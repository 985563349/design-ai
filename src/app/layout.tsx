import type { Metadata } from 'next';
import localFont from 'next/font/local';

import { Toaster } from '@/components/ui/sonner';
import { SessionProvider } from '@/providers/session';
import { QueryClientProvider } from '@/providers/query-client';
import { DialogProvider } from '@/providers/dialog';

import './globals.css';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

export const metadata: Metadata = {
  title: 'Design AI',
  description: 'visualize your ideas with image ai',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <SessionProvider>
          <QueryClientProvider>
            <DialogProvider>{children}</DialogProvider>
          </QueryClientProvider>
        </SessionProvider>
        <Toaster />
      </body>
    </html>
  );
}
