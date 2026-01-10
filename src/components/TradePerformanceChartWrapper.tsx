"use client"

import { TradePerformanceChart } from './TradePerformanceChart'

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

interface Props {
  runs: RunData[]
  marketColor: string
}

export function TradePerformanceChartWrapper({ runs, marketColor }: Props) {
  return <TradePerformanceChart runs={runs} marketColor={marketColor} />
}
