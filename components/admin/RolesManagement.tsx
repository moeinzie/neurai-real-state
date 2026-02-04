'use client'

import { useState, useEffect } from 'react'
import { Search, Plus, Edit, Trash2, Save, X, ChevronDown, ChevronRight, Shield, CheckSquare, Square, KeyRound } from 'lucide-react'
import { createRole, getAllRoles, updateRole, removeRole, addClaimToRole, getRoleClaims } from '@/lib/api/auth'
import { useToast } from '@/components/ui/Toast'
import ConfirmationModal from '@/components/ui/ConfirmationModal'

export interface Permission {
  id: string
  name: string
  description: string
  category: string
}

export interface Role {
  id: string
  name: string
  description: string
  permissions: string[] // Array of permission IDs
  userCount: number
  createdAt: string
  updatedAt: string
}

const permissionCategories = {
  PropertyUnit: {
    name: 'Property Unit',
    icon: '🏠',
    permissions: [
      { id: 'PropertyUnit.Read', name: 'Read Property Unit', description: 'View and read property unit information' },
      { id: 'PropertyUnit.Insert', name: 'Insert Property Unit', description: 'Create new property units' },
      { id: 'PropertyUnit.Update', name: 'Update Property Unit', description: 'Modify existing property units' },
      { id: 'PropertyUnit.Remove', name: 'Remove Property Unit', description: 'Delete property units' },
    ],
  },
  Users: {
    name: 'Users',
    icon: '👥',
    permissions: [
      { id: 'Users.Read', name: 'Read Users', description: 'View and read user information' },
      { id: 'Users.Insert', name: 'Insert Users', description: 'Create new users' },
      { id: 'Users.Update', name: 'Update Users', description: 'Modify existing users' },
      { id: 'Users.Remove', name: 'Remove Users', description: 'Delete users' },
    ],
  },
}

const mockRoles: Role[] = [
  {
    id: '1',
    name: 'Super Admin',
    description: 'Full access to all system features',
    permissions: Object.values(permissionCategories).flatMap((cat) => cat.permissions.map((p) => p.id)),
    userCount: 2,
    createdAt: '2024-01-01',
    updatedAt: '2024-12-20',
  },
  {
    id: '2',
    name: 'Admin',
    description: 'Administrative access with most permissions',
    permissions: [
      'PropertyUnit.Read',
      'PropertyUnit.Insert',
      'PropertyUnit.Update',
      'PropertyUnit.Remove',
      'Users.Read',
      'Users.Insert',
      'Users.Update',
    ],
    userCount: 5,
    createdAt: '2024-01-15',
    updatedAt: '2024-12-19',
  },
  {
    id: '3',
    name: 'Property Manager',
    description: 'Manage properties',
    permissions: [
      'PropertyUnit.Read',
      'PropertyUnit.Insert',
      'PropertyUnit.Update',
    ],
    userCount: 12,
    createdAt: '2024-02-01',
    updatedAt: '2024-12-18',
  },
  {
    id: '4',
    name: 'Viewer',
    description: 'Read-only access to properties',
    permissions: ['PropertyUnit.Read'],
    userCount: 45,
    createdAt: '2024-02-15',
    updatedAt: '2024-12-17',
  },
]

export default function RolesManagement() {
  const toast = useToast()
  const [roles, setRoles] = useState<Role[]>(mockRoles)
  const [searchTerm, setSearchTerm] = useState('')
  const [editingRole, setEditingRole] = useState<Role | null>(null)
  const [permissionRole, setPermissionRole] = useState<Role | null>(null)
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([])
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({})
  const [showAddModal, setShowAddModal] = useState(false)
  const [showPermissionModal, setShowPermissionModal] = useState(false)
  const [showDeleteRoleModal, setShowDeleteRoleModal] = useState(false)
  const [showEditRoleNameModal, setShowEditRoleNameModal] = useState(false)
  const [editingRoleName, setEditingRoleName] = useState<Role | null>(null)
  const [updatedRoleName, setUpdatedRoleName] = useState('')
  const [deletingRoleId, setDeletingRoleId] = useState<string | null>(null)
  const [deletingRoleName, setDeletingRoleName] = useState<string | null>(null)
  const [newRoleName, setNewRoleName] = useState('')
  const [isCreatingRole, setIsCreatingRole] = useState(false)
  const [isUpdatingRole, setIsUpdatingRole] = useState(false)
  const [isDeletingRole, setIsDeletingRole] = useState(false)
  const [isSavingPermissions, setIsSavingPermissions] = useState(false)
  const [isLoadingPermissions, setIsLoadingPermissions] = useState(false)

  // Load roles from API
  const loadRoles = async () => {
    try {
      const response = await getAllRoles()
      if (response.isSuccess && response.data) {
        // Map API roles to local Role interface
        const mappedRoles: Role[] = response.data.map((apiRole) => ({
          id: apiRole.id,
          name: apiRole.name,
          description: apiRole.description || '',
          permissions: apiRole.permissions || [],
          userCount: apiRole.userCount || 0,
          createdAt: apiRole.createdAt || new Date().toISOString().split('T')[0],
          updatedAt: apiRole.updatedAt || new Date().toISOString().split('T')[0],
        }))
        setRoles(mappedRoles)
        // Save to localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('roles', JSON.stringify(mappedRoles))
        }
      }
    } catch (error: any) {
      console.error('Error loading roles:', error)
      // Try to load from localStorage as fallback
      if (typeof window !== 'undefined') {
        const storedRoles = localStorage.getItem('roles')
        if (storedRoles) {
          try {
            setRoles(JSON.parse(storedRoles))
          } catch (e) {
            console.error('Error parsing stored roles:', e)
          }
        }
      }
    }
  }

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Try to load from localStorage first for immediate display
      const storedRoles = localStorage.getItem('roles')
      if (storedRoles) {
        try {
          setRoles(JSON.parse(storedRoles))
        } catch (e) {
          console.error('Error parsing stored roles:', e)
        }
      }
      // Load roles from API
      loadRoles()
    }
  }, [])

  const saveRoles = (updatedRoles: Role[]) => {
    setRoles(updatedRoles)
    if (typeof window !== 'undefined') {
      localStorage.setItem('roles', JSON.stringify(updatedRoles))
    }
  }

  const filteredRoles = roles.filter(
    (r) =>
      r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }))
  }

  const handleEdit = (role: Role) => {
    setEditingRoleName(role)
    setUpdatedRoleName(role.name)
    setShowEditRoleNameModal(true)
  }

  const handleCloseEditRoleNameModal = () => {
    setShowEditRoleNameModal(false)
    setEditingRoleName(null)
    setUpdatedRoleName('')
  }

  const handleSaveRoleName = async () => {
    if (!editingRoleName || !updatedRoleName.trim()) {
      toast.warning('Please enter a role name')
      return
    }

    if (updatedRoleName.trim() === editingRoleName.name) {
      toast.info('Role name is unchanged')
      handleCloseEditRoleNameModal()
      return
    }

    setIsUpdatingRole(true)
    try {
      const response = await updateRole({
        roleName: editingRoleName.name,
        updatedName: updatedRoleName.trim(),
      })
      if (response.isSuccess) {
        // Reload roles from API
        await loadRoles()
        handleCloseEditRoleNameModal()
        toast.success(response.message || 'Role name updated successfully')
      } else {
        toast.error(response.message || 'Failed to update role name')
      }
    } catch (error: any) {
      console.error('Error updating role name:', error)
      toast.error(error?.message || error?.data?.message || 'An error occurred while updating the role name')
    } finally {
      setIsUpdatingRole(false)
    }
  }

  const handleCancelEdit = () => {
    setEditingRole(null)
    setSelectedPermissions([])
    setExpandedCategories({})
  }

  const togglePermission = (permissionId: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(permissionId) ? prev.filter((id) => id !== permissionId) : [...prev, permissionId]
    )
  }

  const handleSave = () => {
    if (!editingRole) return

    const updatedRoles = roles.map((r) =>
      r.id === editingRole.id
        ? {
            ...r,
            permissions: selectedPermissions,
            updatedAt: new Date().toISOString().split('T')[0],
          }
        : r
    )
    saveRoles(updatedRoles)
    handleCancelEdit()
  }

  const handleDelete = (role: Role) => {
    setDeletingRoleId(role.id)
    setDeletingRoleName(role.name)
    setShowDeleteRoleModal(true)
  }

  const handleConfirmDelete = async () => {
    if (!deletingRoleId || !deletingRoleName) return

    setIsDeletingRole(true)
    try {
      const response = await removeRole({ roleName: deletingRoleName })
      if (response.isSuccess) {
        // Reload roles from API
        await loadRoles()
        setShowDeleteRoleModal(false)
        setDeletingRoleId(null)
        setDeletingRoleName(null)
        toast.success(response.message || 'Role deleted successfully')
      } else {
        toast.error(response.message || 'Failed to delete role')
      }
    } catch (error: any) {
      console.error('Error deleting role:', error)
      toast.error(error?.message || error?.data?.message || 'An error occurred while deleting the role')
    } finally {
      setIsDeletingRole(false)
    }
  }

  const handleAddRole = async () => {
    if (!newRoleName.trim()) {
      toast.warning('Please enter a role name')
      return
    }

    setIsCreatingRole(true)
    try {
      const response = await createRole({ roleName: newRoleName.trim() })
      if (response.isSuccess) {
        // Reload roles from API
        await loadRoles()
        setShowAddModal(false)
        setNewRoleName('')
        toast.success(response.message || 'Role created successfully')
      } else {
        toast.error(response.message || 'Failed to create role')
      }
    } catch (error: any) {
      console.error('Error creating role:', error)
      toast.error(error?.message || error?.data?.message || 'An error occurred while creating the role')
    } finally {
      setIsCreatingRole(false)
    }
  }

  const handleOpenPermissionModal = async (role: Role) => {
    setPermissionRole(role)
    setIsLoadingPermissions(true)
    setShowPermissionModal(true)
    
    try {
      const response = await getRoleClaims(role.name)
      if (response.isSuccess && response.data) {
        // Extract value from each claim object (e.g., 'Users.Read', 'PropertyUnit.Insert')
        // Filter out '*.*' as it represents all permissions
        const claims = response.data
          .map((claim) => claim.value)
          .filter((value) => value !== '*.*')
        setSelectedPermissions(claims)
      } else {
        // Fallback to role.permissions if API fails
        setSelectedPermissions([...role.permissions])
        if (response.message) {
          toast.warning(response.message || 'Failed to load permissions, using cached data')
        }
      }
    } catch (error: any) {
      console.error('Error loading role claims:', error)
      // Fallback to role.permissions if API fails
      setSelectedPermissions([...role.permissions])
      toast.error(error?.message || error?.data?.message || 'Failed to load permissions, using cached data')
    } finally {
      setIsLoadingPermissions(false)
    }
    
    const allExpanded: Record<string, boolean> = {}
    Object.keys(permissionCategories).forEach((cat) => {
      allExpanded[cat] = true
    })
    setExpandedCategories(allExpanded)
  }

  const handleClosePermissionModal = () => {
    setShowPermissionModal(false)
    setPermissionRole(null)
    setSelectedPermissions([])
    setExpandedCategories({})
  }

  const handleSavePermissions = async () => {
    if (!permissionRole) return

    setIsSavingPermissions(true)
    try {
      const response = await addClaimToRole({
        roleName: permissionRole.name,
        claimValue: selectedPermissions, // Array of permission IDs like ['Users.Read', 'PropertyUnit.Read']
      })
      if (response.isSuccess) {
        // Reload roles from API to get updated permissions
        await loadRoles()
        handleClosePermissionModal()
        toast.success(response.message || 'Permissions updated successfully')
      } else {
        toast.error(response.message || 'Failed to update permissions')
      }
    } catch (error: any) {
      console.error('Error updating permissions:', error)
      toast.error(error?.message || error?.data?.message || 'An error occurred while updating permissions')
    } finally {
      setIsSavingPermissions(false)
    }
  }

  const isPermissionSelected = (permissionId: string) => {
    return selectedPermissions.includes(permissionId)
  }

  const selectAllInCategory = (category: string) => {
    const categoryPermissions = permissionCategories[category as keyof typeof permissionCategories].permissions.map(
      (p) => p.id
    )
    const allSelected = categoryPermissions.every((id) => selectedPermissions.includes(id))

    if (allSelected) {
      setSelectedPermissions((prev) => prev.filter((id) => !categoryPermissions.includes(id)))
    } else {
      setSelectedPermissions((prev) => [...new Set([...prev, ...categoryPermissions])])
    }
  }

  return (
    <div>
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6 border-b flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">Create New Role</h3>
              <button
                onClick={() => {
                  setShowAddModal(false)
                  setNewRoleName('')
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Role Name *</label>
                <input
                  type="text"
                  value={newRoleName}
                  onChange={(e) => setNewRoleName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="e.g., Content Manager"
                />
                <p className="text-xs text-gray-500 mt-2">
                  You can assign permissions to this role after creation.
                </p>
              </div>
            </div>

            <div className="p-6 border-t flex items-center justify-end gap-3">
              <button
                onClick={() => {
                  setShowAddModal(false)
                  setNewRoleName('')
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddRole}
                disabled={isCreatingRole}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-4 h-4" />
                {isCreatingRole ? 'Creating...' : 'Create Role'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showEditRoleNameModal && editingRoleName && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6 border-b flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">Edit Role Name</h3>
              <button
                onClick={handleCloseEditRoleNameModal}
                className="text-gray-400 hover:text-gray-600"
                disabled={isUpdatingRole}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Current Role Name</label>
                <input
                  type="text"
                  value={editingRoleName.name}
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">New Role Name *</label>
                <input
                  type="text"
                  value={updatedRoleName}
                  onChange={(e) => setUpdatedRoleName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !isUpdatingRole) {
                      handleSaveRoleName()
                    }
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter new role name"
                  autoFocus
                />
              </div>
            </div>

            <div className="p-6 border-t flex items-center justify-end gap-3">
              <button
                onClick={handleCloseEditRoleNameModal}
                disabled={isUpdatingRole}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveRoleName}
                disabled={isUpdatingRole || !updatedRoleName.trim()}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-4 h-4" />
                {isUpdatingRole ? 'Updating...' : 'Update Role Name'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showPermissionModal && permissionRole && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Manage Permissions: {permissionRole.name}</h3>
                <p className="text-sm text-gray-600 mt-1">Select permissions for this role</p>
              </div>
              <button
                onClick={handleClosePermissionModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1">
              {isLoadingPermissions ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mb-4"></div>
                    <p className="text-sm text-gray-600">Loading permissions...</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {Object.entries(permissionCategories).map(([categoryKey, category]) => {
                  const isExpanded = expandedCategories[categoryKey] || false
                  const categoryPermissions = category.permissions
                  const allSelected = categoryPermissions.every((p) => selectedPermissions.includes(p.id))

                  return (
                    <div key={categoryKey} className="border border-gray-200 rounded-lg">
                      <button
                        onClick={() => toggleCategory(categoryKey)}
                        className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition"
                      >
                        <div className="flex items-center gap-3">
                          {isExpanded ? (
                            <ChevronDown className="w-5 h-5 text-gray-500" />
                          ) : (
                            <ChevronRight className="w-5 h-5 text-gray-500" />
                          )}
                          <span className="text-2xl">{category.icon}</span>
                          <span className="font-semibold text-gray-900">{category.name}</span>
                          <span className="text-sm text-gray-500">
                            ({categoryPermissions.filter((p) => selectedPermissions.includes(p.id)).length}/
                            {categoryPermissions.length})
                          </span>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            selectAllInCategory(categoryKey)
                          }}
                          className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                        >
                          {allSelected ? 'Deselect All' : 'Select All'}
                        </button>
                      </button>

                      {isExpanded && (
                        <div className="px-4 pb-3 space-y-2 border-t border-gray-100">
                          {categoryPermissions.map((permission) => (
                            <label
                              key={permission.id}
                              className="flex items-start gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer"
                            >
                              <div className="mt-1">
                                {isPermissionSelected(permission.id) ? (
                                  <CheckSquare className="w-5 h-5 text-primary-600" />
                                ) : (
                                  <Square className="w-5 h-5 text-gray-400" />
                                )}
                              </div>
                              <div className="flex-1">
                                <div className="font-medium text-gray-900">{permission.name}</div>
                                <div className="text-sm text-gray-500">{permission.description}</div>
                              </div>
                              <input
                                type="checkbox"
                                checked={isPermissionSelected(permission.id)}
                                onChange={() => togglePermission(permission.id)}
                                className="hidden"
                              />
                            </label>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                })}
                </div>
              )}
            </div>

            <div className="p-6 border-t flex items-center justify-end gap-3">
              <button
                onClick={handleClosePermissionModal}
                disabled={isSavingPermissions || isLoadingPermissions}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={handleSavePermissions}
                disabled={isSavingPermissions || isLoadingPermissions}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-4 h-4" />
                {isSavingPermissions ? 'Saving...' : 'Save Permissions'}
              </button>
            </div>
          </div>
        </div>
      )}

      {editingRole && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Edit Role: {editingRole.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{editingRole.description}</p>
              </div>
              <button onClick={handleCancelEdit} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1">
              <div className="mb-4">
                <p className="text-sm text-gray-600">
                  Select permissions for this role. Permissions are organized by category.
                </p>
              </div>

              <div className="space-y-3">
                {Object.entries(permissionCategories).map(([categoryKey, category]) => {
                  const isExpanded = expandedCategories[categoryKey] || false
                  const categoryPermissions = category.permissions
                  const allSelected = categoryPermissions.every((p) => selectedPermissions.includes(p.id))
                  const someSelected = categoryPermissions.some((p) => selectedPermissions.includes(p.id))

                  return (
                    <div key={categoryKey} className="border border-gray-200 rounded-lg">
                      <button
                        onClick={() => toggleCategory(categoryKey)}
                        className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition"
                      >
                        <div className="flex items-center gap-3">
                          {isExpanded ? (
                            <ChevronDown className="w-5 h-5 text-gray-500" />
                          ) : (
                            <ChevronRight className="w-5 h-5 text-gray-500" />
                          )}
                          <span className="text-2xl">{category.icon}</span>
                          <span className="font-semibold text-gray-900">{category.name}</span>
                          <span className="text-sm text-gray-500">
                            ({categoryPermissions.filter((p) => selectedPermissions.includes(p.id)).length}/
                            {categoryPermissions.length})
                          </span>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            selectAllInCategory(categoryKey)
                          }}
                          className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                        >
                          {allSelected ? 'Deselect All' : 'Select All'}
                        </button>
                      </button>

                      {isExpanded && (
                        <div className="px-4 pb-3 space-y-2 border-t border-gray-100">
                          {categoryPermissions.map((permission) => (
                            <label
                              key={permission.id}
                              className="flex items-start gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer"
                            >
                              <div className="mt-1">
                                {isPermissionSelected(permission.id) ? (
                                  <CheckSquare className="w-5 h-5 text-primary-600" />
                                ) : (
                                  <Square className="w-5 h-5 text-gray-400" />
                                )}
                              </div>
                              <div className="flex-1">
                                <div className="font-medium text-gray-900">{permission.name}</div>
                                <div className="text-sm text-gray-500">{permission.description}</div>
                              </div>
                              <input
                                type="checkbox"
                                checked={isPermissionSelected(permission.id)}
                                onChange={() => togglePermission(permission.id)}
                                className="hidden"
                              />
                            </label>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="p-6 border-t flex items-center justify-end gap-3">
              <button
                onClick={handleCancelEdit}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900">Roles & Permissions</h2>
            <p className="text-sm text-gray-600 mt-1">Manage user roles and their access permissions</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center gap-2 text-sm"
          >
            <Plus className="w-4 h-4" />
            Add Role
          </button>
        </div>

        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search roles..."
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
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Role</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRoles.map((role) => (
                <tr key={role.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                        <Shield className="w-5 h-5 text-primary-600" />
                      </div>
                      <span className="text-sm font-medium text-gray-900">{role.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleOpenPermissionModal(role)}
                        className="p-2 text-purple-600 hover:bg-purple-50 rounded"
                        title="Manage Permissions"
                      >
                        <KeyRound className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEdit(role)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(role)}
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
            Showing {filteredRoles.length} of {roles.length} roles
          </p>
        </div>
      </div>

      {/* Delete Role Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteRoleModal}
        onClose={() => {
          setShowDeleteRoleModal(false)
          setDeletingRoleId(null)
          setDeletingRoleName(null)
        }}
        onConfirm={handleConfirmDelete}
        title="Delete Role"
        message="Are you sure you want to delete this role? This action cannot be undone."
        confirmText="Delete Role"
        confirmButtonColor="red"
        isLoading={isDeletingRole}
        details={
          deletingRoleName
            ? [
                {
                  label: 'Role',
                  value: deletingRoleName,
                },
              ]
            : []
        }
      />
    </div>
  )
}

