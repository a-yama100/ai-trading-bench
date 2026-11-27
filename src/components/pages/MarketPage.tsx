import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { H1, MARKETS, UI, type Lang, type MarketId } from '@/lib/content'
import { localePath } from '@/lib/i18n'

// 市場ごとのランキング（/crypto・/forex・/stock と、その /en の版）

async function getRankings(market: MarketId) {
  const { data, error } = await supabase
    .from('tb_benchmark_runs')
    .select('id, model_id, return_pct, total_trades, winning_trades, initial_balance, final_balance, finished_at, shared_models(display_name, provider)')
    .eq('category_id', market)
    .eq('status', 'completed')
    .order('return_pct', { ascending: false })

  if (error) {
    console.error('Error fetching ' + market + ' rankings:', error)
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

function getProviderColor(provider: string) {
  switch (provider) {
    case 'openai': return 'bg-green-100 text-green-800'
    case 'anthropic': return 'bg-orange-100 text-orange-800'
    case 'google': return 'bg-blue-100 text-blue-800'
    case 'xai': return 'bg-purple-100 text-purple-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

export async function MarketPage({ lang, market }: { lang: Lang; market: MarketId }) {
  const rankings = await getRankings(market)
  const m = MARKETS[market]
  const t = UI[lang].market

  const totalRuns = rankings.length
  const avgReturn = totalRuns > 0
    ? rankings.reduce((sum, r) => sum + Number(r.return_pct), 0) / totalRuns
    : 0
  const bestReturn = totalRuns > 0 ? Number(rankings[0]?.return_pct) : 0
  const worstReturn = totalRuns > 0 ? Number(rankings[rankings.length - 1]?.return_pct) : 0

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className={'bg-gradient-to-r ' + m.gradient + ' rounded-xl p-6 mb-8'}>
        <h1 className="text-3xl font-bold text-white">{H1[lang][market]}</h1>
        <p className="text-white/80 mt-2">{m[lang].subtitle}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl shadow p-4 text-center">
          <p className="text-sm text-gray-500">{t.totalRuns}</p>
          <p className="text-2xl font-bold text-gray-900">{totalRuns}</p>
        </div>
        <div className="bg-white rounded-xl shadow p-4 text-center">
          <p className="text-sm text-gray-500">{t.avgReturn}</p>
          <p className={'text-2xl font-bold ' + (avgReturn >= 0 ? 'text-green-600' : 'text-red-600')}>
            {avgReturn >= 0 ? '+' : ''}{avgReturn.toFixed(2)}%
          </p>
        </div>
        <div className="bg-white rounded-xl shadow p-4 text-center">
          <p className="text-sm text-gray-500">{t.bestReturn}</p>
          <p className={'text-2xl font-bold ' + (bestReturn >= 0 ? 'text-green-600' : 'text-red-600')}>
            {bestReturn >= 0 ? '+' : ''}{bestReturn.toFixed(2)}%
          </p>
        </div>
        <div className="bg-white rounded-xl shadow p-4 text-center">
          <p className="text-sm text-gray-500">{t.worstReturn}</p>
          <p className={'text-2xl font-bold ' + (worstReturn >= 0 ? 'text-green-600' : 'text-red-600')}>
            {worstReturn >= 0 ? '+' : ''}{worstReturn.toFixed(2)}%
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">{t.leaderboard}</h2>
          <p className="text-sm text-gray-500 mt-1">{t.leaderboardHint}</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t.rank}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t.model}</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">{t.return}</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">{t.winRate}</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">{t.trades}</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">{t.finalBalance}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {rankings.map((run, index) => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const modelData = run.shared_models as any
                const winRate = run.total_trades > 0
                  ? ((run.winning_trades / run.total_trades) * 100).toFixed(1)
                  : '0.0'
                return (
                  <tr key={run.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <RankBadge rank={index + 1} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link href={localePath(lang, '/' + market + '/' + run.model_id)} className="flex items-center gap-3 group">
                        <span className={getProviderColor(modelData?.provider) + ' px-2 py-0.5 rounded text-xs font-medium'}>
                          {modelData?.provider || t.unknown}
                        </span>
                        <span className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                          {modelData?.display_name || run.model_id}
                        </span>
                        <svg className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
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
                      {'$' + Number(run.final_balance).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                  </tr>
                )
              })}
              {rankings.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    {t.noData}
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
