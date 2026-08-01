import { NextResponse } from 'next/server'
import pool from '@/lib/db'

export async function GET() {
  try {
    const connection = await pool.getConnection()
    const [rows] = await connection.execute('SELECT * FROM silence_prices')
    connection.release()
    return NextResponse.json({ success: true, prices: rows })
  } catch (error) {
    console.error('Fetch error:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const { updates } = await request.json()

    if (!Array.isArray(updates)) {
      return NextResponse.json({ success: false, message: 'Invalid payload' }, { status: 400 })
    }

    const connection = await pool.getConnection()
    
    await connection.beginTransaction()
    
    try {
      for (const item of updates) {
        await connection.execute(`
          INSERT INTO silence_prices (category, car_type, price)
          VALUES (?, ?, ?)
          ON DUPLICATE KEY UPDATE price = ?
        `, [item.category, item.car_type, item.price, item.price])
      }
      await connection.commit()
    } catch (e) {
      await connection.rollback()
      throw e
    } finally {
      connection.release()
    }

    return NextResponse.json({ success: true, message: 'Prices updated successfully' })
  } catch (error) {
    console.error('Update error:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
