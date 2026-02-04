'use client'

import { useEffect, useState, useRef } from 'react'

interface AuthGuardProps {
  children: React.ReactNode
}

const publicRoutes = ['/login', '/register', '/forgot-password']

// Helper to normalize paths for comparison
const normalizePath = (path: string): string => {
  return path.replace(/\/$/, '') || '/'
}

// Helper to check if path is public
const isPublicRoute = (path: string): boolean => {
  const normalized = normalizePath(path)
  return publicRoutes.some(route => {
    const normalizedRoute = normalizePath(route)
    return normalized === normalizedRoute
  })
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const [isReady, setIsReady] = useState(false)
  const [isAuthorized, setIsAuthorized] = useState(false)
  const hasCheckedRef = useRef(false)

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') {
      return
    }

    // Prevent multiple checks
    if (hasCheckedRef.current) {
      return
    }

    const checkAuth = () => {
      const currentPath = window.location.pathname

      // Check if on public route
      const isPublic = isPublicRoute(currentPath)

      // Get token
      const token = localStorage.getItem('token')
      const validToken = token && token !== 'undefined' && token !== 'null' && token.trim() !== ''

      // If on public route, allow access (no token needed)
      if (isPublic) {
        sessionStorage.removeItem('auth_redirecting')
        hasCheckedRef.current = true
        setIsAuthorized(true)
        setIsReady(true)
        return
      }

      // NOT on public route - MUST have valid token
      if (!validToken) {
        // No token on protected route - redirect to login immediately
        // Mark that we're redirecting to prevent showing content
        sessionStorage.setItem('auth_redirecting', 'true')
        hasCheckedRef.current = true
        
        // Redirect immediately - don't set isAuthorized to true
        window.location.replace('/login')
        return
      }

      // Has valid token on protected route - allow access
      sessionStorage.removeItem('auth_redirecting')
      hasCheckedRef.current = true
      setIsAuthorized(true)
      setIsReady(true)
    }

    checkAuth()
  }, [])

  // Don't render anything until we've checked auth
  if (!isReady) {
    // Check if we're redirecting - if so, show nothing at all
    if (typeof window !== 'undefined') {
      const isRedirecting = sessionStorage.getItem('auth_redirecting')
      if (isRedirecting === 'true') {
        // Don't show anything while redirecting
        return null
      }
    }

    // Show loading only while checking
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <svg className="animate-spin h-8 w-8 text-primary-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Only render children if authorized (has token or on public route)
  if (!isAuthorized) {
    // Not authorized - show nothing (shouldn't reach here if redirect worked)
    return null
  }

  return <>{children}</>
}

