import { ModelDetailPage, modelDetailMetadata } from '@/components/pages/ModelDetailPage'

export const revalidate = 60

interface Props {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params
  return modelDetailMetadata('ja', id)
}

export default async function ModelDetailPageJa({ params }: Props) {
  const { id } = await params
  return <ModelDetailPage lang="ja" id={id} />
}
