import { PrivacyPage } from '@/components/pages/PrivacyPage'
import { META } from '@/lib/content'
import { pageMeta } from '@/lib/i18n'

export const metadata = pageMeta('ja', '/privacy', META.ja.pages.privacy)

export default function PrivacyPageJa() {
  return <PrivacyPage lang="ja" />
}
