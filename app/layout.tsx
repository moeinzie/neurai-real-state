import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import QueryProvider from '@/lib/providers/QueryProvider'
import AuthGuard from '@/lib/auth/authGuard'
import { ToastProvider } from '@/components/ui/Toast'
import PageWrapper from '@/components/layout/PageWrapper'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Madrid Real Estate Investment Platform',
  description: 'Machine-learning enhanced arbitrage opportunities in Madrid real estate market',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <QueryProvider>
          <ToastProvider>
            <AuthGuard>
              <PageWrapper>
                {children}
              </PageWrapper>
            </AuthGuard>
          </ToastProvider>
        </QueryProvider>
      </body>
    </html>
  )
}

