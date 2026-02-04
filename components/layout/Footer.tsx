'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'

export default function Footer() {
  const pathname = usePathname()
  
  // Hide footer on auth pages
  const authPages = ['/login', '/register', '/forgot-password']
  const normalizePath = (path: string): string => {
    return path.replace(/\/$/, '') || '/'
  }
  const isAuthPage = pathname ? authPages.some(route => normalizePath(pathname) === normalizePath(route)) : false

  if (isAuthPage) {
    return null
  }

  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-6">
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Platform</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link href="/" className="hover:text-primary-600">Home</Link></li>
              <li><Link href="/explore" className="hover:text-primary-600">Explore</Link></li>
              <li><Link href="/analytics" className="hover:text-primary-600">Analytics</Link></li>
              <li><Link href="/portfolio" className="hover:text-primary-600">Portfolio</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Resources</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link href="/methodology" className="hover:text-primary-600">Methodology</Link></li>
              <li><Link href="/help" className="hover:text-primary-600">Help & Glossary</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Legal</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="#" className="hover:text-primary-600">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-primary-600">Terms of Service</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Contact</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="#" className="hover:text-primary-600">Support</a></li>
              <li><a href="#" className="hover:text-primary-600">Contact Us</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-200 pt-6 text-center text-sm text-gray-600">
          <p>&copy; {new Date().getFullYear()} Real Estate Platform. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

