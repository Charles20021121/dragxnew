import { NextResponse } from 'next/server'
import pool from '@/lib/db'
import { v2 as cloudinary } from 'cloudinary'

// 配置 Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

// 添加 GET 方法
export async function GET(request, { params }) {
  const { category } = params

  try {
    const connection = await pool.getConnection()
    try {
      const query = `
        SELECT *
        FROM gallery
        WHERE categories = ?
        ORDER BY date DESC
      `
      const [rows] = await connection.execute(query, [category])
      return NextResponse.json(rows)
    } finally {
      connection.release()
    }
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request, { params }) {
  const { category } = params;
  const { id, publicId, same } = await request.json();
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();
    
    console.log('Delete request:', { category, id, publicId, same });

    // 檢查圖片是否存在
    const [galleryCheck] = await connection.query(
      'SELECT * FROM gallery WHERE Id = ? AND categories = ?',
      [id, category]
    );

    if (!galleryCheck.length) {
      throw new Error('Image not found');
    }

    const image = galleryCheck[0];

    // 如果是主圖片（Id 和 same 相同），刪除所有相關圖片
    if (image.Id === image.same) {
      // 獲取所有相關圖片的 publicId
      const [relatedImages] = await connection.query(
        'SELECT publicId FROM gallery WHERE same = ?',
        [image.same]
      );

      // 從 Cloudinary 刪除所有相關圖片
      for (const relatedImage of relatedImages) {
        if (relatedImage.publicId) {
          try {
            const cloudinaryResult = await cloudinary.uploader.destroy(relatedImage.publicId);
            console.log('Cloudinary delete result:', cloudinaryResult);
          } catch (error) {
            console.error('Cloudinary delete error:', error);
            // 繼續刪除其他圖片，不中斷流程
          }
        }
      }

      // 從數據庫刪除所有相關圖片
      const [deleteResult] = await connection.query(
        'DELETE FROM gallery WHERE same = ?',
        [image.same]
      );

      console.log(`Deleted ${deleteResult.affectedRows} related images`);
    } else {
      // 如果不是主圖片，只刪除單張圖片
      if (publicId) {
        try {
          const cloudinaryResult = await cloudinary.uploader.destroy(publicId);
          console.log('Cloudinary delete result:', cloudinaryResult);
        } catch (error) {
          console.error('Cloudinary delete error:', error);
          throw new Error('Failed to delete image from Cloudinary');
        }
      }

      // 從數據庫刪除單張圖片
      const [result] = await connection.query(
        'DELETE FROM gallery WHERE Id = ? AND categories = ?',
        [id, category]
      );

      if (result.affectedRows === 0) {
        throw new Error('Failed to delete from database');
      }
    }

    await connection.commit();
    return NextResponse.json({ 
      success: true,
      message: 'Image(s) deleted successfully'
    });

  } catch (error) {
    await connection.rollback();
    console.error('Delete operation failed:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: error.message || 'Failed to delete image(s)'
      },
      { status: 500 }
    );
  } finally {
    connection.release();
  }
} 