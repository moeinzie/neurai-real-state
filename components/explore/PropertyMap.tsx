'use client'

import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap, Rectangle, CircleMarker } from 'react-leaflet'
import L from 'leaflet'
import { Property } from '@/types/property'
import Link from 'next/link'

// Fix for default marker icon in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

interface PropertyMapProps {
  properties: Property[]
  selectedProperty: string | null
  onPropertySelect: (id: string | null) => void
  showClusterLayers?: boolean
  selectedClusters?: string[]
}

// Component to fit bounds when properties change
function FitBounds({ properties }: { properties: Property[] }) {
  const map = useMap()

  useEffect(() => {
    if (properties.length > 0) {
      const bounds = L.latLngBounds(
        properties.map((p) => [p.latitude, p.longitude])
      )
      map.fitBounds(bounds, { padding: [50, 50] })
    }
  }, [properties, map])

  return null
}

// Custom marker icon component
function CustomMarker({
  property,
  isSelected,
  onPropertySelect,
}: {
  property: Property
  isSelected: boolean
  onPropertySelect: (id: string | null) => void
}) {
  const getColor = (score: number) => {
    if (score >= 0.9) return '#10b981' // green
    if (score >= 0.7) return '#3b82f6' // blue
    return '#6b7280' // gray
  }

  const iconSize = isSelected ? 28 : 20
  const borderWidth = isSelected ? 3 : 2
  const borderColor = isSelected ? '#0ea5e9' : 'white'

  const customIcon = L.divIcon({
    className: 'custom-marker',
    html: `<div style="
      width: ${iconSize}px;
      height: ${iconSize}px;
      border-radius: 50%;
      background-color: ${getColor(property.arbitrageScore)};
      border: ${borderWidth}px solid ${borderColor};
      box-shadow: 0 2px 4px rgba(0,0,0,0.2);
      cursor: pointer;
    "></div>`,
    iconSize: [iconSize, iconSize],
    iconAnchor: [iconSize / 2, iconSize / 2],
  })

  return (
    <Marker
      position={[property.latitude, property.longitude]}
      icon={customIcon}
      eventHandlers={{
        click: () => {
          onPropertySelect(property.id)
        },
        mouseover: () => {
          onPropertySelect(property.id)
        },
        mouseout: () => {
          // Keep selected on mouseout to maintain sync with list
        },
      }}
    >
      <Popup>
        <div className="p-2 min-w-[200px]">
          <h3 className="font-semibold text-sm mb-1">{property.address}</h3>
          <p className="text-xs text-gray-600 mb-2">{property.neighborhood}</p>
          <p className="text-sm font-bold text-primary-600">€{property.price.toLocaleString()}</p>
          <p className="text-xs text-gray-600">ROI: {property.predictedROI}%</p>
          <p className="text-xs text-gray-500 mb-2">Score: {property.arbitrageScore.toFixed(2)}</p>
          <Link
            href={`/property/${property.id}`}
            className="text-xs text-primary-600 hover:underline mt-1 block"
            onClick={() => onPropertySelect(property.id)}
          >
            View Details
          </Link>
        </div>
      </Popup>
    </Marker>
  )
}

// Cluster Layer Component
function ClusterLayer({ 
  properties, 
  clusterId, 
  isVisible 
}: { 
  properties: Property[]
  clusterId: string
  isVisible: boolean 
}) {
  const clusterProperties = properties.filter((p) => p.clusterId === clusterId)
  
  if (!isVisible || clusterProperties.length === 0) return null

  // Create a bounding box for the cluster
  const bounds = clusterProperties.reduce(
    (acc, p) => {
      return {
        minLat: Math.min(acc.minLat, p.latitude),
        maxLat: Math.max(acc.maxLat, p.latitude),
        minLng: Math.min(acc.minLng, p.longitude),
        maxLng: Math.max(acc.maxLng, p.longitude),
      }
    },
    {
      minLat: clusterProperties[0].latitude,
      maxLat: clusterProperties[0].latitude,
      minLng: clusterProperties[0].longitude,
      maxLng: clusterProperties[0].longitude,
    }
  )

  const clusterColors: Record<string, string> = {
    'cluster-1': '#10b981',
    'cluster-2': '#3b82f6',
    'cluster-3': '#f59e0b',
  }

  const color = clusterColors[clusterId] || '#6b7280'

  return (
    <Rectangle
      bounds={[
        [bounds.minLat, bounds.minLng],
        [bounds.maxLat, bounds.maxLng],
      ]}
      pathOptions={{
        color,
        fillColor: color,
        fillOpacity: 0.1,
        weight: 2,
        dashArray: '5, 5',
      }}
    />
  )
}

export default function PropertyMap({ 
  properties, 
  selectedProperty, 
  onPropertySelect,
  showClusterLayers = false,
  selectedClusters = [],
}: PropertyMapProps) {
  // Madrid center coordinates
  const center: [number, number] = [40.4168, -3.7038]
  
  const uniqueClusters = Array.from(new Set(properties.map((p) => p.clusterId).filter(Boolean)))

  return (
    <div className="relative w-full h-full">
      <MapContainer
        center={center}
        zoom={12}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FitBounds properties={properties} />
        
        {/* Cluster Layers */}
        {showClusterLayers && uniqueClusters.map((clusterId) => (
          <ClusterLayer
            key={clusterId}
            properties={properties}
            clusterId={clusterId!}
            isVisible={selectedClusters.length === 0 || selectedClusters.includes(clusterId!)}
          />
        ))}
        
        {/* Property Markers */}
        {properties.map((property) => (
          <CustomMarker
            key={property.id}
            property={property}
            isSelected={selectedProperty === property.id}
            onPropertySelect={onPropertySelect}
          />
        ))}
      </MapContainer>
    </div>
  )
}
