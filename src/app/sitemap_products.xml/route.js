import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  const baseUrl = 'https://dragx.asia';

  try {
    // 设置 5 秒超时
    const dbPromise = async () => {
      const connection = await pool.getConnection();
      try {
        // 获取所有产品（只获取主产品，Id = same）
        const [products] = await connection.query(`
          SELECT Id, Name, categories, date, same
          FROM products
          ORDER BY categories, date DESC
        `);

        // 过滤出主产品（Id = same）
        const mainProducts = products.filter((p) => p.Id == p.same);

        // 获取产品类别
        const productCategories = [...new Set(mainProducts.map((p) => p.categories))];

        return { mainProducts, productCategories };
      } finally {
        connection.release();
      }
    };

    // 使用 Promise.race 实现超时控制
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Database query timed out')), 5000)
    );

    const { mainProducts, productCategories } = await Promise.race([
      dbPromise(),
      timeoutPromise,
    ]);

    // 生成产品类别页面
    const productCategoryRoutes = productCategories.map((category) => ({
      url: `${baseUrl}/products/${category}`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'weekly',
      priority: 0.8,
    }));

    // 生成产品详情页面
    const productRoutes = mainProducts.map((product) => {
      const slug = product.Name.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      return {
        url: `${baseUrl}/products/${product.categories}/${slug}`,
        lastModified: new Date(product.date || new Date()).toISOString(),
        changeFrequency: 'monthly',
        priority: 0.7,
      };
    });

    const allRoutes = [...productCategoryRoutes, ...productRoutes];

    // Generate XML
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allRoutes
  .map(
    (route) => `  <url>
    <loc>${route.url}</loc>
    <lastmod>${route.lastModified}</lastmod>
    <changefreq>${route.changeFrequency}</changefreq>
    <priority>${route.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

    return new NextResponse(xml, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    });
  } catch (error) {
    console.error('Error generating products sitemap:', error.message);
    // 如果数据库超时或出错，返回空的 sitemap
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
</urlset>`;

    return new NextResponse(xml, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=60, s-maxage=60',
      },
    });
  }
}
