import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="min-h-screen bg-mist flex flex-col items-center justify-center px-6 text-center">
      <span className="dot-pulse dot-large mb-8" />
      <h1
        className="text-4xl font-extrabold text-ink mb-3"
        style={{ fontFamily: 'Sora, sans-serif' }}
      >
        Guide not found
      </h1>
      <p className="text-stone mb-8 max-w-xs">
        This guide link may have expired or doesn't exist. Ask the sender to
        share it again.
      </p>
      <Link
        href="/"
        className="bg-dot text-white px-7 py-3 rounded-full font-semibold text-sm hover:bg-red-600 transition-colors"
        style={{ fontFamily: 'Sora, sans-serif' }}
      >
        Back to Waylo
      </Link>
    </main>
  );
}
