'use client';

import { useEffect, useState } from 'react';

interface Review {
  name: string;
  rating: number;
  text: string;
  created_at?: string;
}

function Stars({ n, size = 'text-base' }: { n: number; size?: string }) {
  return (
    <span className={`${size} tracking-tight`} aria-label={`${n} out of 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className={i <= n ? 'text-dot' : 'text-border'}>
          ★
        </span>
      ))}
    </span>
  );
}

export default function Testimonials() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loaded, setLoaded] = useState(false);

  // Form
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [rating, setRating] = useState(5);
  const [text, setText] = useState('');
  const [status, setStatus] = useState<'idle' | 'saving' | 'done' | 'error'>('idle');
  const [error, setError] = useState('');

  async function load() {
    try {
      const r = await fetch('/api/feedback', { cache: 'no-store' });
      const d = await r.json();
      setReviews(Array.isArray(d.reviews) ? d.reviews : []);
    } catch {
      setReviews([]);
    } finally {
      setLoaded(true);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (text.trim().length < 3) {
      setError('Please write a short review.');
      setStatus('error');
      return;
    }
    setStatus('saving');
    setError('');
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, rating, text }),
      });
      const d = await res.json();
      if (!res.ok || !d.ok) throw new Error(d.error || 'Failed');
      setStatus('done');
      setName('');
      setText('');
      setRating(5);
      load();
      setTimeout(() => {
        setOpen(false);
        setStatus('idle');
      }, 1400);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
      setStatus('error');
    }
  }

  const inputClass =
    'w-full bg-white border border-border rounded-xl px-4 py-3 text-ink text-sm placeholder:text-stone/60 focus:outline-none focus:border-dot transition-colors';

  return (
    <section id="reviews" className="max-w-5xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
        <div>
          <p className="text-xs sm:text-sm font-semibold uppercase tracking-widest text-dot mb-3" style={{ fontFamily: 'Sora, sans-serif' }}>
            Reviews
          </p>
          <h2 className="text-2xl sm:text-4xl font-bold text-ink" style={{ fontFamily: 'Sora, sans-serif' }}>
            What people say about Waylo
          </h2>
        </div>
        <button
          onClick={() => { setOpen(true); setStatus('idle'); setError(''); }}
          className="self-start sm:self-auto bg-dot text-white px-5 py-3 rounded-full font-semibold text-sm hover:bg-red-600 transition-colors whitespace-nowrap"
          style={{ fontFamily: 'Sora, sans-serif' }}
        >
          Leave a review
        </button>
      </div>

      {!loaded ? (
        <p className="text-stone text-sm">Loading reviews…</p>
      ) : reviews.length === 0 ? (
        <div className="bg-white border border-border rounded-2xl p-10 text-center">
          <div className="text-3xl mb-3">💬</div>
          <p className="text-ink font-semibold text-sm mb-1" style={{ fontFamily: 'Sora, sans-serif' }}>
            No reviews yet
          </p>
          <p className="text-stone text-sm mb-5">Be the first to share your experience with Waylo.</p>
          <button
            onClick={() => setOpen(true)}
            className="bg-dot text-white px-5 py-2.5 rounded-full font-semibold text-sm hover:bg-red-600 transition-colors"
            style={{ fontFamily: 'Sora, sans-serif' }}
          >
            Write the first review
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {reviews.map((r, i) => (
            <div key={i} className="bg-white border border-border rounded-2xl p-6 flex flex-col">
              <Stars n={r.rating} />
              <p className="text-ink text-sm leading-relaxed mt-3 flex-1">“{r.text}”</p>
              <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border">
                <span className="w-8 h-8 rounded-full bg-dot/10 text-dot flex items-center justify-center text-sm font-bold flex-shrink-0" style={{ fontFamily: 'Sora, sans-serif' }}>
                  {r.name.charAt(0).toUpperCase()}
                </span>
                <span className="text-stone text-xs font-medium">{r.name}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Review modal */}
      {open && (
        <div
          className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center px-0 sm:px-4"
          onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}
        >
          <div className="bg-mist rounded-t-3xl sm:rounded-3xl max-w-md w-full p-6 sm:p-8 relative shadow-2xl">
            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 text-stone hover:text-ink text-xl leading-none w-8 h-8 flex items-center justify-center"
            >
              ✕
            </button>

            {status === 'done' ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-3">🎉</div>
                <p className="text-ink font-semibold" style={{ fontFamily: 'Sora, sans-serif' }}>Thank you!</p>
                <p className="text-stone text-sm mt-1">Your review has been posted.</p>
              </div>
            ) : (
              <>
                <h2 className="text-xl sm:text-2xl font-bold text-ink mb-1" style={{ fontFamily: 'Sora, sans-serif' }}>
                  Leave a review
                </h2>
                <p className="text-stone text-sm mb-5">Tell us how Waylo helped you.</p>
                <form onSubmit={submit} className="flex flex-col gap-3">
                  <input
                    className={inputClass}
                    placeholder="Your name (optional)"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    maxLength={80}
                  />
                  <div className="flex items-center gap-2">
                    <span className="text-stone text-sm">Rating:</span>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setRating(i)}
                          className={`text-2xl leading-none transition-colors ${i <= rating ? 'text-dot' : 'text-border hover:text-dot/50'}`}
                          aria-label={`${i} star${i > 1 ? 's' : ''}`}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                  </div>
                  <textarea
                    className={`${inputClass} resize-none`}
                    placeholder="What did you think? How did it help?"
                    rows={4}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    maxLength={600}
                  />
                  {status === 'error' && <p className="text-dot text-xs">{error}</p>}
                  <button
                    type="submit"
                    disabled={status === 'saving'}
                    className="w-full bg-dot text-white py-3 rounded-xl font-bold text-sm hover:bg-red-600 transition-colors disabled:opacity-60"
                    style={{ fontFamily: 'Sora, sans-serif' }}
                  >
                    {status === 'saving' ? 'Posting…' : 'Post review'}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
