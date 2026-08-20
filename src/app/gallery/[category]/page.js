import GalleryCategoryClientWrapper from '@/components/GalleryCategoryClientWrapper'
import pool from '@/lib/db'
import { notFound } from 'next/navigation'

export const revalidate = 3600;
export const dynamicParams = true;

export async function generateStaticParams() {
  let connection;
  try {
    connection = await pool.getConnection();
    const [rows] = await connection.query(`
      SELECT DISTINCT categories 
      FROM gallery 
      WHERE categories IS NOT NULL AND categories != ''
    `);
    const params = [];
    const seen = new Set();
    for (const row of rows) {
      const cat = row.categories.toLowerCase().trim();
      if (!seen.has(cat)) {
        seen.add(cat);
        params.push({ category: cat });
      }
    }
    if (!seen.has('alphard-vellfire')) params.push({ category: 'alphard-vellfire' });
    return params;
  } catch (error) {
    console.warn('generateStaticParams fallback for gallery categories:', error?.message);
    return [];
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

export default async function GalleryCategory({ params }) {
  const { category } = await params;
  const isCombined = category === 'alphard-vellfire';
  
  let rawProducts = [];

  try {
    const connection = await pool.getConnection();
    
    try {
      let query;
      let queryParams;

      // Filter only the main products (Id = same) directly in SQL
      if (isCombined) {
        query = `
          SELECT *
          FROM gallery
          WHERE categories IN ('alphard', 'vellfire')
            AND Id = same
          ORDER BY date DESC
        `;
        queryParams = [];
      } else {
        query = `
          SELECT *
          FROM gallery
          WHERE categories = ?
            AND Id = same
          ORDER BY date DESC
        `;
        queryParams = [category];
      }
      
      const [rows] = await connection.execute(query, queryParams);
      rawProducts = rows;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error fetching gallery:', error);
  }

  const formattedProducts = rawProducts.map(item => ({
    id: item.Id,
    name: item.Name || `Product ${item.Id}`,
    image: item.Url,
    same: item.same,
    description: item.description,
    date: item.date,
    rawCategory: item.categories, // To be used by the client wrapper for filtering
    slug: (item.Name || `Product ${item.Id}`).toLowerCase().replace(/\s+/g, '-')
  }));

  if (rawProducts.length === 0) {
    notFound();
  }

  return (
    <div className="min-h-screen">
      <GalleryCategoryClientWrapper 
        category={category} 
        products={formattedProducts} 
        isCombined={isCombined} 
      />
    </div>
  )
}