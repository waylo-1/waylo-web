import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

// Saves a Google-signed-in user into the shared `users` table (same one the app
// backend + Mac read by email). Called from the website after Google Identity
// Services returns the signed-in email. Same-origin HTTPS route -> no mixed
// content. Does NOT change plan — new users default to 'free'.

export const runtime = 'nodejs';

let ready = false;
async function ensure() {
  if (ready) return;
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      email TEXT PRIMARY KEY, name TEXT, plan TEXT DEFAULT 'free', google_id TEXT,
      free_tasks_used INTEGER DEFAULT 0, paid_tasks_remaining INTEGER DEFAULT 0,
      created_at TIMESTAMPTZ DEFAULT now(), last_seen TIMESTAMPTZ DEFAULT now())`);
  await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS plan TEXT DEFAULT 'free'`);
  await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS google_id TEXT`);
  await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS paid_tasks_remaining INTEGER DEFAULT 0`);
  ready = true;
}

export async function POST(req: Request) {
  try {
    const b = await req.json().catch(() => ({}));
    const email = String(b?.email || '').trim().toLowerCase();
    const name = String(b?.name || '').trim().slice(0, 120);
    const googleId = String(b?.googleId || '').trim().slice(0, 64);
    if (!email.includes('@')) return NextResponse.json({ ok: false, error: 'valid email required' }, { status: 400 });
    await ensure();
    const r = await pool.query(
      `INSERT INTO users (email, name, google_id, last_seen) VALUES ($1,$2,$3, now())
       ON CONFLICT (email) DO UPDATE SET
         name = COALESCE(NULLIF(EXCLUDED.name, ''), users.name),
         google_id = COALESCE(NULLIF(EXCLUDED.google_id, ''), users.google_id),
         last_seen = now()
       RETURNING plan, paid_tasks_remaining`,
      [email, name, googleId]
    );
    const u = r.rows[0];
    return NextResponse.json({ ok: true, email, plan: u.plan, isPaid: (u.paid_tasks_remaining || 0) > 0 || u.plan === 'paid' });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'unknown';
    console.error('[auth]', message);
    return NextResponse.json({ ok: false, error: 'auth failed' }, { status: 500 });
  }
}
