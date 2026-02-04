'use client'

import { useState, useEffect } from 'react'
import { Bell, BellRing, X, CheckCircle, AlertCircle, Info } from 'lucide-react'
import { Property } from '@/types/property'

interface Alert {
  id: string
  type: 'new_match' | 'price_change' | 'roi_update' | 'new_opportunity'
  title: string
  message: string
  propertyId?: string
  timestamp: Date
  read: boolean
}

interface AlertSystemProps {
  savedSearches?: Array<{ id: string; name: string; filters: any }>
  savedProperties?: Property[]
}

export default function AlertSystem({ savedSearches = [], savedProperties = [] }: AlertSystemProps) {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [hasUnread, setHasUnread] = useState(false)

  // Mock alerts - in production, these would come from WebSocket or polling
  useEffect(() => {
    const mockAlerts: Alert[] = [
      {
        id: '1',
        type: 'new_match',
        title: 'New Property Matches Your Search',
        message: '5 new properties match your "High ROI Apartments" search criteria',
        timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
        read: false,
      },
      {
        id: '2',
        type: 'price_change',
        title: 'Price Update',
        message: 'Property at Calle Gran Vía 45 has reduced price by 5%',
        propertyId: 'prop-1',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        read: false,
      },
      {
        id: '3',
        type: 'new_opportunity',
        title: 'Top 1% Opportunity Available',
        message: 'A new property with arbitrage score 0.98 is now available',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
        read: true,
      },
    ]

    setAlerts(mockAlerts)
    setHasUnread(mockAlerts.some((a) => !a.read))
  }, [])

  const markAsRead = (alertId: string) => {
    setAlerts((prev) =>
      prev.map((alert) => (alert.id === alertId ? { ...alert, read: true } : alert))
    )
    setHasUnread(alerts.some((a) => a.id !== alertId && !a.read))
  }

  const markAllAsRead = () => {
    setAlerts((prev) => prev.map((alert) => ({ ...alert, read: true })))
    setHasUnread(false)
  }

  const deleteAlert = (alertId: string) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== alertId))
  }

  const getAlertIcon = (type: Alert['type']) => {
    switch (type) {
      case 'new_match':
      case 'new_opportunity':
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'price_change':
        return <AlertCircle className="w-4 h-4 text-yellow-600" />
      case 'roi_update':
        return <Info className="w-4 h-4 text-blue-600" />
      default:
        return <Info className="w-4 h-4 text-gray-600" />
    }
  }

  const formatTime = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    return `${days}d ago`
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
      >
        {hasUnread ? (
          <BellRing className="w-5 h-5" />
        ) : (
          <Bell className="w-5 h-5" />
        )}
        {hasUnread && (
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
        )}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-12 w-96 bg-white border border-gray-200 rounded-lg shadow-xl z-50 max-h-[600px] flex flex-col">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Notifications</h3>
              {alerts.some((a) => !a.read) && (
                <button
                  onClick={markAllAsRead}
                  className="text-xs text-primary-600 hover:text-primary-700"
                >
                  Mark all as read
                </button>
              )}
            </div>
            <div className="flex-1 overflow-y-auto">
              {alerts.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <Bell className="w-12 h-12 mx-auto mb-3 opacity-40" />
                  <p className="text-sm">No notifications</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {alerts.map((alert) => (
                    <div
                      key={alert.id}
                      className={`p-4 hover:bg-gray-50 transition-colors ${
                        !alert.read ? 'bg-blue-50' : ''
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-0.5">{getAlertIcon(alert.type)}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <h4 className="text-sm font-semibold text-gray-900">{alert.title}</h4>
                            <button
                              onClick={() => deleteAlert(alert.id)}
                              className="flex-shrink-0 text-gray-400 hover:text-gray-600"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{alert.message}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500">{formatTime(alert.timestamp)}</span>
                            {!alert.read && (
                              <button
                                onClick={() => markAsRead(alert.id)}
                                className="text-xs text-primary-600 hover:text-primary-700"
                              >
                                Mark as read
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

