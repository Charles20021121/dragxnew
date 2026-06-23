import { Suspense } from "react";
import ProductDetail from "@/components/ProductDetail";
import pool from '@/lib/db';
import { notFound } from "next/navigation";

export const revalidate = 3600;

// Helper: name → URL slug
const toSlug = (name) =>
  name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

// Helper: format additional_images string → array
const parseAdditionalImages = (str) =>
  str
    ? str.split('|||').filter(Boolean).map(imgData => {
        const [Id, Name, Url, publicId, date] = imgData.split('|');
        return { Id, Name, Url, publicId, date };
      })
    : [];

export default async function ProductPage({ params }) {
  const { category, slug } = await params;
  let product = null;
  let connection;

  try {
    connection = await pool.getConnection();
    await connection.query('SET SESSION group_concat_max_len = 1000000');

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
        AND p1.Id = p1.same
      GROUP BY p1.Id
      ORDER BY p1.date DESC
    `;

    const [rows] = await connection.query(query, [category]);

    const match = rows
      .filter(p => toSlug(p.Name) === slug.toLowerCase())
      .sort((a, b) => {
        const sA = (a.price ? 2 : 0) + (a.description ? 1 : 0);
        const sB = (b.price ? 2 : 0) + (b.description ? 1 : 0);
        return sB - sA;
      })[0];

    if (match) {
      product = {
        id: match.Id,
        name: match.Name,
        categories: match.categories,
        image: match.Url,
        date: match.date,
        sort_order: match.sort_order,
        price: match.price,
        additionalImages: parseAdditionalImages(match.additional_images),
        buy: match.buy,
        specifications: match.Specifications,
        description: match.description,
        publicId: match.publicId,
        filter: match.filter,
        filter1: match.filter1,
        android_series: match.android_series,
        custom_filter: match.custom_filter,
        same: match.same,
      }
    }

    // Fetch all potential recommendations on the server
    const queryList = `
      SELECT Id as id, Name as name, categories, Url as image, date, same, filter1, android_series, sort_order
      FROM products
      WHERE same IS NOT NULL AND same != '' AND Id = same
      ORDER BY sort_order DESC, date DESC
    `;
    const [listRows] = await connection.query(queryList);
    
    // Process list for recommendations
    if (product && listRows.length > 0) {
      const allPotentialRecs = listRows
        .filter(p => String(p.id) === String(p.same) && String(p.same) !== String(product.same))
        .map(p => ({
          ...p,
          slug: (p.name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
        }));
        
      product.recommendations = allPotentialRecs;
    }

  } catch (error) {
    console.error('Error fetching product:', error);
  } finally {
    if (connection) {
      connection.release();
    }
  }

  if (!product) {
    notFound();
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProductDetail product={product} />
    </Suspense>
  );
}