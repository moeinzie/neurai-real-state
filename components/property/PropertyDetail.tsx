'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { mockProperties } from '@/lib/mockData'
import { Property } from '@/types/property'
import { MapPin, TrendingUp, Award, Download, FileText, BarChart3, Building2, Layers, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import PropertyMap from '@/components/explore/PropertyMap'
import FeatureImportance from './FeatureImportance'
import ComparablesTable from './ComparablesTable'
import SavePropertyButton from './SavePropertyButton'
import ExportReport from './ExportReport'
import DistributionChart from './DistributionChart'

interface PropertyDetailProps {
  propertyId: string
}

export default function PropertyDetail({ propertyId }: PropertyDetailProps) {
  const [property, setProperty] = useState<Property | null>(null)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)

  useEffect(() => {
    const found = mockProperties.find((p) => p.id === propertyId)
    setProperty(found || null)
    setSelectedImageIndex(0)
  }, [propertyId])

  if (!property) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p className="text-gray-600">Property not found</p>
        <Link href="/explore" className="text-primary-600 hover:underline mt-4 inline-block">
          Back to Explore
        </Link>
      </div>
    )
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low':
        return 'bg-green-100 text-green-800'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800'
      case 'high':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b bg-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/explore" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm font-medium">Back to Analysis</span>
            </Link>
            <div className="flex items-center gap-2">
              <SavePropertyButton property={property} />
              <ExportReport property={property} />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <div className="text-xs text-gray-500 font-mono mb-1">Property ID: {property.id}</div>
                  <h1 className="text-xl md:text-2xl font-semibold text-gray-900">{property.address}</h1>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 ml-[52px]">
                <MapPin className="w-4 h-4" />
                <span>{property.neighborhood}</span>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className={`px-3 py-1.5 rounded text-xs font-medium ${getRiskColor(property.riskIndicator)}`}>
                {property.riskIndicator.toUpperCase()} RISK
              </span>
              {property.clusterLabel && (
                <span className="px-3 py-1.5 rounded text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
                  {property.clusterLabel}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Valuation</span>
              <FileText className="w-4 h-4 text-gray-400" />
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-semibold text-gray-900">€{property.price.toLocaleString()}</p>
              <p className="text-sm text-gray-600">€{property.pricePerSqm.toLocaleString()} per m²</p>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Predicted ROI</span>
              <TrendingUp className="w-4 h-4 text-gray-400" />
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-semibold text-gray-900">{property.predictedROI}%</p>
              <p className="text-sm text-gray-600">Annualized return</p>
              {property.predictionInterval && (
                <p className="text-xs text-gray-500">
                  Range: {property.predictionInterval.lower}% - {property.predictionInterval.upper}%
                </p>
              )}
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Arbitrage Score</span>
              <Award className="w-4 h-4 text-gray-400" />
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-semibold text-gray-900">{property.arbitrageScore.toFixed(2)}</p>
              <p className="text-sm text-gray-600">Top {Math.round((1 - property.arbitrageScore) * 100)}% percentile</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <Layers className="w-5 h-5 text-gray-600" />
                <h2 className="text-lg font-semibold text-gray-900">Property Specifications</h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <div className="text-xs text-gray-500 mb-1">Size</div>
                  <div className="text-sm font-medium text-gray-900">{property.size} m²</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Rooms</div>
                  <div className="text-sm font-medium text-gray-900">{property.rooms}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Type</div>
                  <div className="text-sm font-medium text-gray-900 capitalize">{property.propertyType}</div>
                </div>
                {property.floor && (
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Floor</div>
                    <div className="text-sm font-medium text-gray-900">{property.floor}</div>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Features</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {[
                  { key: 'hasElevator', label: 'Elevator' },
                  { key: 'hasParking', label: 'Parking' },
                  { key: 'hasBalcony', label: 'Balcony' },
                  { key: 'hasTerrace', label: 'Terrace' },
                  { key: 'hasGarden', label: 'Garden' },
                  { key: 'hasSwimmingPool', label: 'Swimming Pool' },
                  { key: 'hasGym', label: 'Gym' },
                  { key: 'hasSecurity', label: 'Security' },
                  { key: 'hasAirConditioning', label: 'Air Conditioning' },
                  { key: 'hasHeating', label: 'Heating' },
                  { key: 'hasFurnished', label: 'Furnished' },
                  { key: 'hasStorage', label: 'Storage' },
                  { key: 'hasConcierge', label: 'Concierge' },
                  { key: 'hasPetFriendly', label: 'Pet Friendly' },
                  { key: 'hasWheelchairAccess', label: 'Wheelchair Access' },
                ].map((feature) => (
                  <div key={feature.key} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                    <span className="text-sm text-gray-700">{feature.label}</span>
                    <span className={`text-xs font-medium ${property[feature.key as keyof Property] ? 'text-green-600' : 'text-gray-400'}`}>
                      {property[feature.key as keyof Property] ? 'Yes' : 'No'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <FeatureImportance property={property} />
            <DistributionChart property={property} />
            <ComparablesTable property={property} />
          </div>

          <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Location</h2>
              <div className="h-64 bg-gray-100 rounded-lg overflow-hidden">
                <PropertyMap
                  properties={[property]}
                  selectedProperty={property.id}
                  onPropertySelect={() => {}}
                />
              </div>
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Latitude</span>
                  <span className="font-mono text-gray-900">{property.latitude.toFixed(6)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Longitude</span>
                  <span className="font-mono text-gray-900">{property.longitude.toFixed(6)}</span>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 className="w-5 h-5 text-gray-600" />
                <h2 className="text-lg font-semibold text-gray-900">Investment Metrics</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-600">Price per m²</span>
                    <span className="text-sm font-semibold text-gray-900">€{property.pricePerSqm.toLocaleString()}</span>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-600">Risk Level</span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getRiskColor(property.riskIndicator)}`}>
                      {property.riskIndicator.toUpperCase()}
                    </span>
                  </div>
                </div>
                {property.clusterId && (
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-gray-600">Cluster ID</span>
                      <span className="text-sm font-mono text-gray-900">{property.clusterId}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {property.images && property.images.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Visual Documentation</h2>
                <div className="space-y-3">
                  <div className="relative h-48 rounded-lg overflow-hidden border border-gray-200">
                    <Image
                      src={property.images[selectedImageIndex]}
                      alt={`${property.address} - Image ${selectedImageIndex + 1}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 400px"
                    />
                  </div>
                  {property.images.length > 1 && (
                    <div className="grid grid-cols-3 gap-2">
                      {property.images.slice(0, 3).map((image, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedImageIndex(index)}
                          className={`relative h-20 rounded overflow-hidden border-2 transition ${
                            selectedImageIndex === index ? 'border-gray-900' : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <Image
                            src={image}
                            alt={`Thumbnail ${index + 1}`}
                            fill
                            className="object-cover"
                            sizes="80px"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

