'use client'

import { PropertyFilters } from '@/types/property'
import { Euro, TrendingUp, Home, Filter, X, RotateCcw, SlidersHorizontal, Building2, Layers } from 'lucide-react'
import { useMemo } from 'react'

interface FilterPanelProps {
  filters: PropertyFilters
  onFiltersChange: (filters: PropertyFilters) => void
}

type SortOption = 'arbitrageScore' | 'price' | 'pricePerSqm' | 'predictedROI' | 'size'

export default function FilterPanel({ filters, onFiltersChange }: FilterPanelProps) {
  const updateFilter = (key: keyof PropertyFilters, value: any) => {
    onFiltersChange({ ...filters, [key]: value })
  }

  const updateBudget = (field: 'min' | 'max', value: string) => {
    const budget = filters.budget || {}
    updateFilter('budget', { ...budget, [field]: value ? parseInt(value) : undefined })
  }

  const updateSize = (field: 'min' | 'max', value: string) => {
    const size = filters.size || {}
    updateFilter('size', { ...size, [field]: value ? parseInt(value) : undefined })
  }

  const updateRooms = (field: 'min' | 'max', value: string) => {
    const rooms = filters.rooms || {}
    updateFilter('rooms', { ...rooms, [field]: value ? parseInt(value) : undefined })
  }

  const updateROI = (field: 'min' | 'max', value: string) => {
    const roi = filters.roiRange || {}
    updateFilter('roiRange', { ...roi, [field]: value ? parseFloat(value) : undefined })
  }

  const updatePricePerSqm = (field: 'min' | 'max', value: string) => {
    const pricePerSqm = filters.pricePerSqm || {}
    updateFilter('pricePerSqm', { ...pricePerSqm, [field]: value ? parseInt(value) : undefined })
  }

  const togglePropertyType = (type: 'apartment' | 'house' | 'studio') => {
    const current = filters.propertyType || []
    const updated = current.includes(type)
      ? current.filter((t) => t !== type)
      : [...current, type]
    updateFilter('propertyType', updated.length > 0 ? updated : undefined)
  }

  const toggleRiskLevel = (risk: 'low' | 'medium' | 'high') => {
    const current = filters.riskLevels || []
    const updated = current.includes(risk)
      ? current.filter((r) => r !== risk)
      : [...current, risk]
    updateFilter('riskLevels', updated.length > 0 ? updated : undefined)
  }

  const toggleFeature = (feature: string) => {
    const current = filters.features || []
    const updated = current.includes(feature)
      ? current.filter((f) => f !== feature)
      : [...current, feature]
    updateFilter('features', updated.length > 0 ? updated : undefined)
  }

  const clearAllFilters = () => {
    onFiltersChange({})
  }

  const activeFiltersCount = useMemo(() => {
    let count = 0
    if (filters.budget?.min || filters.budget?.max) count++
    if (filters.targetROI) count++
    if (filters.roiRange?.min || filters.roiRange?.max) count++
    if (filters.size?.min || filters.size?.max) count++
    if (filters.rooms?.min || filters.rooms?.max) count++
    if (filters.pricePerSqm?.min || filters.pricePerSqm?.max) count++
    if (filters.propertyType && filters.propertyType.length > 0) count++
    if (filters.minArbitrageScore) count++
    if (filters.riskLevels && filters.riskLevels.length > 0) count++
    if (filters.maxRisk) count++
    if (filters.features && filters.features.length > 0) count++
    if (filters.clusters && filters.clusters.length > 0) count++
    if (filters.location?.neighborhood) count++
    return count
  }, [filters])

  return (
    <div className="w-full lg:w-80 bg-white border-r border-gray-200 overflow-y-auto flex flex-col h-full">
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
          </div>
          {activeFiltersCount > 0 && (
            <span className="px-2 py-0.5 bg-gray-700 text-white text-xs font-medium rounded">
              {activeFiltersCount}
            </span>
          )}
        </div>
        {activeFiltersCount > 0 && (
          <button
            onClick={clearAllFilters}
            className="flex items-center gap-1 text-xs text-gray-600 hover:text-gray-900 transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            Clear all filters
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Euro className="w-4 h-4 inline mr-1" />
            Budget (€)
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Min"
              value={filters.budget?.min || ''}
              onChange={(e) => updateBudget('min', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            />
            <input
              type="number"
              placeholder="Max"
              value={filters.budget?.max || ''}
              onChange={(e) => updateBudget('max', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <TrendingUp className="w-4 h-4 inline mr-1" />
            ROI Range (%)
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              step="0.1"
              placeholder="Min"
              value={filters.roiRange?.min || ''}
              onChange={(e) => updateROI('min', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 text-sm"
            />
            <input
              type="number"
              step="0.1"
              placeholder="Max"
              value={filters.roiRange?.max || ''}
              onChange={(e) => updateROI('max', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Price per m² (€)
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Min"
              value={filters.pricePerSqm?.min || ''}
              onChange={(e) => updatePricePerSqm('min', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 text-sm"
            />
            <input
              type="number"
              placeholder="Max"
              value={filters.pricePerSqm?.max || ''}
              onChange={(e) => updatePricePerSqm('max', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Number of Rooms
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Min"
              value={filters.rooms?.min || ''}
              onChange={(e) => updateRooms('min', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 text-sm"
            />
            <input
              type="number"
              placeholder="Max"
              value={filters.rooms?.max || ''}
              onChange={(e) => updateRooms('max', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Home className="w-4 h-4 inline mr-1" />
            Size (m²)
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Min"
              value={filters.size?.min || ''}
              onChange={(e) => updateSize('min', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            />
            <input
              type="number"
              placeholder="Max"
              value={filters.size?.max || ''}
              onChange={(e) => updateSize('max', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Property Type</label>
          <div className="space-y-2">
            {(['apartment', 'house', 'studio'] as const).map((type) => (
              <label key={type} className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.propertyType?.includes(type) || false}
                  onChange={() => togglePropertyType(type)}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="ml-2 text-sm text-gray-700 capitalize">{type}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Arbitrage Score</label>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                name="arbitrage"
                checked={!filters.minArbitrageScore}
                onChange={() => updateFilter('minArbitrageScore', undefined)}
                className="text-primary-600 focus:ring-primary-500"
              />
              <span className="ml-2 text-sm text-gray-700">All</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="arbitrage"
                checked={filters.minArbitrageScore === 0.9}
                onChange={() => updateFilter('minArbitrageScore', 0.9)}
                className="text-primary-600 focus:ring-primary-500"
              />
              <span className="ml-2 text-sm text-gray-700">Top 10%</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="arbitrage"
                checked={filters.minArbitrageScore === 0.95}
                onChange={() => updateFilter('minArbitrageScore', 0.95)}
                className="text-primary-600 focus:ring-primary-500"
              />
              <span className="ml-2 text-sm text-gray-700">Top 5%</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="arbitrage"
                checked={filters.minArbitrageScore === 0.99}
                onChange={() => updateFilter('minArbitrageScore', 0.99)}
                className="text-primary-600 focus:ring-primary-500"
              />
              <span className="ml-2 text-sm text-gray-700">Top 1%</span>
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Risk Level</label>
          <div className="space-y-2">
            {(['low', 'medium', 'high'] as const).map((risk) => (
              <label key={risk} className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.riskLevels?.includes(risk) || false}
                  onChange={() => toggleRiskLevel(risk)}
                  className="rounded border-gray-300 text-gray-600 focus:ring-gray-500"
                />
                <span className="ml-2 text-sm text-gray-700 capitalize">{risk}</span>
              </label>
            ))}
          </div>
          {!filters.riskLevels && (
            <select
              value={filters.maxRisk || 'all'}
              onChange={(e) => updateFilter('maxRisk', e.target.value === 'all' ? undefined : e.target.value)}
              className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 text-sm"
            >
              <option value="all">Max Risk: All</option>
              <option value="low">Max Risk: Low</option>
              <option value="medium">Max Risk: Medium</option>
              <option value="high">Max Risk: High</option>
            </select>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Essential Features</label>
          <div className="space-y-2">
            {[
              { key: 'hasElevator', label: 'Elevator' },
              { key: 'hasParking', label: 'Parking' },
              { key: 'hasBalcony', label: 'Balcony' },
              { key: 'hasTerrace', label: 'Terrace' },
              { key: 'hasGarden', label: 'Garden' },
              { key: 'hasAirConditioning', label: 'Air Conditioning' },
              { key: 'hasHeating', label: 'Heating' },
              { key: 'hasSecurity', label: 'Security' },
            ].map((feature) => (
              <label key={feature.key} className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.features?.includes(feature.key) || false}
                  onChange={() => toggleFeature(feature.key)}
                  className="rounded border-gray-300 text-gray-600 focus:ring-gray-500"
                />
                <span className="ml-2 text-sm text-gray-700">{feature.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Building2 className="w-4 h-4 inline mr-1" />
            Neighborhood
          </label>
          <input
            type="text"
            placeholder="Search neighborhood..."
            value={filters.location?.neighborhood || ''}
            onChange={(e) => updateFilter('location', { ...filters.location, neighborhood: e.target.value || undefined })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Layers className="w-4 h-4 inline mr-1" />
            Clusters
          </label>
          <div className="space-y-2">
            {['cluster-1', 'cluster-2', 'cluster-3'].map((clusterId) => {
              const isSelected = filters.clusters?.includes(clusterId) || false
              return (
                <label key={clusterId} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => {
                      const current = filters.clusters || []
                      const updated = isSelected
                        ? current.filter((c) => c !== clusterId)
                        : [...current, clusterId]
                      updateFilter('clusters', updated.length > 0 ? updated : undefined)
                    }}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="ml-2 text-sm text-gray-700 capitalize">
                    {clusterId.replace('cluster-', 'Cluster ')}
                  </span>
                </label>
              )
            })}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Holding Period (months)
          </label>
          <input
            type="number"
            placeholder="e.g., 12, 24, 36"
            min="1"
            max="120"
            value={filters.holdingPeriod || ''}
            onChange={(e) => updateFilter('holdingPeriod', e.target.value ? parseInt(e.target.value) : undefined)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 text-sm"
          />
          <p className="text-xs text-gray-500 mt-1">Expected duration before selling</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
          <select
            value={filters.sortBy || 'arbitrageScore'}
            onChange={(e) => updateFilter('sortBy', e.target.value as SortOption)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 text-sm"
          >
            <option value="arbitrageScore">Arbitrage Score (High to Low)</option>
            <option value="predictedROI">ROI (High to Low)</option>
            <option value="price">Price (Low to High)</option>
            <option value="pricePerSqm">Price per m² (Low to High)</option>
            <option value="size">Size (Large to Small)</option>
          </select>
        </div>
      </div>
    </div>
  )
}

