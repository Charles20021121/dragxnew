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

// 獲取 Gallery 分類列表
export async function GET(request, { params }) {
  const resolvedParams = await params
  const { category } = resolvedParams

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

// 刪除 Gallery 圖片
export async function DELETE(request, { params }) {
  const resolvedParams = await params
  const { category } = resolvedParams;
  const { id, publicId, same } = await request.json();
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    console.log('Delete request:', { category, id, publicId, same });

    const [galleryCheck] = await connection.query(
      'SELECT * FROM gallery WHERE Id = ? AND categories = ?',
      [id, category]
    );

    if (!galleryCheck.length) {
      throw new Error('Image not found');
    }

    const image = galleryCheck[0];

    if (image.Id === image.same) {
      // 主圖：刪除整組相關圖片（DB + R2）
      const [relatedImages] = await connection.query(
        'SELECT Url FROM gallery WHERE same = ?',
        [image.same]
      );

      for (const relatedImage of relatedImages) {
        await deleteFromR2(relatedImage.Url);
      }

      const [deleteResult] = await connection.query(
        'DELETE FROM gallery WHERE same = ?',
        [image.same]
      );

      console.log(`Deleted ${deleteResult.affectedRows} related images`);
    } else {
      // 副圖：只刪除這一張（DB + R2）
      await deleteFromR2(image.Url);

      const [result] = await connection.query(
        'DELETE FROM gallery WHERE Id = ? AND categories = ?',
        [id, category]
      );

      if (result.affectedRows === 0) {
        throw new Error('Failed to delete from database');
      }
    }

    await connection.commit();
    
    revalidatePath('/gallery', 'layout');
    
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