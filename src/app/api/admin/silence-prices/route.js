import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import pool from '@/lib/db'
import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3'

const ACCOUNT_ID = "0ec9e4b9094d340d1e3b9530f8a07bcc"
const ACCESS_KEY_ID = "c3137344dab444cc7d472e85a295c86c"
const SECRET_ACCESS_KEY = "040469803914f825110df2e3951566dcbd02d099327bf62443257872262e7417"
const BUCKET_NAME = "dragx"
const R2_PUBLIC_BASE = "https://pub-332f16c726da4f048f11221d7baacb53.r2.dev/"

const s3Client = new S3Client({
  region: "auto",
  endpoint: `https://${ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: ACCESS_KEY_ID,
    secretAccessKey: SECRET_ACCESS_KEY,
  },
})

// 从 R2 中物理删除旧文件
async function deleteFromR2(url) {
  if (!url || typeof url !== 'string' || !url.includes(R2_PUBLIC_BASE)) return
  try {
    const key = url.replace(R2_PUBLIC_BASE, '')
    await s3Client.send(new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    }))
    console.log('R2 old image deleted:', key)
  } catch (error) {
    console.error('R2 delete error:', error)
  }
}

// 确保表和字段存在
async function ensureSchema(connection) {
  try {
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS silence_prices (
        id INT AUTO_INCREMENT PRIMARY KEY,
        category VARCHAR(50) NOT NULL,
        car_type VARCHAR(50) NOT NULL,
        price VARCHAR(50) DEFAULT '',
        image_url TEXT,
        mobile_image_url TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE KEY unique_cat_car (category, car_type)
      )
    `)

    try {
      await connection.execute(`ALTER TABLE silence_prices ADD COLUMN image_url TEXT`)
    } catch (e) {}

    try {
      await connection.execute(`ALTER TABLE silence_prices ADD COLUMN mobile_image_url TEXT`)
    } catch (e) {}
  } catch (err) {
    console.error('ensureSchema error:', err)
  }
}

export async function GET() {
  try {
    const connection = await pool.getConnection()
    await ensureSchema(connection)
    const [rows] = await connection.execute('SELECT * FROM silence_prices')
    connection.release()
    return NextResponse.json({ success: true, prices: rows })
  } catch (error) {
    console.error('Fetch error:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const { updates } = await request.json()

    if (!Array.isArray(updates)) {
      return NextResponse.json({ success: false, message: 'Invalid payload' }, { status: 400 })
    }

    const connection = await pool.getConnection()
    await ensureSchema(connection)
    
    await connection.beginTransaction()
    
    try {
      for (const item of updates) {
        if (!item.category || !item.car_type) continue

        // 1. 查询现有的旧图片路径
        const [existingRows] = await connection.execute(`
          SELECT image_url, mobile_image_url FROM silence_prices 
          WHERE category = ? AND car_type = ?
        `, [item.category, item.car_type])

        const oldItem = existingRows[0]

        // 2. 如果替换了新的桌面端图片，自动清理 R2 中的旧图
        if (oldItem && oldItem.image_url && item.image_url !== undefined && item.image_url !== oldItem.image_url) {
          await deleteFromR2(oldItem.image_url)
        }

        // 3. 如果替换了新的手机端图片，自动清理 R2 中的旧图
        if (oldItem && oldItem.mobile_image_url && item.mobile_image_url !== undefined && item.mobile_image_url !== oldItem.mobile_image_url) {
          await deleteFromR2(oldItem.mobile_image_url)
        }

        // 4. 更新数据库为最新数据
        await connection.execute(`
          INSERT INTO silence_prices (category, car_type, price, image_url, mobile_image_url)
          VALUES (?, ?, ?, ?, ?)
          ON DUPLICATE KEY UPDATE 
            price = VALUES(price),
            image_url = VALUES(image_url),
            mobile_image_url = VALUES(mobile_image_url)
        `, [
          item.category, 
          item.car_type, 
          item.price || '', 
          item.image_url || null, 
          item.mobile_image_url || null
        ])
      }
      await connection.commit()
    } catch (e) {
      await connection.rollback()
      throw e
    } finally {
      connection.release()
    }

    revalidatePath('/products', 'layout')
    revalidatePath('/products/silence', 'page')
    revalidatePath('/products/soundproof', 'page')
    revalidatePath('/', 'layout')

    return NextResponse.json({ success: true, message: 'Prices and images updated with auto-cleanup' })
  } catch (error) {
    console.error('Update error:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
