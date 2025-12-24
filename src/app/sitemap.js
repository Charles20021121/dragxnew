// Sitemap Index - Google 推荐的方式
// 将大的 sitemap 拆分成多个小的 sitemap 文件

export default function sitemap() {
  return [
    {
      url: 'https://dragx.asia/sitemap_static.xml',
      lastModified: new Date(),
    },
    {
      url: 'https://dragx.asia/sitemap_products.xml',
      lastModified: new Date(),
    },
    {
      url: 'https://dragx.asia/sitemap_gallery.xml',
      lastModified: new Date(),
    },
  ];
}
