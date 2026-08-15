'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';

interface GuideRow {
  id: string;
  task: string;
  created_at: string;
}

// Demo steps for the animated carousel
const DEMO_STEPS = [
  {
    label: 'Step 1',
    instruction: 'Open Finder from your Dock',
    dot: { x: 42, y: 88 },
    screen: 'desktop',
  },
  {
    label: 'Step 2',
    instruction: 'Click on your Desktop in the sidebar',
    dot: { x: 22, y: 38 },
    screen: 'finder',
  },
  {
    label: 'Step 3',
    instruction: 'Right-click on empty space and choose "New Folder"',
    dot: { x: 56, y: 76 },
    screen: 'finder_menu',
  },
  {
    label: 'Step 4',
    instruction: 'Type the folder name and press Return',
    dot: { x: 55, y: 62 },
    screen: 'rename',
  },
];

function MacDesktopScreen({ screen, dot, active }: { screen: string; dot: { x: number; y: number }; active: boolean }) {
  return (
    <div className="relative w-full h-full">
      {/* macOS window chrome */}
      <div className="absolute inset-0 bg-zinc-800 rounded-xl overflow-hidden border border-zinc-700 shadow-2xl flex flex-col">
        {/* Title bar */}
        <div className="h-8 bg-zinc-900 flex items-center px-3 gap-1.5 flex-shrink-0">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="w-3 h-3 rounded-full bg-yellow-400" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <div className="flex-1 mx-6 h-5 bg-zinc-700 rounded text-zinc-500 text-xs flex items-center justify-center">
            {screen === 'desktop' ? 'Desktop' : screen === 'finder' || screen === 'finder_menu' ? 'Finder' : 'Waylo'}
          </div>
        </div>

        {/* Screen content */}
        <div className="flex-1 relative">
          {(screen === 'finder' || screen === 'finder_menu') && (
            <div className="flex h-full">
              {/* Sidebar */}
              <div className="w-1/4 bg-zinc-900 border-r border-zinc-700 p-2 space-y-1">
                {['Recents', 'Desktop', 'Documents', 'Downloads', 'Applications'].map((item, i) => (
                  <div key={item} className={`text-xs px-2 py-1 rounded ${i === 1 ? 'bg-blue-500/30 text-blue-300' : 'text-zinc-500'}`}>
                    {item}
                  </div>
                ))}
              </div>
              {/* Main area */}
              <div className="flex-1 p-4 grid grid-cols-4 gap-3 content-start">
                {['Documents', 'Photos', 'Projects', 'Archive'].map((f) => (
                  <div key={f} className="flex flex-col items-center gap-1">
                    <div className="w-10 h-8 bg-blue-500/40 rounded-md" />
                    <span className="text-xs text-zinc-400">{f}</span>
                  </div>
                ))}
                {screen === 'finder_menu' && (
                  <div className="absolute bg-zinc-700 rounded-lg shadow-xl p-1 text-xs text-zinc-200 space-y-0.5 z-10" style={{ left: '45%', top: '40%' }}>
                    {['Open', 'Get Info', 'Rename', 'New Folder', 'Move to Trash'].map((item) => (
                      <div key={item} className={`px-3 py-1 rounded ${item === 'New Folder' ? 'bg-blue-500 text-white' : 'hover:bg-zinc-600'}`}>
                        {item}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {screen === 'desktop' && (
            <div className="h-full bg-gradient-to-br from-zinc-700 to-zinc-900 p-4">
              <div className="grid grid-cols-5 gap-3 content-start">
                {['Safari', 'Mail', 'Finder', 'Photos', 'Notes'].map((app) => (
                  <div key={app} className="flex flex-col items-center gap-1">
                    <div className="w-10 h-10 rounded-xl bg-zinc-600" />
                    <span className="text-xs text-zinc-400">{app}</span>
                  </div>
                ))}
              </div>
              {/* Dock */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1">
                <div className="flex gap-2 bg-zinc-700/70 backdrop-blur px-3 py-1.5 rounded-2xl">
                  {[{icon:'🔵',label:'Finder'},{icon:'📁',label:'Files'},{icon:'🌐',label:'Safari'},{icon:'📧',label:'Mail'}].map((item, i) => (
                    <div key={i} className="flex flex-col items-center gap-0.5">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-base ${i === 0 ? 'bg-blue-500/70 ring-2 ring-white/60' : 'bg-zinc-600'}`}>{item.icon}</div>
                      <div className={`w-1 h-1 rounded-full ${i === 0 ? 'bg-white/80' : 'bg-transparent'}`} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {screen === 'rename' && (
            <div className="h-full bg-gradient-to-br from-zinc-700 to-zinc-900 p-4 flex items-center justify-center">
              <div className="flex flex-col items-center gap-2">
                <div className="w-14 h-12 bg-blue-500/40 rounded-xl" />
                <div className="flex flex-col items-center gap-1">
                  <span className="text-xs text-zinc-500 line-through">New Folder</span>
                  <div className="bg-white rounded px-3 py-1 text-xs text-zinc-800 border-2 border-blue-500 min-w-24 text-center font-medium">
                    Waylo|
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Red dot */}
      {active && (
        <div
          className="absolute z-20 pointer-events-none"
          style={{ left: `${dot.x}%`, top: `${dot.y}%`, transform: 'translate(-50%, -50%)' }}
        >
          <div className="w-6 h-6 rounded-full bg-red-500 shadow-lg shadow-red-500/50 animate-ping absolute inset-0" style={{ animationDuration: '1.2s' }} />
          <div className="w-6 h-6 rounded-full bg-red-500 relative" />
        </div>
      )}

      {/* Instruction bubble */}
      {active && (
        <div className="absolute -bottom-14 left-1/2 -translate-x-1/2 bg-white rounded-xl shadow-lg px-4 py-2 text-xs font-medium text-zinc-800 whitespace-nowrap z-20">
          <span className="text-red-500 mr-1">●</span> Waylo says: click here
        </div>
      )}
    </div>
  );
}

export default function HomePage() {
  const [recentGuides, setRecentGuides] = useState<GuideRow[]>([]);
  const [showDownload, setShowDownload] = useState(false);
  const [dlStep, setDlStep] = useState<'signin' | 'plan' | 'pay' | 'platform'>('plan');
  const [signedInEmail, setSignedInEmail] = useState('');
  const [gsiReady, setGsiReady] = useState(false);
  const googleBtnRef = useRef<HTMLDivElement>(null);
  const GOOGLE_CLIENT_ID = '506434766076-ck15hl1n5kvfmo2oktk9q7iuh5i9ggi3.apps.googleusercontent.com';
  const [dlPlan, setDlPlan] = useState<'free' | 'paid' | null>(null);
  const [pEmail, setPEmail] = useState('');
  const [pRef, setPRef] = useState('');
  const [pStatus, setPStatus] = useState<'idle' | 'saving' | 'done' | 'error'>('idle');
  const [pMsg, setPMsg] = useState('');
  const UPI_ID = process.env.NEXT_PUBLIC_UPI_ID || 'shambhvis@icici';
  const upiLink = () => `upi://pay?pa=${encodeURIComponent(UPI_ID)}&pn=Waylo&am=100&cu=INR&tn=${encodeURIComponent('Waylo 25 tasks')}`;
  const qrUrl = () => `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(upiLink())}`;
  const dlInput = 'w-full bg-white border border-border rounded-xl px-4 py-3 text-ink text-sm placeholder:text-stone/60 focus:outline-none focus:border-dot transition-colors';
  const openDownload = () => { setDlPlan(null); setPStatus('idle'); setPMsg(''); setDlStep(signedInEmail ? 'plan' : 'signin'); setShowDownload(true); };
  async function submitUpgrade() {
    if (!pEmail.includes('@') || pRef.trim().length < 4) { setPMsg('Enter your email and the UPI reference from your payment.'); setPStatus('error'); return; }
    setPStatus('saving'); setPMsg('');
    try {
      const res = await fetch('/api/upgrade', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: pEmail, ref: pRef }) });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || 'Failed');
      setPStatus('done');
      setTimeout(() => setDlStep('platform'), 900);
    } catch (e) { setPMsg(e instanceof Error ? e.message : 'Something went wrong.'); setPStatus('error'); }
  }

  // Load Google Identity Services once.
  useEffect(() => {
    const w = window as unknown as { google?: { accounts?: { id?: unknown } } };
    if (w.google?.accounts?.id) { setGsiReady(true); return; }
    const s = document.createElement('script');
    s.src = 'https://accounts.google.com/gsi/client';
    s.async = true; s.defer = true;
    s.onload = () => setGsiReady(true);
    document.body.appendChild(s);
  }, []);

  async function handleCredential(resp: { credential?: string }) {
    try {
      const jwt = resp.credential || '';
      const payload = JSON.parse(atob(jwt.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
      const email = String(payload.email || '').toLowerCase();
      if (!email) return;
      setSignedInEmail(email);
      setPEmail(email);
      fetch('/api/auth', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name: String(payload.name || ''), googleId: String(payload.sub || '') }),
      }).catch(() => {});
      setDlStep('plan');
    } catch {
      /* ignore malformed token */
    }
  }

  // Render the Google button when the sign-in step is visible.
  useEffect(() => {
    if (dlStep !== 'signin' || !gsiReady || !googleBtnRef.current) return;
    const g = (window as unknown as {
      google?: { accounts?: { id?: { initialize: (o: unknown) => void; renderButton: (el: HTMLElement, o: unknown) => void } } };
    }).google;
    if (!g?.accounts?.id) return;
    g.accounts.id.initialize({ client_id: GOOGLE_CLIENT_ID, callback: handleCredential });
    googleBtnRef.current.innerHTML = '';
    g.accounts.id.renderButton(googleBtnRef.current, { theme: 'filled_blue', size: 'large', text: 'continue_with', shape: 'pill', width: 260 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dlStep, gsiReady]);
  const [demoStep, setDemoStep] = useState(0);
  const [dotVisible, setDotVisible] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    fetch('/api/guides')
      .then((r) => r.json())
      .then((d) => setRecentGuides(d.guides ?? []))
      .catch(() => {});
  }, []);

  // Auto-advance demo
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setDotVisible(false);
      setTimeout(() => {
        setDemoStep((s) => (s + 1) % DEMO_STEPS.length);
        setDotVisible(true);
      }, 400);
    }, 2800);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  const goToStep = (i: number) => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setDotVisible(false);
    setTimeout(() => { setDemoStep(i); setDotVisible(true); }, 200);
    intervalRef.current = setInterval(() => {
      setDotVisible(false);
      setTimeout(() => { setDemoStep((s) => (s + 1) % DEMO_STEPS.length); setDotVisible(true); }, 400);
    }, 2800);
  };

  const howSteps = [
    {
      icon: '⌨️',
      title: 'You describe the task',
      desc: 'Type anything in plain English. "How do I FaceTime my daughter?" or "Create a new folder on Desktop."',
    },
    {
      icon: '🧠',
      title: 'Amazon Nova builds the plan',
      desc: 'Our AI — powered by Amazon Nova on AWS Bedrock — generates a precise, ordered step plan in under 2 seconds.',
    },
    {
      icon: '🔴',
      title: 'The red dot appears',
      desc: 'Waylo overlays a pulsing red dot directly on your screen — on the exact element to click. No searching, no confusion.',
    },
    {
      icon: '✅',
      title: 'Task complete',
      desc: 'Follow the dots step by step. When you\'re done, Waylo confirms. No tutorial, no YouTube, no phone call needed.',
    },
  ];

  return (
    <main className="min-h-screen bg-mist">
      {/* Nav */}
      <nav className="flex items-center justify-between px-4 sm:px-6 py-4 max-w-5xl mx-auto">
        <div className="flex items-center gap-3">
          <span className="dot-pulse dot-large" />
          <span className="text-lg sm:text-xl font-bold tracking-tight" style={{ fontFamily: 'Sora, sans-serif' }}>
            Waylo
          </span>
        </div>
        <div className="flex items-center gap-3 sm:gap-6">
          <a href="#how-it-works" className="text-sm text-stone hover:text-ink transition-colors hidden md:block">
            How it works
          </a>
          <a
            href="https://github.com/waylo-1"
            target="_blank"
            rel="noopener noreferrer"
            className="text-stone hover:text-ink transition-colors"
            aria-label="GitHub"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.268 2.75 1.026A9.578 9.578 0 0112 6.836c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.026 2.747-1.026.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.416 22 12c0-5.523-4.477-10-10-10z"/></svg>
          </a>
          <button
            onClick={openDownload}
            className="bg-dot text-white px-4 sm:px-5 py-2 rounded-full font-semibold text-xs sm:text-sm hover:bg-red-600 transition-colors flex items-center gap-2"
            style={{ fontFamily: 'Sora, sans-serif' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.268 2.75 1.026A9.578 9.578 0 0112 6.836c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.026 2.747-1.026.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.416 22 12c0-5.523-4.477-10-10-10z"/>
            </svg>
            <span>Download</span>
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pt-10 sm:pt-16 pb-12 sm:pb-20">
        <p className="text-xs sm:text-sm font-semibold uppercase tracking-widest text-dot mb-4 sm:mb-6" style={{ fontFamily: 'Sora, sans-serif' }}>
          Free to start · Mac &amp; Android
        </p>
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold leading-tight text-ink mb-4 sm:mb-6" style={{ fontFamily: 'Sora, sans-serif' }}>
          The red dot that
          <br />
          <span className="text-dot">shows the way.</span>
        </h1>
        <p className="text-base sm:text-xl text-stone max-w-xl leading-relaxed mb-8 sm:mb-10">
          Waylo watches your screen and places a pulsing red dot on exactly
          what to tap next — step by step, for any task, spoken aloud.
        </p>
        <div className="flex flex-wrap gap-3 sm:gap-4 items-center">
          <button onClick={openDownload} className="flex items-center gap-2 bg-dot text-white px-5 sm:px-7 py-3 sm:py-3.5 rounded-full font-semibold text-sm hover:bg-red-600 transition-colors" style={{ fontFamily: 'Sora, sans-serif' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 16l-5-5h3V4h4v7h3l-5 5zm-7 2h14v2H5v-2z" />
            </svg>
            Download Waylo
          </button>
          <a href="#how-it-works" className="border border-border text-ink px-5 sm:px-7 py-3 sm:py-3.5 rounded-full font-semibold text-sm hover:border-ink transition-colors" style={{ fontFamily: 'Sora, sans-serif' }}>
            See how it works
          </a>
        </div>
      </section>

      {/* Animated Demo */}
      <section className="bg-ink py-12 sm:py-16 overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <p className="text-dot text-xs sm:text-sm font-semibold uppercase tracking-widest mb-2" style={{ fontFamily: 'Sora, sans-serif' }}>
            Demo
          </p>
          <h2 className="text-white text-2xl sm:text-3xl font-bold mb-8 sm:mb-12" style={{ fontFamily: 'Sora, sans-serif' }}>
            Waylo guiding: <span className="text-dot">"Create a new folder on Desktop"</span>
          </h2>

          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
            {/* Mac screen */}
            <div className="w-full max-w-sm lg:max-w-none lg:flex-1 relative" style={{ height: '260px' }}>
              <MacDesktopScreen
                screen={DEMO_STEPS[demoStep].screen}
                dot={DEMO_STEPS[demoStep].dot}
                active={dotVisible}
              />
            </div>

            {/* Step list */}
            <div className="w-full lg:w-72 space-y-3">
              {DEMO_STEPS.map((s, i) => (
                <button
                  key={i}
                  onClick={() => goToStep(i)}
                  className={`w-full text-left px-4 py-3 rounded-xl border transition-all ${
                    i === demoStep
                      ? 'border-dot bg-dot/10 text-white'
                      : 'border-zinc-700 text-zinc-400 hover:border-zinc-500'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${i === demoStep ? 'bg-dot text-white' : 'bg-zinc-700 text-zinc-400'}`}>
                      {i + 1}
                    </span>
                    <span className="text-sm leading-snug">{s.instruction}</span>
                  </div>
                </button>
              ))}
              {/* Progress dots */}
              <div className="flex gap-2 pt-2 justify-center">
                {DEMO_STEPS.map((_, i) => (
                  <button key={i} onClick={() => goToStep(i)} className={`w-2 h-2 rounded-full transition-all ${i === demoStep ? 'bg-dot w-6' : 'bg-zinc-600'}`} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works — improved */}
      <section id="how-it-works" className="max-w-5xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
        <p className="text-xs sm:text-sm font-semibold uppercase tracking-widest text-dot mb-3" style={{ fontFamily: 'Sora, sans-serif' }}>
          How Waylo works
        </p>
        <h2 className="text-2xl sm:text-4xl font-bold text-ink mb-12" style={{ fontFamily: 'Sora, sans-serif' }}>
          From question to done — in seconds.
        </h2>

        <div className="relative">
          {/* Connecting line — desktop only */}
          <div className="hidden md:block absolute top-10 left-10 right-10 h-px bg-border" style={{ zIndex: 0 }} />

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 relative">
            {howSteps.map((s, i) => (
              <div key={i} className="relative">
                {/* Number bubble */}
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white border-2 border-border flex items-center justify-center text-lg sm:text-xl mb-4 sm:mb-6 relative z-10">
                  {s.icon}
                </div>
                <h3 className="font-bold text-ink text-sm sm:text-base mb-2" style={{ fontFamily: 'Sora, sans-serif' }}>
                  {s.title}
                </h3>
                <p className="text-stone text-xs sm:text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* AWS callout */}
        <div className="mt-12 bg-white border border-border rounded-2xl px-6 py-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="w-10 h-10 bg-zinc-900 rounded-xl flex items-center justify-center flex-shrink-0 text-white text-xs font-bold">
            AWS
          </div>
          <div>
            <p className="font-semibold text-ink text-sm" style={{ fontFamily: 'Sora, sans-serif' }}>
              Powered by Amazon Nova on AWS Bedrock + Aurora PostgreSQL
            </p>
            <p className="text-stone text-xs mt-0.5">
              Plans generated by Amazon Nova Pro. Step cache and guide storage on Aurora PostgreSQL with pgvector for semantic search.
            </p>
          </div>
        </div>
      </section>


      {/* Contact */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-12 border-t border-border">
        <p className="text-xs sm:text-sm font-semibold uppercase tracking-widest text-dot mb-3" style={{ fontFamily: 'Sora, sans-serif' }}>
          Contact us
        </p>
        <h2 className="text-2xl sm:text-3xl font-bold text-ink mb-6" style={{ fontFamily: 'Sora, sans-serif' }}>
          Get in touch
        </h2>
        <div className="flex flex-col sm:flex-row gap-4">
          <a href="mailto:shambhvi.sharma@gmail.com"
            className="bg-white border border-border rounded-2xl px-6 py-4 flex items-center gap-3 hover:border-dot/40 transition-colors group">
            <span className="text-xl">✉️</span>
            <div>
              <p className="text-xs text-stone font-medium uppercase tracking-wide">Shambhvi Sharma</p>
              <p className="text-sm font-semibold text-ink group-hover:text-dot transition-colors">shambhvi.sharma@gmail.com</p>
            </div>
          </a>
          <a href="mailto:yashaggarwal1029@gmail.com"
            className="bg-white border border-border rounded-2xl px-6 py-4 flex items-center gap-3 hover:border-dot/40 transition-colors group">
            <span className="text-xl">✉️</span>
            <div>
              <p className="text-xs text-stone font-medium uppercase tracking-wide">Yash Aggarwal</p>
              <p className="text-sm font-semibold text-ink group-hover:text-dot transition-colors">yashaggarwal1029@gmail.com</p>
            </div>
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 sm:py-10 mt-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="dot-pulse" />
            <span className="font-bold text-ink" style={{ fontFamily: 'Sora, sans-serif' }}>Waylo</span>
          </div>
          <p className="text-stone text-xs text-center">Built for the 300 million Indians who deserve a patient guide in their pocket.</p>
          <p className="text-stone text-xs">© 2026 Waylo</p>
        </div>
      </footer>

      {/* Download modal */}
      {showDownload && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center px-0 sm:px-4"
          onClick={(e) => { if (e.target === e.currentTarget) setShowDownload(false); }}>
          <div className="bg-mist rounded-t-3xl sm:rounded-3xl max-w-lg w-full p-6 sm:p-8 relative shadow-2xl">
            <button onClick={() => setShowDownload(false)}
              className="absolute top-4 right-4 sm:top-5 sm:right-5 text-stone hover:text-ink text-xl leading-none w-8 h-8 flex items-center justify-center">
              ✕
            </button>

            {dlStep === 'signin' && (
              <>
                <div className="flex items-center gap-3 mb-2">
                  <span className="dot-pulse dot-large" />
                  <h2 className="text-xl sm:text-2xl font-bold text-ink" style={{ fontFamily: 'Sora, sans-serif' }}>Sign in to continue</h2>
                </div>
                <p className="text-stone text-sm mb-6">Sign in with Google to get Waylo — we use your email to save your plan.</p>
                <div className="flex justify-center py-3">
                  <div ref={googleBtnRef} />
                </div>
                {!gsiReady && <p className="text-center text-xs text-stone mt-2">Loading sign-in…</p>}
              </>
            )}

            {dlStep === 'plan' && (
              <>
                <div className="flex items-center gap-3 mb-2">
                  <span className="dot-pulse dot-large" />
                  <h2 className="text-xl sm:text-2xl font-bold text-ink" style={{ fontFamily: 'Sora, sans-serif' }}>Choose your plan</h2>
                </div>
                <p className="text-stone text-sm mb-6">Start free, or unlock more with one UPI payment.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button onClick={() => { setDlPlan('free'); setDlStep('platform'); }}
                    className="text-left bg-white border border-border rounded-2xl p-5 hover:border-dot transition-colors">
                    <div className="font-bold text-ink text-lg" style={{ fontFamily: 'Sora, sans-serif' }}>Free</div>
                    <div className="text-2xl font-extrabold text-ink my-1">₹0</div>
                    <div className="text-stone text-xs">5 guided tasks</div>
                  </button>
                  <button onClick={() => { setDlPlan('paid'); setDlStep('pay'); }}
                    className="text-left bg-ink text-white border border-ink rounded-2xl p-5 hover:opacity-95 transition-opacity">
                    <div className="font-bold text-lg" style={{ fontFamily: 'Sora, sans-serif' }}>Paid</div>
                    <div className="text-2xl font-extrabold my-1">₹100 <span className="text-zinc-400 text-sm font-normal">/ 25 tasks</span></div>
                    <div className="text-zinc-300 text-xs">Best value · one UPI payment</div>
                  </button>
                </div>
              </>
            )}

            {dlStep === 'pay' && (
              <>
                <button onClick={() => setDlStep('plan')} className="text-stone text-sm mb-3 hover:text-ink">← Back</button>
                <h2 className="text-xl sm:text-2xl font-bold text-ink mb-1" style={{ fontFamily: 'Sora, sans-serif' }}>Pay ₹100 by UPI</h2>
                <p className="text-stone text-sm mb-4">Scan or tap to pay, then confirm to continue to your download.</p>
                {pStatus === 'done' ? (
                  <div className="text-center py-6"><div className="text-3xl mb-2">✅</div><p className="text-ink font-semibold text-sm">Payment recorded! Taking you to the download…</p></div>
                ) : (
                  <>
                    <div className="bg-white rounded-xl p-3 flex flex-col items-center gap-2 mb-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={qrUrl()} alt="Scan to pay by UPI" width={150} height={150} className="rounded" />
                      <p className="text-ink text-[11px] font-medium">{UPI_ID}</p>
                    </div>
                    <a href={upiLink()} className="block w-full text-center bg-dot text-white py-2.5 rounded-xl font-bold text-sm hover:bg-red-600 transition-colors mb-3" style={{ fontFamily: 'Sora, sans-serif' }}>Pay ₹100 in your UPI app</a>
                    <div className="flex flex-col gap-2">
                      <input className={dlInput} type="email" placeholder="Your email (same as sign-in)" value={pEmail} onChange={(e) => setPEmail(e.target.value)} />
                      <input className={dlInput} placeholder="UPI reference / transaction ID" value={pRef} onChange={(e) => setPRef(e.target.value)} />
                      {pMsg && <p className="text-dot text-xs">{pMsg}</p>}
                      <button onClick={submitUpgrade} disabled={pStatus === 'saving'} className="w-full bg-ink text-white py-2.5 rounded-xl font-bold text-sm disabled:opacity-60" style={{ fontFamily: 'Sora, sans-serif' }}>{pStatus === 'saving' ? 'Saving…' : "I've paid — continue"}</button>
                    </div>
                  </>
                )}
                <button onClick={() => setDlStep('platform')} className="block w-full text-center text-stone text-xs mt-4 underline hover:text-ink">Skip — I&rsquo;ll pay later</button>
              </>
            )}

            {dlStep === 'platform' && (
              <>
                <button onClick={() => setDlStep(dlPlan === 'paid' ? 'pay' : 'plan')} className="text-stone text-sm mb-3 hover:text-ink">← Back</button>
                <h2 className="text-xl sm:text-2xl font-bold text-ink mb-1" style={{ fontFamily: 'Sora, sans-serif' }}>Choose your device</h2>
                <p className="text-stone text-sm mb-5">Download Waylo for your platform.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <a href="/waylo.apk" download className="text-center bg-dot text-white rounded-2xl p-6 font-bold hover:bg-red-600 transition-colors" style={{ fontFamily: 'Sora, sans-serif' }}>
                    <div className="text-3xl mb-2">🤖</div>Android
                    <div className="text-white/80 text-[11px] font-normal mt-1">Install the APK</div>
                  </a>
                  <a href="https://github.com/waylo-1/mac-version/releases/download/v1.0.0/Waylo-macOS.dmg" target="_blank" rel="noopener noreferrer" className="text-center bg-ink text-white rounded-2xl p-6 font-bold hover:opacity-95 transition-opacity" style={{ fontFamily: 'Sora, sans-serif' }}>
                    <div className="text-3xl mb-2">🍎</div>macOS
                    <div className="text-white/70 text-[11px] font-normal mt-1">Apple Silicon</div>
                  </a>
                </div>
                <p className="text-center text-[11px] text-stone mt-4 leading-relaxed">Android: open the file, allow &ldquo;Install unknown apps&rdquo;. macOS: run <code className="text-dot">xattr -dr com.apple.quarantine /Applications/Waylo.app</code></p>
              </>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
