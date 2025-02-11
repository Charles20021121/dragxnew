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