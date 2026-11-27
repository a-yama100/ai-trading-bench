import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import Script from 'next/script'
import { jsonLd as toJsonLd } from '@/lib/security/escapeHtml'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { ScrollToTop } from '@/components/ScrollToTop'
import { META, SITE_NAME, SITE_URL, type Lang } from '@/lib/content'
import { localePath } from '@/lib/i18n'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

// 日本語と英語のルートレイアウトで共通に使う設定
export function rootMetadata(lang: Lang): Metadata {
  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: META[lang].defaultTitle,
      template: '%s | ' + SITE_NAME[lang],
    },
    description: META[lang].description,
    keywords: lang === 'ja'
      ? ['AIトレーディング', 'AI 売買', 'ベンチマーク', 'GPT', 'Claude', '暗号資産 AI', '為替 AI', '株価指数 AI', 'AIモデル 比較']
      : ['AI trading', 'trading benchmark', 'GPT trading', 'Claude trading', 'crypto AI', 'forex AI', 'stock market AI', 'AI comparison'],
    authors: [{ name: 'AI Trading Benchmark' }],
    creator: 'AI Trading Benchmark',
    publisher: 'AI Trading Benchmark',
    robots: {
      index: true,
      follow: true,
    },
    icons: {
      icon: '/favicon.svg',
    },
  }
}

const JSON_LD_TEXT: Record<Lang, { description: string; featureList: string[] }> = {
  ja: {
    description: 'GPT、Claude、Gemini、Grok や、パソコン上で動かす小型のAIモデルの模擬売買の成績を比べるサイトです。対象はビットコイン、ユーロ/米ドル、S&P 500 です。',
    featureList: [
      'AIモデルの比較',
      '暗号資産の売買ベンチマーク',
      '為替の売買ベンチマーク',
      '株価指数の売買ベンチマーク',
      '日別の売買成績',
    ],
  },
  en: {
    description: 'Compare how AI models from OpenAI, Anthropic, Google and xAI trade Bitcoin, EUR/USD and the S&P 500 in a simulation.',
    featureList: [
      'AI model comparison',
      'Crypto trading benchmarks',
      'Forex trading benchmarks',
      'Stock market benchmarks',
      'Day-by-day performance tracking',
    ],
  },
}

const gaId = process.env.NEXT_PUBLIC_GA_ID || ''

export function RootShell({ lang, children }: { lang: Lang; children: React.ReactNode }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: SITE_NAME[lang],
    description: JSON_LD_TEXT[lang].description,
    url: SITE_URL + (lang === 'ja' ? '/' : localePath(lang, '/')),
    inLanguage: lang,
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    featureList: JSON_LD_TEXT[lang].featureList,
  }

  return (
    <html lang={lang}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: toJsonLd(jsonLd) }}
        />
      </head>
      <body className={geistSans.variable + ' ' + geistMono.variable + ' antialiased min-h-screen flex flex-col'}>
        <Navbar lang={lang} />
        <main className="flex-1">
          {children}
        </main>
        <Footer lang={lang} />
        <ScrollToTop lang={lang} />
        {gaId && (
          <>
            <Script
              src={"https://www.googletagmanager.com/gtag/js?id=" + gaId}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {"window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','" + gaId + "');"}
            </Script>
          </>
        )}
      </body>
    </html>
  )
}
