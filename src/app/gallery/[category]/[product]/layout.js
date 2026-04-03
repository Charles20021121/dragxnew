import pool from '@/lib/db';

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const { category, product } = resolvedParams;
  
  // 從數據庫獲取產品信息
  let productImage = 'https://pub-332f16c726da4f048f11221d7baacb53.r2.dev/dragx/dragx/lyeylq4n5vfrh5n39izv.webp'; // 默認圖片
  let productName = '';
  
  try {
    const connection = await pool.getConnection();
    try {
      const query = `
        SELECT Url, Name
        FROM gallery
        WHERE categories = ? 
        AND LOWER(REPLACE(Name, ' ', '-')) = ?
      `;
      
      const [rows] = await connection.execute(query, [
        category,
        product
      ]);

      if (rows.length > 0) {
        productImage = rows[0].Url; // 使用產品的主圖
        productName = rows[0].Name; // 使用產品的實際名稱
      }
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error fetching gallery image:', error);
  }

  // 如果沒有找到產品名稱，從 URL 參數生成標題
  if (!productName && product) {
    productName = product
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  // 類別映射
  const categoryTitles = {
    alphard: 'Alphard',
    vellfire: 'Vellfire',
    bmw: 'BMW',
    mercedes: 'Mercedes-Benz',
    audi: 'Audi',
    honda: 'Honda',
    toyota: 'Toyota'
  };

  const categoryTitle = categoryTitles[category] || (category ? category.toUpperCase() : 'Gallery');

  return {
    title: `${productName} - ${categoryTitle} Gallery | DRAGX`,
    description: `View our ${productName} installation for ${categoryTitle}. Professional car modifications and customizations by DRAGX.`,
    keywords: `${productName}, ${categoryTitle}, car modifications, installations, DRAGX, Malaysia`,
    openGraph: {
      title: `${productName} - ${categoryTitle} Gallery | DRAGX`,
      description: `View our ${productName} installation for ${categoryTitle}`,
      images: [productImage], // 使用產品的實際圖片
    }
  };
}

export default function GalleryProductLayout({ children }) {
  return children;
} 