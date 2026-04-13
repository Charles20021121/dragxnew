import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    // ?list=true → lightweight query for /products listing page (no JOIN)
    const listOnly = searchParams.get('list') === 'true';

    const connection = await pool.getConnection();

    // ─── CATEGORY PAGE (with additional_images for detail/gallery) ──────────
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

      const formattedProducts = products.map(product => ({
        id: product.Id,
        name: product.Name,
        categories: product.categories,
        image: product.Url,
        date: product.date,
        price: product.price,
        additionalImages: product.additional_images
          ? product.additional_images.split('|||').filter(Boolean).map(imgData => {
            const [Id, Name, Url, publicId, date] = imgData.split('|');
            return { Id, Name, Url, publicId, date };
          })
          : [],
        buy: product.buy,
        specifications: product.Specifications,
        description: product.description,
        publicId: product.publicId,
        filter: product.filter,
        filter1: product.filter1,
        android_series: product.android_series,
        custom_filter: product.custom_filter,
        same: product.same
      }));

      return NextResponse.json(formattedProducts);
    }

    // ─── LIST VIEW (lightweight, no JOIN, only main images: Id == same) ──────
    // Used by /products listing page – only needs one thumbnail per product
    if (listOnly) {
      const query = `
        SELECT Id, Name, categories, Url, date, same, filter1, android_series
        FROM products
        WHERE same IS NOT NULL AND same != '' AND Id = same
        ORDER BY date DESC
      `;

      const [products] = await connection.query(query);
      connection.release();

      const formattedProducts = products.map(product => ({
        id: product.Id,
        name: product.Name,
        categories: product.categories,
        image: product.Url,
        date: product.date,
        same: product.same,
        filter1: product.filter1,
        android_series: product.android_series,
      }));

      return NextResponse.json(formattedProducts);
    }

    // ─── FULL LIST (recommendations in ProductDetail, etc.) ──────────────────
    // Avoid the heavy GROUP_CONCAT JOIN – the detail page builds its own image
    // list from the same-group products returned here.
    const query = `
      SELECT Id, Name, categories, Url, date, price,
             filter, filter1, android_series, same, publicId
      FROM products
      ORDER BY date DESC
    `;

    const [products] = await connection.query(query);
    connection.release();

    const formattedProducts = products.map(product => ({
      id: product.Id,
      name: product.Name,
      categories: product.categories,
      image: product.Url,
      date: product.date,
      price: product.price,
      filter: product.filter,
      filter1: product.filter1,
      android_series: product.android_series,
      publicId: product.publicId,
      same: product.same,
    }));

    return NextResponse.json(formattedProducts);

  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}