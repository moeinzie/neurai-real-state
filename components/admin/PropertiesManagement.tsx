'use client'

import { useState, useMemo, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Plus, Edit, Trash2, Upload, Download, Loader2 } from 'lucide-react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Property } from '@/types/property'
import { useToast } from '@/components/ui/Toast'
import ConfirmationModal from '@/components/ui/ConfirmationModal'
import { getUnits, removePropertyUnit, PropertyUnit } from '@/lib/api/property'

const propertyImage1 = 'https://www.mckissock.com/wp-content/uploads/2016/11/GettyImages-1151832961.jpg'
const propertyImage2 = 'https://mbluxury1.s3.amazonaws.com/2024/04/17092933/Luxury-Real-Estate-Brands.jpg'

// Convert PropertyUnit from API to Property type
const convertPropertyUnitToProperty = (unit: PropertyUnit): Property => {
  return {
    id: unit.id,
    address: unit.address,
    latitude: unit.latitude,
    longitude: unit.longitude,
    neighborhood: unit.neighborhood,
    price: unit.price,
    pricePerSqm: unit.houseArea && unit.houseArea > 0 ? unit.price / unit.houseArea : 0,
    size: unit.houseArea || unit.usefulArea || 0,
    rooms: unit.room,
    propertyType: unit.typeId === 1 ? 'apartment' : unit.typeId === 2 ? 'house' : 'studio',
    floor: unit.floor,
    hasElevator: unit.features?.elevator || false,
    hasParking: unit.features?.parking || false,
    hasBalcony: unit.features?.balcony || false,
    hasTerrace: unit.features?.teracce || false,
    hasGarden: unit.features?.garden || false,
    hasSwimmingPool: unit.features?.pool || false,
    hasGym: unit.features?.gym || false,
    hasSecurity: unit.features?.security || false,
    hasAirConditioning: unit.features?.airConditioning || false,
    hasHeating: unit.features?.heating || false,
    hasFurnished: unit.features?.furnished || false,
    hasStorage: unit.features?.storage || false,
    hasConcierge: unit.features?.concierge || false,
    hasPetFriendly: unit.features?.petFriendly || false,
    hasWheelchairAccess: unit.features?.wheelchair || false,
    predictedROI: unit.roi ?? 0,
    arbitrageScore: unit.arbitrage ?? 0,
    score: unit.score != null ? unit.score : undefined,
    riskIndicator: (unit.score != null ? unit.score : 5) > 7 ? 'low' : (unit.score != null ? unit.score : 5) > 4 ? 'medium' : 'high',
    images: unit.picture ? [unit.picture] : [],
  }
}

export default function PropertiesManagement() {
  const router = useRouter()
  const toast = useToast()
  const [searchTerm, setSearchTerm] = useState('')
  const [showDeletePropertyModal, setShowDeletePropertyModal] = useState(false)
  const [deletingPropertyId, setDeletingPropertyId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // Fetch properties using React Query
  const {
    data: unitsResponse,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['propertyUnits'],
    queryFn: getUnits,
  })

  // Convert API units to Property format
  const properties = useMemo(() => {
    if (!unitsResponse?.data) return []
    return unitsResponse.data.map(convertPropertyUnitToProperty)
  }, [unitsResponse])

  const filteredProperties = useMemo(() => {
    return properties.filter(
      (p) =>
        p.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.neighborhood.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [properties, searchTerm])

  const openAddProperty = () => {
    router.push('/admin/property/new')
  }

  const openEditProperty = (property: Property) => {
    router.push(`/admin/property/${property.id}`)
  }

  const handleDelete = (id: string) => {
    setDeletingPropertyId(id)
    setShowDeletePropertyModal(true)
  }

  const handleConfirmDelete = async () => {
    if (!deletingPropertyId) return
    
    setIsDeleting(true)
    try {
      const id = parseInt(deletingPropertyId)
      if (isNaN(id)) {
        toast.error('Invalid property ID')
        return
      }
      
      const response = await removePropertyUnit(id)
      
      if (response.isSuccess) {
        toast.success('Property deleted successfully')
        setShowDeletePropertyModal(false)
        setDeletingPropertyId(null)
        // Refetch after delete
        refetch()
      } else {
        toast.error(response.message || 'Failed to delete property')
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete property. Please try again.')
    } finally {
      setIsDeleting(false)
    }
  }

  // Show error message if API call fails
  useEffect(() => {
    if (error) {
      toast.error('Failed to load properties. Please try again.')
    }
  }, [error, toast])

  return (
    <>
      <div className="space-y-6">
        <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900">Properties Management</h2>
            <p className="text-sm text-gray-600 mt-1">Manage and update property listings</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => toast.info('Import functionality coming soon')}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2 text-sm"
            >
              <Upload className="w-4 h-4" />
              Import
            </button>
            <button
              onClick={() => toast.info('Export functionality coming soon')}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2 text-sm"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
            <button
              onClick={openAddProperty}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center gap-2 text-sm"
            >
              <Plus className="w-4 h-4" />
              Add Property
            </button>
          </div>
        </div>

        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search properties..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
            <span className="ml-3 text-gray-600">Loading properties...</span>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-red-600 mb-4">Failed to load properties</p>
            <button
              onClick={() => refetch()}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              Retry
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Address</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Neighborhood</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Price</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">ROI</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Score</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProperties.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-gray-500">
                      No properties found
                    </td>
                  </tr>
                ) : (
                  filteredProperties.map((property) => (
                    <tr key={property.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <p className="text-sm font-medium text-gray-900">{property.address}</p>
                        <p className="text-xs text-gray-600">
                          {property.size} m² • {property.rooms} rooms
                        </p>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-sm text-gray-700">{property.neighborhood}</span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className="text-sm font-semibold">€{property.price.toLocaleString()}</span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className="text-sm font-semibold text-primary-600">
                          {property.predictedROI != null ? `${property.predictedROI}%` : 'N/A'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className="text-sm">
                          {property.score != null ? property.score.toFixed(2) : property.arbitrageScore != null ? property.arbitrageScore.toFixed(2) : 'N/A'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => openEditProperty(property)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(property.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        <div className="flex items-center justify-between pt-4">
          <p className="text-sm text-gray-600">
            Showing {filteredProperties.length} of {properties.length} properties
          </p>
        </div>
        </div>
      </div>

      {/* Delete Property Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeletePropertyModal}
        onClose={() => {
          setShowDeletePropertyModal(false)
          setDeletingPropertyId(null)
        }}
        onConfirm={handleConfirmDelete}
        title="Delete Property"
        message="Are you sure you want to delete this property?"
        confirmText="Delete Property"
        confirmButtonColor="red"
        isLoading={isDeleting}
        details={
          deletingPropertyId
            ? [
                {
                  label: 'Property',
                  value: properties.find((p) => p.id === deletingPropertyId)?.address || '',
                },
              ]
            : []
        }
      />
    </>
  )
}
