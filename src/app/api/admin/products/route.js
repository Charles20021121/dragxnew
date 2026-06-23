import { NextResponse } from 'next/server'
import pool from '@/lib/db'
import { revalidatePath } from 'next/cache'

export async function POST(request) {
  const connection = await pool.getConnection()
  try {
    const data = await request.json()

    // 開始事務
    await connection.beginTransaction()

    // 使用 FOR UPDATE 鎖定表，獲取當前最大 Id
    const [maxIdResult] = await connection.query(
      'SELECT COALESCE(MAX(Id), 0) + 1 as nextId FROM products FOR UPDATE'
    )
    const nextId = maxIdResult[0].nextId

    // 插入產品，手動指定 Id
    const [result] = await connection.query(
      `INSERT INTO products (
        Id,
        Name,
        categories,
        Url,
        Specifications,
        description,
        buy,
        filter,
        filter1,
        android_series,
        custom_filter,
        publicId,
        date,
        price,
        same
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        nextId,
        data.Name || '',
        data.categories || '',
        data.Url || '',
        data.Specifications || '',
        data.description || '',
        data.buy || '',
        data.filter || '',
        data.filter1 || '',
        data.android_series || '',
        data.custom_filter || '',
        data.publicId || '',
        data.date || new Date().toISOString().replace('T', ' ').split('.')[0],
        data.price || null,
        data.same || nextId  // 如果沒有 same，使用新的 Id
      ]
    )

    await connection.commit()

    revalidatePath('/products', 'layout')

    return NextResponse.json({
      success: true,
      id: nextId
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