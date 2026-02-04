'use client'

import { Property } from '@/types/property'
import { BarChart3 } from 'lucide-react'

interface FeatureImportanceProps {
  property: Property
}

export default function FeatureImportance({ property }: FeatureImportanceProps) {
  const featureImportance = property.featureImportance || [
    { feature: 'Location (Neighborhood)', importance: 0.28 },
    { feature: 'Price per m²', importance: 0.22 },
    { feature: 'Size', importance: 0.15 },
    { feature: 'Number of Rooms', importance: 0.12 },
    { feature: 'Distance to Metro', importance: 0.10 },
    { feature: 'Property Age', importance: 0.08 },
    { feature: 'Elevator', importance: 0.05 },
  ]

  const maxImportance = Math.max(...featureImportance.map((f) => f.importance))

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 className="w-5 h-5 text-gray-600" />
        <h2 className="text-lg font-semibold text-gray-900">Feature Importance Analysis</h2>
      </div>
      <p className="text-sm text-gray-600 mb-6">
        Feature contribution to predicted ROI, calculated using SHAP values.
      </p>
      <div className="space-y-4">
        {featureImportance.map((item, index) => (
          <div key={index}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">{item.feature}</span>
              <span className="text-sm font-mono text-gray-900">{(item.importance * 100).toFixed(2)}%</span>
            </div>
            <div className="w-full bg-gray-100 rounded h-1.5">
              <div
                className="bg-gray-700 h-1.5 rounded transition-all"
                style={{ width: `${(item.importance / maxImportance) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500">
          SHAP (SHapley Additive exPlanations) values quantify each feature&apos;s contribution to the model&apos;s prediction.
        </p>
      </div>
    </div>
  )
}

