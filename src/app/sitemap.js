import pool from '@/lib/db'

export default async function sitemap() {
  const baseUrl = 'https://dragx.asia';

  // 静态页面
  const staticRoutes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/gallery`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/locations`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/androidplayer`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/silence`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/ambientlight`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contidecoder`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/dx360`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/powerboot`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/lyno`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/manual/lyno`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ];

  try {
    // 设置 3 秒超时，防止数据库连接卡死导致 Sitemap 无法生成
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
        const mainProducts = products.filter(p => p.Id == p.same);

        // 获取所有画廊项目（只获取主图片，Id = same）
        const [galleryItems] = await connection.query(`
          SELECT Id, Name, categories, date, same
          FROM gallery 
          ORDER BY categories, date DESC
        `);

        // 过滤出主画廊项目（Id = same）
        const mainGalleryItems = galleryItems.filter(g => g.Id == g.same);

        // 获取产品类别
        const productCategories = [...new Set(mainProducts.map(p => p.categories))];

        // 获取画廊类别  
        const galleryCategories = [...new Set(mainGalleryItems.map(g => g.categories))];

        return { mainProducts, mainGalleryItems, productCategories, galleryCategories };
      } finally {
        connection.release();
      }
    };

    // 使用 Promise.race 实现超时控制
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Database query timed out')), 3000)
    );

    const { mainProducts, mainGalleryItems, productCategories, galleryCategories } =
      await Promise.race([dbPromise(), timeoutPromise]);

    // 生成产品类别页面
    const productCategoryRoutes = productCategories.map((category) => ({
      url: `${baseUrl}/products/${category}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    }));

    // 生成画廊类别页面
    const galleryCategoryRoutes = galleryCategories.map((category) => ({
      url: `${baseUrl}/gallery/${category}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    }));

    // 生成产品详情页面
    const productRoutes = mainProducts.map((product) => {
      const slug = product.Name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      return {
        url: `${baseUrl}/products/${product.categories}/${slug}`,
        lastModified: new Date(product.date || new Date()),
        changeFrequency: 'monthly',
        priority: 0.7,
      };
    });

    // 生成画廊详情页面
    const galleryRoutes = mainGalleryItems.map((item) => {
      const slug = item.Name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      return {
        url: `${baseUrl}/gallery/${item.categories}/${slug}`,
        lastModified: new Date(item.date || new Date()),
        changeFrequency: 'monthly',
        priority: 0.6,
      };
    });

    return [
      ...staticRoutes,
      ...productCategoryRoutes,
      ...galleryCategoryRoutes,
      ...productRoutes,
      ...galleryRoutes,
    ];

  } catch (error) {
    console.error('Error generating sitemap (fallback to static):', error.message);
    // 如果数据库超时或出错，至少返回静态页面
    return staticRoutes;
  }
}
