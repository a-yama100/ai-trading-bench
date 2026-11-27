import { HomePage } from '@/components/pages/HomePage'
import { pageMeta } from '@/lib/i18n'

// Supabase から60秒ごとに作り直す（新しい実行結果を、デプロイなしで表示する）
export const revalidate = 60

export const metadata = pageMeta('en', '/')

export default function HomeEn() {
  return <HomePage lang="en" />
}
