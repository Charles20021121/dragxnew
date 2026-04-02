import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(request) {
  try {
    const { images } = await request.json();

    if (!images || !Array.isArray(images) || images.length === 0) {
      return NextResponse.json({ error: 'Invalid images data' }, { status: 400 });
    }

    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      // 1. Get all current records for this product group and sort them by date (matching frontend logic)
      const mainId = images[0].same || images[0].id;
      const [records] = await connection.query(
        'SELECT Id, Url, publicId, Name, date, same FROM products WHERE Id = ? OR same = ?',
        [mainId, mainId]
      );

      // Sort existing records to identify the "slots" (main first, then by date)
      const currentRecords = records.sort((a, b) => {
        if (a.Id == a.same && b.Id != b.same) return -1;
        if (b.Id == b.same && a.Id != a.same) return 1;
        return new Date(a.date) - new Date(b.date);
      });

      // 2. Map current records to their desired new content
      // We redistribute the (Url, publicId) from 'images' array into the existing database IDs.
      const updates = [];

      for (let i = 0; i < images.length; i++) {
        // targetId is the Id of the record at this position (slot i)
        const targetId = currentRecords[i]?.Id;
        
        if (targetId) {
          if (targetId == mainId) {
            // 第一張圖（主產品）：只更換圖片資源，保留原有的產品名稱、價格、日期等所有資料
            updates.push(
              connection.query(
                'UPDATE products SET Url = ?, publicId = ? WHERE Id = ?',
                [images[i].src, images[i].publicId, targetId]
              )
            );
          } else {
            // 其他副圖：僅更新圖片資源，保留原有日期（保持排序），並清空副圖名稱（避免繼承主產品名稱）
            updates.push(
              connection.query(
                'UPDATE products SET Url = ?, publicId = ?, Name = ? WHERE Id = ?',
                [images[i].src, images[i].publicId, "", targetId]
              )
            );
          }
        }
      }

      await Promise.all(updates);
      await connection.commit();
      
      return NextResponse.json({ success: true });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error reordering products:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 
