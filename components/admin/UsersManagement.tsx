'use client'

import { useState, useEffect } from 'react'
import { Search, UserPlus, Mail, Shield, Ban, Edit, X, Save, KeyRound } from 'lucide-react'
import { Role } from './RolesManagement'

interface User {
  id: string
  name: string
  email: string
  password?: string
  roleId: string // Role ID instead of role string
  roleName?: string // For display purposes
  status: 'active' | 'inactive' | 'suspended'
  registeredAt: string
  lastLogin: string
}

const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    roleId: '3',
    roleName: 'Property Manager',
    status: 'active',
    registeredAt: '2024-01-15',
    lastLogin: '2024-12-20',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    roleId: '4',
    roleName: 'Viewer',
    status: 'active',
    registeredAt: '2024-02-20',
    lastLogin: '2024-12-19',
  },
  {
    id: '3',
    name: 'Admin User',
    email: 'admin@example.com',
    roleId: '1',
    roleName: 'Super Admin',
    status: 'active',
    registeredAt: '2024-01-01',
    lastLogin: '2024-12-20',
  },
]

export default function UsersManagement() {
  const [users, setUsers] = useState<User[]>(mockUsers)
  const [roles, setRoles] = useState<Role[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  
  // Form states
  const [newUserName, setNewUserName] = useState('')
  const [newUserEmail, setNewUserEmail] = useState('')
  const [newUserPassword, setNewUserPassword] = useState('')
  const [newUserRoleId, setNewUserRoleId] = useState('')
  const [newUserStatus, setNewUserStatus] = useState<'active' | 'inactive' | 'suspended'>('active')

  // Load roles and users from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Default roles definition
      const defaultRoles: Role[] = [
        {
          id: '1',
          name: 'Super Admin',
          description: 'Full access to all system features',
          permissions: [],
          userCount: 0,
          createdAt: '2024-01-01',
          updatedAt: '2024-12-20',
        },
        {
          id: '2',
          name: 'Admin',
          description: 'Administrative access with most permissions',
          permissions: [],
          userCount: 0,
          createdAt: '2024-01-15',
          updatedAt: '2024-12-19',
        },
        {
          id: '3',
          name: 'Property Manager',
          description: 'Manage properties and view analytics',
          permissions: [],
          userCount: 0,
          createdAt: '2024-02-01',
          updatedAt: '2024-12-18',
        },
        {
          id: '4',
          name: 'Viewer',
          description: 'Read-only access to properties and analytics',
          permissions: [],
          userCount: 0,
          createdAt: '2024-02-15',
          updatedAt: '2024-12-17',
        },
      ]

      const storedRoles = localStorage.getItem('roles')
      let currentRoles: Role[] = defaultRoles
      
      if (storedRoles) {
        currentRoles = JSON.parse(storedRoles)
        setRoles(currentRoles)
      } else {
        setRoles(defaultRoles)
        localStorage.setItem('roles', JSON.stringify(defaultRoles))
      }

      const storedUsers = localStorage.getItem('users')
      if (storedUsers) {
        const parsedUsers = JSON.parse(storedUsers)
        // Update role names from roles
        const usersWithRoleNames = parsedUsers.map((user: User) => {
          const role = currentRoles.find((r: Role) => r.id === user.roleId)
          return {
            ...user,
            roleName: role?.name || 'Unknown'
          }
        })
        setUsers(usersWithRoleNames)
      } else {
        // Update mock users with role names
        const usersWithRoleNames = mockUsers.map((user) => {
          const role = currentRoles.find((r: Role) => r.id === user.roleId)
          return {
            ...user,
            roleName: role?.name || user.roleName || 'Unknown'
          }
        })
        setUsers(usersWithRoleNames)
        localStorage.setItem('users', JSON.stringify(usersWithRoleNames))
      }
    }
  }, [])

  // Update users when roles change (only update role names, not trigger re-renders unnecessarily)
  useEffect(() => {
    if (roles.length > 0 && users.length > 0) {
      setUsers((prevUsers) => {
        const updatedUsers = prevUsers.map((user) => {
          const role = roles.find((r) => r.id === user.roleId)
          const newRoleName = role?.name || 'Unknown'
          // Only update if role name changed
          if (user.roleName === newRoleName) {
            return user
          }
          return {
            ...user,
            roleName: newRoleName
          }
        })
        // Check if any user was actually updated
        const hasChanges = updatedUsers.some((user, index) => user.roleName !== prevUsers[index]?.roleName)
        if (hasChanges && typeof window !== 'undefined') {
          localStorage.setItem('users', JSON.stringify(updatedUsers))
        }
        return updatedUsers
      })
    }
  }, [roles])

  // Save users to localStorage
  const saveUsers = (updatedUsers: User[]) => {
    setUsers(updatedUsers)
    if (typeof window !== 'undefined') {
      localStorage.setItem('users', JSON.stringify(updatedUsers))
    }
    // Update role user counts
    if (typeof window !== 'undefined') {
      const updatedRoles = roles.map((role) => {
        const userCount = updatedUsers.filter((u) => u.roleId === role.id).length
        return { ...role, userCount }
      })
      setRoles(updatedRoles)
      localStorage.setItem('roles', JSON.stringify(updatedRoles))
    }
  }

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.roleName?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getRoleColor = (roleName: string) => {
    switch (roleName?.toLowerCase()) {
      case 'super admin':
        return 'bg-red-100 text-red-800'
      case 'admin':
        return 'bg-orange-100 text-orange-800'
      case 'property manager':
        return 'bg-purple-100 text-purple-800'
      case 'viewer':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'suspended':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const handleAddUser = () => {
    if (!newUserName.trim() || !newUserEmail.trim() || !newUserPassword.trim() || !newUserRoleId) {
      alert('Please fill in all required fields')
      return
    }

    // Check if email already exists
    if (users.some((u) => u.email.toLowerCase() === newUserEmail.toLowerCase())) {
      alert('Email already exists')
      return
    }

    const selectedRole = roles.find((r) => r.id === newUserRoleId)
    const newUser: User = {
      id: Date.now().toString(),
      name: newUserName,
      email: newUserEmail,
      password: newUserPassword, // In production, this should be hashed
      roleId: newUserRoleId,
      roleName: selectedRole?.name || 'Unknown',
      status: newUserStatus,
      registeredAt: new Date().toISOString().split('T')[0],
      lastLogin: 'Never',
    }

    saveUsers([...users, newUser])
    setShowAddModal(false)
    setNewUserName('')
    setNewUserEmail('')
    setNewUserPassword('')
    setNewUserRoleId('')
    setNewUserStatus('active')
  }

  const handleEditUser = (user: User) => {
    setEditingUser(user)
    setNewUserRoleId(user.roleId)
    setNewUserStatus(user.status)
    setShowEditModal(true)
  }

  const handleSaveEdit = () => {
    if (!editingUser || !newUserRoleId) return

    const selectedRole = roles.find((r) => r.id === newUserRoleId)
    const updatedUsers = users.map((u) =>
      u.id === editingUser.id
        ? {
            ...u,
            roleId: newUserRoleId,
            roleName: selectedRole?.name || 'Unknown',
            status: newUserStatus,
          }
        : u
    )

    saveUsers(updatedUsers)
    setShowEditModal(false)
    setEditingUser(null)
    setNewUserRoleId('')
    setNewUserStatus('active')
  }

  const handleSuspendUser = (userId: string) => {
    const updatedUsers = users.map((u) =>
      u.id === userId ? { ...u, status: u.status === 'suspended' ? 'active' : 'suspended' } : u
    )
    saveUsers(updatedUsers)
  }

  const handleDeleteUser = (userId: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      const updatedUsers = users.filter((u) => u.id !== userId)
      saveUsers(updatedUsers)
    }
  }

  return (
    <div className="space-y-6">
      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6 border-b flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">Create New User</h3>
              <button
                onClick={() => {
                  setShowAddModal(false)
                  setNewUserName('')
                  setNewUserEmail('')
                  setNewUserPassword('')
                  setNewUserRoleId('')
                  setNewUserStatus('active')
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                <input
                  type="text"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                <input
                  type="email"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter email address"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password *</label>
                <input
                  type="password"
                  value={newUserPassword}
                  onChange={(e) => setNewUserPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter password"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Role *</label>
                <select
                  value={newUserRoleId}
                  onChange={(e) => setNewUserRoleId(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">Select a role</option>
                  {roles.map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={newUserStatus}
                  onChange={(e) => setNewUserStatus(e.target.value as 'active' | 'inactive' | 'suspended')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>
            </div>

            <div className="p-6 border-t flex items-center justify-end gap-3">
              <button
                onClick={() => {
                  setShowAddModal(false)
                  setNewUserName('')
                  setNewUserEmail('')
                  setNewUserPassword('')
                  setNewUserRoleId('')
                  setNewUserStatus('active')
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddUser}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Create User
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit User / Assign Role Modal */}
      {showEditModal && editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6 border-b flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Edit User: {editingUser.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{editingUser.email}</p>
              </div>
              <button
                onClick={() => {
                  setShowEditModal(false)
                  setEditingUser(null)
                  setNewUserRoleId('')
                  setNewUserStatus('active')
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Assign Role *</label>
                <select
                  value={newUserRoleId}
                  onChange={(e) => setNewUserRoleId(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">Select a role</option>
                  {roles.map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.name} - {role.description}
                    </option>
                  ))}
                </select>
                {newUserRoleId && (
                  <p className="text-xs text-gray-500 mt-2">
                    Current: {roles.find((r) => r.id === newUserRoleId)?.name}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={newUserStatus}
                  onChange={(e) => setNewUserStatus(e.target.value as 'active' | 'inactive' | 'suspended')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>
            </div>

            <div className="p-6 border-t flex items-center justify-end gap-3">
              <button
                onClick={() => {
                  setShowEditModal(false)
                  setEditingUser(null)
                  setNewUserRoleId('')
                  setNewUserStatus('active')
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
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
            <h2 className="text-xl md:text-2xl font-bold text-gray-900">Users Management</h2>
            <p className="text-sm text-gray-600 mt-1">Manage user accounts and permissions</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center gap-2 text-sm"
          >
            <UserPlus className="w-4 h-4" />
            Add User
          </button>
        </div>

        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search users..."
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
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">User</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Email</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Role</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Last Login</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                        <span className="text-primary-600 font-semibold">
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <span className="text-sm font-medium text-gray-900">{user.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-700">{user.email}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${getRoleColor(user.roleName || '')}`}>
                      {user.roleName || 'Unknown'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(user.status)}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm text-gray-600">{user.lastLogin}</span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleEditUser(user)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                        title="Edit Role"
                      >
                        <KeyRound className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleSuspendUser(user.id)}
                        className="p-2 text-orange-600 hover:bg-orange-50 rounded"
                        title={user.status === 'suspended' ? 'Activate' : 'Suspend'}
                      >
                        <Ban className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded"
                        title="Delete"
                      >
                        <X className="w-4 h-4" />
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
            Showing {filteredUsers.length} of {users.length} users
          </p>
        </div>
      </div>
    </div>
  )
}

