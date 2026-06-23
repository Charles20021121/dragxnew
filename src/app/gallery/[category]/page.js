import GalleryCategoryClientWrapper from '@/components/GalleryCategoryClientWrapper'
import pool from '@/lib/db'

export const revalidate = 3600;

export default async function GalleryCategory({ params }) {
  const { category } = await params;
  const isCombined = category === 'alphard-vellfire';
  
  let rawProducts = [];

  try {
    const connection = await pool.getConnection();
    
    try {
      let query;
      let queryParams;

      if (isCombined) {
        query = `
          SELECT *
          FROM gallery
          WHERE categories IN ('alphard', 'vellfire')
          ORDER BY date DESC
        `;
        queryParams = [];
      } else {
        query = `
          SELECT *
          FROM gallery
          WHERE categories = ?
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