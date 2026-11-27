import { TermsPage } from '@/components/pages/TermsPage'
import { META } from '@/lib/content'
import { pageMeta } from '@/lib/i18n'

export const metadata = pageMeta('ja', '/terms', META.ja.pages.terms)

export default function TermsPageJa() {
  return <TermsPage lang="ja" />
}
