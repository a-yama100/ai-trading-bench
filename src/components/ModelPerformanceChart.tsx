"use client"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'

interface PerformanceData {
  category: string
  categoryName: string
  returnPct: number
  totalTrades: number
  winningTrades: number
}

interface ModelPerformanceChartProps {
  data: PerformanceData[]
}

export function ModelPerformanceChart({ data }: ModelPerformanceChartProps) {
  if (data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center bg-gray-100 rounded text-gray-400">
        No benchmark data available for this model.
      </div>
    )
  }

  const chartData = data.map(d => ({
    name: d.categoryName,
    return: Number(d.returnPct.toFixed(2)),
  }))

  const getBarColor = (value: number) => {
    if (value > 0) return '#22c55e'
    if (value < 0) return '#ef4444'
    return '#9ca3af'
  }

  return (
    <div className="[&_svg]:outline-none [&_*]:outline-none">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
          <YAxis
            tickFormatter={(value) => value + '%'}
            tick={{ fontSize: 12 }}
          />
          <Tooltip
            formatter={(value) => [value + '%', 'Return']}
            contentStyle={{ fontSize: 12 }}
          />
          <Bar dataKey="return" radius={[4, 4, 0, 0]}>
            {chartData.map((entry, index) => (
              <Cell key={index} fill={getBarColor(entry.return)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
