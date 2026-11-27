import Link from 'next/link'
import { SITE_NAME, UI, type Lang } from '@/lib/content'
import { localePath } from '@/lib/i18n'

export function Footer({ lang }: { lang: Lang }) {
  const currentYear = new Date().getFullYear()
  const t = UI[lang].footer

  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex flex-col items-center gap-6">
          <Link href={localePath(lang, '/')} className="text-xl font-bold text-white hover:text-blue-400 transition-colors">
            {SITE_NAME[lang]}
          </Link>
          
          <p className="text-gray-400 text-center max-w-md">
            {t.description}
          </p>
          
          <div className="flex items-center space-x-6 text-sm">
            <Link href={localePath(lang, '/terms')} className="hover:text-white transition-colors">{t.terms}</Link>
            <Link href={localePath(lang, '/privacy')} className="hover:text-white transition-colors">{t.privacy}</Link>
          </div>
          
          <div className="border-t border-gray-700 w-full pt-6 mt-2">
            <p className="text-center text-gray-500 text-sm">
              Copyright {currentYear} AI Trading Benchmark. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
