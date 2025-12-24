import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  const baseUrl = 'https://dragx.asia';

  try {
    // 设置 5 秒超时
    const dbPromise = async () => {
      const connection = await pool.getConnection();
      try {
        // 获取所有画廊项目（只获取主图片，Id = same）
        const [galleryItems] = await connection.query(`
          SELECT Id, Name, categories, date, same
          FROM gallery
          ORDER BY categories, date DESC
        `);

        // 过滤出主画廊项目（Id = same）
        const mainGalleryItems = galleryItems.filter((g) => g.Id == g.same);

        // 获取画廊类别
        const galleryCategories = [...new Set(mainGalleryItems.map((g) => g.categories))];

        return { mainGalleryItems, galleryCategories };
      } finally {
        connection.release();
      }
    };

    // 使用 Promise.race 实现超时控制
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Database query timed out')), 5000)
    );

    const { mainGalleryItems, galleryCategories } = await Promise.race([
      dbPromise(),
      timeoutPromise,
    ]);

    // 生成画廊类别页面
    const galleryCategoryRoutes = galleryCategories.map((category) => ({
      url: `${baseUrl}/gallery/${category}`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'weekly',
      priority: 0.8,
    }));

    // 生成画廊详情页面
    const galleryRoutes = mainGalleryItems.map((item) => {
      const slug = item.Name.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      return {
        url: `${baseUrl}/gallery/${item.categories}/${slug}`,
        lastModified: new Date(item.date || new Date()).toISOString(),
        changeFrequency: 'monthly',
        priority: 0.6,
      };
    });

    const allRoutes = [...galleryCategoryRoutes, ...galleryRoutes];

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
    console.error('Error generating gallery sitemap:', error.message);
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
