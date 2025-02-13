import { NextResponse } from 'next/server'
import pool from '@/lib/db'

export async function GET(request, { params }) {
  const { category, product } = params
  const productName = decodeURIComponent(product).replace(/-/g, ' ')
  
  try {
    const connection = await pool.getConnection()
    try {
      const [rows] = await connection.query(
        `SELECT Id, Name, Url, same, description, date, buy, categories, 
         publicId, filter, filter1, Specifications 
         FROM gallery 
         WHERE categories = ? 
         AND LOWER(REPLACE(Name, " ", "-")) = LOWER(?)
         LIMIT 1`,
        [category, product]
      )
      
      if (!rows[0]) {
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

export async function PUT(request, { params }) {
  const { category, product } = params
  let connection;

  try {
    const data = await request.json()
    
    const { Name, buy, Specifications, description} = data

    connection = await pool.getConnection()
    await connection.beginTransaction()

    // 首先獲取產品的 same 值和 Id
    const [productRow] = await connection.query(
      `SELECT Id, same FROM gallery 
       WHERE categories = ? 
       AND LOWER(REPLACE(Name, " ", "-")) = LOWER(?)
       LIMIT 1`,
      [category, product]
    )

    if (!productRow[0]) {
      throw new Error('Product not found')
    }

    const { same, Id } = productRow[0]

    // 更新所有相關圖片的共同資訊
    const [result] = await connection.query(
      `UPDATE gallery 
       SET Name = ?,
           buy = ?,
           Specifications = ?,
           description = ?
       WHERE same = ? AND Id = ?`,
      [Name, buy, Specifications, description, same, Id]
    )

    if (result.affectedRows === 0) {
      throw new Error('Update failed')
    }

    await connection.commit()
    return NextResponse.json({ 
      success: true,
      updatedName: Name  // 返回更新後的名稱
    })

  } catch (error) {
    console.error('Update operation failed:', error)
    if (connection) {
      await connection.rollback()
    }
    return NextResponse.json(
      { success: false, message: error.message || 'Server error' },
      { status: 500 }
    )
  } finally {
    if (connection) {
      connection.release()
    }
  }
} 