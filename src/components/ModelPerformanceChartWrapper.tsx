"use client"

import { ModelPerformanceChart } from './ModelPerformanceChart'
import type { Lang } from '@/lib/content'

interface PerformanceData {
  category: string
  categoryName: string
  returnPct: number
  totalTrades: number
  winningTrades: number
}

interface Props {
  data: PerformanceData[]
  lang: Lang
}

export function ModelPerformanceChartWrapper({ data, lang }: Props) {
  return <ModelPerformanceChart data={data} lang={lang} />
}
