import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';

import Navbar from '@/components/ui/navbar';
import { ThemeProvider } from '@/components/ui/theme-provider';

import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin']
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin']
});

export const metadata: Metadata = {
  title: 'Pererê | CACDIA',
  description: 'Aquilo que falta no SaCI'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='pt-br' suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider attribute='class' defaultTheme='system' enableSystem disableTransitionOnChange>
          <Navbar />
          <div className='mt-4 md:mt-8 lg:mt-12'>{children}</div>
        </ThemeProvider>
      </body>
    </html>
  );
}
