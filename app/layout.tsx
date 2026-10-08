import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Borç & Kredi Takip | Finansal Kontrol Merkezi',
  description: 'Kredi kartları, KMH ve taksitli borçlarınızı takip edin, ödeme tarihlerini kaçırmayın.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Borç Takip',
  },
};

export const viewport: Viewport = {
  themeColor: '#090d16',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className="dark">
      <body className="min-h-screen bg-[#090d16] text-slate-100 antialiased selection:bg-emerald-500 selection:text-white pb-24 md:pb-8">
        {children}
      </body>
    </html>
  );
}
