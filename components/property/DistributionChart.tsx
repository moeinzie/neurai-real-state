'use client'

import { Property } from '@/types/property'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'
import { BarChart3 } from 'lucide-react'

interface DistributionChartProps {
  property: Property
  neighborhoodData?: { roi: number }[]
  citywideData?: { roi: number }[]
}

export default function DistributionChart({ property, neighborhoodData, citywideData }: DistributionChartProps) {
  // Generate mock distribution data if not provided
  const generateDistribution = (mean: number, count: number = 100) => {
    const bins: Record<string, number> = {}
    for (let i = 0; i < count; i++) {
      // Generate normally distributed values
      const value = mean + (Math.random() - 0.5) * 4
      const bin = Math.round(value * 2) / 2 // Round to nearest 0.5
      const binKey = `${bin.toFixed(1)}%`
      bins[binKey] = (bins[binKey] || 0) + 1
    }
    return Object.entries(bins)
      .map(([range, count]) => ({ range, count }))
      .sort((a, b) => parseFloat(a.range) - parseFloat(b.range))
  }

  const neighborhoodDist = neighborhoodData
    ? generateDistribution(
        neighborhoodData.reduce((sum, d) => sum + d.roi, 0) / neighborhoodData.length,
        neighborhoodData.length
      )
    : generateDistribution(property.predictedROI * 0.9, 50)

  const citywideDist = citywideData
    ? generateDistribution(
        citywideData.reduce((sum, d) => sum + d.roi, 0) / citywideData.length,
        citywideData.length
      )
    : generateDistribution(7.5, 200)

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 className="w-5 h-5 text-gray-600" />
        <h2 className="text-lg font-semibold text-gray-900">ROI Distribution Context</h2>
      </div>
      <p className="text-sm text-gray-600 mb-6">
        This property's predicted ROI compared to neighborhood and citywide distributions.
      </p>

      <div className="space-y-6">
        {/* Neighborhood Distribution */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">Neighborhood Distribution</h3>
          <div className="w-full" style={{ height: '200px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={neighborhoodDist}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="range" tick={{ fill: '#6b7280', fontSize: 12 }} />
                <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <ReferenceLine
                  x={`${property.predictedROI.toFixed(1)}%`}
                  stroke="#10b981"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  label={{ value: 'This Property', position: 'top', fill: '#10b981' }}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Citywide Distribution */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">Citywide Distribution</h3>
          <div className="w-full" style={{ height: '200px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={citywideDist}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="range" tick={{ fill: '#6b7280', fontSize: 12 }} />
                <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="count" fill="#6b7280" radius={[4, 4, 0, 0]} />
                <ReferenceLine
                  x={`${property.predictedROI.toFixed(1)}%`}
                  stroke="#10b981"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  label={{ value: 'This Property', position: 'top', fill: '#10b981' }}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center gap-4 text-xs text-gray-600">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded"></div>
            <span>Neighborhood</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gray-500 rounded"></div>
            <span>Citywide</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 border-2 border-green-500"></div>
            <span>This Property</span>
          </div>
        </div>
      </div>
    </div>
  )
}

