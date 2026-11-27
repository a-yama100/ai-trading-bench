import { ModelDetailPage, modelDetailMetadata } from '@/components/pages/ModelDetailPage'

export const revalidate = 60

interface Props {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params
  return modelDetailMetadata('en', id)
}

export default async function ModelDetailPageEn({ params }: Props) {
  const { id } = await params
  return <ModelDetailPage lang="en" id={id} />
}
