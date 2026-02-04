import apiClient from './axios'

export interface PropertyFeatures {
  elevator: boolean
  teracce: boolean
  gym: boolean
  heating: boolean
  concierge: boolean
  parking: boolean
  garden: boolean
  security: boolean
  furnished: boolean
  petFriendly: boolean
  balcony: boolean
  pool: boolean
  airConditioning: boolean
  storage: boolean
  wheelchair: boolean
}

export interface CreatePropertyUnitRequest {
  picture: string
  title: string
  address: string
  floor: number
  room: number
  price: number
  usefulArea: number
  houseArea: number
  roi: number
  score: number
  arbitrage: number
  neighborhood: string
  longitude: number
  latitude: number
  typeId: number
  features: PropertyFeatures
}

export interface CreatePropertyUnitResponse {
  data?: any
  isSuccess: boolean
  message: string
  statusCode: number
}

export interface PropertyUnit {
  id: string
  picture?: string
  title: string
  address: string
  floor: number
  room: number
  price: number
  pricePerM2?: number
  usefulArea?: number
  houseArea?: number
  roi: number
  score: number
  arbitrage: number
  neighborhood: string
  longitude: number
  latitude: number
  typeId: number
  propertyType?: number
  features?: PropertyFeatures
}

export interface UpdatePropertyUnitRequest {
  id: number
  picture: string
  title: string
  address: string
  floor: number
  room: number
  price: number
  pricePerM2: number
  usefulArea: number
  houseArea: number
  roi: number
  score: number
  arbitrage: number
  neighborhood: string
  longitude: number
  latitude: number
  propertyType: number
  features: PropertyFeatures
}

export interface UpdatePropertyUnitResponse {
  data?: any
  isSuccess: boolean
  message: string
  statusCode: number
}

export interface GetPropertyUnitResponse {
  data: PropertyUnit
  isSuccess: boolean
  message: string
  statusCode: number
}

export interface GetUnitsResponse {
  data: PropertyUnit[]
  isSuccess: boolean
  message: string
  statusCode: number
}

export interface RemovePropertyUnitRequest {
  id: number
}

export interface RemovePropertyUnitResponse {
  data?: any
  isSuccess: boolean
  message: string
  statusCode: number
}

// Create Property Unit API call
export const createPropertyUnit = async (
  propertyData: CreatePropertyUnitRequest
): Promise<CreatePropertyUnitResponse> => {
  try {
    const response = await apiClient.post<CreatePropertyUnitResponse>(
      '/api/PropertyUnit/CreatePropertyUnit',
      {
        request: {
          ...propertyData,
          picture: 'https://www.mckissock.com/wp-content/uploads/2016/11/GettyImages-1151832961.jpg',
          usefulArea: 0,
          houseArea: 0,
        },
      }
    )
    return response.data
  } catch (error: any) {
    throw error
  }
}

// Get All Property Units API call
export const getUnits = async (): Promise<GetUnitsResponse> => {
  try {
    const response = await apiClient.get<GetUnitsResponse>('/api/PropertyUnit/GetUnits')
    return response.data
  } catch (error: any) {
    throw error
  }
}

// Get Single Property Unit API call
export const getPropertyUnit = async (
  id: number
): Promise<GetPropertyUnitResponse> => {
  try {
    const response = await apiClient.get<GetPropertyUnitResponse>(
      `/api/PropertyUnit/FindPropertyUnit?id=${id}`
    )
    return response.data
  } catch (error: any) {
    throw error
  }
}

// Update Property Unit API call
export const updatePropertyUnit = async (
  propertyData: UpdatePropertyUnitRequest
): Promise<UpdatePropertyUnitResponse> => {
  try {
    const response = await apiClient.post<UpdatePropertyUnitResponse>(
      '/api/PropertyUnit/UpdatePropertyUnit',
      {
        request: propertyData,
      }
    )
    return response.data
  } catch (error: any) {
    throw error
  }
}

// Remove Property Unit API call
export const removePropertyUnit = async (
  id: number
): Promise<RemovePropertyUnitResponse> => {
  try {
    const response = await apiClient.post<RemovePropertyUnitResponse>(
      `/api/PropertyUnit/RemovePropertyUnit?id=${id}`
    )
    return response.data
  } catch (error: any) {
    throw error
  }
}

