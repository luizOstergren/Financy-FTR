import { Header } from '@/components/Header'

type AuthenticatedPageProps = {
  children: React.ReactNode
}

export function AuthenticatedPage({ children }: AuthenticatedPageProps) {
  return (
    <>
      <Header />
      {children}
    </>
  )
}