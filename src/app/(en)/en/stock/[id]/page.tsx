import { MarketModelPage, marketModelMetadata } from '@/components/pages/MarketModelPage'

export const revalidate = 60

interface Props {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params
  return marketModelMetadata('en', 'stock', id)
}

export default async function StockModelDetailPageEn({ params }: Props) {
  const { id } = await params
  return <MarketModelPage lang="en" market="stock" id={id} />
}
