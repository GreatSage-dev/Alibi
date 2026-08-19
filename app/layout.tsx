import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Alibi — Temporal Verification for AI Agents | HydraDB',
  description: 'Proves what an AI agent actually knew at the moment of decision. Built on HydraDB temporal graphs.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
