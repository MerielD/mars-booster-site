import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Mars Booster',
  description: 'Founder acceleration and innovation ecosystem for Physical AI.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
