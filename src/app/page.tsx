import { supabase } from '@/lib/supabase'
import Link from 'next/link'

interface CategoryData {
  id: string
  name: string
  subtitle: string
  gradient: string
  href: string
}

const CATEGORIES: CategoryData[] = [
  { id: 'crypto', name: 'Cryptocurrency', subtitle: 'BTC/USD', gradient: 'from-orange-400 to-orange-600', href: '/crypto' },
  { id: 'forex', name: 'Forex', subtitle: 'EUR/USD', gradient: 'from-blue-400 to-blue-600', href: '/forex' },
  { id: 'stock', name: 'Stock', subtitle: 'S&P 500', gradient: 'from-green-400 to-green-600', href: '/stock' },
]

async function getTopModels() {
  const results: Record<string, Array<{ model_id: string; display_name: string; return_pct: number }>> = {}

  for (const cat of CATEGORIES) {
    const { data } = await supabase
      .from('benchmark_runs')
      .select('model_id, return_pct, models(display_name)')
      .eq('category_id', cat.id)
      .eq('status', 'completed')
      .order('return_pct', { ascending: false })
      .limit(3)

    results[cat.id] = (data || []).map((row) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const modelData = row.models as any
      return {
        model_id: row.model_id,
        display_name: modelData?.display_name || row.model_id,
        return_pct: Number(row.return_pct),
      }
    })
  }

  return results
}

function RankIcon({ rank }: { rank: number }) {
  if (rank === 1) return <span className="text-xl">&#x1F451;</span>
  if (rank === 2) return <span className="text-lg text-gray-400">&#x1F948;</span>
  if (rank === 3) return <span className="text-lg text-amber-600">&#x1F949;</span>
  return null
}

export default async function Home() {
  const topModels = await getTopModels()

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">AI Trading Benchmark</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Compare how different AI models perform in trading decisions across
          cryptocurrency, forex, and stock markets.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {CATEGORIES.map((cat) => (
          <div key={cat.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
            <Link href={cat.href} className={'bg-gradient-to-r ' + cat.gradient + ' p-6 block hover:opacity-90 transition-opacity'}>
              <h2 className="text-2xl font-bold text-white">{cat.name}</h2>
              <p className="text-white/80">{cat.subtitle}</p>
            </Link>
            <div className="p-6">
              {topModels[cat.id]?.length > 0 ? (
                <div className="space-y-3">
                  {topModels[cat.id].map((model, idx) => (
                    <Link
                      key={model.model_id}
                      href={'/' + cat.id + '/' + model.model_id}
                      className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <RankIcon rank={idx + 1} />
                        <span className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                          {model.display_name}
                        </span>
                      </div>
                      <span className={model.return_pct >= 0 ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}>
                        {model.return_pct >= 0 ? '+' : ''}{model.return_pct.toFixed(1)}%
                      </span>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-center py-4">No data yet</p>
              )}
              <Link
                href={cat.href}
                className="mt-4 block text-center py-2 px-4 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-colors"
              >
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
