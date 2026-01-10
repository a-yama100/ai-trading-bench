import { supabase } from '@/lib/supabase'
import Link from 'next/link'

async function getStockRankings() {
  const { data, error } = await supabase
    .from('benchmark_runs')
    .select('id, model_id, return_pct, total_trades, winning_trades, initial_balance, final_balance, finished_at, models(display_name)')
    .eq('category_id', 'stock')
    .eq('status', 'completed')
    .order('return_pct', { ascending: false })

  if (error) {
    console.error('Error fetching stock rankings:', error)
    return []
  }
  return data || []
}

function RankBadge({ rank }: { rank: number }) {
  if (rank === 1) return <span className="text-2xl">&#x1F451;</span>
  if (rank === 2) return <span className="text-xl text-gray-400">&#x1F948;</span>
  if (rank === 3) return <span className="text-xl text-amber-600">&#x1F949;</span>
  return <span className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-medium">{rank}</span>
}

export default async function StockPage() {
  const rankings = await getStockRankings()

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <Link href="/" className="text-blue-500 hover:text-blue-700 text-sm">
          Back to Home
        </Link>
      </div>

      <div className="bg-gradient-to-r from-green-400 to-green-600 rounded-xl p-6 mb-8">
        <h1 className="text-3xl font-bold text-white">Stock</h1>
        <p className="text-white/80 mt-2">S&P 500 Trading Benchmark</p>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Leaderboard</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Model</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Return</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Win Rate</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Trades</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Final Balance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {rankings.map((run, index) => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const modelData = run.models as any
                const winRate = run.total_trades > 0 
                  ? ((run.winning_trades / run.total_trades) * 100).toFixed(1)
                  : '0.0'
                return (
                  <tr key={run.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <RankBadge rank={index + 1} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-medium text-gray-900">
                        {modelData?.display_name || run.model_id}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <span className={Number(run.return_pct) >= 0 ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}>
                        {Number(run.return_pct) >= 0 ? '+' : ''}{Number(run.return_pct).toFixed(2)}%
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-gray-600">
                      {winRate}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-gray-600">
                      {run.total_trades}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-gray-900 font-medium">
                      
                    </td>
                  </tr>
                )
              })}
              {rankings.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    No benchmark data available yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
