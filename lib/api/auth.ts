import apiClient from './axios'

export interface LoginRequest {
  username: string
  password: string
}

export interface LoginResponse {
  data: {
    token: string
    expireIn: string
  }
  isSuccess: boolean
  message: string
  statusCode: number
}

export interface RefreshTokenRequest {
  token: string
  refreshToken: string
}

export interface RefreshTokenResponse {
  data?: any
  expireIn?: string
  token?: string
  isSuccess: boolean
  message: string
  statusCode: number
}

export interface ValidateTokenRequest {
  token: string
}

export interface ValidateTokenResponse {
  data?: any
  isSuccess: boolean
  message: string
  statusCode: number
}

export interface CreateUserRequest {
  username: string
  password: string
}

export interface CreateUserResponse {
  data?: any
  isSuccess: boolean
  message: string
  statusCode: number
}

export interface ApiUser {
  id: string
  username: string
  roles: string[]
  claims: any[]
}

export interface GetAllUsersResponse {
  isSuccess: boolean
  message: string
  data: ApiUser[]
  statusCode: number
}

export interface ApiRole {
  id: string
  name: string
  description?: string
  permissions?: string[]
  userCount?: number
  createdAt?: string
  updatedAt?: string
}

export interface GetAllRolesResponse {
  isSuccess: boolean
  message: string
  data: ApiRole[]
  statusCode: number
}

export interface CreateRoleRequest {
  roleName: string
}

export interface CreateRoleResponse {
  data?: ApiRole
  isSuccess: boolean
  message: string
  statusCode: number
}

export interface ResetPasswordRequest {
  userName: string
  password: string
}

export interface ResetPasswordResponse {
  data?: any
  isSuccess: boolean
  message: string
  statusCode: number
}

export interface AddRoleToUserRequest {
  username: string
  roleName: string
}

export interface AddRoleToUserResponse {
  data?: any
  isSuccess: boolean
  message: string
  statusCode: number
}

export interface RemoveRoleFromUserRequest {
  username: string
  roleName: string
}

export interface RemoveRoleFromUserResponse {
  data?: any
  isSuccess: boolean
  message: string
  statusCode: number
}

export interface UpdateRoleRequest {
  roleName: string
  updatedName: string
}

export interface UpdateRoleResponse {
  data?: any
  isSuccess: boolean
  message: string
  statusCode: number
}

export interface RemoveRoleRequest {
  roleName: string
}

export interface RemoveRoleResponse {
  data?: any
  isSuccess: boolean
  message: string
  statusCode: number
}

export interface AddClaimToRoleRequest {
  roleName: string
  claimValue: string[]
}

export interface AddClaimToRoleResponse {
  data?: any
  isSuccess: boolean
  message: string
  statusCode: number
}

export interface Claim {
  issuer: string
  originalIssuer: string
  properties: Record<string, any>
  subject: string | null
  type: string
  value: string
  valueType: string
}

export interface GetRoleClaimsResponse {
  data?: Claim[]
  isSuccess: boolean
  message: string
  statusCode: number
}

export interface ApiError {
  message: string
  status: number
  data?: any
}

// Login API call
export const login = async (credentials: LoginRequest): Promise<LoginResponse> => {
  try {
    const response = await apiClient.post<LoginResponse>('/api/Auth/Login', credentials)
    return response.data
  } catch (error: any) {
    throw error
  }
}

// Refresh Token API call
export const refreshToken = async (tokens: RefreshTokenRequest): Promise<RefreshTokenResponse> => {
  try {
    const response = await apiClient.post<RefreshTokenResponse>('/api/Auth/RefreshToken', tokens)
    return response.data
  } catch (error: any) {
    throw error
  }
}

// Validate Token API call
export const validateToken = async (tokenData: ValidateTokenRequest): Promise<ValidateTokenResponse> => {
  try {
    const response = await apiClient.post<ValidateTokenResponse>('/api/Auth/ValidateToken', tokenData)
    return response.data
  } catch (error: any) {
    throw error
  }
}

// Create User API call
export const createUser = async (userData: CreateUserRequest): Promise<CreateUserResponse> => {
  try {
    const response = await apiClient.post<CreateUserResponse>('/api/Users/CreateUser', userData)
    return response.data
  } catch (error: any) {
    throw error
  }
}

// Get All Users API call
export const getAllUsers = async (): Promise<GetAllUsersResponse> => {
  try {
    const response = await apiClient.get<GetAllUsersResponse>('/api/Users/GetAllUsers')
    return response.data
  } catch (error: any) {
    throw error
  }
}

// Get All Roles API call
export const getAllRoles = async (): Promise<GetAllRolesResponse> => {
  try {
    const response = await apiClient.get<GetAllRolesResponse>('/api/Users/GetAllRoles')
    return response.data
  } catch (error: any) {
    throw error
  }
}

// Create Role API call
export const createRole = async (roleData: CreateRoleRequest): Promise<CreateRoleResponse> => {
  try {
    const response = await apiClient.post<CreateRoleResponse>('/api/Users/CreateRole', roleData)
    return response.data
  } catch (error: any) {
    throw error
  }
}

// Reset Password API call
export const resetPassword = async (passwordData: ResetPasswordRequest): Promise<ResetPasswordResponse> => {
  try {
    const response = await apiClient.put<ResetPasswordResponse>('/api/Users/ResetPassword', passwordData)
    return response.data
  } catch (error: any) {
    throw error
  }
}

// Add Role to User API call
export const addRoleToUser = async (roleData: AddRoleToUserRequest): Promise<AddRoleToUserResponse> => {
  try {
    const response = await apiClient.post<AddRoleToUserResponse>('/api/Users/AddRoleToUser', roleData)
    return response.data
  } catch (error: any) {
    throw error
  }
}

// Remove Role from User API call
export const removeRoleFromUser = async (roleData: RemoveRoleFromUserRequest): Promise<RemoveRoleFromUserResponse> => {
  try {
    const response = await apiClient.delete<RemoveRoleFromUserResponse>('/api/Users/RemoveRoleFromUser', {
      data: roleData
    })
    return response.data
  } catch (error: any) {
    throw error
  }
}

// Update Role API call
export const updateRole = async (roleData: UpdateRoleRequest): Promise<UpdateRoleResponse> => {
  try {
    const response = await apiClient.post<UpdateRoleResponse>('/api/Users/UpdateRole', roleData)
    return response.data
  } catch (error: any) {
    throw error
  }
}

// Remove Role API call
export const removeRole = async (roleData: RemoveRoleRequest): Promise<RemoveRoleResponse> => {
  try {
    const response = await apiClient.post<RemoveRoleResponse>('/api/Users/RemoveRole', roleData)
    return response.data
  } catch (error: any) {
    throw error
  }
}

// Add Claim to Role API call
export const addClaimToRole = async (claimData: AddClaimToRoleRequest): Promise<AddClaimToRoleResponse> => {
  try {
    const response = await apiClient.post<AddClaimToRoleResponse>('/api/Users/AddClaimToRole', claimData)
    return response.data
  } catch (error: any) {
    throw error
  }
}

// Get Role Claims API call
export const getRoleClaims = async (roleName: string): Promise<GetRoleClaimsResponse> => {
  try {
    const response = await apiClient.get<GetRoleClaimsResponse>(`/api/Users/GetRoleClaims?rolename=${encodeURIComponent(roleName)}`)
    return response.data
  } catch (error: any) {
    throw error
  }
}

