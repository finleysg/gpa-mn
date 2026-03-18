import type { Metadata } from 'next';
import { Bebas_Neue, Lora, Geist_Mono } from 'next/font/google';
import { Toaster } from '@repo/ui/components/sonner';
import './globals.css';

const bebasNeue = Bebas_Neue({
  variable: '--font-heading',
  weight: '400',
  subsets: ['latin'],
});

const lora = Lora({
  variable: '--font-body',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'GPA-MN Admin',
  description: 'Admin panel for Greyhound Pets of America - Minnesota Chapter',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${bebasNeue.variable} ${lora.variable} ${geistMono.variable} antialiased`}>
        {children}
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
