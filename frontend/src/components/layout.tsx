import { Toaster } from 'sonner'

type LayoutProps = {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-200">
      <main className="mx-auto">{children}</main>
      <Toaster />
    </div>
  )
}