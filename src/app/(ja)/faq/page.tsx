import { FaqPage } from '@/components/pages/FaqPage'
import { META } from '@/lib/content'
import { pageMeta } from '@/lib/i18n'

export const metadata = pageMeta('ja', '/faq', META.ja.pages.faq)

export default function FaqPageJa() {
  return <FaqPage lang="ja" />
}
