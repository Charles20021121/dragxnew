import { NextResponse } from 'next/server'
import pool from '@/lib/db'

export async function POST(request) {
  const connection = await pool.getConnection()
  try {
    const data = await request.json()
    
    // 先插入產品，不設置 same
    const [result] = await connection.query(
      `INSERT INTO products (
        Name, 
        categories,
        Url,
        Specifications,
        description,
        buy,
        filter,
        filter1,
        publicId,
        date
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        data.Name || '',           // 如果沒有值，使用空字符串
        data.categories || '',
        data.Url || '',
        data.Specifications || '', // 使用空字符串代替 null
        data.description || '',
        data.buy || '',
        data.filter || '',
        data.filter1 || '',
        data.publicId || '',
        data.date || new Date().toISOString().replace('T', ' ').split('.')[0]
      ]
    )

    // 使用插入的 ID 更新 same 字段
    await connection.query(
      'UPDATE products SET same = ? WHERE Id = ?',
      [data.same || result.insertId, result.insertId]
    )

    await connection.commit()

    return NextResponse.json({ 
      success: true,
      id: result.insertId
    })
  } catch (error) {
    await connection.rollback()
    console.error('Database error:', error)
    return NextResponse.json(
      { message: 'Server error' },
      { status: 500 }
    )
  } finally {
    connection.release()
  }
}