import { renderOgImage } from '@/lib/og-image'

// SNS 用の画像: /og/ja/opengraph・/og/ja/twitter・/og/en/opengraph・/og/en/twitter
// 日本語と英語の2つのルートレイアウトのページから、pageMeta（src/lib/i18n.ts）が指す
export const runtime = 'edge'

export async function GET(_req: Request, { params }: { params: Promise<{ lang: string; variant: string }> }) {
  const { lang, variant } = await params
  if ((lang !== 'ja' && lang !== 'en') || (variant !== 'opengraph' && variant !== 'twitter')) {
    return new Response('Not found', { status: 404 })
  }
  return renderOgImage(lang, variant)
}
