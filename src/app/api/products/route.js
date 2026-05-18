import { NextResponse } from 'next/server';
import pool from '@/lib/db';

const CACHE_TTL = 300; // 5 minutes CDN edge cache

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

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const slug = searchParams.get('slug');
    const listOnly = searchParams.get('list') === 'true';

    const connection = await pool.getConnection();
    await connection.query('SET SESSION group_concat_max_len = 1000000');

    // ─── SINGLE PRODUCT DETAIL  (?category=xxx&slug=yyy) ─────────────────────
    // Only fetches main-image rows (Id = same) in that category, then matches
    // slug in JS. ~10x fewer rows than the full-category query.
    if (category && slug) {
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
      connection.release();

      const match = rows
        .filter(p => toSlug(p.Name) === slug.toLowerCase())
        .sort((a, b) => {
          const sA = (a.price ? 2 : 0) + (a.description ? 1 : 0);
          const sB = (b.price ? 2 : 0) + (b.description ? 1 : 0);
          return sB - sA;
        })[0];

      if (!match) {
        return NextResponse.json(null, { status: 404 });
      }

      return NextResponse.json({
        id: match.Id,
        name: match.Name,
        categories: match.categories,
        image: match.Url,
        date: match.date,
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
      }, {
        headers: { 'Cache-Control': `public, s-maxage=${CACHE_TTL}, stale-while-revalidate=60` },
      });
    }

    // ─── CATEGORY PAGE  (?category=xxx) ──────────────────────────────────────
    if (category) {
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

      const [products] = await connection.query(query, [category]);
      connection.release();

      const formatted = products
        .filter(p => p.Url && p.Url.trim() !== '')  // 過濾掉空 URL 的記錄
        .map(p => ({
          id: p.Id,
          name: p.Name,
          categories: p.categories,
          image: p.Url,
          date: p.date,
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
        }));

      return NextResponse.json(formatted, {
        headers: { 'Cache-Control': `public, s-maxage=${CACHE_TTL}, stale-while-revalidate=60` },
      });
    }

    // ─── LISTING PAGE  (?list=true) ───────────────────────────────────────────
    // Lightweight – no JOIN, only main-image rows.
    if (listOnly) {
      const query = `
        SELECT Id, Name, categories, Url, date, same, filter1, android_series
        FROM products
        WHERE same IS NOT NULL AND same != '' AND Id = same
        ORDER BY date DESC
      `;

      const [products] = await connection.query(query);
      connection.release();

      return NextResponse.json(
        products.map(p => ({
          id: p.Id,
          name: p.Name,
          categories: p.categories,
          image: p.Url,
          date: p.date,
          same: p.same,
          filter1: p.filter1,
          android_series: p.android_series,
        })),
        { headers: { 'Cache-Control': `public, s-maxage=${CACHE_TTL}, stale-while-revalidate=60` } }
      );
    }

    // ─── FULL LIST (used by ProductDetail recommendations) ───────────────────
    const query = `
      SELECT Id, Name, categories, Url, date, price,
             filter, filter1, android_series, same, publicId
      FROM products
      ORDER BY date DESC
    `;

    const [products] = await connection.query(query);
    connection.release();

    return NextResponse.json(
      products.map(p => ({
        id: p.Id,
        name: p.Name,
        categories: p.categories,
        image: p.Url,
        date: p.date,
        price: p.price,
        filter: p.filter,
        filter1: p.filter1,
        android_series: p.android_series,
        publicId: p.publicId,
        same: p.same,
      })),
      { headers: { 'Cache-Control': `public, s-maxage=${CACHE_TTL}, stale-while-revalidate=60` } }
    );

  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}