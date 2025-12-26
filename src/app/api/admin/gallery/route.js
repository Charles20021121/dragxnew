import { NextResponse } from 'next/server'
import pool from '@/lib/db'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category')

  if (!category) {
    return NextResponse.json({ error: 'Category is required' }, { status: 400 })
  }

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

export async function POST(request) {
  const connection = await pool.getConnection()
  try {
    const data = await request.json()
    console.log('Received data:', data)

    // 開始事務
    await connection.beginTransaction()

    // 使用 FOR UPDATE 鎖定表，獲取當前最大 Id
    const [maxIdResult] = await connection.query(
      'SELECT COALESCE(MAX(Id), 0) + 1 as nextId FROM gallery FOR UPDATE'
    )
    const nextId = maxIdResult[0].nextId

    // 插入圖片，手動指定 Id
    const [result] = await connection.query(
      `INSERT INTO gallery (
        Id,
        Name,
        categories,
        Url,
        same,
        description,
        specifications,
        buy,
        publicId,
        date,
        link,
        filter,
        filter1
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        nextId,
        data.Name || '',
        data.categories || '',
        data.Url || '',
        data.same || nextId,  // 如果沒有 same，使用新的 Id
        data.description || '',
        data.Specifications || '',
        data.buy || '',
        data.publicId || '',
        data.date || new Date().toISOString().replace('T', ' ').split('.')[0],
        data.link || '',
        data.filter || '',
        data.filter1 || ''
      ]
    )

    await connection.commit()
    console.log('Insert successful, ID:', nextId)

    return NextResponse.json({
      success: true,
      id: nextId
    })
  } catch (error) {
    await connection.rollback()
    console.error('Database error:', error)
    return NextResponse.json(
      { message: `Server error: ${error.message}` },
      { status: 500 }
    )
  } finally {
    connection.release()
  }
} 