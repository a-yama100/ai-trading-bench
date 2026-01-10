import Link from 'next/link'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex flex-col items-center gap-6">
          <Link href="/" className="text-xl font-bold text-white hover:text-blue-400 transition-colors">
            AI Trading Benchmark
          </Link>
          
          <p className="text-gray-400 text-center max-w-md">
            Comparing AI models in trading decisions across cryptocurrency, forex, and stock markets.
          </p>
          
          <div className="flex items-center space-x-6 text-sm">
            <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
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
