'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useMutation } from '@tanstack/react-query'
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { login, ApiError } from '@/lib/api/auth'

export default function LoginForm() {
  const router = useRouter()
  
  // Check if we're in local development environment
  const isLocal = typeof window !== 'undefined' && 
    (window.location.hostname === 'localhost' || 
     window.location.hostname === '127.0.0.1' ||
     process.env.NODE_ENV === 'development')
  
  const [formData, setFormData] = useState({
    username: isLocal ? 'Admin' : '',
    password: isLocal ? 'Aa@123456' : '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  
  // Update form data when component mounts in local environment
  useEffect(() => {
    if (isLocal) {
      setFormData({
        username: 'Admin',
        password: 'Aa@123456',
      })
    }
  }, [isLocal])

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      // Check if login was successful and token exists
      if (!data.isSuccess) {
        setError(data.message || 'Login failed. Please check your credentials.')
        return
      }

      // Token is in data.data.token
      const token = data.data?.token
      const expireIn = data.data?.expireIn

      if (!token) {
        setError('Token not received from server. Please try again.')
        return
      }

      // Save token and data to localStorage
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('token', token)
          // If refreshToken is not in response, use current token as refreshToken
          const refreshTokenValue = (data.data as any)?.refreshToken || token
          localStorage.setItem('refreshToken', refreshTokenValue)
          if (data.data) {
            localStorage.setItem('user', JSON.stringify(data.data))
          }
          if (expireIn) {
            localStorage.setItem('tokenExpiry', expireIn)
          }
          // Use window.location.href to ensure localStorage is saved before redirect
          // This causes a full page reload which ensures token is available
          window.location.href = '/'
        } catch (error) {
          setError('Failed to save authentication data. Please try again.')
        }
      }
    },
    onError: (error: any) => {
      // Get error message from API response
      const errorMessage = error?.data?.message || error?.message || 'Login failed. Please check your credentials.'
      setError(errorMessage)
    },
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!formData.username || !formData.password) {
      setError('Please fill in all fields')
      return
    }

    loginMutation.mutate({
      username: formData.username,
      password: formData.password,
    })
  }

  const isLoading = loginMutation.isPending

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2 animate-in slide-in-from-top-2">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
            Username
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              required
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="appearance-none relative block w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all sm:text-sm"
              placeholder="Enter your username"
            />
          </div>
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="appearance-none relative block w-full pl-12 pr-12 py-3 border border-gray-300 rounded-lg placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all sm:text-sm"
              placeholder="Enter your password"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-4 flex items-center hover:text-gray-600 transition-colors"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5 text-gray-400" />
              ) : (
                <Eye className="h-5 w-5 text-gray-400" />
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="flex items-center">
        <input
          id="remember-me"
          name="remember-me"
          type="checkbox"
          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded cursor-pointer"
        />
        <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 cursor-pointer">
          Remember me
        </label>
      </div>

      <div>
        <button
          type="submit"
          disabled={isLoading}
          className="group relative w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-semibold rounded-lg text-white bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] transition-all shadow-lg hover:shadow-xl"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Signing in...
            </span>
          ) : (
            'Sign in'
          )}
        </button>
      </div>
    </form>
  )
}

