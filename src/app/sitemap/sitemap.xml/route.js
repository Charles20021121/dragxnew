import { NextResponse } from 'next/server';

// Sitemap Index - Google 推荐的方式
export async function GET() {
  const baseUrl = 'https://www.dragx.asia';

  const sitemaps = [
    {
      loc: `${baseUrl}/sitemap/sitemap_static.xml`,
      lastmod: new Date().toISOString(),
    },
    {
      loc: `${baseUrl}/sitemap/sitemap_products.xml`,
      lastmod: new Date().toISOString(),
    },
    {
      loc: `${baseUrl}/sitemap/sitemap_gallery.xml`,
      lastmod: new Date().toISOString(),
    },
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemaps
  .map(
    (sitemap) => `  <sitemap>
    <loc>${sitemap.loc}</loc>
    <lastmod>${sitemap.lastmod}</lastmod>
  </sitemap>`
  )
  .join('\n')}
</sitemapindex>`;

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
