import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios'
import { refreshToken } from './auth'

// Base URL - you can use environment variable
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://185.53.142.30:8085'

// Flag to prevent multiple refresh attempts
let isRefreshing = false
let failedQueue: Array<{
  resolve: (value?: any) => void
  reject: (error?: any) => void
}> = []

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })
  failedQueue = []
}

// Create axios instance
const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds
})

// Request interceptor - for adding token and other headers
apiClient.interceptors.request.use(
  (config) => {
    // If token exists in localStorage, add it to the header
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor - for handling errors and token refresh
apiClient.interceptors.response.use(
  (response) => {
    return response
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

    // Handle common errors
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response
      
      if (status === 401 && originalRequest && !originalRequest._retry) {
        // Don't try to refresh token for login/register endpoints
        const isAuthEndpoint = originalRequest.url?.includes('/api/Auth/Login') || 
                                originalRequest.url?.includes('/api/Auth/Register')
        
        if (isAuthEndpoint) {
          // For login/register, return error directly from API
          return Promise.reject({
            message: (data as any)?.message || error.message,
            status,
            data: data,
          })
        }

        // Unauthorized - try to refresh token
        if (typeof window === 'undefined') {
          return Promise.reject({
            message: (data as any)?.message || error.message,
            status,
            data: data,
          })
        }

        // If already refreshing, queue this request
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject })
          })
            .then((token) => {
              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${token}`
              }
              return apiClient(originalRequest)
            })
            .catch((err) => {
              return Promise.reject(err)
            })
        }

        originalRequest._retry = true
        isRefreshing = true

        const currentToken = localStorage.getItem('token')
        const refreshTokenValue = localStorage.getItem('refreshToken')

        // If no refresh token, logout
        if (!refreshTokenValue || !currentToken) {
          localStorage.removeItem('token')
          localStorage.removeItem('user')
          localStorage.removeItem('refreshToken')
          localStorage.removeItem('tokenExpiry')
          processQueue(new Error('No refresh token'), null)
          isRefreshing = false
          
          if (!window.location.pathname.includes('/login')) {
            window.location.href = '/login'
          }
          return Promise.reject({
            message: (data as any)?.message || 'Session expired. Please login again.',
            status: 401,
            data: data,
          })
        }

        try {
          // Try to refresh token
          const response = await refreshToken({
            token: currentToken,
            refreshToken: refreshTokenValue,
          })

          if (response.isSuccess && response.token) {
            // Save new token
            localStorage.setItem('token', response.token)
            if (response.expireIn) {
              localStorage.setItem('tokenExpiry', response.expireIn)
            }
            if (response.data) {
              localStorage.setItem('user', JSON.stringify(response.data))
            }

            // Update authorization header
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${response.token}`
            }

            // Process queued requests
            processQueue(null, response.token)
            isRefreshing = false

            // Retry original request
            return apiClient(originalRequest)
          } else {
            throw new Error('Token refresh failed')
          }
        } catch (refreshError) {
          // Refresh failed, logout user
          localStorage.removeItem('token')
          localStorage.removeItem('user')
          localStorage.removeItem('refreshToken')
          localStorage.removeItem('tokenExpiry')
          processQueue(refreshError, null)
          isRefreshing = false

          if (!window.location.pathname.includes('/login')) {
            window.location.href = '/login'
          }
          return Promise.reject({
            message: (data as any)?.message || 'Session expired. Please login again.',
            status: 401,
            data: data,
          })
        }
      }
      
      // You can add more error handling here
      // Return error message from API response
      return Promise.reject({
        message: (data as any)?.message || error.message,
        status,
        data: data,
      })
    } else if (error.request) {
      // Request was made but no response received
      return Promise.reject({
        message: 'Network error. Please check your connection.',
        status: 0,
      })
    } else {
      // Something else happened
      return Promise.reject({
        message: error.message || 'An unexpected error occurred',
        status: 0,
      })
    }
  }
)

export default apiClient

