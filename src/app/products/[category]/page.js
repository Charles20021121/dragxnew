import ProductCategoryPage from "@/components/ProductCategoryPage";
import pool from "@/lib/db";
import { notFound } from "next/navigation";

export const revalidate = 3600;

export default async function CategoryProducts({ params }) {
  const { category } = await params;
  let products = [];

  try {
    const connection = await pool.getConnection();
    try {
      // Fetch products based on category, same logic as /api/products?category=...
      const query = `
        SELECT
          p1.*,
          GROUP_CONCAT(
            CASE
              WHEN p2.same = p1.same THEN CONCAT(p2.Id, '|', p2.Name, '|', p2.Url, '|', p2.publicId, '|', p2.date)
            END
            ORDER BY p2.date ASC
            SEPARATOR '|||'
          ) as additional_images
        FROM products p1
        LEFT JOIN products p2
          ON p1.same IS NOT NULL
          AND p1.same != ''
          AND p2.same = p1.same
          AND p2.Id != p1.Id
        WHERE p1.categories = ?
        GROUP BY p1.Id
        ORDER BY p1.date DESC
      `;
      const [rows] = await connection.execute(query, [category]);
      
      const parseAdditionalImages = (str) =>
        str
          ? str.split('|||').filter(Boolean).map(imgData => {
              const [Id, Name, Url, publicId, date] = imgData.split('|');
              return { Id, Name, Url, publicId, date };
            })
          : [];

      // Process products to ensure plain objects and generate slug
      products = rows
        .filter(p => p.Url && p.Url.trim() !== '')
        .map(p => ({
          id: p.Id,
          name: p.Name,
          categories: p.categories,
          image: p.Url,
          date: p.date,
          sort_order: p.sort_order,
          price: p.price,
          additionalImages: parseAdditionalImages(p.additional_images),
          buy: p.buy,
          specifications: p.Specifications,
          description: p.description,
          publicId: p.publicId,
          filter: p.filter,
          filter1: p.filter1,
          android_series: p.android_series,
          custom_filter: p.custom_filter,
          same: p.same,
          slug: (p.Name || p.name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
        }));

    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error fetching category products:', error);
  }

  if (products.length === 0) {
    notFound();
  }

  return (
    <ProductCategoryPage
      title={category.toUpperCase()}
      products={products}
      categoryPath={category}
      loading={false}
      heroImage="https://pub-332f16c726da4f048f11221d7baacb53.r2.dev/dragx/dragx/ukzmrw5nzcsovbnb31nd.webp"
    />
  );
}