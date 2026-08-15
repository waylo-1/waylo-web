'use client';

import { useState } from 'react';

// UPI details come from Vercel env vars so no personal payment ID lives in the
// repo. Set these in Vercel → Project → Settings → Environment Variables:
//   NEXT_PUBLIC_UPI_ID    e.g. yourname@okhdfcbank
//   NEXT_PUBLIC_UPI_NAME  e.g. Waylo
const UPI_ID = process.env.NEXT_PUBLIC_UPI_ID || 'shambhvis@icici';
const UPI_NAME = process.env.NEXT_PUBLIC_UPI_NAME || 'Waylo';
const PRICE = 100;

function upiLink(): string {
  const params = new URLSearchParams({
    pa: UPI_ID,
    pn: UPI_NAME,
    am: String(PRICE),
    cu: 'INR',
    tn: 'Waylo 25 tasks',
  });
  return `upi://pay?${params.toString()}`;
}

function qrUrl(): string {
  return `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(upiLink())}`;
}

type Status = 'idle' | 'saving' | 'done' | 'error';

export default function GetWaylo() {
  // Sign-up form
  const [suName, setSuName] = useState('');
  const [suPhone, setSuPhone] = useState('');
  const [suStatus, setSuStatus] = useState<Status>('idle');
  const [suError, setSuError] = useState('');

  // Purchase form
  const [pEmail, setPEmail] = useState('');
  const [pRef, setPRef] = useState('');
  const [pStatus, setPStatus] = useState<Status>('idle');
  const [pError, setPError] = useState('');

  async function submitSignup(e: React.FormEvent) {
    e.preventDefault();
    setSuStatus('saving');
    setSuError('');
    try {
      const res = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: suName, phone: suPhone }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || 'Failed');
      setSuStatus('done');
    } catch (err) {
      setSuError(err instanceof Error ? err.message : 'Something went wrong.');
      setSuStatus('error');
    }
  }

  async function submitPurchase(e: React.FormEvent) {
    e.preventDefault();
    setPStatus('saving');
    setPError('');
    try {
      const res = await fetch('/api/upgrade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: pEmail, ref: pRef }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || 'Failed');
      setPStatus('done');
    } catch (err) {
      setPError(err instanceof Error ? err.message : 'Something went wrong.');
      setPStatus('error');
    }
  }

  const inputClass =
    'w-full bg-white border border-border rounded-xl px-4 py-3 text-ink text-sm placeholder:text-stone/60 focus:outline-none focus:border-dot transition-colors';

  return (
    <section id="get" className="max-w-5xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
      <p className="text-xs sm:text-sm font-semibold uppercase tracking-widest text-dot mb-3" style={{ fontFamily: 'Sora, sans-serif' }}>
        Get Waylo
      </p>
      <h2 className="text-2xl sm:text-4xl font-bold text-ink mb-3" style={{ fontFamily: 'Sora, sans-serif' }}>
        Download it. Try it. Keep it.
      </h2>
      <p className="text-stone text-sm sm:text-base mb-10 max-w-xl">
        Waylo runs on Android phones. Download it free — 5 tasks free, then 25 more for just ₹100.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* 1. Download */}
        <div className="bg-white border border-border rounded-2xl p-6 flex flex-col">
          <div className="text-3xl mb-3">📱</div>
          <h3 className="font-bold text-ink text-lg mb-1" style={{ fontFamily: 'Sora, sans-serif' }}>
            Download for Android
          </h3>
          <p className="text-stone text-sm mb-5 flex-1">
            Free to install. Works on any Android phone with the accessibility permission.
          </p>
          <a
            href="/waylo.apk"
            download
            className="flex items-center justify-center gap-2 w-full bg-dot text-white py-3.5 rounded-xl font-bold text-sm hover:bg-red-600 transition-colors"
            style={{ fontFamily: 'Sora, sans-serif' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 16l-5-5h3V4h4v7h3l-5 5zm-7 2h14v2H5v-2z" />
            </svg>
            Download APK
          </a>
          <p className="text-center text-[11px] text-stone mt-3 leading-relaxed">
            Open the file to install. If asked, allow &ldquo;Install unknown apps&rdquo;.
          </p>
        </div>

        {/* 2. Sign up */}
        <div className="bg-white border border-border rounded-2xl p-6 flex flex-col">
          <div className="text-3xl mb-3">✋</div>
          <h3 className="font-bold text-ink text-lg mb-1" style={{ fontFamily: 'Sora, sans-serif' }}>
            Sign up for updates
          </h3>
          {suStatus === 'done' ? (
            <div className="flex-1 flex flex-col justify-center text-center py-4">
              <div className="text-3xl mb-2">🎉</div>
              <p className="text-ink font-semibold text-sm">You&rsquo;re in!</p>
              <p className="text-stone text-xs mt-1">We&rsquo;ll keep you posted.</p>
            </div>
          ) : (
            <form onSubmit={submitSignup} className="flex flex-col gap-3 flex-1">
              <p className="text-stone text-sm mb-1">Get setup help and new features.</p>
              <input className={inputClass} placeholder="Your name" value={suName} onChange={(e) => setSuName(e.target.value)} required />
              <input className={inputClass} placeholder="Phone number" inputMode="tel" value={suPhone} onChange={(e) => setSuPhone(e.target.value)} required />
              {suStatus === 'error' && <p className="text-dot text-xs">{suError}</p>}
              <button
                type="submit"
                disabled={suStatus === 'saving'}
                className="mt-auto w-full border-2 border-dot text-dot py-3 rounded-xl font-bold text-sm hover:bg-dot hover:text-white transition-colors disabled:opacity-60"
                style={{ fontFamily: 'Sora, sans-serif' }}
              >
                {suStatus === 'saving' ? 'Saving…' : 'Sign me up'}
              </button>
            </form>
          )}
        </div>

        {/* 3. Buy ₹100 via UPI */}
        <div className="bg-ink border border-ink rounded-2xl p-6 flex flex-col text-white">
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-3xl font-extrabold" style={{ fontFamily: 'Sora, sans-serif' }}>₹100</span>
            <span className="text-zinc-400 text-sm">/ 25 tasks</span>
          </div>
          <h3 className="font-bold text-lg mb-3" style={{ fontFamily: 'Sora, sans-serif' }}>
            Unlock 25 tasks
          </h3>

          {pStatus === 'done' ? (
            <div className="flex-1 flex flex-col justify-center text-center py-4">
              <div className="text-3xl mb-2">✅</div>
              <p className="font-semibold text-sm">Payment recorded!</p>
              <p className="text-zinc-400 text-xs mt-1">We&rsquo;ll confirm and activate your access.</p>
            </div>
          ) : !UPI_ID ? (
            <p className="text-zinc-400 text-sm flex-1">
              Payment opens soon. Set <code className="text-dot">NEXT_PUBLIC_UPI_ID</code> in Vercel to enable UPI checkout.
            </p>
          ) : (
            <>
              <div className="bg-white rounded-xl p-3 flex flex-col items-center gap-2 mb-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={qrUrl()} alt="Scan to pay ₹100 via UPI" width={140} height={140} className="rounded" />
                <p className="text-ink text-[11px] font-medium">{UPI_ID}</p>
              </div>
              <a
                href={upiLink()}
                className="w-full text-center bg-dot text-white py-2.5 rounded-xl font-bold text-sm hover:bg-red-600 transition-colors mb-3"
                style={{ fontFamily: 'Sora, sans-serif' }}
              >
                Pay ₹100 in your UPI app
              </a>
              <form onSubmit={submitPurchase} className="flex flex-col gap-2">
                <p className="text-zinc-400 text-[11px]">After paying, confirm below to activate:</p>
                <input className={inputClass} type="email" placeholder="Your email (same as app sign-in)" value={pEmail} onChange={(e) => setPEmail(e.target.value)} required />
                <input className={inputClass} placeholder="UPI reference / txn ID" value={pRef} onChange={(e) => setPRef(e.target.value)} required />
                {pStatus === 'error' && <p className="text-dot text-xs">{pError}</p>}
                <button
                  type="submit"
                  disabled={pStatus === 'saving'}
                  className="w-full bg-white text-ink py-2.5 rounded-xl font-bold text-sm hover:bg-zinc-200 transition-colors disabled:opacity-60"
                  style={{ fontFamily: 'Sora, sans-serif' }}
                >
                  {pStatus === 'saving' ? 'Saving…' : "I've paid — activate"}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
