import { MarketModelPage, marketModelMetadata } from '@/components/pages/MarketModelPage'

export const revalidate = 60

interface Props {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params
  return marketModelMetadata('ja', 'forex', id)
}

export default async function ForexModelDetailPageJa({ params }: Props) {
  const { id } = await params
  return <MarketModelPage lang="ja" market="forex" id={id} />
}
