import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.execute('SELECT COUNT(*) as count FROM gallery');
      return NextResponse.json({ success: true, count: rows[0].count });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Database test error:', error);
    return NextResponse.json(
      { error: 'Database test failed', details: error.message },
      { status: 500 }
    );
  }
} 