import { Metadata, Viewport } from 'next'

export const metadata: Metadata = {
  title: 'Cliente - VendedoresApp',
  description: 'Encuentra vendedores cercanos y realiza pedidos',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function ClienteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
