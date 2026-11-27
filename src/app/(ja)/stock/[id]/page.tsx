import { MarketModelPage, marketModelMetadata } from '@/components/pages/MarketModelPage'

export const revalidate = 60

interface Props {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params
  return marketModelMetadata('ja', 'stock', id)
}

export default async function StockModelDetailPageJa({ params }: Props) {
  const { id } = await params
  return <MarketModelPage lang="ja" market="stock" id={id} />
}
