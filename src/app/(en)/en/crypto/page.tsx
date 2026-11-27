import { MarketPage } from '@/components/pages/MarketPage'
import { META } from '@/lib/content'
import { pageMeta } from '@/lib/i18n'

// Supabase から60秒ごとに作り直す（新しい実行結果を、デプロイなしで表示する）
export const revalidate = 60

export const metadata = pageMeta('en', '/crypto', META.en.pages.crypto)

export default function CryptoPageEn() {
  return <MarketPage lang="en" market="crypto" />
}
