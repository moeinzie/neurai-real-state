'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save } from 'lucide-react'
import { useQueryClient } from '@tanstack/react-query'
import { mockProperties } from '@/lib/mockData'
import { Property } from '@/types/property'
import LocationPickerMap from '@/components/admin/LocationPickerMap'
import { useToast } from '@/components/ui/Toast'
import { createPropertyUnit, getPropertyUnit, updatePropertyUnit } from '@/lib/api/property'

const propertyImage1 = 'https://www.mckissock.com/wp-content/uploads/2016/11/GettyImages-1151832961.jpg'
const propertyImage2 = 'https://mbluxury1.s3.amazonaws.com/2024/04/17092933/Luxury-Real-Estate-Brands.jpg'

interface PropertyFormClientProps {
  id: string
}

export default function PropertyFormClient({ id }: PropertyFormClientProps) {
  const router = useRouter()
  const toast = useToast()
  const queryClient = useQueryClient()
  const isEditMode = id !== 'new'

  const [formData, setFormData] = useState<Partial<Property & { title: string; score: number }>>({
    title: '',
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
    score: 0,
    riskIndicator: 'medium',
    images: [propertyImage1, propertyImage2, propertyImage1, propertyImage2],
  })
  const [isLoading, setIsLoading] = useState(false)

  const [properties, setProperties] = useState<Property[]>([])

  useEffect(() => {
    // Load properties from localStorage or use mock data
    const storedProperties = typeof window !== 'undefined' ? localStorage.getItem('properties') : null
    const allProperties = storedProperties ? JSON.parse(storedProperties) : mockProperties
    setProperties(allProperties)

    // If edit mode, load the property data from API
    if (isEditMode) {
      const loadPropertyData = async () => {
        try {
          setIsLoading(true)
          const propertyId = parseInt(id)
          if (isNaN(propertyId)) {
            toast.error('Invalid property ID')
            router.push('/admin')
            return
          }

          const response = await getPropertyUnit(propertyId)
          
          if (response.isSuccess && response.data) {
            const property = response.data
            const propertyTypeMap: Record<number, 'apartment' | 'house' | 'studio'> = {
              1: 'apartment',
              2: 'house',
              3: 'studio',
            }
            
            setFormData({
              title: property.title || '',
              address: property.address,
              latitude: property.latitude,
              longitude: property.longitude,
              neighborhood: property.neighborhood,
              price: property.price,
              pricePerSqm: property.pricePerM2 || (property.houseArea && property.houseArea > 0 ? property.price / property.houseArea : 0),
              size: property.houseArea || property.usefulArea || 0,
              rooms: property.room,
              propertyType: propertyTypeMap[property.typeId || property.propertyType || 1] || 'apartment',
              floor: property.floor,
              hasElevator: property.features?.elevator ?? false,
              hasParking: property.features?.parking ?? false,
              hasBalcony: property.features?.balcony ?? false,
              hasTerrace: property.features?.teracce ?? false,
              hasGarden: property.features?.garden ?? false,
              hasSwimmingPool: property.features?.pool ?? false,
              hasGym: property.features?.gym ?? false,
              hasSecurity: property.features?.security ?? false,
              hasAirConditioning: property.features?.airConditioning ?? false,
              hasHeating: property.features?.heating ?? false,
              hasFurnished: property.features?.furnished ?? false,
              hasStorage: property.features?.storage ?? false,
              hasConcierge: property.features?.concierge ?? false,
              hasPetFriendly: property.features?.petFriendly ?? false,
              hasWheelchairAccess: property.features?.wheelchair ?? false,
              predictedROI: property.roi,
              arbitrageScore: property.arbitrage,
              score: property.score,
              riskIndicator: property.score > 7 ? 'low' : property.score > 4 ? 'medium' : 'high',
              images: property.picture ? [property.picture] : [propertyImage1, propertyImage2, propertyImage1, propertyImage2],
            })
          } else {
            toast.error(response.message || 'Failed to load property')
            router.push('/admin')
          }
        } catch (error: any) {
          console.error('Error loading property:', error)
          toast.error(error.message || 'Failed to load property. Please try again.')
          router.push('/admin')
        } finally {
          setIsLoading(false)
        }
      }

      loadPropertyData()
    }
  }, [id, isEditMode, router, toast])

  const handleInputChange = (field: keyof (Property & { title?: string; score?: number }), value: any) => {
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

  // Map property type to typeId
  const getTypeId = (propertyType: string): number => {
    const typeMap: Record<string, number> = {
      apartment: 1,
      house: 2,
      studio: 3,
    }
    return typeMap[propertyType] || 1
  }

  const handleSave = async () => {
    if (!formData.address || !formData.neighborhood || !formData.price || !formData.size || !formData.title) {
      toast.warning('Please fill in all required fields')
      return
    }

    setIsLoading(true)
    
    if (isEditMode) {
      // For edit mode, use API
      try {
        const propertyId = parseInt(id)
        if (isNaN(propertyId)) {
          toast.error('Invalid property ID')
          return
        }

        const propertyData = {
          id: propertyId,
          picture: formData.images?.[0] || 'https://www.mckissock.com/wp-content/uploads/2016/11/GettyImages-1151832961.jpg',
          title: formData.title!,
          address: formData.address!,
          floor: formData.floor || 0,
          room: formData.rooms || 1,
          price: formData.price!,
          pricePerM2: formData.pricePerSqm || (formData.price && formData.size ? formData.price / formData.size : 0),
          usefulArea: formData.size || 0,
          houseArea: formData.size || 0,
          roi: formData.predictedROI || 0,
          score: formData.score || formData.arbitrageScore || 0,
          arbitrage: formData.arbitrageScore || 0,
          neighborhood: formData.neighborhood!,
          longitude: formData.longitude || -3.7038,
          latitude: formData.latitude || 40.4168,
          propertyType: getTypeId(formData.propertyType || 'apartment'),
          features: {
            elevator: formData.hasElevator || false,
            teracce: formData.hasTerrace || false,
            gym: formData.hasGym || false,
            heating: formData.hasHeating || false,
            concierge: formData.hasConcierge || false,
            parking: formData.hasParking || false,
            garden: formData.hasGarden || false,
            security: formData.hasSecurity || false,
            furnished: formData.hasFurnished || false,
            petFriendly: formData.hasPetFriendly || false,
            balcony: formData.hasBalcony || false,
            pool: formData.hasSwimmingPool || false,
            airConditioning: formData.hasAirConditioning || false,
            storage: formData.hasStorage || false,
            wheelchair: formData.hasWheelchairAccess || false,
          },
        }

        const response = await updatePropertyUnit(propertyData)

        if (response.isSuccess) {
          // Invalidate and refetch properties list
          await queryClient.invalidateQueries({ queryKey: ['propertyUnits'] })
          await queryClient.refetchQueries({ queryKey: ['propertyUnits'] })
          toast.success('Property updated successfully')
          router.push('/admin')
        } else {
          toast.error(response.message || 'Failed to update property')
        }
      } catch (error: any) {
        console.error('Error updating property:', error)
        toast.error(error.message || 'Failed to update property. Please try again.')
      } finally {
        setIsLoading(false)
      }
    } else {
      // For new property, use API
      setIsLoading(true)
      try {
        const propertyData = {
          picture: 'https://www.mckissock.com/wp-content/uploads/2016/11/GettyImages-1151832961.jpg',
          title: formData.title!,
          address: formData.address!,
          floor: formData.floor || 0,
          room: formData.rooms || 1,
          price: formData.price!,
          usefulArea: 0,
          houseArea: 0,
          roi: formData.predictedROI || 0,
          score: formData.score || formData.arbitrageScore || 0,
          arbitrage: formData.arbitrageScore || 0,
          neighborhood: formData.neighborhood!,
          longitude: formData.longitude || -3.7038,
          latitude: formData.latitude || 40.4168,
          typeId: getTypeId(formData.propertyType || 'apartment'),
          features: {
            elevator: formData.hasElevator || false,
            teracce: formData.hasTerrace || false,
            gym: formData.hasGym || false,
            heating: formData.hasHeating || false,
            concierge: formData.hasConcierge || false,
            parking: formData.hasParking || false,
            garden: formData.hasGarden || false,
            security: formData.hasSecurity || false,
            furnished: formData.hasFurnished || false,
            petFriendly: formData.hasPetFriendly || false,
            balcony: formData.hasBalcony || false,
            pool: formData.hasSwimmingPool || false,
            airConditioning: formData.hasAirConditioning || false,
            storage: formData.hasStorage || false,
            wheelchair: formData.hasWheelchairAccess || false,
          },
        }

        const response = await createPropertyUnit(propertyData)

        if (response.isSuccess) {
          // Invalidate and refetch properties list
          await queryClient.invalidateQueries({ queryKey: ['propertyUnits'] })
          await queryClient.refetchQueries({ queryKey: ['propertyUnits'] })
          toast.success('Property created successfully')
          router.push('/admin')
        } else {
          toast.error(response.message || 'Failed to create property')
        }
      } catch (error: any) {
        console.error('Error creating property:', error)
        toast.error(error.message || 'Failed to create property. Please try again.')
      } finally {
        setIsLoading(false)
      }
    }
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
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.title || ''}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                placeholder="Property title"
              />
            </div>
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
                <label key={feature.key} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData[feature.key as keyof typeof formData] as boolean}
                    onChange={(e) => handleInputChange(feature.key as keyof Property, e.target.checked)}
                    className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-700">{feature.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* ROI and Scores */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Score</label>
              <input
                type="number"
                step="0.01"
                value={formData.score || formData.arbitrageScore || 0}
                onChange={(e) => handleInputChange('score', parseFloat(e.target.value))}
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
              disabled={isLoading}
              className={`px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center gap-2 text-sm ${
                isLoading ? 'opacity-60 cursor-not-allowed' : ''
              }`}
            >
              <Save className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              {isLoading ? 'Saving...' : isEditMode ? 'Update' : 'Create'} Property
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

