'use client'

import { useState, useMemo } from 'react'
import { Layers, BarChart3, TrendingUp, MapPin, Building2, Home, Info } from 'lucide-react'
import Link from 'next/link'
import { mockProperties } from '@/lib/mockData'

interface Cluster {
  id: string
  label: string
  description: string
  propertyCount: number
  avgROI: number
  avgArbitrageScore: number
  avgPrice: number
  avgPricePerSqm: number
  commonTypes: string[]
  topNeighborhoods: string[]
}

export default function ClustersPage() {
  // Calculate clusters from mock data
  const clusters = useMemo<Cluster[]>(() => {
    const clusterMap = new Map<string, any[]>()

    mockProperties.forEach((property) => {
      if (property.clusterId) {
        if (!clusterMap.has(property.clusterId)) {
          clusterMap.set(property.clusterId, [])
        }
        clusterMap.get(property.clusterId)!.push(property)
      }
    })

    // Create default clusters if none exist
    if (clusterMap.size === 0) {
      return [
        {
          id: 'cluster-1',
          label: 'Premium High-Value Properties',
          description: 'Top-tier properties with high prices and strong investment potential',
          propertyCount: mockProperties.filter((p) => p.price > 400000).length,
          avgROI: 8.5,
          avgArbitrageScore: 0.92,
          avgPrice: 550000,
          avgPricePerSqm: 6500,
          commonTypes: ['apartment', 'house'],
          topNeighborhoods: ['Salamanca', 'Centro', 'Retiro'],
        },
        {
          id: 'cluster-2',
          label: 'Mid-Range Opportunities',
          description: 'Well-priced properties with good ROI potential',
          propertyCount: mockProperties.filter((p) => p.price >= 250000 && p.price <= 400000).length,
          avgROI: 7.8,
          avgArbitrageScore: 0.85,
          avgPrice: 320000,
          avgPricePerSqm: 4800,
          commonTypes: ['apartment'],
          topNeighborhoods: ['Chamberí', 'Moncloa'],
        },
        {
          id: 'cluster-3',
          label: 'Budget-Friendly Investments',
          description: 'Affordable properties with high arbitrage scores',
          propertyCount: mockProperties.filter((p) => p.price < 250000).length,
          avgROI: 9.2,
          avgArbitrageScore: 0.88,
          avgPrice: 180000,
          avgPricePerSqm: 3500,
          commonTypes: ['studio', 'apartment'],
          topNeighborhoods: ['Centro', 'Moncloa'],
        },
      ]
    }

    return Array.from(clusterMap.entries()).map(([id, properties]) => {
      const avgROI = properties.reduce((sum, p) => sum + p.predictedROI, 0) / properties.length
      const avgArbitrage = properties.reduce((sum, p) => sum + p.arbitrageScore, 0) / properties.length
      const avgPrice = properties.reduce((sum, p) => sum + p.price, 0) / properties.length
      const avgPricePerSqm = properties.reduce((sum, p) => sum + p.pricePerSqm, 0) / properties.length

      const typeCounts = new Map<string, number>()
      const neighborhoodCounts = new Map<string, number>()

      properties.forEach((p) => {
        typeCounts.set(p.propertyType, (typeCounts.get(p.propertyType) || 0) + 1)
        neighborhoodCounts.set(p.neighborhood, (neighborhoodCounts.get(p.neighborhood) || 0) + 1)
      })

      const commonTypes = Array.from(typeCounts.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 2)
        .map(([type]) => type)

      const topNeighborhoods = Array.from(neighborhoodCounts.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([neighborhood]) => neighborhood)

      return {
        id,
        label: properties[0]?.clusterLabel || `Cluster ${id}`,
        description: `Properties with similar characteristics and investment profiles`,
        propertyCount: properties.length,
        avgROI,
        avgArbitrageScore: avgArbitrage,
        avgPrice,
        avgPricePerSqm,
        commonTypes,
        topNeighborhoods,
      }
    })
  }, [])

  const [selectedCluster, setSelectedCluster] = useState<string | null>(null)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b bg-white">
        <div className="container mx-auto px-4 py-6">
          <Link href="/explore" className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-4">
            ← Back to Explore
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
              <Layers className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Cluster Explorer</h1>
              <p className="text-gray-600 mt-1">Explore property clusters and investment patterns</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-gray-500 uppercase">Total Clusters</span>
                <Layers className="w-4 h-4 text-gray-400" />
              </div>
              <p className="text-2xl font-semibold text-gray-900">{clusters.length}</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-gray-500 uppercase">Total Properties</span>
                <Building2 className="w-4 h-4 text-gray-400" />
              </div>
              <p className="text-2xl font-semibold text-gray-900">
                {clusters.reduce((sum, c) => sum + c.propertyCount, 0)}
              </p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-gray-500 uppercase">Avg. ROI</span>
                <TrendingUp className="w-4 h-4 text-gray-400" />
              </div>
              <p className="text-2xl font-semibold text-gray-900">
                {(clusters.reduce((sum, c) => sum + c.avgROI * c.propertyCount, 0) /
                  clusters.reduce((sum, c) => sum + c.propertyCount, 0)).toFixed(1)}%
              </p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-gray-500 uppercase">Avg. Score</span>
                <BarChart3 className="w-4 h-4 text-gray-400" />
              </div>
              <p className="text-2xl font-semibold text-gray-900">
                {(
                  clusters.reduce((sum, c) => sum + c.avgArbitrageScore * c.propertyCount, 0) /
                  clusters.reduce((sum, c) => sum + c.propertyCount, 0)
                ).toFixed(2)}
              </p>
            </div>
          </div>

          {/* Clusters Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {clusters.map((cluster) => (
              <div
                key={cluster.id}
                className={`bg-white border rounded-lg p-6 cursor-pointer transition-all ${
                  selectedCluster === cluster.id
                    ? 'border-primary-500 shadow-lg'
                    : 'border-gray-200 hover:border-primary-300 hover:shadow-md'
                }`}
                onClick={() => setSelectedCluster(selectedCluster === cluster.id ? null : cluster.id)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Layers className="w-5 h-5 text-primary-600" />
                      <h2 className="text-xl font-semibold text-gray-900">{cluster.label}</h2>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">{cluster.description}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Properties</div>
                    <div className="text-lg font-semibold text-gray-900">{cluster.propertyCount}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Avg. ROI</div>
                    <div className="text-lg font-semibold text-primary-600">{cluster.avgROI.toFixed(1)}%</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Avg. Price</div>
                    <div className="text-lg font-semibold text-gray-900">€{Math.round(cluster.avgPrice).toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Arbitrage Score</div>
                    <div className="text-lg font-semibold text-gray-900">{cluster.avgArbitrageScore.toFixed(2)}</div>
                  </div>
                </div>

                {selectedCluster === cluster.id && (
                  <div className="mt-4 pt-4 border-t border-gray-200 space-y-3">
                    <div>
                      <div className="text-xs text-gray-500 mb-2">Common Property Types</div>
                      <div className="flex flex-wrap gap-2">
                        {cluster.commonTypes.map((type) => (
                          <span
                            key={type}
                            className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded capitalize"
                          >
                            {type}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-2">Top Neighborhoods</div>
                      <div className="flex flex-wrap gap-2">
                        {cluster.topNeighborhoods.map((neighborhood) => (
                          <span
                            key={neighborhood}
                            className="px-2 py-1 bg-primary-50 text-primary-700 text-xs rounded flex items-center gap-1"
                          >
                            <MapPin className="w-3 h-3" />
                            {neighborhood}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="pt-2">
                      <Link
                        href={`/explore?clusters=${cluster.id}`}
                        className="inline-flex items-center gap-2 text-sm font-medium text-primary-600 hover:text-primary-700"
                      >
                        View Properties in this Cluster →
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Info Box */}
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-blue-900 mb-2">About Clusters</h3>
                <p className="text-sm text-blue-800">
                  Clusters group properties with similar characteristics, helping identify investment patterns. 
                  You can filter properties by cluster in the Explore view, and cluster layers can be toggled 
                  on the map for visual analysis.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

