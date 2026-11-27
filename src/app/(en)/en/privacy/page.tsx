import { PrivacyPage } from '@/components/pages/PrivacyPage'
import { META } from '@/lib/content'
import { pageMeta } from '@/lib/i18n'

export const metadata = pageMeta('en', '/privacy', META.en.pages.privacy)

export default function PrivacyPageEn() {
  return <PrivacyPage lang="en" />
}
