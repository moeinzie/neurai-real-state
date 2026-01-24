'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Plus, Edit, Trash2, Upload, Download } from 'lucide-react'
import { mockProperties } from '@/lib/mockData'
import { Property } from '@/types/property'

const propertyImage1 = 'https://www.mckissock.com/wp-content/uploads/2016/11/GettyImages-1151832961.jpg'
const propertyImage2 = 'https://mbluxury1.s3.amazonaws.com/2024/04/17092933/Luxury-Real-Estate-Brands.jpg'

export default function PropertiesManagement() {
  const router = useRouter()
  const [properties, setProperties] = useState<Property[]>(mockProperties)
  const [searchTerm, setSearchTerm] = useState('')

  const filteredProperties = properties.filter(
    (p) =>
      p.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.neighborhood.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const openAddProperty = () => {
    router.push('/admin/property/new')
  }

  const openEditProperty = (property: Property) => {
    router.push(`/admin/property/${property.id}`)
  }

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this property?')) {
      const updatedProperties = properties.filter((p) => p.id !== id)
      setProperties(updatedProperties)
      if (typeof window !== 'undefined') {
        localStorage.setItem('properties', JSON.stringify(updatedProperties))
      }
    }
  }

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedProperties = localStorage.getItem('properties')
      if (storedProperties) {
        setProperties(JSON.parse(storedProperties))
      }
    }
  }, [])

  useEffect(() => {
    const handleFocus = () => {
      if (typeof window !== 'undefined') {
        const storedProperties = localStorage.getItem('properties')
        if (storedProperties) {
          setProperties(JSON.parse(storedProperties))
        }
      }
    }
    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [])

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900">Properties Management</h2>
            <p className="text-sm text-gray-600 mt-1">Manage and update property listings</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => alert('Import functionality coming soon')}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2 text-sm"
            >
              <Upload className="w-4 h-4" />
              Import
            </button>
            <button
              onClick={() => alert('Export functionality coming soon')}
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
              {filteredProperties.map((property) => (
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
                    <span className="text-sm font-semibold text-primary-600">{property.predictedROI}%</span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className="text-sm">{property.arbitrageScore.toFixed(2)}</span>
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
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between pt-4">
          <p className="text-sm text-gray-600">
            Showing {filteredProperties.length} of {properties.length} properties
          </p>
        </div>
      </div>
    </div>
  )
}
