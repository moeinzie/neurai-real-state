import { TrendingUp, Home, Award, BarChart3 } from 'lucide-react'
import { mockStats } from '@/lib/mockData'

export default function StatsStrip() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-white border border-gray-200 rounded-lg p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Average Predicted ROI</span>
          <TrendingUp className="w-4 h-4 text-gray-400" />
        </div>
        <div className="space-y-1">
          <p className="text-2xl font-semibold text-gray-900">{mockStats.averagePredictedROI}%</p>
          <p className="text-sm text-gray-600">Annualized return</p>
        </div>
      </div>
      <div className="bg-white border border-gray-200 rounded-lg p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Active Opportunities</span>
          <Home className="w-4 h-4 text-gray-400" />
        </div>
        <div className="space-y-1">
          <p className="text-2xl font-semibold text-gray-900">{mockStats.activeOpportunities.toLocaleString()}</p>
          <p className="text-sm text-gray-600">Properties available</p>
        </div>
      </div>
      <div className="bg-white border border-gray-200 rounded-lg p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Top 5% Opportunities</span>
          <Award className="w-4 h-4 text-gray-400" />
        </div>
        <div className="space-y-1">
          <p className="text-2xl font-semibold text-gray-900">{mockStats.topPercentileCount}</p>
          <p className="text-sm text-gray-600">High-value investments</p>
        </div>
      </div>
    </div>
  )
}

