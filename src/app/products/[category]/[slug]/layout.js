import pool from '@/lib/db';

// 獲取 base URL（支持 ngrok 測試）
const getBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_BASE_URL) {
    return process.env.NEXT_PUBLIC_BASE_URL;
  }
  return 'https://dragx.asia';
};

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const { category, slug } = resolvedParams;

  const baseUrl = getBaseUrl();

  console.log('🔍 generateMetadata 被调用:', { category, slug, baseUrl });

  // 從數據庫獲取產品信息（改进：使用 same 组中按日期最早的图片作为 OG 图，即“第一张照片”）
  let productImage = 'https://res.cloudinary.com/dmkxx68km/image/upload/v1725611928/ukzmrw5nzcsovbnb31nd.webp'; // 默認圖片
  let productName = '';

  try {
    // 添加超时控制，确保快速响应
    const connection = await Promise.race([
      pool.getConnection(),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Database connection timeout')), 3000)
      )
    ]);

    try {
      // 先获取当前产品行（包含 same）
      const getProductQuery = `
        SELECT Id, Url, Name, same
        FROM products
        WHERE categories = ?
        AND LOWER(REPLACE(Name, ' ', '-')) = ?
        LIMIT 1
      `;

      const [productRows] = await Promise.race([
        connection.execute(getProductQuery, [category, slug]),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Query timeout')), 2000)
        )
      ]);

      if (productRows.length > 0) {
        productName = productRows[0].Name || '';
        const sameGroup = productRows[0].same;

        // 如果存在 same 值，则在同组中按日期升序取第一条作为“第一张照片”
        if (sameGroup) {
          const firstImageQuery = `
            SELECT Url, Name
            FROM products
            WHERE same = ?
            ORDER BY date ASC
            LIMIT 1
          `;

          const [firstRows] = await Promise.race([
            connection.execute(firstImageQuery, [sameGroup]),
            new Promise((_, reject) =>
              setTimeout(() => reject(new Error('Query timeout')), 2000)
            )
          ]);

          if (firstRows.length > 0 && firstRows[0].Url) {
            productImage = firstRows[0].Url;
            productName = productName || firstRows[0].Name || '';
          } else if (productRows[0].Url) {
            // 回退到当前行的 Url
            productImage = productRows[0].Url;
          }
        } else if (productRows[0].Url) {
          productImage = productRows[0].Url;
        }
      }

      // 確保圖片 URL 是絕對路徑
      if (productImage && !productImage.startsWith('http')) {
        productImage = `${baseUrl}${productImage}`;
      }

      // 🔧 WhatsApp 兼容性修复：使用 Cloudinary 的自动格式选择
      // f_auto 会根据客户端自动选择最佳格式（WhatsApp 会得到 JPEG）
      if (productImage && productImage.includes('cloudinary.com')) {
        console.log('🔍 原始图片 URL:', productImage);

        if (productImage.includes('/upload/')) {
          // 添加 Cloudinary 优化参数：
          // - f_auto: 自动选择格式（浏览器得到 WebP，WhatsApp 得到 JPEG）
          // - q_auto:good: 自动优化质量
          // - w_1200,h_630,c_fill: 调整为标准 OG 尺寸
          productImage = productImage.replace(
            '/upload/',
            '/upload/f_auto,q_auto:good,w_1200,h_630,c_fill/'
          );
        }

        console.log('✅ 优化后的图片 URL:', productImage);
      }
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error fetching product image:', error);
  }

  // 使用實際產品名稱或從 slug 轉換
  const title = productName || slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

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

  const categoryTitle = categoryTitles[category] || category.toUpperCase();

  const pageTitle = `${title} - ${categoryTitle} | DRAGX Car Accessories`;
  const pageDescription = `Discover the ${title} from our ${categoryTitle} collection. Professional car accessories and automotive solutions by DRAGX.`;
  const pageUrl = `${baseUrl}/products/${category}/${slug}`;

  console.log('📝 生成的 metadata:', {
    title: pageTitle,
    image: productImage,
    url: pageUrl
  });

  return {
    title: pageTitle,
    description: pageDescription,
    keywords: `${title}, ${category}, car accessories, automotive, DRAGX, Malaysia`,
    openGraph: {
      type: 'website',
      url: pageUrl,
      title: pageTitle,
      description: pageDescription,
      siteName: 'DRAGX Car Accessories',
      locale: 'en_US',
      images: [{
        url: productImage,
        width: 1200,
        height: 630,
        alt: `${title} - ${categoryTitle}`,
        type: 'image/jpeg',
      }],
    },
    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description: pageDescription,
      images: [productImage],
    },
    alternates: {
      canonical: pageUrl,
    },
  };
}

export default function ProductLayout({ children }) {
  return children;
} 