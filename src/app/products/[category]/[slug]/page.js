import { Suspense, cache } from "react";
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

// Cached data fetcher to deduplicate DB queries between metadata and page render
const getProductBySlug = cache(async (category, slug) => {
  let connection;
  try {
    connection = await pool.getConnection();

    // 1. Fetch lightweight info (Id and Name) to match the slug
    const [summaryRows] = await connection.query(`
      SELECT Id, Name
      FROM products
      WHERE categories = ? AND Id = same
    `, [category]);

    const matchSummary = summaryRows.find(p => toSlug(p.Name) === slug.toLowerCase());
    if (!matchSummary) return null;

    // 2. Fetch detailed info ONLY for the matched product ID (avoid loading the entire category)
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
      WHERE p1.Id = ?
      GROUP BY p1.Id
    `;

    const [rows] = await connection.query(query, [matchSummary.Id]);
    if (rows.length === 0) return null;

    const match = rows[0];
    const product = {
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
    };

    // 3. Fetch potential recommendations
    const queryList = `
      SELECT Id as id, Name as name, categories, Url as image, date, same, filter1, android_series, sort_order
      FROM products
      WHERE same IS NOT NULL AND same != '' AND Id = same
      ORDER BY sort_order DESC, date DESC
    `;
    const [listRows] = await connection.query(queryList);
    
    if (listRows.length > 0) {
      const allPotentialRecs = listRows
        .filter(p => String(p.id) === String(p.same) && String(p.same) !== String(product.same))
        .map(p => ({
          ...p,
          slug: (p.name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
        }));
        
      product.recommendations = allPotentialRecs;
    }

    return product;
  } catch (error) {
    console.error('Error fetching product in cache:', error);
    return null;
  } finally {
    if (connection) {
      connection.release();
    }
  }
});

export async function generateMetadata({ params }) {
  const { category, slug } = await params;
  const product = await getProductBySlug(category, slug);

  if (!product) {
    return {
      title: "Product Not Found - DRAGX",
    };
  }

  return {
    title: `${product.name} | Premium ${category.replace("-", " ").toUpperCase()} Installation | DRAGX Malaysia`,
    description: product.description || `Upgrade your car with ${product.name}. DRAGX is Malaysia's #1 specialist for ${category.replace("-", " ")} installation and automotive solutions.`, // SEO Optimized description
    alternates: {
      canonical: `https://www.dragx.asia/products/${category}/${slug}`
    },
    openGraph: {
      title: `${product.name} | Premium ${category.replace("-", " ").toUpperCase()} Installation | DRAGX Malaysia`,
      description: product.description || `Upgrade your car with ${product.name}. DRAGX is Malaysia's #1 specialist for ${category.replace("-", " ")} installation and automotive solutions.`, // SEO Optimized description
      images: [product.image || "https://pub-332f16c726da4f048f11221d7baacb53.r2.dev/dragx/dragx/epz5butosofn5h6jxvqu.webp"],
    },
  };
}

export default async function ProductPage({ params }) {
  const { category, slug } = await params;
  const product = await getProductBySlug(category, slug);

  if (!product) {
    notFound();
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "image": product.image ? [product.image] : [],
    "description": product.description || `Buy ${product.name} at DRAGX - Malaysia's #1 Car Accessories`,
    "brand": {
      "@type": "Brand",
      "name": "DRAGX"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "89"
    },
    "offers": {
      "@type": "Offer",
      "url": `https://www.dragx.asia/products/${category}/${slug}`,
      "priceCurrency": "MYR",
      "price": product.price ? String(product.price).replace(/[^0-9.]/g, '') || "0.00" : "0.00",
      "availability": "https://schema.org/InStock",
      "itemCondition": "https://schema.org/NewCondition",
      "priceValidUntil": new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
      "seller": {
        "@type": "Organization",
        "name": "DRAGX"
      }
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Suspense fallback={<div>Loading...</div>}>
        <ProductDetail product={product} />
      </Suspense>
    </>
  );
}