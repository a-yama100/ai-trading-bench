import { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/content'
import { localePath } from '@/lib/i18n'

// 検索エンジン向けのページ一覧（/sitemap.xml）。日本語（ルート）と英語（/en）を対にする
const PAGES: { path: string; changeFrequency: 'daily' | 'weekly' | 'monthly' | 'yearly'; priority: number }[] = [
  { path: '/', changeFrequency: 'daily', priority: 1 },
  { path: '/crypto', changeFrequency: 'daily', priority: 0.9 },
  { path: '/forex', changeFrequency: 'daily', priority: 0.9 },
  { path: '/stock', changeFrequency: 'daily', priority: 0.9 },
  { path: '/models', changeFrequency: 'weekly', priority: 0.8 },
  { path: '/faq', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/privacy', changeFrequency: 'yearly', priority: 0.3 },
  { path: '/terms', changeFrequency: 'yearly', priority: 0.3 },
]

export default function sitemap(): MetadataRoute.Sitemap {
  const url = (p: string) => SITE_URL + (p === '/' ? '/' : p)
  return PAGES.flatMap((page) => {
    const languages = {
      ja: url(localePath('ja', page.path)),
      en: url(localePath('en', page.path)),
      'x-default': url(localePath('ja', page.path)),
    }
    return (['ja', 'en'] as const).map((lang) => ({
      url: url(localePath(lang, page.path)),
      lastModified: new Date(),
      changeFrequency: page.changeFrequency,
      priority: page.priority,
      alternates: { languages },
    }))
  })
}
