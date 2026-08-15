import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

// Lead capture for Waylo sign-ups. Writes to the same Aurora DB the rest of the
// app uses (see src/lib/db.ts). The table is created on first call so no
// separate migration step is needed for the launch.

export const runtime = 'nodejs';

let tableReady = false;
async function ensureTable() {
  if (tableReady) return;
  await pool.query(`
    CREATE TABLE IF NOT EXISTS leads (
      id BIGSERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      phone TEXT NOT NULL,
      source TEXT DEFAULT 'web',
      created_at TIMESTAMPTZ DEFAULT now()
    )
  `);
  tableReady = true;
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const name = String(body?.name || '').trim().slice(0, 120);
    const phone = String(body?.phone || '').trim().slice(0, 20);

    if (!name || phone.replace(/\D/g, '').length < 7) {
      return NextResponse.json(
        { ok: false, error: 'Please enter your name and a valid phone number.' },
        { status: 400 }
      );
    }

    await ensureTable();
    await pool.query('INSERT INTO leads (name, phone, source) VALUES ($1, $2, $3)', [
      name,
      phone,
      'web',
    ]);

    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'unknown error';
    console.error('[signup] failed:', message);
    return NextResponse.json({ ok: false, error: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}

// Simple count endpoint so you can show "N people signed up" as proof.
export async function GET() {
  try {
    await ensureTable();
    const r = await pool.query('SELECT COUNT(*)::int AS count FROM leads');
    return NextResponse.json({ ok: true, count: r.rows[0].count });
  } catch {
    return NextResponse.json({ ok: true, count: 0 });
  }
}
