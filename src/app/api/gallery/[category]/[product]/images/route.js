import { NextResponse } from 'next/server'
import pool from '@/lib/db'

export async function GET(request, { params }) {
  const { category, product } = params
  const productSlug = decodeURIComponent(product)

  try {
    const connection = await pool.getConnection()
    
    try {
      const query = `
        SELECT Url as url, Name as alt
        FROM gallery
        WHERE categories = ? 
        AND (
          LOWER(REPLACE(Name, ' ', '-')) = ?
          OR same = (
            SELECT Id FROM gallery 
            WHERE categories = ? 
            AND LOWER(REPLACE(Name, ' ', '-')) = ?
          )
        )
      `
      
      const [rows] = await connection.execute(query, [
        category, 
        productSlug,
        category,
        productSlug
      ])

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