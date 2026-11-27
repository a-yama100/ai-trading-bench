import { MarketModelPage, marketModelMetadata } from '@/components/pages/MarketModelPage'

export const revalidate = 60

interface Props {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params
  return marketModelMetadata('en', 'crypto', id)
}

export default async function CryptoModelDetailPageEn({ params }: Props) {
  const { id } = await params
  return <MarketModelPage lang="en" market="crypto" id={id} />
}
