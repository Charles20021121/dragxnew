import HeroSection from "@/components/HeroSection";
import ProductCategory from "@/components/ProductCategory";
import ProductsClientWrapper from "@/components/ProductsClientWrapper";
import pool from '@/lib/db';

export const revalidate = 3600;

// 定義類別順序
const categoryOrder = {
  'androidplayer': 1,
  'ambientlight': 2,
  'contidecoder': 3,
  'alphardvellfire': 4,
  'bmw': 5,
  'mercedes': 6,
  'powerboot': 7,
  'soundproof': 8,
  'silence': 8,
  '360camera': 9,
  'other': 999
};

// 排除的類別
const excludedCategories = [];

export default async function Products() {
  let categories = [];

  try {
    const connection = await pool.getConnection();
    
    const query = `
      SELECT Id, Name, categories, Url, date, same, filter1, android_series, sort_order
      FROM products
      WHERE same IS NOT NULL AND same != '' AND Id = same
      ORDER BY sort_order DESC, date DESC
    `;

    const [rows] = await connection.query(query);
    connection.release();

    const products = rows.map(p => ({
      id: p.Id,
      name: p.Name,
      categories: p.categories,
      image: p.Url,
      date: p.date,
      sort_order: p.sort_order,
      same: p.same,
      filter1: p.filter1,
      android_series: p.android_series,
    }));

    const categorizedProducts = products.reduce((acc, product) => {
      const category = product.categories;

      if (excludedCategories.includes(category)) {
        return acc;
      }

      if (!acc[category]) {
        let displayName = category.toUpperCase();
        if (category === '360camera') {
          displayName = 'DX360';
        }

        acc[category] = {
          name: displayName,
          categoryKey: category,
          link: `/products/${category}`,
          products: []
        };
      }
      acc[category].products.push({
        Id: product.id.toString(),
        same: product.same,
        Name: product.name,
        categories: product.categories,
        Url: product.image,
        date: product.date,
        slug: product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      });
      return acc;
    }, {});

    categories = Object.values(categorizedProducts).sort((a, b) => {
      const orderA = categoryOrder[a.categoryKey] || 999;
      const orderB = categoryOrder[b.categoryKey] || 999;
      return orderA - orderB;
    });

  } catch (error) {
    console.error('Error fetching products:', error);
  }

  return (
    <main className="min-h-screen">
      <HeroSection
        image="https://pub-332f16c726da4f048f11221d7baacb53.r2.dev/dragx/dragx/ukzmrw5nzcsovbnb31nd.webp"
        aspectRatio="1601/501"
      />
      <ProductsClientWrapper>
        {categories.map((category, index) => (
          <ProductCategory
            key={category.name}
            name={category.name}
            link={category.link}
            products={category.products}
            index={index}
          />
        ))}
      </ProductsClientWrapper>
    </main>
  );
}