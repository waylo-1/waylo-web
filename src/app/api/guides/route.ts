import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export async function GET() {
  try {
    const { rows } = await pool.query(
      `SELECT id, task, created_at
       FROM guides
       ORDER BY created_at DESC
       LIMIT 6`
    );
    return NextResponse.json({ guides: rows });
  } catch (err) {
    console.error('DB error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
