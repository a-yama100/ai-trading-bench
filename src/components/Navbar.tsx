'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

export function Navbar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/'
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

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
              <span className="text-white font-bold text-sm">TB</span>
            </div>
            <span className="font-bold text-lg text-gray-800 group-hover:text-blue-600 transition-colors hidden sm:inline">
              AI Trading Bench
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-2">
            <Link href="/" className={linkClass('/')}>Home</Link>
            <Link href="/crypto" className={linkClass('/crypto')}>Crypto</Link>
            <Link href="/forex" className={linkClass('/forex')}>Forex</Link>
            <Link href="/stock" className={linkClass('/stock')}>Stock</Link>
            <Link href="/models" className={linkClass('/models')}>Models</Link>
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
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

      {isOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <Link href="/" className={mobileLinkClass('/')} onClick={() => setIsOpen(false)}>Home</Link>
          <Link href="/crypto" className={mobileLinkClass('/crypto')} onClick={() => setIsOpen(false)}>Crypto</Link>
          <Link href="/forex" className={mobileLinkClass('/forex')} onClick={() => setIsOpen(false)}>Forex</Link>
          <Link href="/stock" className={mobileLinkClass('/stock')} onClick={() => setIsOpen(false)}>Stock</Link>
          <Link href="/models" className={mobileLinkClass('/models')} onClick={() => setIsOpen(false)}>Models</Link>
        </div>
      )}
    </nav>
  )
}
