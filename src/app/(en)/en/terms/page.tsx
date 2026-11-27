import { TermsPage } from '@/components/pages/TermsPage'
import { META } from '@/lib/content'
import { pageMeta } from '@/lib/i18n'

export const metadata = pageMeta('en', '/terms', META.en.pages.terms)

export default function TermsPageEn() {
  return <TermsPage lang="en" />
}
