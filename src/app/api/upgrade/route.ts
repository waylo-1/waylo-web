import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

// ₹100 UPI upgrade from the website. Writes the SHARED `users` table (same one
// the app backend + Yash's Mac read by email): sets plan='paid' and grants 25
// tasks. Same-origin HTTPS route -> no mixed-content issue.

export const runtime = 'nodejs';

const TASKS = 25;
const PRICE = 100;

let ready = false;
async function ensure() {
  if (ready) return;
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      email TEXT PRIMARY KEY, name TEXT, plan TEXT DEFAULT 'free', google_id TEXT,
      free_tasks_used INTEGER DEFAULT 0, paid_tasks_remaining INTEGER DEFAULT 0,
      created_at TIMESTAMPTZ DEFAULT now(), last_seen TIMESTAMPTZ DEFAULT now())`);
  await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS plan TEXT DEFAULT 'free'`);
  await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS paid_tasks_remaining INTEGER DEFAULT 0`);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS account_purchases (
      id BIGSERIAL PRIMARY KEY, email TEXT NOT NULL, upi_ref TEXT,
      amount_inr INTEGER DEFAULT ${PRICE}, tasks_granted INTEGER DEFAULT ${TASKS},
      created_at TIMESTAMPTZ DEFAULT now())`);
  ready = true;
}

export async function POST(req: Request) {
  try {
    const b = await req.json().catch(() => ({}));
    const email = String(b?.email || '').trim().toLowerCase();
    const ref = String(b?.ref || b?.upiRef || '').trim().slice(0, 64);
    if (!email.includes('@')) return NextResponse.json({ ok: false, error: 'Enter a valid email.' }, { status: 400 });
    if (ref.length < 4) return NextResponse.json({ ok: false, error: 'Enter the UPI reference from your payment.' }, { status: 400 });
    await ensure();
    await pool.query('INSERT INTO users (email) VALUES ($1) ON CONFLICT (email) DO NOTHING', [email]);
    await pool.query('INSERT INTO account_purchases (email, upi_ref) VALUES ($1, $2)', [email, ref]);
    await pool.query(
      "UPDATE users SET plan='paid', paid_tasks_remaining = COALESCE(paid_tasks_remaining,0) + $2, last_seen = now() WHERE email=$1",
      [email, TASKS]
    );
    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'unknown';
    console.error('[upgrade]', message);
    return NextResponse.json({ ok: false, error: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}
