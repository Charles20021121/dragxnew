import ProductCategoryPage from "@/components/ProductCategoryPage";
import pool from "@/lib/db";
import { notFound } from "next/navigation";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function CategoryProducts({ params }) {
  const { category } = await params;
  let products = [];
  let silencePrices = [];

  try {
    const connection = await pool.getConnection();
    try {
      if (category === 'silence') {
        try {
          const [priceRows] = await connection.execute('SELECT * FROM silence_prices');
          silencePrices = priceRows;
        } catch (priceErr) {
          console.error('Error fetching silence prices:', priceErr);
        }
      }

      // Fetch only the main products (Id = same) and skip the expensive LEFT JOIN of additional images
      const query = category === 'silence'
        ? `
          SELECT *
          FROM products
          WHERE (categories = 'silence' OR categories = 'soundproof')
            AND Id = same
            AND Url IS NOT NULL
            AND Url != ''
          ORDER BY date DESC
        `
        : `
          SELECT *
          FROM products
          WHERE categories = ?
            AND Id = same
            AND Url IS NOT NULL
            AND Url != ''
          ORDER BY date DESC
        `;
      const [rows] = category === 'silence'
        ? await connection.execute(query)
        : await connection.execute(query, [category]);

      products = rows.map(p => ({
        id: p.Id,
        name: p.Name,
        categories: p.categories,
        image: p.Url,
        date: p.date,
        sort_order: p.sort_order,
        price: p.price,
        additionalImages: [], // Not needed on the category page listing
        buy: p.buy,
        specifications: p.Specifications,
        description: p.description,
        publicId: p.publicId,
        filter: p.filter,
        filter1: p.filter1,
        android_series: p.android_series,
        custom_filter: p.custom_filter,
        same: p.same,
        slug: (p.Name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      }));

    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error fetching category products:', error);
  }

  if (products.length === 0 && category !== 'silence') {
    notFound();
  }

  return (
    <ProductCategoryPage
      title={category.toUpperCase()}
      products={products}
      silencePrices={silencePrices}
      categoryPath={category}
      loading={false}
      heroImage="https://pub-332f16c726da4f048f11221d7baacb53.r2.dev/dragx/dragx/ukzmrw5nzcsovbnb31nd.webp"
    />
  );
}