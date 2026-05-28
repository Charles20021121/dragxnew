import { NextResponse } from 'next/server'
import pool from '@/lib/db'

export async function PUT(request) {
  const connection = await pool.getConnection()
  try {
    const data = await request.json()
    const { category, oldFilter, newFilter } = data

    if (!category || !oldFilter || !newFilter) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 })
    }

    await connection.query(
      'UPDATE products SET custom_filter = ? WHERE custom_filter = ? AND categories = ?',
      [newFilter, oldFilter, category]
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json({ message: 'Server error' }, { status: 500 })
  } finally {
    connection.release()
  }
}

export async function DELETE(request) {
  const connection = await pool.getConnection()
  try {
    const data = await request.json()
    const { category, filter } = data

    if (!category || !filter) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 })
    }

    await connection.query(
      'UPDATE products SET custom_filter = "" WHERE custom_filter = ? AND categories = ?',
      [filter, category]
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json({ message: 'Server error' }, { status: 500 })
  } finally {
    connection.release()
  }
}
