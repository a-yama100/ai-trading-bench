'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { UI, type Lang } from '@/lib/content'
import { localePath, switchLangPath } from '@/lib/i18n'

const NAV_ITEMS = ['home', 'crypto', 'forex', 'stock', 'models', 'faq'] as const

export function Navbar({ lang }: { lang: Lang }) {
  const pathname = usePathname() || '/'
  const [isOpen, setIsOpen] = useState(false)
  const t = UI[lang].nav

  const hrefOf = (item: typeof NAV_ITEMS[number]) => localePath(lang, item === 'home' ? '/' : '/' + item)

  const isActive = (path: string) => {
    const home = localePath(lang, '/')
    if (path === home) return pathname === home
    return pathname.startsWith(path)
  }

  const linkClass = (path: string) => {
    const base = 'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200'
    if (isActive(path)) {
      return base + ' bg-blue-500 text-white shadow-md'
    }
    return base + ' text-gray-600 hover:bg-gray-100 hover:text-gray-900'
  }

  const mobileLinkClass = (path: string) => {
    const base = 'block px-4 py-3 text-sm font-medium transition-all duration-200'
    if (isActive(path)) {
      return base + ' bg-blue-500 text-white'
    }
    return base + ' text-gray-600 hover:bg-gray-100'
  }

  // 言語の切り替え（今のページの、もう一方の言語の同じパス）
  const langSwitch = (className: string) => (
    <div className={className}>
      {(['ja', 'en'] as const).map((l) => (
        l === lang ? (
          <span key={l} className="px-2 py-1 font-semibold text-gray-900" aria-current="true">{UI[lang].langSwitch[l]}</span>
        ) : (
          <a key={l} href={switchLangPath(pathname, l)} hrefLang={l} lang={l} className="px-2 py-1 text-gray-500 hover:text-blue-600 transition-colors">
            {UI[lang].langSwitch[l]}
          </a>
        )
      ))}
    </div>
  )

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          <Link href={localePath(lang, '/')} className="flex items-center space-x-2 group">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
              <span className="text-white font-bold text-sm">TB</span>
            </div>
            <span className="font-bold text-lg text-gray-800 group-hover:text-blue-600 transition-colors inline text-sm sm:text-lg">
              AI Trading Bench
            </span>
          </Link>
          <div className="hidden md:flex items-center space-x-2">
            {NAV_ITEMS.map((item) => (
              <Link key={item} href={hrefOf(item)} className={linkClass(hrefOf(item))}>{t[item]}</Link>
            ))}
            {langSwitch('flex items-center text-sm border-l border-gray-200 pl-3 ml-1')}
          </div>
          <div className="flex items-center md:hidden">
            {langSwitch('flex items-center text-xs')}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 cursor-pointer"
              aria-label={t.menu}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>
      {isOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          {NAV_ITEMS.map((item) => (
            <Link key={item} href={hrefOf(item)} className={mobileLinkClass(hrefOf(item))} onClick={() => setIsOpen(false)}>{t[item]}</Link>
          ))}
        </div>
      )}
    </nav>
  )
}
