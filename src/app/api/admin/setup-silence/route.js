import { NextResponse } from 'next/server'
import pool from '@/lib/db'

export async function GET() {
  try {
    const connection = await pool.getConnection()
    
    // Create table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS silence_prices (
        id INT AUTO_INCREMENT PRIMARY KEY,
        category VARCHAR(255) NOT NULL,
        car_type VARCHAR(255) NOT NULL,
        price VARCHAR(255) DEFAULT '',
        UNIQUE KEY unique_cat_car (category, car_type)
      )
    `)
    
    // Seed data
    const categories = ['BASIC', 'STANDARD', 'PRO', 'COMFORT', 'COMFORT MAX', 'ACOUSTIC PROMAX'];
    const carTypes = ['HATCHBACK', 'SEDAN', 'SUV', 'MPV'];

    for (const cat of categories) {
      for (const car of carTypes) {
        await connection.execute(`
          INSERT IGNORE INTO silence_prices (category, car_type, price)
          VALUES (?, ?, ?)
        `, [cat, car, '']);
      }
    }

    connection.release()
    
    return NextResponse.json({ success: true, message: 'Table created and seeded' })
  } catch (error) {
    console.error('Setup error:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
