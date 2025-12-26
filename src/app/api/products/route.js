import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    const connection = await pool.getConnection();

    if (category) {
      let query = `
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
        LEFT JOIN products p2 ON p2.same = p1.same AND p2.Id != p1.Id
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
        same: product.same
      }));

      return NextResponse.json(formattedProducts);
    } else {
      let query = `
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
        LEFT JOIN products p2 ON p2.same = p1.same AND p2.Id != p1.Id
        GROUP BY p1.Id
        ORDER BY p1.date DESC
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
        same: product.same
      }));

      return NextResponse.json(formattedProducts);
    }
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 