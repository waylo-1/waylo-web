// Free vs Paid choice — shown after the "how it works" explanation and before
// the download section. Both buttons scroll to #get (download + UPI upgrade).

export default function PlanChoice() {
  return (
    <section id="plans" className="max-w-5xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
      <p className="text-xs sm:text-sm font-semibold uppercase tracking-widest text-dot mb-3" style={{ fontFamily: 'Sora, sans-serif' }}>
        Pricing
      </p>
      <h2 className="text-2xl sm:text-4xl font-bold text-ink mb-3" style={{ fontFamily: 'Sora, sans-serif' }}>
        Start free. Upgrade when you&rsquo;re ready.
      </h2>
      <p className="text-stone text-sm sm:text-base mb-10 max-w-xl">
        Try Waylo free, then unlock more whenever you need it — one simple UPI payment, no card, no subscription.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Free */}
        <div className="bg-white border border-border rounded-2xl p-7 flex flex-col">
          <h3 className="font-bold text-ink text-xl mb-1" style={{ fontFamily: 'Sora, sans-serif' }}>Free</h3>
          <div className="flex items-baseline gap-1 mb-5">
            <span className="text-4xl font-extrabold text-ink" style={{ fontFamily: 'Sora, sans-serif' }}>₹0</span>
          </div>
          <ul className="text-stone text-sm space-y-2.5 mb-7 flex-1">
            <li>✓ 5 free guided tasks</li>
            <li>✓ The red-dot guidance overlay</li>
            <li>✓ Spoken, step-by-step help</li>
          </ul>
          <a
            href="#get"
            className="w-full text-center border-2 border-dot text-dot py-3 rounded-xl font-bold text-sm hover:bg-dot hover:text-white transition-colors"
            style={{ fontFamily: 'Sora, sans-serif' }}
          >
            Start free
          </a>
        </div>

        {/* Paid */}
        <div className="bg-ink border border-ink rounded-2xl p-7 flex flex-col text-white relative">
          <span className="absolute top-6 right-6 text-[11px] font-bold text-dot uppercase tracking-wider">Best value</span>
          <h3 className="font-bold text-xl mb-1" style={{ fontFamily: 'Sora, sans-serif' }}>Paid</h3>
          <div className="flex items-baseline gap-2 mb-5">
            <span className="text-4xl font-extrabold" style={{ fontFamily: 'Sora, sans-serif' }}>₹100</span>
            <span className="text-zinc-400 text-sm">/ 25 tasks</span>
          </div>
          <ul className="text-zinc-300 text-sm space-y-2.5 mb-7 flex-1">
            <li>✓ Everything in Free</li>
            <li>✓ 25 more guided tasks</li>
            <li>✓ One UPI payment — no subscription</li>
          </ul>
          <a
            href="#get"
            className="w-full text-center bg-dot text-white py-3 rounded-xl font-bold text-sm hover:bg-red-600 transition-colors"
            style={{ fontFamily: 'Sora, sans-serif' }}
          >
            Go Paid — ₹100
          </a>
        </div>
      </div>
    </section>
  );
}
