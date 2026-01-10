import Link from 'next/link'
import { supabase } from '@/lib/supabase'

interface RankingItem {
  rank: number
  model: string
  returnPct: number
}

interface CategoryRankings {
  crypto: RankingItem[]
  forex: RankingItem[]
  stock: RankingItem[]
}

async function getRankings(): Promise<CategoryRankings> {
  const { data, error } = await supabase
    .from('benchmark_runs')
    .select('category_id, model_id, return_pct, models(display_name)')
    .eq('status', 'completed')
    .order('return_pct', { ascending: false })

  if (error || !data) {
    console.error('Error fetching rankings:', error)
    return { crypto: [], forex: [], stock: [] }
  }

  const rankings: CategoryRankings = { crypto: [], forex: [], stock: [] }
  const categoryCounts = { crypto: 0, forex: 0, stock: 0 }

  for (const row of data) {
    const category = row.category_id as keyof CategoryRankings
    if (category in categoryCounts && categoryCounts[category] < 3) {
      categoryCounts[category]++
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const modelData = row.models as any
      const displayName = modelData?.display_name || row.model_id
      rankings[category].push({
        rank: categoryCounts[category],
        model: displayName,
        returnPct: Number(row.return_pct),
      })
    }
  }

  return rankings
}

function RankBadge({ rank }: { rank: number }) {
  if (rank === 1) return <span className="text-2xl">&#x1F451;</span>
  if (rank === 2) return <span className="text-xl text-gray-400">&#x1F948;</span>
  if (rank === 3) return <span className="text-xl text-amber-600">&#x1F949;</span>
  return <span className="text-gray-500">{rank}</span>
}

function MarketCard({
  title,
  symbol,
  href,
  rankings,
  gradient,
}: {
  title: string
  symbol: string
  href: string
  rankings: RankingItem[]
  gradient: string
}) {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
      <div className={gradient + ' px-6 py-4'}>
        <h2 className="text-xl font-bold text-white">{title}</h2>
        <p className="text-white/80 text-sm">{symbol}</p>
      </div>
      <div className="p-6">
        <div className="space-y-3">
          {rankings.length > 0 ? (
            rankings.map((item) => (
              <div
                key={item.rank}
                className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <RankBadge rank={item.rank} />
                  <span className="font-medium text-gray-800">{item.model}</span>
                </div>
                <span
                  className={
                    'font-bold ' +
                    (item.returnPct >= 0 ? 'text-green-600' : 'text-red-600')
                  }
                >
                  {item.returnPct >= 0 ? '+' : ''}
                  {item.returnPct.toFixed(1)}%
                </span>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center py-4">No data yet</p>
          )}
        </div>
        <div className="mt-6 flex justify-center">
          <Link
            href={href}
            className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  )
}

export default async function Home() {
  const rankings = await getRankings()

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          AI Trading Benchmark
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Compare how different AI models perform in trading decisions across
          cryptocurrency, forex, and stock markets.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <MarketCard
          title="Cryptocurrency"
          symbol="BTC/USD"
          href="/crypto"
          rankings={rankings.crypto}
          gradient="bg-gradient-to-r from-orange-400 to-orange-600"
        />
        <MarketCard
          title="Forex"
          symbol="EUR/USD"
          href="/forex"
          rankings={rankings.forex}
          gradient="bg-gradient-to-r from-blue-400 to-blue-600"
        />
        <MarketCard
          title="Stock"
          symbol="S&P 500"
          href="/stock"
          rankings={rankings.stock}
          gradient="bg-gradient-to-r from-green-400 to-green-600"
        />
      </div>

      <div className="mt-12 text-center">
        <p className="text-sm text-gray-500">
          Benchmarks are run with historical data. Past performance does not
          guarantee future results.
        </p>
      </div>
    </div>
  )
}
