import GalleryProductClientWrapper from '@/components/GalleryProductClientWrapper'
import pool from '@/lib/db'
import { notFound } from 'next/navigation'

export const revalidate = 3600;

export default async function GalleryProductPage({ params }) {
  const { category, product } = await params;
  const productSlug = decodeURIComponent(product);
  
  let mainProduct = null;
  let relatedImages = [];

  try {
    const connection = await pool.getConnection();

    try {
      // 1. Fetch main product
      let query;
      let queryParams;

      if (category === 'alphard-vellfire') {
        query = `
          SELECT *
          FROM gallery
          WHERE categories IN ('alphard', 'vellfire')
          AND LOWER(REPLACE(Name, ' ', '-')) = ?
          ORDER BY date ASC
        `;
        queryParams = [productSlug];
      } else {
        query = `
          SELECT *
          FROM gallery
          WHERE categories = ? 
          AND LOWER(REPLACE(Name, ' ', '-')) = ?
          ORDER BY date ASC
        `;
        queryParams = [category, productSlug];
      }

      const [rows] = await connection.execute(query, queryParams);
      
      if (rows.length > 0) {
        mainProduct = rows[0];

        // 2. Fetch related images with the same 'same' value
        const relatedQuery = `
          SELECT *
          FROM gallery
          WHERE same = ?
          ORDER BY date DESC
        `;
        const [relatedRows] = await connection.execute(relatedQuery, [mainProduct.same]);
        
        // Filter out empty URLs
        relatedImages = relatedRows.filter(img => img.Url && img.Url.trim() !== '');
      }

    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  }

  if (!mainProduct) {
    notFound();
  }

  // Logic to strictly identify Master Record (Id == same)
  const masterId = String(mainProduct.same || mainProduct.Id);
  const masterImage = relatedImages.find(img => String(img.Id) === masterId);

  // All other images sorted by date DESC (newest first)
  const otherImages = relatedImages
    .filter(img => String(img.Id) !== masterId)
    .sort((a, b) => new Date(a.date || 0) - new Date(b.date || 0));

  let allImagesArray = [];

  // Special case: for alphard-vellfire, hide the Main Image (Master Record)
  if (category === 'alphard-vellfire') {
    allImagesArray = otherImages;
  } else {
    // For others, Lock Main Image (Master Record) at the top
    if (masterImage) {
      allImagesArray = [masterImage, ...otherImages];
    } else {
      // Fallback if master not found for some reason
      allImagesArray = otherImages;
    }
  }

  // Transform data if needed so they are plain objects
  const safeMainProduct = {
    ...mainProduct
  };
  
  const safeAllImagesArray = allImagesArray.map(img => ({
    ...img
  }));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ImageGallery",
    "name": safeMainProduct.Name || "DRAGX Gallery",
    "description": `Gallery for ${safeMainProduct.Name || 'Car Accessories'} - DRAGX`,
    "url": `https://dragx.asia/gallery/${category}/${productSlug}`,
    "image": safeAllImagesArray.map(img => img.Url).filter(Boolean)
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <GalleryProductClientWrapper 
        category={category} 
        product={safeMainProduct} 
        allImagesArray={safeAllImagesArray} 
      />
    </>
  )
}