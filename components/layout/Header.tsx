'use client'

import Link from 'next/link'
import { User, Menu, X, LogIn } from 'lucide-react'
import { useState } from 'react'
import { usePathname } from 'next/navigation'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()

  // Hide header on auth pages
  const authPages = ['/login', '/register', '/forgot-password']
  const isAuthPage = authPages.includes(pathname)

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
            <Link
              href="/login"
              className="hidden md:flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-md transition-colors"
            >
              <LogIn className="w-4 h-4" />
              Login
            </Link>
            <Link
              href="/register"
              className="hidden md:flex items-center px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-md transition-colors"
            >
              Register
            </Link>
            <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors">
              <User className="w-5 h-5" />
            </button>
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
              <Link
                href="/login"
                onClick={() => setIsMenuOpen(false)}
                className="px-3 py-2 rounded-md text-sm font-medium text-primary-600 hover:bg-primary-50 transition-colors flex items-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                Login
              </Link>
              <Link
                href="/register"
                onClick={() => setIsMenuOpen(false)}
                className="px-3 py-2 rounded-md text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 transition-colors text-center"
              >
                Register
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

