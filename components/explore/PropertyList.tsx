'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Property } from '@/types/property'
import { MapPin, TrendingUp, Home } from 'lucide-react'

interface PropertyListProps {
  properties: Property[]
  selectedProperty: string | null
  onPropertySelect: (id: string | null) => void
}

export default function PropertyList({ properties, selectedProperty, onPropertySelect }: PropertyListProps) {
  return (
    <div className="h-full flex flex-col">
      <div className="px-4 py-3 border-b bg-white">
        <h2 className="text-sm font-semibold text-gray-900">
          Candidate list
        </h2>
        <p className="text-xs text-gray-500">
          {properties.length} {properties.length === 1 ? 'property' : 'properties'} • ordered by arbitrage score
        </p>
      </div>
      <div className="flex-1 overflow-y-auto bg-gray-50">
        {properties.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <Home className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <p className="text-sm">No properties match the current filters.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {properties.map((property) => (
              <Link
                key={property.id}
                href={`/property/${property.id}`}
                onMouseEnter={() => onPropertySelect(property.id)}
                onMouseLeave={() => onPropertySelect(null)}
                onFocus={() => onPropertySelect(property.id)}
                className={`block px-4 py-3 text-xs transition-colors ${
                  selectedProperty === property.id ? 'bg-primary-50 border-l-2 border-primary-600' : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex gap-3 items-center">
                  {property.images && property.images.length > 0 && (
                    <div className="flex-shrink-0 relative w-14 h-14 rounded-md overflow-hidden bg-gray-100">
                      <Image
                        src={property.images[0]}
                        alt={property.address}
                        fill
                        className="object-cover"
                        sizes="56px"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div className="min-w-0">
                        <p className="font-medium text-gray-900 text-xs truncate">
                          {property.address}
                        </p>
                        <p className="text-[11px] text-gray-500 flex items-center mt-0.5">
                          <MapPin className="w-3 h-3 mr-1" />
                          <span className="truncate">{property.neighborhood}</span>
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-mono bg-gray-100 text-gray-800 border border-gray-200">
                          {property.arbitrageScore.toFixed(2)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-end justify-between mt-2">
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          €{property.price.toLocaleString()}
                        </p>
                        <p className="text-[11px] text-gray-500">
                          {property.size} m² • {property.rooms} rooms
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="inline-flex items-center gap-1 text-[11px] font-medium text-gray-900">
                          <TrendingUp className="w-3.5 h-3.5" />
                          {property.predictedROI}% ROI
                        </p>
                        <p className="text-[10px] text-gray-500">
                          €{property.pricePerSqm.toLocaleString()} / m²
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

