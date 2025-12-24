import pool from '@/lib/db';

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const { category, slug } = resolvedParams;
 
  
  // 從數據庫獲取產品信息
  let productImage = 'https://res.cloudinary.com/dmkxx68km/image/upload/v1725611928/ukzmrw5nzcsovbnb31nd.webp'; // 默認圖片
  
  try {
    const connection = await pool.getConnection();
    try {
      const query = `
        SELECT Url, Name
        FROM products
        WHERE categories = ? 
        AND LOWER(REPLACE(Name, ' ', '-')) = ?
      `;
      
      const [rows] = await connection.execute(query, [
        category,
        slug
      ]);

      if (rows.length > 0) {
        productImage = rows[0].Url; // 使用產品的主圖
      }
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error fetching product image:', error);
  }

  // 將 slug 轉換回可讀的標題
  const title = slug
    ? slug.split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
    : 'Product';

  // 類別映射
  const categoryTitles = {
    androidplayer: 'Android Player',
    ambientlight: 'Ambient Light',
    '360camera': '360° Camera',
    powerboot: 'Power Boot',
    contidecoder: 'Conti Decoder',
    mercedes: 'Mercedes-Benz',
    bmw: 'BMW',
  };

  const categoryTitle = categoryTitles[category] || (category ? category.toUpperCase() : 'Products');
  

  return {
    title: `${title} - ${categoryTitle} | DRAGX Car Accessories`,
    description: `Discover the ${title} from our ${categoryTitle} collection. Professional car accessories and automotive solutions by DRAGX.`,
    keywords: `${title}, ${category}, car accessories, automotive, DRAGX, Malaysia`,
    openGraph: {
      title: `${title} - ${categoryTitle} | DRAGX Car Accessories`,
      description: `Discover the ${title} from our ${categoryTitle} collection`,
      images: [productImage], // 使用產品的實際圖片
    }
  };
}

export default function ProductLayout({ children }) {
  return children;
} 