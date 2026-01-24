'use client'

import { useState } from 'react'
import { Search, MapPin, Euro, TrendingUp } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function SearchPanel() {
  const router = useRouter()
  const [location, setLocation] = useState('')
  const [budget, setBudget] = useState({ min: '', max: '' })
  const [targetROI, setTargetROI] = useState('7')

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (location) params.set('location', location)
    if (budget.min) params.set('minPrice', budget.min)
    if (budget.max) params.set('maxPrice', budget.max)
    if (targetROI) params.set('targetROI', targetROI)
    router.push(`/explore?${params.toString()}`)
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
            <MapPin className="w-4 h-4 inline mr-1" />
            Location
          </label>
          <input
            type="text"
            placeholder="Neighborhood or address"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
            <Euro className="w-4 h-4 inline mr-1" />
            Budget (€)
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Min"
              value={budget.min}
              onChange={(e) => setBudget({ ...budget, min: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
            />
            <input
              type="number"
              placeholder="Max"
              value={budget.max}
              onChange={(e) => setBudget({ ...budget, max: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
            />
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
            <TrendingUp className="w-4 h-4 inline mr-1" />
            Target ROI (%)
          </label>
          <div className="flex items-center gap-2">
            <input
              type="range"
              min="5"
              max="12"
              step="0.5"
              value={targetROI}
              onChange={(e) => setTargetROI(e.target.value)}
              className="flex-1"
            />
            <span className="text-sm font-semibold text-gray-900 min-w-[3rem]">{targetROI}%</span>
          </div>
        </div>
      </div>
      <button
        onClick={handleSearch}
        className="mt-6 w-full bg-gray-900 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-gray-800 transition flex items-center justify-center gap-2 text-sm"
      >
        <Search className="w-4 h-4" />
        Search Properties
      </button>
    </div>
  )
}

