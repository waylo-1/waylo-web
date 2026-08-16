import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

// Testimonials / feedback. Reads and writes the SAME `feedback` table the
// Android app writes to (via the EC2 backend /feedback endpoint), so reviews
// left in the app and on the website land in one place. Same-origin HTTPS
// route -> Aurora directly, so it works even when the EC2 backend is down.
//
//   GET  /api/feedback  -> recent reviews that have text (name + rating + text)
//   POST /api/feedback  -> { name?, email?, rating, text }

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

let ready = false;
async function ensure() {
  if (ready) return;
  // Table already exists (app backend created it: id,email,rating,text,device,created_at).
  // Add a name column for website testimonials without touching existing rows.
  await pool.query(`ALTER TABLE feedback ADD COLUMN IF NOT EXISTS name TEXT`);
  ready = true;
}

export async function GET() {
  try {
    await ensure();
    const r = await pool.query(
      `SELECT name, rating, text, created_at
         FROM feedback
        WHERE text IS NOT NULL AND length(btrim(text)) > 0
        ORDER BY created_at DESC
        LIMIT 30`
    );
    // Never expose email publicly. Fall back to a friendly label when no name.
    const reviews = r.rows.map((x) => ({
      name: (x.name && String(x.name).trim()) || 'Waylo user',
      rating: Math.max(1, Math.min(5, Number(x.rating) || 5)),
      text: String(x.text || ''),
      created_at: x.created_at,
    }));
    return NextResponse.json({ ok: true, reviews });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'unknown';
    console.error('[feedback GET]', message);
    // Don't break the page — return an empty list on error.
    return NextResponse.json({ ok: true, reviews: [] });
  }
}

export async function POST(req: Request) {
  try {
    const b = await req.json().catch(() => ({}));
    const name = String(b?.name || '').trim().slice(0, 80);
    const email = String(b?.email || '').trim().toLowerCase().slice(0, 200);
    const text = String(b?.text || '').trim().slice(0, 600);
    let rating = Number(b?.rating);
    if (!Number.isFinite(rating)) rating = 5;
    rating = Math.max(1, Math.min(5, Math.round(rating)));
    if (text.length < 3) {
      return NextResponse.json({ ok: false, error: 'Please write a short review.' }, { status: 400 });
    }
    await ensure();
    await pool.query(
      `INSERT INTO feedback (email, rating, text, device, name)
       VALUES ($1, $2, $3, 'web', $4)`,
      [email || null, rating, text, name || null]
    );
    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'unknown';
    console.error('[feedback POST]', message);
    return NextResponse.json({ ok: false, error: 'Could not save your review.' }, { status: 500 });
  }
}
