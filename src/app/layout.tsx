import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { ScrollToTop } from '@/components/ScrollToTop'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  metadataBase: new URL('https://trading.phtechai.com'),
  title: {
    default: 'AI Trading Benchmark - Compare AI Models in Trading Decisions',
    template: '%s | AI Trading Benchmark',
  },
  description: 'Compare AI trading performance across GPT-4, Claude, Gemini, and DeepSeek models. Analyze crypto, forex, and stock market decisions with real-time benchmarks.',
  keywords: ['AI trading', 'trading benchmark', 'GPT-4 trading', 'Claude trading', 'crypto AI', 'forex AI', 'stock market AI', 'AI comparison'],
  authors: [{ name: 'AI Trading Benchmark' }],
  creator: 'AI Trading Benchmark',
  publisher: 'AI Trading Benchmark',
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://trading.phtechai.com/',
    siteName: 'AI Trading Benchmark',
    title: 'AI Trading Benchmark - Compare AI Models in Trading Decisions',
    description: 'Compare AI trading performance across GPT-4, Claude, Gemini, and DeepSeek models. Analyze crypto, forex, and stock market decisions with real-time benchmarks.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'AI Trading Benchmark',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Trading Benchmark - Compare AI Models in Trading Decisions',
    description: 'Compare AI trading performance across GPT-4, Claude, Gemini, and DeepSeek models.',
    images: ['/og-image.png'],
  },
  icons: {
    icon: '/favicon.svg',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'AI Trading Benchmark',
  description: 'Compare AI trading performance across GPT-4, Claude, Gemini, and DeepSeek models in crypto, forex, and stock markets.',
  url: 'https://trading.phtechai.com/',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'Web',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  featureList: [
    'AI model comparison',
    'Crypto trading benchmarks',
    'Forex trading benchmarks',
    'Stock market benchmarks',
    'Real-time performance tracking',
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={geistSans.variable + ' ' + geistMono.variable + ' antialiased min-h-screen flex flex-col'}>
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
        <ScrollToTop />
      </body>
    </html>
  )
}
