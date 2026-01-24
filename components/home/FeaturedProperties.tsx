import Link from 'next/link'
import Image from 'next/image'
import { mockProperties } from '@/lib/mockData'
import { MapPin, Home, TrendingUp, Award } from 'lucide-react'
import { Property } from '@/types/property'

function PropertyCard({ property }: { property: Property }) {
  const getArbitrageColor = (score: number) => {
    if (score >= 0.9) return 'bg-green-100 text-green-800'
    if (score >= 0.7) return 'bg-blue-100 text-blue-800'
    return 'bg-gray-100 text-gray-800'
  }

  return (
    <Link href={`/property/${property.id}`}>
      <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition overflow-hidden cursor-pointer">
        <div className="h-48 relative overflow-hidden">
          {property.images && property.images.length > 0 ? (
            <Image
              src={property.images[0]}
              alt={property.address}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            />
          ) : (
            <div className="h-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
              <Home className="w-16 h-16 text-white opacity-50" />
            </div>
          )}
          <div className="absolute top-2 right-2">
            <span className={`px-2 py-1 rounded text-xs font-semibold ${getArbitrageColor(property.arbitrageScore)}`}>
              Top {Math.round((1 - property.arbitrageScore) * 100)}%
            </span>
          </div>
        </div>
        <div className="p-4">
          <div className="mb-2">
            <h3 className="font-semibold text-gray-900 line-clamp-1">{property.address}</h3>
          </div>
          <p className="text-sm text-gray-600 mb-3 flex items-center">
            <MapPin className="w-4 h-4 mr-1" />
            {property.neighborhood}
          </p>
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-2xl font-bold text-gray-900">€{property.price.toLocaleString()}</p>
              <p className="text-sm text-gray-600">€{property.pricePerSqm.toLocaleString()}/m²</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-primary-600 flex items-center">
                <TrendingUp className="w-4 h-4 mr-1" />
                {property.predictedROI}%
              </p>
              <p className="text-xs text-gray-600">Predicted ROI</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span>{property.size} m²</span>
            <span>{property.rooms} rooms</span>
            <span className="capitalize">{property.propertyType}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default function FeaturedProperties() {
  const featured = mockProperties.slice(0, 4)

  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-gray-900">Featured Opportunities</h2>
        <Link href="/explore" className="text-primary-600 hover:text-primary-700 font-semibold">
          View All →
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {featured.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>
    </div>
  )
}

