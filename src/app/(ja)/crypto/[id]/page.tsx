import { MarketModelPage, marketModelMetadata } from '@/components/pages/MarketModelPage'

export const revalidate = 60

interface Props {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params
  return marketModelMetadata('ja', 'crypto', id)
}

export default async function CryptoModelDetailPageJa({ params }: Props) {
  const { id } = await params
  return <MarketModelPage lang="ja" market="crypto" id={id} />
}
