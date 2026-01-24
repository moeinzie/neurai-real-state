'use client'

import { useState, useEffect } from 'react'
import { Search, Plus, Edit, Trash2, Save, X, ChevronDown, ChevronRight, Shield, CheckSquare, Square } from 'lucide-react'

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
  properties: {
    name: 'Properties Management',
    icon: '🏠',
    permissions: [
      { id: 'properties.view', name: 'View Properties', description: 'View property listings' },
      { id: 'properties.create', name: 'Create Properties', description: 'Add new properties' },
      { id: 'properties.edit', name: 'Edit Properties', description: 'Modify existing properties' },
      { id: 'properties.delete', name: 'Delete Properties', description: 'Remove properties' },
      { id: 'properties.import', name: 'Import Properties', description: 'Import properties from files' },
      { id: 'properties.export', name: 'Export Properties', description: 'Export properties to files' },
      { id: 'properties.publish', name: 'Publish Properties', description: 'Publish properties publicly' },
    ],
  },
  users: {
    name: 'Users Management',
    icon: '👥',
    permissions: [
      { id: 'users.view', name: 'View Users', description: 'View user list and details' },
      { id: 'users.create', name: 'Create Users', description: 'Add new users' },
      { id: 'users.edit', name: 'Edit Users', description: 'Modify user information' },
      { id: 'users.delete', name: 'Delete Users', description: 'Remove users' },
      { id: 'users.suspend', name: 'Suspend Users', description: 'Suspend user accounts' },
      { id: 'users.activate', name: 'Activate Users', description: 'Activate suspended users' },
    ],
  },
  roles: {
    name: 'Roles & Permissions',
    icon: '🔐',
    permissions: [
      { id: 'roles.view', name: 'View Roles', description: 'View roles and permissions' },
      { id: 'roles.create', name: 'Create Roles', description: 'Create new roles' },
      { id: 'roles.edit', name: 'Edit Roles', description: 'Modify roles and permissions' },
      { id: 'roles.delete', name: 'Delete Roles', description: 'Remove roles' },
      { id: 'roles.assign', name: 'Assign Roles', description: 'Assign roles to users' },
    ],
  },
  analytics: {
    name: 'Analytics & Reports',
    icon: '📊',
    permissions: [
      { id: 'analytics.view', name: 'View Analytics', description: 'Access analytics dashboard' },
      { id: 'analytics.export', name: 'Export Reports', description: 'Export analytics reports' },
      { id: 'analytics.custom', name: 'Custom Reports', description: 'Create custom reports' },
    ],
  },
  portfolio: {
    name: 'Portfolio Management',
    icon: '📁',
    permissions: [
      { id: 'portfolio.view', name: 'View Portfolio', description: 'View user portfolios' },
      { id: 'portfolio.manage', name: 'Manage Portfolio', description: 'Manage portfolio items' },
    ],
  },
  admin: {
    name: 'Administration',
    icon: '⚙️',
    permissions: [
      { id: 'admin.settings', name: 'System Settings', description: 'Modify system settings' },
      { id: 'admin.logs', name: 'View Logs', description: 'Access activity logs' },
      { id: 'admin.backup', name: 'Backup & Restore', description: 'Backup and restore data' },
      { id: 'admin.maintenance', name: 'Maintenance Mode', description: 'Enable maintenance mode' },
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
      'properties.view',
      'properties.create',
      'properties.edit',
      'properties.delete',
      'users.view',
      'users.edit',
      'analytics.view',
      'portfolio.view',
    ],
    userCount: 5,
    createdAt: '2024-01-15',
    updatedAt: '2024-12-19',
  },
  {
    id: '3',
    name: 'Property Manager',
    description: 'Manage properties and view analytics',
    permissions: [
      'properties.view',
      'properties.create',
      'properties.edit',
      'analytics.view',
      'portfolio.view',
    ],
    userCount: 12,
    createdAt: '2024-02-01',
    updatedAt: '2024-12-18',
  },
  {
    id: '4',
    name: 'Viewer',
    description: 'Read-only access to properties and analytics',
    permissions: ['properties.view', 'analytics.view', 'portfolio.view'],
    userCount: 45,
    createdAt: '2024-02-15',
    updatedAt: '2024-12-17',
  },
]

export default function RolesManagement() {
  const [roles, setRoles] = useState<Role[]>(mockRoles)
  const [searchTerm, setSearchTerm] = useState('')
  const [editingRole, setEditingRole] = useState<Role | null>(null)
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([])
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({})
  const [showAddModal, setShowAddModal] = useState(false)
  const [newRoleName, setNewRoleName] = useState('')
  const [newRoleDescription, setNewRoleDescription] = useState('')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedRoles = localStorage.getItem('roles')
      if (storedRoles) {
        setRoles(JSON.parse(storedRoles))
      }
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
    setEditingRole(role)
    setSelectedPermissions([...role.permissions])
    const allExpanded: Record<string, boolean> = {}
    Object.keys(permissionCategories).forEach((cat) => {
      allExpanded[cat] = true
    })
    setExpandedCategories(allExpanded)
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

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this role?')) {
      const updatedRoles = roles.filter((r) => r.id !== id)
      saveRoles(updatedRoles)
    }
  }

  const handleAddRole = () => {
    if (!newRoleName.trim()) return

    const newRole: Role = {
      id: Date.now().toString(),
      name: newRoleName,
      description: newRoleDescription,
      permissions: selectedPermissions,
      userCount: 0,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    }

    saveRoles([...roles, newRole])
    setShowAddModal(false)
    setNewRoleName('')
    setNewRoleDescription('')
    setSelectedPermissions([])
    setExpandedCategories({})
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
    <div className="space-y-6">
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">Create New Role</h3>
              <button
                onClick={() => {
                  setShowAddModal(false)
                  setNewRoleName('')
                  setNewRoleDescription('')
                  setSelectedPermissions([])
                  setExpandedCategories({})
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1">
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Role Name</label>
                <input
                  type="text"
                  value={newRoleName}
                  onChange={(e) => setNewRoleName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="e.g., Content Manager"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={newRoleDescription}
                  onChange={(e) => setNewRoleDescription(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  rows={3}
                  placeholder="Describe the role's purpose..."
                />
              </div>

              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Permissions</h4>
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
            </div>

            <div className="p-6 border-t flex items-center justify-end gap-3">
              <button
                onClick={() => {
                  setShowAddModal(false)
                  setNewRoleName('')
                  setNewRoleDescription('')
                  setSelectedPermissions([])
                  setExpandedCategories({})
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddRole}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Create Role
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
            onClick={() => {
              setShowAddModal(true)
              const allExpanded: Record<string, boolean> = {}
              Object.keys(permissionCategories).forEach((cat) => {
                allExpanded[cat] = true
              })
              setExpandedCategories(allExpanded)
            }}
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
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Description</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Permissions</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Users</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Last Updated</th>
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
                    <span className="text-sm text-gray-700">{role.description}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm text-gray-600">{role.permissions.length} permissions</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm text-gray-600">{role.userCount} users</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm text-gray-600">{role.updatedAt}</span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleEdit(role)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(role.id)}
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
    </div>
  )
}

