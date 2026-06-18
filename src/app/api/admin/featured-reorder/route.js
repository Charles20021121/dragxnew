import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(request) {
  try {
    const { items } = await request.json();

    if (!Array.isArray(items)) {
      return NextResponse.json({ error: 'Invalid data format' }, { status: 400 });
    }

    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      for (const item of items) {
        if (!item.id || typeof item.sort_order !== 'number') {
          continue;
        }
        
        // We update all rows that share the same main 'same' ID if they are linked
        const query = 'UPDATE products SET sort_order = ? WHERE same = ?';
        await connection.query(query, [item.sort_order, item.id]);
      }

      await connection.commit();
      return NextResponse.json({ message: 'Order updated successfully' });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error reordering products:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
