'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ArrowLeft, Save } from 'lucide-react'
import { mockProperties } from '@/lib/mockData'
import { Property } from '@/types/property'
import LocationPickerMap from '@/components/admin/LocationPickerMap'

const propertyImage1 = 'https://www.mckissock.com/wp-content/uploads/2016/11/GettyImages-1151832961.jpg'
const propertyImage2 = 'https://mbluxury1.s3.amazonaws.com/2024/04/17092933/Luxury-Real-Estate-Brands.jpg'

export default function PropertyFormPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  const isEditMode = id !== 'new'

  const [formData, setFormData] = useState<Partial<Property>>({
    address: '',
    latitude: 40.4168,
    longitude: -3.7038,
    neighborhood: '',
    price: 0,
    pricePerSqm: 0,
    size: 0,
    rooms: 1,
    propertyType: 'apartment',
    floor: undefined,
    hasElevator: false,
    hasParking: false,
    hasBalcony: false,
    hasTerrace: false,
    hasGarden: false,
    hasSwimmingPool: false,
    hasGym: false,
    hasSecurity: false,
    hasAirConditioning: false,
    hasHeating: false,
    hasFurnished: false,
    hasStorage: false,
    hasConcierge: false,
    hasPetFriendly: false,
    hasWheelchairAccess: false,
    predictedROI: 0,
    arbitrageScore: 0,
    riskIndicator: 'medium',
    images: [propertyImage1, propertyImage2, propertyImage1, propertyImage2],
  })

  const [properties, setProperties] = useState<Property[]>([])

  useEffect(() => {
    // Load properties from localStorage or use mock data
    const storedProperties = typeof window !== 'undefined' ? localStorage.getItem('properties') : null
    const allProperties = storedProperties ? JSON.parse(storedProperties) : mockProperties
    setProperties(allProperties)

    // If edit mode, load the property data
    if (isEditMode) {
      const property = allProperties.find((p: Property) => p.id === id)
      if (property) {
        setFormData({
          address: property.address,
          latitude: property.latitude,
          longitude: property.longitude,
          neighborhood: property.neighborhood,
          price: property.price,
          pricePerSqm: property.pricePerSqm,
          size: property.size,
          rooms: property.rooms,
          propertyType: property.propertyType,
          floor: property.floor,
          hasElevator: property.hasElevator ?? false,
          hasParking: property.hasParking ?? false,
          hasBalcony: property.hasBalcony ?? false,
          hasTerrace: property.hasTerrace ?? false,
          hasGarden: property.hasGarden ?? false,
          hasSwimmingPool: property.hasSwimmingPool ?? false,
          hasGym: property.hasGym ?? false,
          hasSecurity: property.hasSecurity ?? false,
          hasAirConditioning: property.hasAirConditioning ?? false,
          hasHeating: property.hasHeating ?? false,
          hasFurnished: property.hasFurnished ?? false,
          hasStorage: property.hasStorage ?? false,
          hasConcierge: property.hasConcierge ?? false,
          hasPetFriendly: property.hasPetFriendly ?? false,
          hasWheelchairAccess: property.hasWheelchairAccess ?? false,
          predictedROI: property.predictedROI,
          arbitrageScore: property.arbitrageScore,
          riskIndicator: property.riskIndicator,
          images: property.images || [propertyImage1, propertyImage2, propertyImage1, propertyImage2],
        })
      }
    }
  }, [id, isEditMode])

  const handleInputChange = (field: keyof Property, value: any) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value }
      // Auto-calculate pricePerSqm when price or size changes
      if (field === 'price' || field === 'size') {
        const newPrice = field === 'price' ? value : updated.price || 0
        const newSize = field === 'size' ? value : updated.size || 0
        if (newPrice > 0 && newSize > 0) {
          updated.pricePerSqm = newPrice / newSize
        }
      }
      return updated
    })
  }

  const handleLocationChange = (lat: number, lng: number) => {
    setFormData({ ...formData, latitude: lat, longitude: lng })
  }

  const handleSave = () => {
    if (!formData.address || !formData.neighborhood || !formData.price || !formData.size) {
      alert('Please fill in all required fields')
      return
    }

    const storedProperties = typeof window !== 'undefined' ? localStorage.getItem('properties') : null
    const allProperties = storedProperties ? JSON.parse(storedProperties) : mockProperties

    let updatedProperties: Property[]

    if (isEditMode) {
      // Update existing property
      updatedProperties = allProperties.map((p: Property) =>
        p.id === id
          ? {
              ...p,
              ...formData,
              id: id,
              pricePerSqm: formData.price && formData.size ? formData.price / formData.size : p.pricePerSqm,
            }
          : p
      )
    } else {
      // Add new property
      const newProperty: Property = {
        id: Date.now().toString(),
        address: formData.address!,
        latitude: formData.latitude || 40.4168,
        longitude: formData.longitude || -3.7038,
        neighborhood: formData.neighborhood!,
        price: formData.price!,
        pricePerSqm: formData.price! / formData.size!,
        size: formData.size!,
        rooms: formData.rooms || 1,
        propertyType: formData.propertyType || 'apartment',
        floor: formData.floor,
        hasElevator: formData.hasElevator || false,
        hasParking: formData.hasParking || false,
        hasBalcony: formData.hasBalcony || false,
        hasTerrace: formData.hasTerrace || false,
        hasGarden: formData.hasGarden || false,
        hasSwimmingPool: formData.hasSwimmingPool || false,
        hasGym: formData.hasGym || false,
        hasSecurity: formData.hasSecurity || false,
        hasAirConditioning: formData.hasAirConditioning || false,
        hasHeating: formData.hasHeating || false,
        hasFurnished: formData.hasFurnished || false,
        hasStorage: formData.hasStorage || false,
        hasConcierge: formData.hasConcierge || false,
        hasPetFriendly: formData.hasPetFriendly || false,
        hasWheelchairAccess: formData.hasWheelchairAccess || false,
        predictedROI: formData.predictedROI || 0,
        arbitrageScore: formData.arbitrageScore || 0,
        riskIndicator: formData.riskIndicator || 'medium',
        images: formData.images || [propertyImage1, propertyImage2, propertyImage1, propertyImage2],
      }
      updatedProperties = [...allProperties, newProperty]
    }

    // Save to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('properties', JSON.stringify(updatedProperties))
    }

    // Navigate back to admin page
    router.push('/admin')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <button
            onClick={() => router.push('/admin')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Admin</span>
          </button>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            {isEditMode ? 'Edit Property' : 'Add New Property'}
          </h1>
        </div>

        <div className="bg-white rounded-lg shadow p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Neighborhood <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.neighborhood}
                onChange={(e) => handleInputChange('neighborhood', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          {/* Map for Location Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location <span className="text-red-500">*</span>
            </label>
            <p className="text-xs text-gray-500 mb-2">Click on the map to select the property location</p>
            <LocationPickerMap
              latitude={formData.latitude || 40.4168}
              longitude={formData.longitude || -3.7038}
              onLocationChange={handleLocationChange}
            />
            <div className="mt-2 text-xs text-gray-600">
              Coordinates: {formData.latitude?.toFixed(6)}, {formData.longitude?.toFixed(6)}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Property Type</label>
              <select
                value={formData.propertyType}
                onChange={(e) => handleInputChange('propertyType', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              >
                <option value="apartment">Apartment</option>
                <option value="house">House</option>
                <option value="studio">Studio</option>
              </select>
            </div>
          </div>

          {/* Price and Size */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price (€) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => handleInputChange('price', parseFloat(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Size (m²) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={formData.size}
                onChange={(e) => handleInputChange('size', parseFloat(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price per m²</label>
              <input
                type="number"
                value={formData.pricePerSqm?.toFixed(2) || ''}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
              />
            </div>
          </div>

          {/* Rooms and Floor */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rooms</label>
              <input
                type="number"
                min="1"
                value={formData.rooms}
                onChange={(e) => handleInputChange('rooms', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Floor</label>
              <input
                type="number"
                value={formData.floor || ''}
                onChange={(e) => handleInputChange('floor', e.target.value ? parseInt(e.target.value) : undefined)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          {/* Features */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Features</label>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.hasElevator}
                  onChange={(e) => handleInputChange('hasElevator', e.target.checked)}
                  className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700">Elevator</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.hasParking}
                  onChange={(e) => handleInputChange('hasParking', e.target.checked)}
                  className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700">Parking</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.hasBalcony}
                  onChange={(e) => handleInputChange('hasBalcony', e.target.checked)}
                  className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700">Balcony</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.hasTerrace}
                  onChange={(e) => handleInputChange('hasTerrace', e.target.checked)}
                  className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700">Terrace</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.hasGarden}
                  onChange={(e) => handleInputChange('hasGarden', e.target.checked)}
                  className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700">Garden</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.hasSwimmingPool}
                  onChange={(e) => handleInputChange('hasSwimmingPool', e.target.checked)}
                  className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700">Swimming Pool</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.hasGym}
                  onChange={(e) => handleInputChange('hasGym', e.target.checked)}
                  className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700">Gym</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.hasSecurity}
                  onChange={(e) => handleInputChange('hasSecurity', e.target.checked)}
                  className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700">Security</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.hasAirConditioning}
                  onChange={(e) => handleInputChange('hasAirConditioning', e.target.checked)}
                  className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700">Air Conditioning</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.hasHeating}
                  onChange={(e) => handleInputChange('hasHeating', e.target.checked)}
                  className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700">Heating</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.hasFurnished}
                  onChange={(e) => handleInputChange('hasFurnished', e.target.checked)}
                  className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700">Furnished</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.hasStorage}
                  onChange={(e) => handleInputChange('hasStorage', e.target.checked)}
                  className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700">Storage</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.hasConcierge}
                  onChange={(e) => handleInputChange('hasConcierge', e.target.checked)}
                  className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700">Concierge</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.hasPetFriendly}
                  onChange={(e) => handleInputChange('hasPetFriendly', e.target.checked)}
                  className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700">Pet Friendly</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.hasWheelchairAccess}
                  onChange={(e) => handleInputChange('hasWheelchairAccess', e.target.checked)}
                  className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700">Wheelchair Access</span>
              </label>
            </div>
          </div>

          {/* ROI and Scores */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Predicted ROI (%)</label>
              <input
                type="number"
                step="0.1"
                value={formData.predictedROI}
                onChange={(e) => handleInputChange('predictedROI', parseFloat(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Arbitrage Score</label>
              <input
                type="number"
                step="0.01"
                value={formData.arbitrageScore}
                onChange={(e) => handleInputChange('arbitrageScore', parseFloat(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Risk Indicator</label>
              <select
                value={formData.riskIndicator}
                onChange={(e) => handleInputChange('riskIndicator', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t">
            <button
              onClick={() => router.push('/admin')}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center gap-2 text-sm"
            >
              <Save className="w-4 h-4" />
              {isEditMode ? 'Update' : 'Create'} Property
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

