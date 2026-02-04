'use client'

import Link from 'next/link'
import { Menu, X, LogOut } from 'lucide-react'
import { useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  // Hide header on auth pages
  const authPages = ['/login', '/register', '/forgot-password']
  const normalizePath = (path: string): string => {
    return path.replace(/\/$/, '') || '/'
  }
  const isAuthPage = pathname ? authPages.some(route => normalizePath(pathname) === normalizePath(route)) : false

  // Check if user is logged in
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token')
      setIsLoggedIn(!!token && token !== 'undefined' && token !== 'null')
    }
  }, [pathname])

  // Handle logout
  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('tokenExpiry')
      router.push('/login')
    }
  }

  const navItems = [
    { href: '/', label: 'Dashboard' },
    { href: '/explore', label: 'Explore' },
    { href: '/analytics', label: 'Analytics' },
    { href: '/portfolio', label: 'Portfolio' },
    { href: '/methodology', label: 'Methodology' },
    { href: '/help', label: 'Help' },
    { href: '/admin', label: 'Admin' },
  ]

  // Don't render header on auth pages
  if (isAuthPage) {
    return null
  }

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-7 h-7 bg-primary-600 rounded flex items-center justify-center">
              <span className="text-white font-semibold text-sm">M</span>
            </div>
            <span className="font-semibold text-base text-gray-900">Real Estate Platform</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  pathname === item.href
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center space-x-3">
            {isLoggedIn && (
              <button
                onClick={handleLogout}
                className="hidden md:flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            )}
            <button
              className="md:hidden p-2 text-gray-600 hover:text-gray-900"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-3 border-t border-gray-200">
            <nav className="flex flex-col space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    pathname === item.href
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              {isLoggedIn && (
                <button
                  onClick={() => {
                    setIsMenuOpen(false)
                    handleLogout()
                  }}
                  className="px-3 py-2 rounded-md text-sm font-medium text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

