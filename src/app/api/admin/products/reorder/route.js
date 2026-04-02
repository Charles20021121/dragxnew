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
      // 1. Get all current records for this product group
      const mainId = images[0].same || images[0].id;
      const [currentRecords] = await connection.query(
        'SELECT Id, Url, publicId, Name, date FROM products WHERE Id = ? OR same = ?',
        [mainId, mainId]
      );

      // 2. Map current records to their desired new content
      // We want to redistribute the (Url, publicId, Name) from the 'images' array 
      // into the existing database IDs.
      
      // The product with Id == mainId should get the content of images[0]
      // The other products should get the content of images[1..N]
      
      const updates = [];
      const now = new Date();

      for (let i = 0; i < images.length; i++) {
        const targetId = (i === 0) ? mainId : currentRecords.filter(r => r.Id !== mainId)[i-1]?.Id;
        
        if (targetId) {
          // 增加日期偏移以確保排序
          const updatedDate = new Date(now.getTime() + i * 1000)
            .toISOString().replace('T', ' ').split('.')[0];

          if (i === 0) {
            // 第一張圖（主產品）：只更換圖片資源，保留原有的產品名稱、價格等所有資料
            updates.push(
              connection.query(
                'UPDATE products SET Url = ?, publicId = ?, date = ? WHERE Id = ?',
                [images[i].src, images[i].publicId, updatedDate, targetId]
              )
            );
          } else {
            // 其他副圖：更新圖片資源和日期，並給一個固定的圖片標籤（避免繼承主產品名稱）
            updates.push(
              connection.query(
                'UPDATE products SET Url = ?, publicId = ?, Name = ?, date = ? WHERE Id = ?',
                [images[i].src, images[i].publicId, "", updatedDate, targetId]
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
