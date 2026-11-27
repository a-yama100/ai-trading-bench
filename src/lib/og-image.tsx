import { ImageResponse } from 'next/og'
import type { Lang } from '@/lib/content'

// SNS 用の画像（1200×630）。日本語と英語の両方のページから使う（src/app/og/[lang]/[variant]/route.tsx）
// 以前の src/app/opengraph-image.tsx（市場の3つの札あり）と twitter-image.tsx（札なし）を、言語ごとに描く

export const OG_SIZE = { width: 1200, height: 630 }

const TEXT: Record<Lang, { title: string; subtitle: string; chips: string[] }> = {
  ja: {
    title: 'AIトレーディング・ベンチマーク',
    subtitle: 'GPT・Claude・Gemini・Grok などの模擬売買の成績を比較',
    chips: ['暗号資産', '為替', '株価指数'],
  },
  en: {
    title: 'AI Trading Benchmark',
    subtitle: 'Compare GPT, Claude, Gemini, and Grok in Trading Decisions',
    chips: ['Crypto', 'Forex', 'Stocks'],
  },
}

// 画像に日本語を描くための字体。Google Fonts から、使う文字だけを取り出して読み込む
// （@vercel/og の標準の字体には日本語がないため。取得できないときは標準の字体で描く）
async function loadGoogleFont(family: string, weight: number, text: string): Promise<ArrayBuffer | null> {
  try {
    const url = 'https://fonts.googleapis.com/css2?family=' + family + ':wght@' + weight + '&text=' + encodeURIComponent(text)
    const css = await (await fetch(url)).text()
    const resource = css.match(/src: url\((.+?)\) format\('(opentype|truetype)'\)/)
    if (!resource) return null
    const res = await fetch(resource[1])
    if (!res.ok) return null
    return await res.arrayBuffer()
  } catch {
    return null
  }
}

export async function renderOgImage(lang: Lang, variant: 'opengraph' | 'twitter'): Promise<ImageResponse> {
  const t = TEXT[lang]
  const withChips = variant === 'opengraph'

  let fonts: { name: string; data: ArrayBuffer; weight: 400 | 700; style: 'normal' }[] | undefined
  if (lang === 'ja') {
    const allText = t.title + t.subtitle + (withChips ? t.chips.join('') : '')
    const [bold, regular] = await Promise.all([
      loadGoogleFont('Noto+Sans+JP', 700, allText),
      loadGoogleFont('Noto+Sans+JP', 400, allText),
    ])
    fonts = []
    if (bold) fonts.push({ name: 'Noto Sans JP', data: bold, weight: 700, style: 'normal' })
    if (regular) fonts.push({ name: 'Noto Sans JP', data: regular, weight: 400, style: 'normal' })
    if (fonts.length === 0) fonts = undefined
  }

  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 64,
          background: 'linear-gradient(135deg, #1e3a5f 0%, #0f172a 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          padding: '40px',
          fontFamily: fonts ? 'Noto Sans JP' : undefined,
        }}
      >
        <div
          style={{
            fontSize: lang === 'ja' ? 64 : 72,
            fontWeight: 'bold',
            marginBottom: '20px',
            textAlign: 'center',
          }}
        >
          {t.title}
        </div>
        <div
          style={{
            fontSize: 32,
            opacity: 0.9,
            textAlign: 'center',
            maxWidth: '900px',
          }}
        >
          {t.subtitle}
        </div>
        {withChips && (
          <div
            style={{
              display: 'flex',
              gap: '30px',
              marginTop: '40px',
            }}
          >
            {t.chips.map((chip) => (
              <div key={chip} style={{ fontSize: 24, padding: '10px 24px', background: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}>
                {chip}
              </div>
            ))}
          </div>
        )}
      </div>
    ),
    {
      ...OG_SIZE,
      fonts,
    }
  )
}
