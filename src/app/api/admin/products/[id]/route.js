import { NextResponse } from 'next/server'
import pool from '@/lib/db'
import { v2 as cloudinary } from 'cloudinary'

// 配置 Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

// 獲取單個產品
export async function GET(request, { params: paramsPromise }) {
  const params = await paramsPromise;
  try {
    const connection = await pool.getConnection()
    try {
      const [product] = await connection.query(
        'SELECT * FROM products WHERE Id = ?',
        [params.id]
      )

      if (!product.length) {
        return NextResponse.json(
          { message: 'Product not found' },
          { status: 404 }
        )
      }

      return NextResponse.json(product[0])
    } finally {
      connection.release()
    }
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json(
      { message: 'Server error' },
      { status: 500 }
    )
  }
}

// 更新產品
export async function PUT(request, { params: paramsPromise }) {
  // 先等待 params
  const params = await paramsPromise;
  const connection = await pool.getConnection();

  try {
    const data = await request.json();

    // 只更新當前產品的資料，不批量更新所有副圖
    // 不更新 date 字段，保持原來的順序
    const [result] = await connection.query(
      `UPDATE products SET
        Name = ?,
        categories = ?,
        description = ?,
        Specifications = ?,
        buy = ?,
        filter = ?,
        filter1 = ?,
        android_series = ?,
        custom_filter = ?,
        price = ?
      WHERE Id = ?`,
      [
        data.Name || '',
        data.categories || '',
        data.description || '',
        data.Specifications || '',
        data.buy || '',
        data.filter || '',
        data.filter1 || '',
        data.android_series || '',
        data.custom_filter || '',
        data.price || null,
        params.id
      ]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { message: 'Failed to update product' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { message: 'Server error' },
      { status: 500 }
    );
  } finally {
    connection.release();
  }
}

// 刪除產品
export async function DELETE(request, { params }) {
  const resolvedParams = await params;
  const { id } = resolvedParams;
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    // 1. 檢查產品是否存在並獲取相關信息
    const [productCheck] = await connection.query(
      'SELECT * FROM products WHERE Id = ?',
      [id]
    );

    if (!productCheck.length) {
      throw new Error('Product not found');
    }

    const product = productCheck[0];

    // 2. 如果是主圖（Id 和 same 相同），刪除所有相關圖片
    if (product.Id === product.same) {
      // 獲取所有相關圖片
      const [relatedImages] = await connection.query(
        'SELECT * FROM products WHERE same = ?',
        [product.same]
      );

      // 從 Cloudinary 刪除所有相關圖片
      for (const image of relatedImages) {
        if (image.publicId) {
          try {
            await cloudinary.uploader.destroy(image.publicId);
          } catch (error) {
            console.error('Cloudinary delete error:', error);
          }
        }
      }

      // 從數據庫刪除所有相關圖片
      const [deleteResult] = await connection.query(
        'DELETE FROM products WHERE same = ?',
        [product.same]
      );

      if (deleteResult.affectedRows === 0) {
        throw new Error('Failed to delete related images');
      }
    } else {
      // 如果不是主圖，只刪除單張圖片
      if (product.publicId) {
        try {
          await cloudinary.uploader.destroy(product.publicId);
        } catch (error) {
          console.error('Cloudinary delete error:', error);
        }
      }

      const [deleteResult] = await connection.query(
        'DELETE FROM products WHERE Id = ?',
        [id]
      );

      if (deleteResult.affectedRows === 0) {
        throw new Error('Failed to delete image');
      }
    }

    await connection.commit();
    return NextResponse.json({
      success: true,
      message: 'Product(s) deleted successfully'
    });

  } catch (error) {
    await connection.rollback();
    console.error('Delete operation failed:', error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to delete product(s)'
      },
      { status: 500 }
    );
  } finally {
    connection.release();
  }
} 