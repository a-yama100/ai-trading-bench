"use client"

import { ModelPerformanceChart } from './ModelPerformanceChart'

interface PerformanceData {
  category: string
  categoryName: string
  returnPct: number
  totalTrades: number
  winningTrades: number
}

interface Props {
  data: PerformanceData[]
}

export function ModelPerformanceChartWrapper({ data }: Props) {
  return <ModelPerformanceChart data={data} />
}
