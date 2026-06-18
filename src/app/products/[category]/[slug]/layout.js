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
  let productImage = 'https://pub-332f16c726da4f048f11221d7baacb53.r2.dev/dragx/dragx/ukzmrw5nzcsovbnb31nd.webp'; // 默認圖片
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
      // 处理特殊字符：TRIM 去除前后空格，将 | 替换为空，空格替换为 -，处理多个连续 - 变成单个 -，去除前导 -
      const getProductQuery = `
        SELECT Id, Url, Name, same
        FROM products
        WHERE categories = ?
      `;

      console.log('🔍 查询参数:', { category, slug });

      const [rawRows] = await Promise.race([
        connection.execute(getProductQuery, [category]),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Query timeout')), 4000)
        )
      ]);

      const toSlug = (name) =>
        name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

      const productRows = rawRows.filter(row => toSlug(row.Name || '') === slug.toLowerCase());

      console.log('🔍 产品查询结果:', productRows.length > 0 ? { Id: productRows[0]?.Id, Name: productRows[0]?.Name, same: productRows[0]?.same, Url: productRows[0]?.Url?.substring(0, 60) } : '无结果');

      if (productRows.length > 0) {
        productName = productRows[0].Name || '';
        const sameGroup = productRows[0].same;

        // 如果存在 same 值，则在同组中按日期升序取第一条作为“第一张照片”
        if (sameGroup) {
          const firstImageQuery = `
            SELECT Url, Name
            FROM products
            WHERE same = ?
            ORDER BY (Id = same) DESC, date ASC
            LIMIT 1
          `;

          const [firstRows] = await Promise.race([
            connection.execute(firstImageQuery, [sameGroup]),
            new Promise((_, reject) =>
              setTimeout(() => reject(new Error('Query timeout')), 2000)
            )
          ]);

          if (firstRows.length > 0 && firstRows[0].Url) {
            console.log('✅ 主图查询成功:', { Url: firstRows[0].Url?.substring(0, 60) });
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
    '360camera': 'DX360',
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
        type: 'image/webp',
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