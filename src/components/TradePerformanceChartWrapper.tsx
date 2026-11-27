"use client"

import { TradePerformanceChart } from './TradePerformanceChart'
import type { Lang } from '@/lib/content'

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
  lang: Lang
}

export function TradePerformanceChartWrapper({ runs, marketColor, lang }: Props) {
  return <TradePerformanceChart runs={runs} marketColor={marketColor} lang={lang} />
}
