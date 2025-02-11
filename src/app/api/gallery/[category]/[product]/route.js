import { NextResponse } from 'next/server'
import pool from '@/lib/db'

export async function GET(request, { params }) {
  const { category, product } = params
  const productSlug = decodeURIComponent(product)

  try {
    const connection = await pool.getConnection()
    
    try {
      const query = `
        SELECT *
        FROM gallery
        WHERE categories = ? 
        AND LOWER(REPLACE(Name, ' ', '-')) = ?
      `
      
      const [rows] = await connection.execute(query, [category, productSlug])
      
      if (rows.length === 0) {
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