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
  const { category } = params
  let connection;
  
  try {
    // 解析请求体
    const body = await request.json()
    const { id, same, publicId } = body
    
    console.log('Delete request:', { category, id, same, publicId })

    if (!same) {
      return NextResponse.json(
        { success: false, message: 'Same parameter is required' },
        { status: 400 }
      )
    }

    connection = await pool.getConnection()
    await connection.beginTransaction()

    // 1. 获取所有相关图片的 publicId
    const [relatedImages] = await connection.query(
      'SELECT publicId FROM gallery WHERE same = ?',
      [same]
    )
    console.log('Related images:', relatedImages)

    // 2. 从 Cloudinary 删除所有相关图片
    for (const image of relatedImages) {
      if (image.publicId) {
        try {
          await cloudinary.uploader.destroy(image.publicId)
        } catch (cloudinaryError) {
          console.error('Error deleting from Cloudinary:', cloudinaryError)
        }
      }
    }

    // 3. 从数据库删除所有相关图片
    const [deleteResult] = await connection.query(
      'DELETE FROM gallery WHERE same = ?',
      [same]
    )

    await connection.commit()
    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Delete operation failed:', error)
    if (connection) {
      await connection.rollback()
    }
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    )
  } finally {
    if (connection) {
      connection.release()
    }
  }
} 