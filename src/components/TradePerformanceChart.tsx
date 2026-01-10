"use client"

import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  ReferenceLine,
} from 'recharts'

interface RunData {
  id: string
  return_pct: number
  total_trades: number
  winning_trades: number
  initial_balance: number
  final_balance: number
  finished_at: string
  daily_data?: string
}

interface TradeChartProps {
  runs: RunData[]
  marketColor: string
}

interface DailyDataPoint {
  day: number
  date: string
  price: number
  cash: number
  position: number
  portfolio_value: number
  daily_pnl: number
  action: string | null
  trade_pnl: number | null
}

export function TradePerformanceChart({ runs, marketColor }: TradeChartProps) {
  if (runs.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center bg-gray-100 rounded text-gray-400">
        No benchmark data available
      </div>
    )
  }

  // Get the most recent run with daily_data
  const latestRun = runs.find(r => r.daily_data)
  let dailyData: DailyDataPoint[] = []
  
  if (latestRun && latestRun.daily_data) {
    try {
      dailyData = JSON.parse(latestRun.daily_data)
    } catch (e) {
      console.error('Failed to parse daily_data:', e)
    }
  }

  // Chart data for portfolio value over time
  const portfolioChartData = dailyData.map(d => ({
    day: d.day,
    value: Number(d.portfolio_value.toFixed(2)),
    price: d.price,
    action: d.action,
  }))

  // Chart data for cumulative P&L
  const initialBalance = runs[0]?.initial_balance || 10000
  const pnlChartData = dailyData.map(d => ({
    day: d.day,
    pnl: Number((d.portfolio_value - initialBalance).toFixed(2)),
    pnlPct: Number(((d.portfolio_value - initialBalance) / initialBalance * 100).toFixed(2)),
    action: d.action,
  }))

  return (
    <div className="space-y-8">
      {dailyData.length > 0 ? (
        <>
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-3">Portfolio Value Over Time</h3>
            <div className="[&_svg]:outline-none [&_*]:outline-none">
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={portfolioChartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="day" 
                    tick={{ fontSize: 11 }} 
                    label={{ value: 'Day', position: 'insideBottom', offset: -5, fontSize: 11 }}
                  />
                  <YAxis 
                    tickFormatter={(value) => '$' + (value / 1000).toFixed(1) + 'k'} 
                    tick={{ fontSize: 11 }}
                    domain={['dataMin - 200', 'dataMax + 200']}
                  />
                  <Tooltip
                    formatter={(value) => ['$' + Number(value).toLocaleString(), 'Portfolio']}
                    labelFormatter={(label) => 'Day ' + label}
                    contentStyle={{ fontSize: 12 }}
                  />
                  <ReferenceLine y={initialBalance} stroke="#9ca3af" strokeDasharray="5 5" />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke={marketColor} 
                    strokeWidth={2}
                    dot={(props) => {
                      const { cx, cy, payload } = props
                      if (payload.action === 'buy') {
                        return <circle cx={cx} cy={cy} r={5} fill="#22c55e" stroke="#fff" strokeWidth={2} />
                      }
                      if (payload.action === 'sell') {
                        return <circle cx={cx} cy={cy} r={5} fill="#ef4444" stroke="#fff" strokeWidth={2} />
                      }
                      return <circle cx={cx} cy={cy} r={2} fill={marketColor} />
                    }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-6 mt-2 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-full bg-green-500"></span> Buy
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-full bg-red-500"></span> Sell
              </span>
              <span className="flex items-center gap-1">
                <span className="w-6 border-t-2 border-dashed border-gray-400"></span> Initial Balance
              </span>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-3">Cumulative P&L (%)</h3>
            <div className="[&_svg]:outline-none [&_*]:outline-none">
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={pnlChartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="day" 
                    tick={{ fontSize: 11 }}
                    label={{ value: 'Day', position: 'insideBottom', offset: -5, fontSize: 11 }}
                  />
                  <YAxis 
                    tickFormatter={(value) => value + '%'} 
                    tick={{ fontSize: 11 }}
                  />
                  <Tooltip
                    formatter={(value) => [value + '%', 'P&L']}
                    labelFormatter={(label) => 'Day ' + label}
                    contentStyle={{ fontSize: 12 }}
                  />
                  <ReferenceLine y={0} stroke="#9ca3af" strokeDasharray="5 5" />
                  <Line 
                    type="monotone" 
                    dataKey="pnlPct" 
                    stroke={marketColor}
                    strokeWidth={2}
                    dot={(props) => {
                      const { cx, cy, payload } = props
                      if (payload.action === 'buy') {
                        return <circle cx={cx} cy={cy} r={4} fill="#22c55e" stroke="#fff" strokeWidth={1} />
                      }
                      if (payload.action === 'sell') {
                        return <circle cx={cx} cy={cy} r={4} fill="#ef4444" stroke="#fff" strokeWidth={1} />
                      }
                      return null
                    }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      ) : (
        <div className="bg-gray-50 rounded-lg p-8 text-center text-gray-500">
          <p>Daily trading data not available for this run.</p>
          <p className="text-sm mt-2">Run a new benchmark with --save to see detailed charts.</p>
        </div>
      )}

      <div>
        <h3 className="text-sm font-medium text-gray-500 mb-3">Run History</h3>
        <div className="[&_svg]:outline-none [&_*]:outline-none">
          <ResponsiveContainer width="100%" height={150}>
            <LineChart 
              data={runs.map((r, i) => ({
                run: runs.length - i,
                return: Number(r.return_pct.toFixed(2)),
                date: new Date(r.finished_at).toLocaleDateString(),
              })).reverse()} 
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="run" tick={{ fontSize: 11 }} label={{ value: 'Run #', position: 'insideBottom', offset: -5, fontSize: 11 }} />
              <YAxis tickFormatter={(value) => value + '%'} tick={{ fontSize: 11 }} />
              <Tooltip
                formatter={(value) => [value + '%', 'Return']}
                labelFormatter={(label) => 'Run #' + label}
                contentStyle={{ fontSize: 12 }}
              />
              <ReferenceLine y={0} stroke="#9ca3af" strokeDasharray="5 5" />
              <Line 
                type="monotone" 
                dataKey="return" 
                stroke={marketColor}
                strokeWidth={2}
                dot={{ fill: marketColor, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
