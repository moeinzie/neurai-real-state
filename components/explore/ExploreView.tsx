'use client'

import { useState, useMemo, useEffect } from 'react'
import PropertyList from './PropertyList'
import FilterPanel from './FilterPanel'
import { mockProperties } from '@/lib/mockData'
import { Property, PropertyFilters } from '@/types/property'
import { Filter, X, BarChart3, LayoutPanelLeft, Map, ListChecks } from 'lucide-react'

export default function ExploreView() {
  const [filters, setFilters] = useState<PropertyFilters>({})
  const [selectedProperty, setSelectedProperty] = useState<string | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map')
  const [showClusterLayers, setShowClusterLayers] = useState(false)
  const [PropertyMap, setPropertyMap] = useState<any>(null)
  const [isMapLoading, setIsMapLoading] = useState(true)

  // Load PropertyMap only on client side for static export compatibility
  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('./PropertyMap').then((module) => {
        setPropertyMap(() => module.default)
        setIsMapLoading(false)
      }).catch((error) => {
        console.error('Failed to load PropertyMap:', error)
        setIsMapLoading(false)
      })
    }
  }, [])

  const filteredProperties = useMemo(() => {
    let result = [...mockProperties]

    if (filters.budget?.min) {
      result = result.filter((p) => p.price >= filters.budget!.min!)
    }
    if (filters.budget?.max) {
      result = result.filter((p) => p.price <= filters.budget!.max!)
    }

    if (filters.targetROI) {
      result = result.filter((p) => p.predictedROI >= filters.targetROI!)
    }
    if (filters.roiRange?.min) {
      result = result.filter((p) => p.predictedROI >= filters.roiRange!.min!)
    }
    if (filters.roiRange?.max) {
      result = result.filter((p) => p.predictedROI <= filters.roiRange!.max!)
    }

    if (filters.size?.min) {
      result = result.filter((p) => p.size >= filters.size!.min!)
    }
    if (filters.size?.max) {
      result = result.filter((p) => p.size <= filters.size!.max!)
    }

    if (filters.rooms?.min) {
      result = result.filter((p) => p.rooms >= filters.rooms!.min!)
    }
    if (filters.rooms?.max) {
      result = result.filter((p) => p.rooms <= filters.rooms!.max!)
    }

    if (filters.pricePerSqm?.min) {
      result = result.filter((p) => p.pricePerSqm >= filters.pricePerSqm!.min!)
    }
    if (filters.pricePerSqm?.max) {
      result = result.filter((p) => p.pricePerSqm <= filters.pricePerSqm!.max!)
    }

    if (filters.propertyType && filters.propertyType.length > 0) {
      result = result.filter((p) => filters.propertyType!.includes(p.propertyType))
    }

    if (filters.minArbitrageScore) {
      result = result.filter((p) => p.arbitrageScore >= filters.minArbitrageScore!)
    }

    if (filters.riskLevels && filters.riskLevels.length > 0) {
      result = result.filter((p) => filters.riskLevels!.includes(p.riskIndicator))
    } else if (filters.maxRisk) {
      const riskOrder = { low: 1, medium: 2, high: 3 }
      const maxRiskLevel = riskOrder[filters.maxRisk]
      result = result.filter((p) => riskOrder[p.riskIndicator] <= maxRiskLevel)
    }

    if (filters.features && filters.features.length > 0) {
      result = result.filter((p) => {
        return filters.features!.every((feature) => {
          const featureKey = feature as keyof Property
          return p[featureKey] === true
        })
      })
    }

    if (filters.location?.neighborhood) {
      const searchTerm = filters.location.neighborhood.toLowerCase()
      result = result.filter((p) => p.neighborhood.toLowerCase().includes(searchTerm))
    }

    if (filters.clusters && filters.clusters.length > 0) {
      result = result.filter((p) => p.clusterId && filters.clusters!.includes(p.clusterId))
    }

    const sortBy = filters.sortBy || 'arbitrageScore'
    switch (sortBy) {
      case 'arbitrageScore':
        result.sort((a, b) => b.arbitrageScore - a.arbitrageScore)
        break
      case 'predictedROI':
        result.sort((a, b) => b.predictedROI - a.predictedROI)
        break
      case 'price':
        result.sort((a, b) => a.price - b.price)
        break
      case 'pricePerSqm':
        result.sort((a, b) => a.pricePerSqm - b.pricePerSqm)
        break
      case 'size':
        result.sort((a, b) => b.size - a.size)
        break
      default:
        result.sort((a, b) => b.arbitrageScore - a.arbitrageScore)
    }

    return result
  }, [filters])

  const summary = useMemo(() => {
    if (filteredProperties.length === 0) {
      return {
        count: 0,
        avgROI: 0,
        avgArbitrage: 0,
      }
    }

    const totalROI = filteredProperties.reduce((sum, p) => sum + p.predictedROI, 0)
    const totalArbitrage = filteredProperties.reduce((sum, p) => sum + p.arbitrageScore, 0)

    return {
      count: filteredProperties.length,
      avgROI: totalROI / filteredProperties.length,
      avgArbitrage: totalArbitrage / filteredProperties.length,
    }
  }, [filteredProperties])

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 flex">
      <div className="hidden lg:block border-r border-gray-200 bg-white">
        <FilterPanel filters={filters} onFiltersChange={setFilters} />
      </div>

      <div className="flex-1 flex flex-col">
        <div className="border-b border-gray-200 bg-white">
          <div className="px-4 py-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center">
                <LayoutPanelLeft className="w-4 h-4 text-gray-600" />
              </div>
              <div>
                <h1 className="text-sm font-semibold text-gray-900">Explore Opportunities</h1>
                <p className="text-xs text-gray-500">
                  Filter and prioritize investment candidates based on arbitrage and ROI.
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden inline-flex items-center gap-2 px-3 py-2 text-xs font-medium text-gray-700 border border-gray-300 rounded-lg bg-white"
            >
              <Filter className="w-4 h-4" />
              Filters
            </button>
          </div>

          <div className="px-4 pb-3">
            <div className="grid grid-cols-3 gap-3 text-xs">
              <div className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-gray-600">Candidates</span>
                  <ListChecks className="w-3.5 h-3.5 text-gray-400" />
                </div>
                <p className="text-sm font-semibold text-gray-900">{summary.count}</p>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-gray-600">Avg. ROI</span>
                  <BarChart3 className="w-3.5 h-3.5 text-gray-400" />
                </div>
                <p className="text-sm font-semibold text-gray-900">
                  {summary.count ? `${summary.avgROI.toFixed(1)}%` : '–'}
                </p>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-gray-600">Avg. Score</span>
                  <Map className="w-3.5 h-3.5 text-gray-400" />
                </div>
                <p className="text-sm font-semibold text-gray-900">
                  {summary.count ? summary.avgArbitrage.toFixed(2) : '–'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {showFilters && (
          <>
            <div
              className="lg:hidden fixed inset-0 bg-black/40 z-30"
              onClick={() => setShowFilters(false)}
            />
            <div className="lg:hidden fixed left-0 top-0 bottom-0 w-full sm:w-80 bg-white z-40 overflow-y-auto shadow-xl">
              <div className="p-4 flex items-center justify-between border-b sticky top-0 bg-white z-10">
                <h2 className="text-sm font-semibold text-gray-900">Filters</h2>
                <button onClick={() => setShowFilters(false)} className="p-1.5 rounded hover:bg-gray-100">
                  <X className="w-4 h-4 text-gray-600" />
                </button>
              </div>
              <FilterPanel filters={filters} onFiltersChange={setFilters} />
            </div>
          </>
        )}

        <div className="flex-1 flex flex-col">
          <div className="lg:hidden flex border-b border-gray-200 bg-gray-50">
            <button
              onClick={() => setViewMode('map')}
              className={`flex-1 px-3 py-2 text-xs font-medium flex items-center justify-center gap-1 ${
                viewMode === 'map'
                  ? 'bg-white text-gray-900 border-b-2 border-gray-900'
                  : 'text-gray-600'
              }`}
            >
              <Map className="w-3.5 h-3.5" />
              Map
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`flex-1 px-3 py-2 text-xs font-medium flex items-center justify-center gap-1 ${
                viewMode === 'list'
                  ? 'bg-white text-gray-900 border-b-2 border-gray-900'
                  : 'text-gray-600'
              }`}
            >
              <ListChecks className="w-3.5 h-3.5" />
              List ({filteredProperties.length})
            </button>
          </div>

          <div className="hidden lg:flex flex-1">
            <div className="flex-1 relative">
              <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2">
                <button
                  onClick={() => setShowClusterLayers(!showClusterLayers)}
                  className={`px-3 py-2 text-xs font-medium rounded-lg shadow-md transition-colors ${
                    showClusterLayers
                      ? 'bg-primary-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {showClusterLayers ? 'Hide' : 'Show'} Clusters
                </button>
              </div>
              {isMapLoading || !PropertyMap ? (
                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-2"></div>
                    <p className="text-sm text-gray-600">Loading map...</p>
                  </div>
                </div>
              ) : (
                <PropertyMap
                  properties={filteredProperties}
                  selectedProperty={selectedProperty}
                  onPropertySelect={setSelectedProperty}
                  showClusterLayers={showClusterLayers}
                  selectedClusters={filters.clusters || []}
                />
              )}
            </div>
            <div className="w-[360px] border-l border-gray-200 bg-white overflow-hidden">
              <PropertyList
                properties={filteredProperties}
                selectedProperty={selectedProperty}
                onPropertySelect={setSelectedProperty}
              />
            </div>
          </div>

          <div className="lg:hidden flex-1 relative">
            {viewMode === 'map' ? (
              <>
                <div className="absolute top-4 right-4 z-[1000]">
                  <button
                    onClick={() => setShowClusterLayers(!showClusterLayers)}
                    className={`px-3 py-2 text-xs font-medium rounded-lg shadow-md transition-colors ${
                      showClusterLayers
                        ? 'bg-primary-600 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {showClusterLayers ? 'Hide' : 'Show'} Clusters
                  </button>
                </div>
                {isMapLoading || !PropertyMap ? (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-2"></div>
                      <p className="text-sm text-gray-600">Loading map...</p>
                    </div>
                  </div>
                ) : (
                  <PropertyMap
                    properties={filteredProperties}
                    selectedProperty={selectedProperty}
                    onPropertySelect={setSelectedProperty}
                    showClusterLayers={showClusterLayers}
                    selectedClusters={filters.clusters || []}
                  />
                )}
              </>
            ) : (
              <PropertyList
                properties={filteredProperties}
                selectedProperty={selectedProperty}
                onPropertySelect={setSelectedProperty}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

