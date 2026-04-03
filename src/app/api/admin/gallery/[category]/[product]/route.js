import { NextResponse } from 'next/server'
import pool from '@/lib/db'
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

// 從 R2 URL 提取 key 並刪除文件（用於替換圖片時刪除舊圖）
async function deleteFromR2ByUrl(url) {
  if (!url || !url.includes(R2_PUBLIC_BASE)) return;
  try {
    const key = url.replace(R2_PUBLIC_BASE, '');
    await s3Client.send(new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    }));
    console.log('R2 deleted old image:', key);
  } catch (error) {
    console.error('R2 delete error:', error);
  }
}

export async function GET(request, { params }) {
  const resolvedParams = await params
  const { category, product } = resolvedParams

  try {
    const connection = await pool.getConnection()
    try {
      const [rows] = await connection.query(
        `SELECT Id, Name, Url, same, description, date, buy, categories, 
         publicId, filter, filter1, Specifications, link 
         FROM gallery 
         WHERE categories = ? 
         AND LOWER(REPLACE(Name, " ", "-")) = LOWER(?)
         ORDER BY date ASC
         LIMIT 1`,
        [category, product]
      )

      if (!rows[0]) {
        return NextResponse.json(
          { error: 'Product not found' },
          { status: 404 }
        )
      }

      return NextResponse.json(rows[0])
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

export async function PUT(request, { params }) {
  const resolvedParams = await params
  const { category, product } = resolvedParams
  let connection;

  try {
    const data = await request.json()
    const { Name, buy, Specifications, description } = data

    connection = await pool.getConnection()
    await connection.beginTransaction()

    const [productRow] = await connection.query(
      `SELECT Id, same FROM gallery 
       WHERE categories = ? 
       AND LOWER(REPLACE(Name, " ", "-")) = LOWER(?)
       LIMIT 1`,
      [category, product]
    )

    if (!productRow[0]) {
      throw new Error('Product not found')
    }

    const { same, Id } = productRow[0]

    const [result] = await connection.query(
      `UPDATE gallery 
       SET Name = ?,
           buy = ?,
           Specifications = ?,
           description = ?
       WHERE same = ? AND Id = ?`,
      [Name, buy, Specifications, description, same, Id]
    )

    if (result.affectedRows === 0) {
      throw new Error('Update failed')
    }

    await connection.commit()
    return NextResponse.json({
      success: true,
      updatedName: Name
    })

  } catch (error) {
    console.error('Update operation failed:', error)
    if (connection) await connection.rollback()
    return NextResponse.json(
      { success: false, message: error.message || 'Server error' },
      { status: 500 }
    )
  } finally {
    if (connection) connection.release()
  }
}

export async function PATCH(request) {
  let connection;
  try {
    const data = await request.json()
    const updates = Array.isArray(data) ? data : [data]

    if (updates.length === 0) {
      return NextResponse.json({ error: 'No updates provided' }, { status: 400 })
    }

    connection = await pool.getConnection()
    await connection.beginTransaction()

    for (const update of updates) {
      const { id, link, date, newUrl, newPublicId, deleteOldUrl } = update

      if (!id) continue

      // 替換舊圖時，從 R2 刪除舊圖文件
      if (deleteOldUrl) {
        await deleteFromR2ByUrl(deleteOldUrl)
      }

      const fields = []
      const params = []

      if (link !== undefined) {
        fields.push('link = ?')
        params.push(link)
      }

      if (date !== undefined) {
        fields.push('date = ?')
        params.push(date)
      }

      if (newUrl !== undefined) {
        fields.push('Url = ?')
        params.push(newUrl)
      }

      if (newPublicId !== undefined) {
        fields.push('publicId = ?')
        params.push(newPublicId)
      }

      if (fields.length > 0) {
        params.push(id)
        await connection.query(
          `UPDATE gallery SET ${fields.join(', ')} WHERE Id = ?`,
          params
        )
      }
    }

    await connection.commit()
    return NextResponse.json({ success: true, message: 'Gallery updated' })
  } catch (error) {
    if (connection) await connection.rollback()
    console.error('Update gallery failed:', error)
    return NextResponse.json(
      { success: false, message: error.message || 'Server error' },
      { status: 500 }
    )
  } finally {
    if (connection) connection.release()
  }
}