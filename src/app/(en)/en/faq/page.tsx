import { FaqPage } from '@/components/pages/FaqPage'
import { META } from '@/lib/content'
import { pageMeta } from '@/lib/i18n'

export const metadata = pageMeta('en', '/faq', META.en.pages.faq)

export default function FaqPageEn() {
  return <FaqPage lang="en" />
}
