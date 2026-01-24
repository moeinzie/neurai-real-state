'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'
import { mockProperties } from '@/lib/mockData'
import { TrendingUp, Trash2, Download, Share2, Search, BarChart3, Home, Building2, Eye } from 'lucide-react'
import Link from 'next/link'
import { Property } from '@/types/property'
import AlertSystem from './AlertSystem'
import ScenarioSimulator from './ScenarioSimulator'

export default function PortfolioView() {
  const [trackedProperties] = useState<Property[]>(mockProperties.slice(0, 3))
  const [savedSearches] = useState([
    { id: '1', name: 'High ROI Apartments', count: 45, date: '2024-01-15' },
    { id: '2', name: 'Top 5% Opportunities', count: 12, date: '2024-01-20' },
    { id: '3', name: 'Budget Studios', count: 28, date: '2024-01-22' },
  ])

  const propertyTypeStats = useMemo(() => {
    const stats = trackedProperties.reduce((acc, property) => {
      acc[property.propertyType] = (acc[property.propertyType] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    return stats
  }, [trackedProperties])

  const searchStats = useMemo(() => {
    return {
      totalSearches: savedSearches.length,
      totalMatches: savedSearches.reduce((sum, s) => sum + s.count, 0),
      averageMatches: Math.round(savedSearches.reduce((sum, s) => sum + s.count, 0) / savedSearches.length),
    }
  }, [savedSearches])

  const getPropertyTypeIcon = (type: string) => {
    switch (type) {
      case 'apartment':
        return <Building2 className="w-4 h-4" />
      case 'house':
        return <Home className="w-4 h-4" />
      case 'studio':
        return <Building2 className="w-4 h-4" />
      default:
        return <Home className="w-4 h-4" />
    }
  }

  const getPropertyTypeLabel = (type: string) => {
    switch (type) {
      case 'apartment':
        return 'Apartment'
      case 'house':
        return 'House'
      case 'studio':
        return 'Studio'
      default:
        return type
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6 md:py-8">
        <div className="mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">Portfolio</h1>
              <p className="text-gray-600 text-sm">Track and monitor your properties and search activities</p>
            </div>
            <div className="flex gap-2 mt-4 md:mt-0">
              <button className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-primary-300 transition-colors flex items-center gap-1.5">
                <Download className="w-4 h-4" />
                Export
              </button>
              <button className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-primary-300 transition-colors flex items-center gap-1.5">
                <Share2 className="w-4 h-4" />
                Share
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Tracked Properties</span>
              <Eye className="w-4 h-4 text-gray-400" />
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-semibold text-gray-900">{trackedProperties.length}</p>
              <p className="text-sm text-gray-600">Active properties</p>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Search Matches</span>
              <BarChart3 className="w-4 h-4 text-gray-400" />
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-semibold text-gray-900">{searchStats.totalMatches}</p>
              <p className="text-sm text-gray-600">{searchStats.totalSearches} total searches</p>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Avg. ROI</span>
              <TrendingUp className="w-4 h-4 text-gray-400" />
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-semibold text-gray-900">
                {(trackedProperties.reduce((sum, p) => sum + p.predictedROI, 0) / trackedProperties.length).toFixed(1)}%
              </p>
              <p className="text-sm text-gray-600">Average return</p>
            </div>
          </div>
        </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <Building2 className="w-5 h-5 text-gray-600" />
              <h2 className="text-lg font-semibold text-gray-900">Tracked Properties</h2>
            </div>
            <div className="space-y-4">
              {trackedProperties.map((property) => (
                <div
                  key={property.id}
                  className="border border-gray-200 rounded-lg p-4 hover:border-primary-300 hover:shadow-sm transition-all"
                >
                  <div className="flex gap-4">
                    {property.images && property.images.length > 0 && (
                      <div className="flex-shrink-0 relative w-24 h-24 rounded-lg overflow-hidden border border-gray-200">
                        <Image
                          src={property.images[0]}
                          alt={property.address}
                          fill
                          className="object-cover"
                          sizes="96px"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1 min-w-0">
                          <Link href={`/property/${property.id}`}>
                            <h3 className="font-semibold text-gray-900 hover:text-primary-600 line-clamp-1 text-base md:text-lg transition-colors">
                              {property.address}
                            </h3>
                          </Link>
                          <p className="text-sm text-gray-500 mt-1">{property.neighborhood}</p>
                        </div>
                        <button className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <div className="space-y-1">
                          <p className="text-xl md:text-2xl font-bold text-gray-900">
                            €{property.price.toLocaleString()}
                          </p>
                          <p className="text-sm text-gray-600">
                            {property.size} m² • {property.rooms} rooms • {getPropertyTypeLabel(property.propertyType)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-semibold text-primary-600 flex items-center justify-end gap-1">
                            <TrendingUp className="w-4 h-4" />
                            {property.predictedROI}%
                          </p>
                          <p className="text-xs text-gray-500">Score: {property.arbitrageScore.toFixed(2)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <ScenarioSimulator properties={trackedProperties} />

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <Search className="w-5 h-5 text-gray-600" />
              <h2 className="text-lg font-semibold text-gray-900">Search History</h2>
            </div>
            <div className="space-y-3">
              {savedSearches.map((search) => (
                <div
                  key={search.id}
                  className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm text-gray-700 font-medium">{search.name}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span>{search.count} matches</span>
                      <span>•</span>
                      <span>{new Date(search.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link
                      href={`/explore?search=${search.id}`}
                      className="px-3 py-1.5 text-xs font-medium text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded transition-colors"
                    >
                      View
                    </Link>
                    <button className="p-1.5 text-gray-400 hover:text-red-600 rounded transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="w-5 h-5 text-gray-600" />
              <h2 className="text-lg font-semibold text-gray-900">Property Types</h2>
            </div>
            <div className="space-y-4">
              {Object.entries(propertyTypeStats).map(([type, count]) => (
                <div key={type} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-100 rounded-lg text-gray-600">
                      {getPropertyTypeIcon(type)}
                    </div>
                    <span className="text-sm font-medium text-gray-700">{getPropertyTypeLabel(type)}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-gray-900 min-w-[20px] text-right">{count}</span>
                    <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary-600 rounded-full transition-all duration-300"
                        style={{ width: `${(count / trackedProperties.length) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="w-5 h-5 text-gray-600" />
              <h2 className="text-lg font-semibold text-gray-900">Search Statistics</h2>
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-600">Total Searches</span>
                  <span className="text-sm font-semibold text-gray-900">{searchStats.totalSearches}</span>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-600">Total Matches</span>
                  <span className="text-sm font-semibold text-gray-900">{searchStats.totalMatches}</span>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-600">Avg. Matches</span>
                  <span className="text-sm font-semibold text-gray-900">{searchStats.averageMatches}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  )
}
