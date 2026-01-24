export interface Property {
  id: string
  address: string
  latitude: number
  longitude: number
  neighborhood: string
  price: number
  pricePerSqm: number
  size: number // square meters
  rooms: number
  propertyType: 'apartment' | 'house' | 'studio'
  floor?: number
  // Property Features
  hasElevator: boolean
  hasParking: boolean
  hasBalcony: boolean
  hasTerrace: boolean
  hasGarden: boolean
  hasSwimmingPool: boolean
  hasGym: boolean
  hasSecurity: boolean
  hasAirConditioning: boolean
  hasHeating: boolean
  hasFurnished: boolean
  hasStorage: boolean
  hasConcierge: boolean
  hasPetFriendly: boolean
  hasWheelchairAccess: boolean
  predictedROI: number // annualized return percentage
  arbitrageScore: number // standardized mispricing index
  riskIndicator: 'low' | 'medium' | 'high'
  clusterId?: string
  clusterLabel?: string
  images?: string[]
  comparables?: Property[]
  featureImportance?: {
    feature: string
    importance: number
  }[]
  predictionInterval?: {
    lower: number
    upper: number
  }
}

export interface PropertyFilters {
  location?: {
    neighborhood?: string
    address?: string
  }
  budget?: {
    min?: number
    max?: number
  }
  targetROI?: number
  roiRange?: {
    min?: number
    max?: number
  }
  maxRisk?: 'low' | 'medium' | 'high'
  riskLevels?: ('low' | 'medium' | 'high')[]
  holdingPeriod?: number // months
  size?: {
    min?: number
    max?: number
  }
  propertyType?: ('apartment' | 'house' | 'studio')[]
  rooms?: {
    min?: number
    max?: number
  }
  pricePerSqm?: {
    min?: number
    max?: number
  }
  minArbitrageScore?: number
  clusters?: string[]
  features?: string[]
  sortBy?: 'arbitrageScore' | 'price' | 'pricePerSqm' | 'predictedROI' | 'size'
}

