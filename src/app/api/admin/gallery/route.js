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

    // 先插入圖片
    const [result] = await connection.query(
      `INSERT INTO gallery (
        Name, 
        categories,
        Url,
        same,
        description,
        specifications,
        buy,
        publicId,
        date,
        link
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        data.Name || '',
        data.categories || '',
        data.Url || '',
        data.same || '',  // 使用傳入的 same 值
        data.description || '',
        data.Specifications || '',
        data.buy || '',
        data.publicId || '',
        data.date || new Date().toISOString().replace('T', ' ').split('.')[0],
        data.link || ''
      ]
    )

    // 如果沒有提供 same，則使用新插入的 Id 作為 same
    if (!data.same) {
      await connection.query(
        'UPDATE gallery SET same = ? WHERE Id = ?',
        [result.insertId, result.insertId]
      )
    }

    await connection.commit()
    console.log('Insert successful, ID:', result.insertId)

    return NextResponse.json({
      success: true,
      id: result.insertId
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