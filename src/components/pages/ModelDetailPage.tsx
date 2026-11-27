import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { ModelPerformanceChartWrapper } from '@/components/ModelPerformanceChartWrapper'
import { getModelName } from '@/components/pages/MarketModelPage'
import { CATEGORY_NAMES as CATEGORY_NAMES_ALL, META, PROVIDER_NAMES as PROVIDER_NAMES_ALL, UI, dateLocale, type Lang } from '@/lib/content'
import { pageMeta } from '@/lib/i18n'

// 1つのモデルの、全市場の成績（/models/[id] と /en/models/[id]）

export async function modelDetailMetadata(lang: Lang, id: string): Promise<Metadata> {
  const name = (await getModelName(id)) || id
  return pageMeta(lang, '/models/' + id, META[lang].modelDetail(name))
}

const PROVIDER_COLORS: Record<string, string> = {
  openai: 'bg-green-100 text-green-800',
  anthropic: 'bg-orange-100 text-orange-800',
  google: 'bg-blue-100 text-blue-800',
  xai: 'bg-purple-100 text-purple-800',
}

export async function ModelDetailPage({ lang, id }: { lang: Lang; id: string }) {
  const CATEGORY_NAMES = CATEGORY_NAMES_ALL[lang]
  const PROVIDER_NAMES = PROVIDER_NAMES_ALL[lang]
  const t = UI[lang].modelDetail

  const { data: model } = await supabase
    .from('shared_models')
    .select('*')
    .eq('id', id)
    .single()

  if (!model) {
    notFound()
  }

  const { data: runs } = await supabase
    .from('tb_benchmark_runs')
    .select('*')
    .eq('model_id', id)
    .eq('status', 'completed')
    .order('finished_at', { ascending: false })

  const categoryStats: Record<string, { returnPct: number; totalTrades: number; winningTrades: number; count: number }> = {}
  
  if (runs) {
    for (const run of runs) {
      const cat = run.category_id
      if (!categoryStats[cat]) {
        categoryStats[cat] = { returnPct: 0, totalTrades: 0, winningTrades: 0, count: 0 }
      }
      categoryStats[cat].returnPct += Number(run.return_pct)
      categoryStats[cat].totalTrades += run.total_trades
      categoryStats[cat].winningTrades += run.winning_trades
      categoryStats[cat].count += 1
    }
  }

  const performanceData = Object.entries(categoryStats).map(([cat, stats]) => ({
    category: cat,
    categoryName: CATEGORY_NAMES[cat] || cat,
    returnPct: stats.returnPct / stats.count,
    totalTrades: Math.round(stats.totalTrades / stats.count),
    winningTrades: Math.round(stats.winningTrades / stats.count),
  }))

  const overallReturn = performanceData.length > 0
    ? performanceData.reduce((sum, d) => sum + d.returnPct, 0) / performanceData.length
    : 0

  const totalRuns = runs?.length || 0

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{model.display_name}</h1>
            <p className="text-gray-500 mt-1">{model.id}</p>
          </div>
          <span className={PROVIDER_COLORS[model.provider] + ' px-4 py-2 rounded-full text-sm font-medium'}>
            {PROVIDER_NAMES[model.provider] || model.provider}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <p className="text-sm text-gray-500">{t.overallReturn}</p>
            <p className={'text-2xl font-bold ' + (overallReturn >= 0 ? 'text-green-600' : 'text-red-600')}>
              {overallReturn >= 0 ? '+' : ''}{overallReturn.toFixed(2)}%
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <p className="text-sm text-gray-500">{t.totalRuns}</p>
            <p className="text-2xl font-bold text-gray-900">{totalRuns}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <p className="text-sm text-gray-500">{t.provider}</p>
            <p className="text-2xl font-bold text-gray-900">{PROVIDER_NAMES[model.provider] || model.provider}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <p className="text-sm text-gray-500">{t.type}</p>
            <p className="text-2xl font-bold text-gray-900">{model.backend_type?.toUpperCase() || 'API'}</p>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">{t.byMarket}</h2>
        <ModelPerformanceChartWrapper data={performanceData} lang={lang} />
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">{t.marketStats}</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t.market}</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">{t.avgReturn}</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">{t.avgTrades}</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">{t.winRate}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {performanceData.map((data) => {
                const winRate = data.totalTrades > 0 ? (data.winningTrades / data.totalTrades * 100) : 0
                return (
                  <tr key={data.category} className="hover:bg-gray-50">
                    <td className="px-4 py-4 font-medium text-gray-900">{data.categoryName}</td>
                    <td className="px-4 py-4 text-right">
                      <span className={data.returnPct >= 0 ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}>
                        {data.returnPct >= 0 ? '+' : ''}{data.returnPct.toFixed(2)}%
                      </span>
                    </td>
                    <td className="px-4 py-4 text-right text-gray-600">{data.totalTrades}</td>
                    <td className="px-4 py-4 text-right text-gray-600">{winRate.toFixed(1)}%</td>
                  </tr>
                )
              })}
              {performanceData.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                    {t.noData}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">{t.recentRuns}</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t.market}</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">{t.return}</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">{t.trades}</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">{t.finalBalance}</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">{t.date}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {runs && runs.slice(0, 10).map((run) => (
                <tr key={run.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 font-medium text-gray-900">
                    {CATEGORY_NAMES[run.category_id] || run.category_id}
                  </td>
                  <td className="px-4 py-4 text-right">
                    <span className={Number(run.return_pct) >= 0 ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}>
                      {Number(run.return_pct) >= 0 ? '+' : ''}{Number(run.return_pct).toFixed(2)}%
                    </span>
                  </td>
                  <td className="px-4 py-4 text-right text-gray-600">{run.total_trades}</td>
                  <td className="px-4 py-4 text-right text-gray-900 font-medium">
                    {'$' + Number(run.final_balance).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                  <td className="px-4 py-4 text-right text-gray-500">
                    {new Date(run.finished_at).toLocaleDateString(dateLocale(lang))}
                  </td>
                </tr>
              ))}
              {(!runs || runs.length === 0) && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                    {t.noRuns}
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
