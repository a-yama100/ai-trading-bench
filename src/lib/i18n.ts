import type { Metadata } from 'next'
import { META, SITE_NAME, SITE_URL, type Lang } from '@/lib/content'

// 日本語はルート（/、/crypto）、英語は /en の下（/en、/en/crypto）
export function localePath(lang: Lang, path: string): string {
  if (lang === 'ja') return path
  return path === '/' ? '/en' : '/en' + path
}

// 今のパスから、もう一方の言語の同じページのパスを出す
export function switchLangPath(pathname: string, to: Lang): string {
  const base = pathname === '/en' ? '/' : pathname.startsWith('/en/') ? pathname.slice(3) : pathname
  return localePath(to, base || '/')
}

// SNS 用の画像（src/app/og/[lang]/[variant]/route.tsx）
export function ogImageUrl(lang: Lang, variant: 'opengraph' | 'twitter'): string {
  return '/og/' + lang + '/' + variant
}

// ページの題名・説明・正規の URL・言語の対応（hreflang）・SNS の設定
// title を省くと、サイトの既定の題名（トップページ用）を使う
export function pageMeta(lang: Lang, path: string, page?: { title: string; description: string }): Metadata {
  const m = META[lang]
  const fullTitle = page ? page.title + ' | ' + SITE_NAME[lang] : m.defaultTitle
  const description = page ? page.description : m.description
  const url = localePath(lang, path)
  return {
    title: page ? page.title : { absolute: m.defaultTitle },
    description,
    robots: { index: true, follow: true },
    alternates: {
      canonical: url,
      languages: {
        ja: localePath('ja', path),
        en: localePath('en', path),
        'x-default': localePath('ja', path),
      },
    },
    openGraph: {
      type: 'website',
      locale: lang === 'ja' ? 'ja_JP' : 'en_US',
      url: SITE_URL + (url === '/' ? '/' : url),
      siteName: SITE_NAME[lang],
      title: fullTitle,
      description,
      images: [{ url: ogImageUrl(lang, 'opengraph'), width: 1200, height: 630, alt: m.ogAlt }],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description: page ? page.description : m.twitterDescription,
      images: [ogImageUrl(lang, 'twitter')],
    },
  }
}
