import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { rows } = await pool.query(
      'SELECT id, task, steps_json, created_at FROM guides WHERE id = $1',
      [params.id]
    );

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Guide not found' }, { status: 404 });
    }

    const row = rows[0];
    return NextResponse.json({
      id: row.id,
      task: row.task,
      steps: typeof row.steps_json === 'string'
        ? JSON.parse(row.steps_json)
        : row.steps_json,
      createdAt: row.created_at,
    });
  } catch (err) {
    console.error('DB error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
