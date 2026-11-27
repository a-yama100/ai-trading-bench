import { ModelsPage } from '@/components/pages/ModelsPage'
import { META } from '@/lib/content'
import { pageMeta } from '@/lib/i18n'

// Supabase から60秒ごとに作り直す（新しい実行結果を、デプロイなしで表示する）
export const revalidate = 60

export const metadata = pageMeta('en', '/models', META.en.pages.models)

export default function ModelsPageEn() {
  return <ModelsPage lang="en" />
}
