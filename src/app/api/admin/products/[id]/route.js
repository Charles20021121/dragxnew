import { NextResponse } from 'next/server'
import pool from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3'

const ACCOUNT_ID = "0ec9e4b9094d340d1e3b9530f8a07bcc";
const ACCESS_KEY_ID = "c3137344dab444cc7d472e85a295c86c";
const SECRET_ACCESS_KEY = "040469803914f825110df2e3951566dcbd02d099327bf62443257872262e7417";
const BUCKET_NAME = "dragx";
const R2_PUBLIC_BASE = "https://pub-332f16c726da4f048f11221d7baacb53.r2.dev/";

const s3Client = new S3Client({
  region: "auto",
  endpoint: `https://${ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: ACCESS_KEY_ID,
    secretAccessKey: SECRET_ACCESS_KEY,
  },
});

// 從 R2 URL 提取 key 並刪除文件
async function deleteFromR2(url) {
  if (!url || !url.includes(R2_PUBLIC_BASE)) return;
  try {
    const key = url.replace(R2_PUBLIC_BASE, '');
    await s3Client.send(new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    }));
    console.log('R2 deleted:', key);
  } catch (error) {
    console.error('R2 delete error:', error);
  }
}

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
  const params = await paramsPromise;
  const connection = await pool.getConnection();

  try {
    const data = await request.json();

    // 檢查是否有舊圖片需要清理
    if (data.Url) {
      const [oldRows] = await connection.query('SELECT Url FROM products WHERE Id = ?', [params.id]);
      const oldUrl = oldRows[0]?.Url;
      if (oldUrl && data.Url !== oldUrl) {
        await deleteFromR2(oldUrl);
      }
    }

    const [result] = await connection.query(
      `UPDATE products SET
        Name = ?,
        categories = ?,
        Url = COALESCE(?, Url),
        publicId = COALESCE(?, publicId),
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
        data.Url || null,
        data.publicId || null,
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

    revalidatePath('/products', 'layout');
    revalidatePath('/products/silence', 'page');
    revalidatePath('/products/soundproof', 'page');
    revalidatePath('/', 'layout');

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

    const [productCheck] = await connection.query(
      'SELECT * FROM products WHERE Id = ?',
      [id]
    );

    if (!productCheck.length) {
      throw new Error('Product not found');
    }

    const product = productCheck[0];

    if (product.Id === product.same || !product.same) {
      // 主圖：刪除整組相關圖片（DB + R2）
      const [relatedImages] = await connection.query(
        'SELECT * FROM products WHERE same = ? OR Id = ?',
        [product.same || id, id]
      );

      for (const image of relatedImages) {
        if (image.Url) {
          await deleteFromR2(image.Url);
        }
      }

      const [deleteResult] = await connection.query(
        'DELETE FROM products WHERE same = ? OR Id = ?',
        [product.same || id, id]
      );

      if (deleteResult.affectedRows === 0) {
        throw new Error('Failed to delete related images');
      }
    } else {
      // 副圖：只刪除這一張（DB + R2）
      if (product.Url) {
        await deleteFromR2(product.Url);
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
    
    revalidatePath('/products', 'layout');
    revalidatePath('/products/silence', 'page');
    revalidatePath('/products/soundproof', 'page');
    revalidatePath('/', 'layout');
    
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