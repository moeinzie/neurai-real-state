'use client'

import { usePathname } from 'next/navigation'
import Header from './Header'
import Footer from './Footer'

interface PageWrapperProps {
  children: React.ReactNode
}

const authPages = ['/login', '/register', '/forgot-password']

// Helper to normalize paths for comparison
const normalizePath = (path: string): string => {
  return path.replace(/\/$/, '') || '/'
}

// Helper to check if path is auth page
const isAuthPage = (path: string | null): boolean => {
  if (!path) return false
  const normalized = normalizePath(path)
  return authPages.some(route => {
    const normalizedRoute = normalizePath(route)
    return normalized === normalizedRoute
  })
}

export default function PageWrapper({ children }: PageWrapperProps) {
  const pathname = usePathname()
  const isAuth = isAuthPage(pathname)

  // Don't show header/footer on auth pages
  if (isAuth) {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  )
}

