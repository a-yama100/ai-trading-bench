import '../globals.css'
import { RootShell, rootMetadata } from '@/components/RootShell'

export const metadata = rootMetadata('ja')

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <RootShell lang="ja">{children}</RootShell>
}
