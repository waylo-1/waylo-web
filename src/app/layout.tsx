import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Waylo — Your parents deserve a guide, not a phone call',
  description:
    'Waylo watches your screen and places a red dot on exactly what to tap next. Step-by-step guidance in Hindi, for every app.',
  openGraph: {
    title: 'Waylo',
    description: 'AI-powered tap guidance for Indian families.',
    siteName: 'Waylo',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
