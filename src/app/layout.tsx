import './globals.css'
import { Inter } from 'next/font/google'
import { ViewProvider } from '@/lib/view-context'
import { Header } from '@/components/layout/header'
import { Sidebar } from '@/components/sidebar/sidebar'
import { MobileLayout } from '@/components/mobile/mobile-layout'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'PhotoPro Essentials',
  description: 'Essential documentation for photographers',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: 'no'
  }
}

function DesktopLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col">
      <Header>{children}</Header>
      <div className="flex-1 flex">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </head>
      <body className={inter.className}>
        <ViewProvider>
          <ClientLayout>
            {children}
          </ClientLayout>
        </ViewProvider>
      </body>
    </html>
  )
}

'use client'
function ClientLayout({ children }: { children: React.ReactNode }) {
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;
  
  if (isMobile) {
    return <MobileLayout>{children}</MobileLayout>;
  }

  return <DesktopLayout>{children}</DesktopLayout>;
} 