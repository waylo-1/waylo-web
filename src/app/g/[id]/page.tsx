import { notFound } from 'next/navigation';
import Link from 'next/link';
import { pool } from '@/lib/db';
import type { Metadata } from 'next';

interface Step {
  index: number;
  instruction: string;
  findDescription?: string;
  targetPackage?: string;
  doneWhen?: string;
}

interface Guide {
  id: string;
  task: string;
  steps: Step[];
  created_at: string;
}

async function getGuide(id: string): Promise<Guide | null> {
  try {
    const { rows } = await pool.query(
      'SELECT id, task, steps_json, created_at FROM guides WHERE id = $1',
      [id]
    );
    if (!rows[0]) return null;
    const row = rows[0];
    return {
      id: row.id,
      task: row.task,
      steps:
        typeof row.steps_json === 'string'
          ? JSON.parse(row.steps_json)
          : row.steps_json,
      created_at: row.created_at,
    };
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const guide = await getGuide(params.id);
  if (!guide) return { title: 'Guide not found — Waylo' };
  return {
    title: `${guide.task} — Waylo Guide`,
    description: `${guide.steps.length} steps to complete this task on your Android phone.`,
  };
}

export default async function GuidePage({
  params,
}: {
  params: { id: string };
}) {
  const guide = await getGuide(params.id);
  if (!guide) notFound();

  return (
    <main className="min-h-screen bg-mist">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-5 max-w-3xl mx-auto">
        <Link href="/" className="flex items-center gap-3 group">
          <span className="dot-pulse" />
          <span
            className="text-lg font-bold tracking-tight text-ink"
            style={{ fontFamily: 'Sora, sans-serif' }}
          >
            Waylo
          </span>
        </Link>
        <span className="text-xs text-stone">Shared guide</span>
      </nav>

      <div className="max-w-3xl mx-auto px-6 pb-20">
        {/* Guide header */}
        <div className="mb-10 pt-6">
          <p
            className="text-sm font-semibold uppercase tracking-widest text-dot mb-3"
            style={{ fontFamily: 'Sora, sans-serif' }}
          >
            {guide.steps.length} steps
          </p>
          <h1
            className="text-3xl md:text-4xl font-extrabold text-ink leading-tight mb-4"
            style={{ fontFamily: 'Sora, sans-serif' }}
          >
            {guide.task}
          </h1>
          <p className="text-sm text-stone">
            Created{' '}
            {new Date(guide.created_at).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </p>
        </div>

        {/* App banner */}
        <div className="bg-dot/5 border border-dot/20 rounded-2xl px-6 py-5 mb-10 flex items-center gap-4">
          <span className="dot-pulse dot-large flex-shrink-0" />
          <div>
            <p className="font-semibold text-ink text-sm">
              Open this guide on your Android phone with Waylo
            </p>
            <p className="text-xs text-stone mt-1">
              The red dot will guide you through each step automatically.
            </p>
          </div>
        </div>

        {/* Steps */}
        <ol className="relative">
          {/* Vertical line */}
          <div
            className="absolute left-[19px] top-8 bottom-8 w-px bg-border"
            aria-hidden="true"
          />

          {guide.steps.map((step, i) => (
            <li key={step.index ?? i} className="relative flex gap-6 mb-8">
              {/* Step number circle */}
              <div className="flex-shrink-0 z-10">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border-2"
                  style={{
                    fontFamily: 'Sora, sans-serif',
                    background: i === 0 ? '#E8341A' : '#F5F4F0',
                    borderColor: i === 0 ? '#E8341A' : '#E2E0DA',
                    color: i === 0 ? '#fff' : '#6B6A67',
                  }}
                >
                  {(step.index ?? i + 1)}
                </div>
              </div>

              {/* Step card */}
              <div className="flex-1 bg-white rounded-2xl border border-border px-6 py-5 hover:border-dot/20 transition-colors">
                <p
                  className="font-semibold text-ink leading-snug text-base mb-2"
                  style={{ fontFamily: 'Sora, sans-serif' }}
                >
                  {step.instruction}
                </p>
                {step.findDescription && (
                  <p className="text-xs text-stone bg-zinc-50 rounded-lg px-3 py-2 font-mono">
                    Looking for: {step.findDescription}
                  </p>
                )}
              </div>
            </li>
          ))}

          {/* Done marker */}
          <li className="relative flex gap-6">
            <div className="flex-shrink-0 z-10">
              <div className="w-10 h-10 rounded-full bg-green-100 border-2 border-green-300 flex items-center justify-center text-green-700 font-bold text-lg">
                ✓
              </div>
            </div>
            <div className="flex-1 bg-green-50 border border-green-200 rounded-2xl px-6 py-5">
              <p
                className="font-bold text-green-800"
                style={{ fontFamily: 'Sora, sans-serif' }}
              >
                Sab kuch ho gaya! 🎉
              </p>
              <p className="text-sm text-green-700 mt-1">Task complete.</p>
            </div>
          </li>
        </ol>

        {/* Promo */}
        <div className="mt-14 bg-ink rounded-3xl px-8 py-10 text-center">
          <p
            className="text-white text-2xl font-bold mb-3"
            style={{ fontFamily: 'Sora, sans-serif' }}
          >
            Want the red dot on your screen?
          </p>
          <p className="text-zinc-400 text-sm mb-6 max-w-sm mx-auto">
            Download Waylo and this guide will start automatically — the dot
            will show you exactly where to tap, step by step.
          </p>
          <Link
            href="/"
            className="inline-block bg-dot text-white px-7 py-3 rounded-full font-semibold text-sm hover:bg-red-600 transition-colors"
            style={{ fontFamily: 'Sora, sans-serif' }}
          >
            Learn more about Waylo →
          </Link>
        </div>
      </div>
    </main>
  );
}
