import { NextResponse } from 'next/server'
import pool from '@/lib/db'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const same = searchParams.get('same')

  if (!same) {
    return NextResponse.json(
      { error: 'Same parameter is required' },
      { status: 400 }
    )
  }

  try {
    const connection = await pool.getConnection()
    try {
      const [rows] = await connection.query(
        'SELECT * FROM gallery WHERE same = ? ORDER BY date ASC',
        [same]
      )
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