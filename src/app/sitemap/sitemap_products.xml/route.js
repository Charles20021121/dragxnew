import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  const baseUrl = 'https://www.dragx.asia';

  try {
    const dbPromise = async () => {
      const connection = await pool.getConnection();
      try {
        const [products] = await connection.query(`
          SELECT Id, Name, categories, date, same
          FROM products
          ORDER BY categories, date DESC
        `);

        const mainProducts = products.filter((p) => p.Id == p.same);
        const productCategories = [...new Set(mainProducts.map((p) => p.categories))];

        return { mainProducts, productCategories };
      } finally {
        connection.release();
      }
    };

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Database query timed out')), 5000)
    );

    const { mainProducts, productCategories } = await Promise.race([
      dbPromise(),
      timeoutPromise,
    ]);

    const productCategoryRoutes = productCategories.map((category) => ({
      url: `${baseUrl}/products/${category}`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'weekly',
      priority: 0.8,
    }));

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
