import GalleryProductClientWrapper from '@/components/GalleryProductClientWrapper'
import pool from '@/lib/db'
import { notFound } from 'next/navigation'
import { cache } from 'react'

export const revalidate = 3600;

// Cached fetcher to deduplicate queries between metadata and page render
const getGalleryProductBySlug = cache(async (category, productSlug) => {
  let connection;
  try {
    connection = await pool.getConnection();

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
    
    if (rows.length === 0) return null;

    const mainProduct = rows[0];

    // 2. Fetch related images with the same 'same' value
    const relatedQuery = `
      SELECT *
      FROM gallery
      WHERE same = ?
      ORDER BY date DESC
    `;
    const [relatedRows] = await connection.execute(relatedQuery, [mainProduct.same]);
    
    // Filter out empty URLs
    const relatedImages = relatedRows.filter(img => img.Url && img.Url.trim() !== '');

    return {
      mainProduct,
      relatedImages
    };
  } catch (error) {
    console.error('Error fetching gallery product:', error);
    return null;
  } finally {
    if (connection) {
      connection.release();
    }
  }
});

export async function generateMetadata({ params }) {
  const { category, product } = await params;
  const productSlug = decodeURIComponent(product);
  
  let title = "Gallery - DRAGX";
  let description = "Explore DRAGX Car Accessories Gallery.";
  let imageUrl = "https://pub-332f16c726da4f048f11221d7baacb53.r2.dev/dragx/dragx/epz5butosofn5h6jxvqu.webp";

  const result = await getGalleryProductBySlug(category, productSlug);
  if (result) {
    const { mainProduct } = result;
    title = `${mainProduct.Name} - DRAGX Gallery`;
    description = `View the gallery for ${mainProduct.Name} at DRAGX.`;
    if (mainProduct.Url) imageUrl = mainProduct.Url;
  }

  return {
    title,
    description,
    alternates: {
      canonical: `https://www.dragx.asia/gallery/${category}/${productSlug}`
    },
    openGraph: {
      title,
      description,
      images: [imageUrl],
    },
  };
}

export default async function GalleryProductPage({ params }) {
  const { category, product } = await params;
  const productSlug = decodeURIComponent(product);
  
  const result = await getGalleryProductBySlug(category, productSlug);
  if (!result) {
    notFound();
  }

  const { mainProduct, relatedImages } = result;

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
    "url": `https://www.dragx.asia/gallery/${category}/${productSlug}`,
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