import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  const baseUrl = 'https://www.dragx.asia';

  try {
    const dbPromise = async () => {
      const connection = await pool.getConnection();
      try {
        const [galleryItems] = await connection.query(`
          SELECT Id, Name, categories, date, same
          FROM gallery
          ORDER BY categories, date DESC
        `);

        const mainGalleryItems = galleryItems.filter((g) => g.Id == g.same);
        const galleryCategories = [...new Set(mainGalleryItems.map((g) => g.categories))];

        return { mainGalleryItems, galleryCategories };
      } finally {
        connection.release();
      }
    };

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Database query timed out')), 5000)
    );

    const { mainGalleryItems, galleryCategories } = await Promise.race([
      dbPromise(),
      timeoutPromise,
    ]);

    const galleryCategoryRoutes = galleryCategories.map((category) => ({
      url: `${baseUrl}/gallery/${category}`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'weekly',
      priority: 0.8,
    }));

    const galleryRoutes = mainGalleryItems.map((item) => {
      const name = item.Name || `Product ${item.Id}`;
      const slug = encodeURIComponent(name.toLowerCase().replace(/\s+/g, '-'));
      return {
        url: `${baseUrl}/gallery/${item.categories}/${slug}`,
        lastModified: new Date(item.date || new Date()).toISOString(),
        changeFrequency: 'monthly',
        priority: 0.6,
      };
    });

    const allRoutes = [...galleryCategoryRoutes, ...galleryRoutes];

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
