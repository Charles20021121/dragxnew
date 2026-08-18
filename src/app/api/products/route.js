import { NextResponse } from 'next/server';
import pool from '@/lib/db';

const CACHE_TTL = 300; // 5 minutes CDN edge cache
const CACHE_HEADER = `public, s-maxage=${CACHE_TTL}, stale-while-revalidate=60`;

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
    const id = searchParams.get('id');
    const category = searchParams.get('category');
    const slug = searchParams.get('slug');
    const listOnly = searchParams.get('list') === 'true';

    const connection = await pool.getConnection();
    await connection.query('SET SESSION group_concat_max_len = 1000000');

    // ─── SINGLE PRODUCT BY ID (?id=xxx) ──────────────────────────────────────
    if (id) {
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

      const [rows] = await connection.query(query, [id]);
      connection.release();

      if (!rows || rows.length === 0) {
        return NextResponse.json(null, { status: 404 });
      }

      const match = rows[0];
      const extraList = parseAdditionalImages(match.additional_images);

      return NextResponse.json({
        id: match.Id,
        Id: match.Id,
        name: match.Name,
        Name: match.Name,
        categories: match.categories,
        image: match.Url,
        Url: match.Url,
        date: match.date,
        sort_order: match.sort_order,
        price: match.price,
        additional_images: extraList,
        additionalImages: extraList,
        buy: match.buy,
        specifications: match.Specifications,
        Specifications: match.Specifications,
        description: match.description,
        publicId: match.publicId,
        filter: match.filter,
        filter1: match.filter1,
        android_series: match.android_series,
        custom_filter: match.custom_filter,
        same: match.same,
      });
    }

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
      }, {
        headers: { 'Cache-Control': CACHE_HEADER },
      });
    }

    // ─── CATEGORY PAGE  (?category=xxx) ──────────────────────────────────────
    // ─── CATEGORY PAGE  (?category=xxx) ──────────────────────────────────────
    if (category) {
      const isSilence = category.toLowerCase() === 'silence' || category.toLowerCase() === 'soundproof';
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
        WHERE ${isSilence ? "(p1.categories = 'silence' OR p1.categories = 'soundproof')" : "p1.categories = ?"}
        GROUP BY p1.Id
        ORDER BY p1.date DESC
      `;

      const [products] = isSilence 
        ? await connection.query(query)
        : await connection.query(query, [category]);
      connection.release();

      const formatted = products
        .filter(p => p.Url && p.Url.trim() !== '')  // 過濾掉空 URL 的記錄
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
        }));

      return NextResponse.json(formatted, {
        headers: { 'Cache-Control': CACHE_HEADER },
      });
    }

    // ─── LISTING PAGE  (?list=true) ───────────────────────────────────────────
    // Lightweight – no JOIN, only main-image rows.
    if (listOnly) {
      const query = `
        SELECT Id, Name, categories, Url, date, same, filter1, android_series, sort_order
        FROM products
        WHERE same IS NOT NULL AND same != '' AND Id = same
        ORDER BY sort_order DESC, date DESC
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
          sort_order: p.sort_order,
          same: p.same,
          filter1: p.filter1,
          android_series: p.android_series,
        })),
        { headers: { 'Cache-Control': CACHE_HEADER } }
      );
    }

    // ─── FULL LIST (used by ProductDetail recommendations) ───────────────────
    const query = `
      SELECT Id, Name, categories, Url, date, price,
             filter, filter1, android_series, same, publicId, sort_order
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
        sort_order: p.sort_order,
        price: p.price,
        filter: p.filter,
        filter1: p.filter1,
        android_series: p.android_series,
        publicId: p.publicId,
        same: p.same,
      })),
      { headers: { 'Cache-Control': CACHE_HEADER } }
    );

  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}