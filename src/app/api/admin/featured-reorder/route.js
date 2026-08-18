import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
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
        
        // Update both main and associated images
        const query = 'UPDATE products SET sort_order = ? WHERE same = ? OR Id = ?';
        await connection.query(query, [item.sort_order, item.id, item.id]);
      }

      await connection.commit();

      revalidatePath('/products', 'layout');
      revalidatePath('/products/silence', 'page');
      revalidatePath('/products/soundproof', 'page');
      revalidatePath('/', 'layout');

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
