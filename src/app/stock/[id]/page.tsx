import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { TradePerformanceChartWrapper } from '@/components/TradePerformanceChartWrapper'

export const revalidate = 60

interface Props {
  params: Promise<{ id: string }>
}

const PROVIDER_COLORS: Record<string, string> = {
  openai: 'bg-green-100 text-green-800',
  anthropic: 'bg-orange-100 text-orange-800',
  google: 'bg-blue-100 text-blue-800',
  xai: 'bg-purple-100 text-purple-800',
}

const PROVIDER_NAMES: Record<string, string> = {
  openai: 'OpenAI',
  anthropic: 'Anthropic',
  google: 'Google',
  xai: 'xAI',
}

export default async function StockModelDetailPage({ params }: Props) {
  const { id } = await params

  const { data: model } = await supabase
    .from('models')
    .select('*')
    .eq('id', id)
    .single()

  if (!model) {
    notFound()
  }

  const { data: runs } = await supabase
    .from('benchmark_runs')
    .select('*')
    .eq('model_id', id)
    .eq('category_id', 'stock')
    .eq('status', 'completed')
    .order('finished_at', { ascending: false })

  const totalRuns = runs?.length || 0
  const avgReturn = totalRuns > 0
    ? runs!.reduce((sum, r) => sum + Number(r.return_pct), 0) / totalRuns
    : 0
  const avgTrades = totalRuns > 0
    ? Math.round(runs!.reduce((sum, r) => sum + r.total_trades, 0) / totalRuns)
    : 0
  const totalWins = runs?.reduce((sum, r) => sum + r.winning_trades, 0) || 0
  const totalTradesAll = runs?.reduce((sum, r) => sum + r.total_trades, 0) || 0
  const winRate = totalTradesAll > 0 ? (totalWins / totalTradesAll * 100) : 0

  const bestRun = runs && runs.length > 0
    ? runs.reduce((best, r) => Number(r.return_pct) > Number(best.return_pct) ? r : best)
    : null
  const worstRun = runs && runs.length > 0
    ? runs.reduce((worst, r) => Number(r.return_pct) < Number(worst.return_pct) ? r : worst)
    : null

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/stock" className="text-blue-500 hover:text-blue-700 text-sm flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Stock Leaderboard
        </Link>
      </div>

      <div className="bg-gradient-to-r from-green-400 to-green-600 rounded-xl p-6 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-white/80 text-sm">Stock (S&P 500)</p>
            <h1 className="text-3xl font-bold text-white">{model.display_name}</h1>
          </div>
          <span className={PROVIDER_COLORS[model.provider] + ' px-4 py-2 rounded-full text-sm font-medium'}>
            {PROVIDER_NAMES[model.provider] || model.provider}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl shadow p-4 text-center">
          <p className="text-sm text-gray-500">Avg Return</p>
          <p className={'text-2xl font-bold ' + (avgReturn >= 0 ? 'text-green-600' : 'text-red-600')}>
            {avgReturn >= 0 ? '+' : ''}{avgReturn.toFixed(2)}%
          </p>
        </div>
        <div className="bg-white rounded-xl shadow p-4 text-center">
          <p className="text-sm text-gray-500">Total Runs</p>
          <p className="text-2xl font-bold text-gray-900">{totalRuns}</p>
        </div>
        <div className="bg-white rounded-xl shadow p-4 text-center">
          <p className="text-sm text-gray-500">Avg Trades</p>
          <p className="text-2xl font-bold text-gray-900">{avgTrades}</p>
        </div>
        <div className="bg-white rounded-xl shadow p-4 text-center">
          <p className="text-sm text-gray-500">Win Rate</p>
          <p className="text-2xl font-bold text-gray-900">{winRate.toFixed(1)}%</p>
        </div>
      </div>

      {bestRun && worstRun && (
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow p-6 border-l-4 border-green-500">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Best Performance</h3>
            <p className={'text-3xl font-bold ' + (Number(bestRun.return_pct) >= 0 ? 'text-green-600' : 'text-red-600')}>
              {Number(bestRun.return_pct) >= 0 ? '+' : ''}{Number(bestRun.return_pct).toFixed(2)}%
            </p>
            <p className="text-sm text-gray-500 mt-2">
              {bestRun.total_trades} trades | Final: 
            </p>
          </div>
          <div className="bg-white rounded-xl shadow p-6 border-l-4 border-red-500">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Worst Performance</h3>
            <p className={'text-3xl font-bold ' + (Number(worstRun.return_pct) >= 0 ? 'text-green-600' : 'text-red-600')}>
              {Number(worstRun.return_pct) >= 0 ? '+' : ''}{Number(worstRun.return_pct).toFixed(2)}%
            </p>
            <p className="text-sm text-gray-500 mt-2">
              {worstRun.total_trades} trades | Final: 
            </p>
          </div>
        </div>
      )}

      {runs && runs.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">Performance Charts</h2>
          </div>
          <div className="p-6">
            <TradePerformanceChartWrapper 
              runs={runs.map(r => ({
                id: r.id,
                return_pct: Number(r.return_pct),
                total_trades: r.total_trades,
                winning_trades: r.winning_trades,
                initial_balance: Number(r.initial_balance),
                final_balance: Number(r.final_balance),
                finished_at: r.finished_at,
                daily_data: r.daily_data,
              }))}
              marketColor="#22c55e"
            />
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">All Stock Runs</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Return</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Trades</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Wins</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Initial</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Final</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {runs && runs.map((run) => (
                <tr key={run.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-gray-900">
                    {new Date(run.finished_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className={Number(run.return_pct) >= 0 ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}>
                      {Number(run.return_pct) >= 0 ? '+' : ''}{Number(run.return_pct).toFixed(2)}%
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right text-gray-600">{run.total_trades}</td>
                  <td className="px-6 py-4 text-right text-gray-600">{run.winning_trades}</td>
                  <td className="px-6 py-4 text-right text-gray-600"></td>
                  <td className="px-6 py-4 text-right font-medium text-gray-900"></td>
                </tr>
              ))}
              {(!runs || runs.length === 0) && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    No benchmark runs for this model in Stock
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-6 text-center">
        <Link
          href={'/models/' + id}
          className="text-blue-500 hover:text-blue-700 text-sm"
        >
          View all market performance for {model.display_name} →
        </Link>
      </div>
    </div>
  )
}
