'use client'

import { useState, useEffect, useRef } from 'react'
import { Search, UserPlus, Edit, X, Save, KeyRound, UserCog, UserMinus } from 'lucide-react'
import { Role } from './RolesManagement'
import { createUser, getAllUsers, getAllRoles, resetPassword, addRoleToUser, removeRoleFromUser } from '@/lib/api/auth'
import { useToast } from '@/components/ui/Toast'
import ConfirmationModal from '@/components/ui/ConfirmationModal'

interface User {
  id: string
  name: string
  password?: string
  roleId: string // Role ID instead of role string
  roleName?: string // For display purposes
  roles?: string[] // Array of role names from API
  registeredAt: string
}

const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    roleId: '3',
    roleName: 'Property Manager',
    registeredAt: '2024-01-15',
  },
  {
    id: '2',
    name: 'Jane Smith',
    roleId: '4',
    roleName: 'Viewer',
    registeredAt: '2024-02-20',
  },
  {
    id: '3',
    name: 'Admin User',
    roleId: '1',
    roleName: 'Super Admin',
    registeredAt: '2024-01-01',
  },
]

export default function UsersManagement() {
  const toast = useToast()
  
  // Load users from localStorage on mount if available
  const getStoredUsers = (): User[] => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('users')
      if (stored) {
        try {
          return JSON.parse(stored)
        } catch (e) {
          return []
        }
      }
    }
    return []
  }

  const [users, setUsers] = useState<User[]>(getStoredUsers)
  const [roles, setRoles] = useState<Role[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showAssignRoleModal, setShowAssignRoleModal] = useState(false)
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false)
  const [showRemoveRoleModal, setShowRemoveRoleModal] = useState(false)
  const [showDeleteUserModal, setShowDeleteUserModal] = useState(false)
  const [showResetPasswordConfirmModal, setShowResetPasswordConfirmModal] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [assigningRoleUser, setAssigningRoleUser] = useState<User | null>(null)
  const [passwordResettingUser, setPasswordResettingUser] = useState<User | null>(null)
  const [removingRoleUser, setRemovingRoleUser] = useState<User | null>(null)
  const [removingRoleName, setRemovingRoleName] = useState<string>('')
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null)
  const [isCreatingUser, setIsCreatingUser] = useState(false)
  const [isResettingPassword, setIsResettingPassword] = useState(false)
  const [isLoadingUsers, setIsLoadingUsers] = useState(false)
  const [isSavingRole, setIsSavingRole] = useState(false)
  const hasLoadedOnce = useRef(users.length > 0)
  
  // Form states
  const [newUserName, setNewUserName] = useState('')
  const [newUserPassword, setNewUserPassword] = useState('')
  const [newUserRoleId, setNewUserRoleId] = useState('')
  const [assignRoleId, setAssignRoleId] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

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

  // Load users from API
  const loadUsers = async (showFullLoading = false) => {
    // Show full loading only if explicitly requested or if we haven't loaded before
    const shouldShowFullLoading = showFullLoading || !hasLoadedOnce.current
    
    // Always set loading, but UI will decide whether to show full or small loading
    setIsLoadingUsers(true)
    
    try {
      const response = await getAllUsers()
      if (response.isSuccess && response.data) {
        // Map API users to local User interface
        const mappedUsers: User[] = response.data.map((apiUser) => ({
          id: apiUser.id,
          name: apiUser.username,
          roleId: apiUser.roles?.[0] || '',
          roleName: apiUser.roles?.join(', ') || 'No Role',
          roles: apiUser.roles || [],
          registeredAt: new Date().toISOString().split('T')[0],
        }))
        setUsers(mappedUsers)
        hasLoadedOnce.current = true
        // Save to localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('users', JSON.stringify(mappedUsers))
        }
      }
    } catch (error: any) {
      console.error('Error loading users:', error)
      // Only show toast if we don't have existing users
      if (!hasLoadedOnce.current) {
        toast.error(error?.message || error?.data?.message || 'Failed to load users')
      }
    } finally {
      setIsLoadingUsers(false)
    }
  }

  // Load roles and users
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Try to load roles from localStorage first for immediate display
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
      
      // Load users from API
      loadUsers()
    }
  }, [])

  // Update users when roles change (only update role names, not trigger re-renders unnecessarily)
  useEffect(() => {
    if (roles.length > 0 && users.length > 0) {
      setUsers((prevUsers) => {
        const updatedUsers = prevUsers.map((user) => {
          const role = roles.find((r) => r.id === user.roleId)
          const newRoleName = role?.name || user.roleName || 'Unknown'
          // Only update if role name changed
          if (user.roleName === newRoleName) {
            return user
          }
          return {
            ...user,
            roleName: newRoleName
          }
        })
        return updatedUsers
      })
    }
  }, [roles, users.length])

  // Update users state
  const updateUsers = (updatedUsers: User[]) => {
    setUsers(updatedUsers)
    // Save to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('users', JSON.stringify(updatedUsers))
      // Update role user counts
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
      u.roleName?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getRoleColor = (roleName: string) => {
    const role = roleName?.toLowerCase().trim()
    switch (role) {
      case 'super admin':
      case 'superadmin':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'admin':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'property manager':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'viewer':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }


  const handleAddUser = async () => {
    if (!newUserName.trim() || !newUserPassword.trim()) {
      toast.warning('Please fill in username and password')
      return
    }

    setIsCreatingUser(true)
    try {
      // Call API to create user
      const response = await createUser({
        username: newUserName.trim(),
        password: newUserPassword,
      })

      if (response.isSuccess) {
        // Add user to local state if needed
        const selectedRole = roles.find((r) => r.id === newUserRoleId)
        const newUser: User = {
          id: Date.now().toString(),
          name: newUserName,
          password: newUserPassword,
          roleId: newUserRoleId || roles[0]?.id || '',
          roleName: selectedRole?.name || roles[0]?.name || 'Unknown',
          registeredAt: new Date().toISOString().split('T')[0],
        }

        // Reload users from API after creating
        await loadUsers(false)
        setShowAddModal(false)
        setNewUserName('')
        setNewUserPassword('')
        setNewUserRoleId('')
        toast.success(response.message || 'User created successfully')
      } else {
        toast.error(response.message || 'Failed to create user')
      }
    } catch (error: any) {
      console.error('Error creating user:', error)
      toast.error(error?.message || error?.data?.message || 'An error occurred while creating the user')
    } finally {
      setIsCreatingUser(false)
    }
  }

  const handleAssignRole = (user: User) => {
    setAssigningRoleUser(user)
    setAssignRoleId('')
    setShowAssignRoleModal(true)
  }

  const handleSaveAssignRole = async () => {
    if (!assigningRoleUser || !assignRoleId) {
      toast.warning('Please select a role')
      return
    }

    const selectedRole = roles.find((r) => r.id === assignRoleId)
    if (!selectedRole) {
      toast.error('Selected role not found')
      return
    }

    setIsSavingRole(true)
    try {
      const response = await addRoleToUser({
        username: assigningRoleUser.name,
        roleName: selectedRole.name,
      })

      if (response.isSuccess) {
        await loadUsers(false)
        setShowAssignRoleModal(false)
        setAssigningRoleUser(null)
        setAssignRoleId('')
        toast.success(response.message || 'Role assigned successfully')
      } else {
        toast.error(response.message || 'Failed to assign role')
      }
    } catch (error: any) {
      console.error('Error assigning role:', error)
      toast.error(error?.data?.message || error?.message || 'An error occurred while assigning role')
    } finally {
      setIsSavingRole(false)
    }
  }

  const handleRemoveRole = (user: User, roleName: string) => {
    setRemovingRoleUser(user)
    setRemovingRoleName(roleName)
    setShowRemoveRoleModal(true)
  }

  const handleConfirmRemoveRole = async () => {
    if (!removingRoleUser || !removingRoleName) return

    setIsSavingRole(true)
    try {
      const response = await removeRoleFromUser({
        username: removingRoleUser.name,
        roleName: removingRoleName,
      })

      if (response.isSuccess) {
        await loadUsers(false)
        setShowRemoveRoleModal(false)
        setRemovingRoleUser(null)
        setRemovingRoleName('')
        toast.success(response.message || 'Role removed successfully')
      } else {
        toast.error(response.message || 'Failed to remove role')
      }
    } catch (error: any) {
      console.error('Error removing role:', error)
      toast.error(error?.data?.message || error?.message || 'An error occurred while removing role')
    } finally {
      setIsSavingRole(false)
    }
  }

  const handleSaveEdit = async () => {
    if (!editingUser || !newUserRoleId) return

    const selectedRole = roles.find((r) => r.id === newUserRoleId)
    if (!selectedRole) {
      toast.error('Selected role not found')
      return
    }

    setIsSavingRole(true)
    try {
      // Remove all old roles if user has roles
      if (editingUser.roles && editingUser.roles.length > 0) {
        // Remove each existing role
        for (const oldRoleName of editingUser.roles) {
          if (oldRoleName !== selectedRole.name) {
            try {
              await removeRoleFromUser({
                username: editingUser.name,
                roleName: oldRoleName,
              })
            } catch (error: any) {
              console.error(`Error removing role ${oldRoleName}:`, error)
              // Continue even if removal fails
            }
          }
        }
      } else if (editingUser.roleName && editingUser.roleName !== selectedRole.name) {
        // Fallback: if roleName exists but roles array doesn't
        try {
          await removeRoleFromUser({
            username: editingUser.name,
            roleName: editingUser.roleName,
          })
        } catch (error: any) {
          console.error('Error removing old role:', error)
          // Continue even if removal fails
        }
      }

      // Add new role (only if it's not already assigned)
      if (!editingUser.roles?.includes(selectedRole.name)) {
        const response = await addRoleToUser({
          username: editingUser.name,
          roleName: selectedRole.name,
        })

        if (response.isSuccess) {
          // Reload users from API to get updated roles
          await loadUsers(false)
          setShowEditModal(false)
          setEditingUser(null)
          setNewUserRoleId('')
          toast.success(response.message || 'Role assigned successfully')
        } else {
          toast.error(response.message || 'Failed to assign role')
        }
      } else {
        // Role already assigned, just close modal
        setShowEditModal(false)
        setEditingUser(null)
        setNewUserRoleId('')
        toast.info('Role is already assigned to this user')
      }
    } catch (error: any) {
      console.error('Error assigning role:', error)
      toast.error(error?.data?.message || error?.message || 'An error occurred while assigning role')
    } finally {
      setIsSavingRole(false)
    }
  }


  const handleDeleteUser = (userId: string) => {
    setDeletingUserId(userId)
    setShowDeleteUserModal(true)
  }

  const handleConfirmDeleteUser = () => {
    if (!deletingUserId) return
    const updatedUsers = users.filter((u) => u.id !== deletingUserId)
    updateUsers(updatedUsers)
    setShowDeleteUserModal(false)
    setDeletingUserId(null)
    toast.success('User deleted successfully')
  }

  const handleResetPassword = (user: User) => {
    setPasswordResettingUser(user)
    setNewPassword('')
    setConfirmPassword('')
    setShowResetPasswordModal(true)
  }

  const handleSavePassword = async () => {
    if (!passwordResettingUser) return

    if (!newPassword.trim()) {
      toast.warning('Please enter a new password')
      return
    }

    if (newPassword.length < 8) {
      toast.warning('Password must be at least 8 characters')
      return
    }

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    // Show confirmation modal
    setShowResetPasswordConfirmModal(true)
  }

  const handleConfirmResetPassword = async () => {
    if (!passwordResettingUser) return

    setIsResettingPassword(true)
    try {
      const response = await resetPassword({
        userName: passwordResettingUser.name,
        password: newPassword,
      })

      if (response.isSuccess) {
        setShowResetPasswordModal(false)
        setPasswordResettingUser(null)
        setNewPassword('')
        setConfirmPassword('')
        toast.success(response.message || 'Password reset successfully')
      } else {
        toast.error(response.message || 'Failed to reset password')
      }
    } catch (error: any) {
      console.error('Error resetting password:', error)
      toast.error(error?.message || error?.data?.message || 'An error occurred while resetting password')
    } finally {
      setIsResettingPassword(false)
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
                  setNewUserPassword('')
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Username *</label>
                <input
                  type="text"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter username"
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
            </div>

            <div className="p-6 border-t flex items-center justify-end gap-3">
              <button
                onClick={() => {
                  setShowAddModal(false)
                  setNewUserName('')
                  setNewUserPassword('')
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddUser}
                disabled={isCreatingUser}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-4 h-4" />
                {isCreatingUser ? 'Creating...' : 'Create User'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reset Password Modal */}
      {showResetPasswordModal && passwordResettingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6 border-b flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Reset Password</h3>
                <p className="text-sm text-gray-600 mt-1">{passwordResettingUser.name}</p>
              </div>
              <button
                onClick={() => {
                  setShowResetPasswordModal(false)
                  setPasswordResettingUser(null)
                  setNewPassword('')
                  setConfirmPassword('')
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">New Password *</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter new password (min 8 characters)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password *</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Confirm new password"
                />
              </div>
            </div>

            <div className="p-6 border-t flex items-center justify-end gap-3">
              <button
                onClick={() => {
                  setShowResetPasswordModal(false)
                  setPasswordResettingUser(null)
                  setNewPassword('')
                  setConfirmPassword('')
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSavePassword}
                disabled={isResettingPassword}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <KeyRound className="w-4 h-4" />
                {isResettingPassword ? 'Resetting...' : 'Reset Password'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Remove Role Confirmation Modal */}
      {showRemoveRoleModal && removingRoleUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6 border-b flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Remove Role</h3>
                <p className="text-sm text-gray-600 mt-1">Are you sure you want to remove this role?</p>
              </div>
              <button
                onClick={() => {
                  setShowRemoveRoleModal(false)
                  setRemovingRoleUser(null)
                  setRemovingRoleName('')
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">User:</span> {removingRoleUser.name}
                </p>
                <p className="text-sm text-gray-700 mt-2">
                  <span className="font-semibold">Role:</span> {removingRoleName}
                </p>
              </div>
              <p className="text-sm text-gray-600">
                This action will remove the role from the user. You can assign it again later if needed.
              </p>
            </div>

            <div className="p-6 border-t flex items-center justify-end gap-3">
              <button
                onClick={() => {
                  setShowRemoveRoleModal(false)
                  setRemovingRoleUser(null)
                  setRemovingRoleName('')
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmRemoveRole}
                disabled={isSavingRole}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <UserMinus className="w-4 h-4" />
                {isSavingRole ? 'Removing...' : 'Remove Role'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Assign Role Modal */}
      {showAssignRoleModal && assigningRoleUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6 border-b flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Assign Role</h3>
                <p className="text-sm text-gray-600 mt-1">{assigningRoleUser.name}</p>
              </div>
              <button
                onClick={() => {
                  setShowAssignRoleModal(false)
                  setAssigningRoleUser(null)
                  setAssignRoleId('')
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Role *</label>
                <select
                  value={assignRoleId}
                  onChange={(e) => setAssignRoleId(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">Select a role</option>
                  {roles.map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.name} - {role.description}
                    </option>
                  ))}
                </select>
                {assigningRoleUser.roles && assigningRoleUser.roles.length > 0 && (
                  <p className="text-xs text-gray-500 mt-2">
                    Current roles: {assigningRoleUser.roles.join(', ')}
                  </p>
                )}
              </div>
            </div>

            <div className="p-6 border-t flex items-center justify-end gap-3">
              <button
                onClick={() => {
                  setShowAssignRoleModal(false)
                  setAssigningRoleUser(null)
                  setAssignRoleId('')
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveAssignRole}
                disabled={isSavingRole}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <UserCog className="w-4 h-4" />
                {isSavingRole ? 'Assigning...' : 'Assign Role'}
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
              </div>
              <button
                onClick={() => {
                  setShowEditModal(false)
                  setEditingUser(null)
                  setNewUserRoleId('')
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
            </div>

            <div className="p-6 border-t flex items-center justify-end gap-3">
              <button
                onClick={() => {
                  setShowEditModal(false)
                  setEditingUser(null)
                  setNewUserRoleId('')
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                disabled={isSavingRole}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-4 h-4" />
                {isSavingRole ? 'Saving...' : 'Save Changes'}
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
          <div className="flex items-center gap-3">
            {isLoadingUsers && users.length > 0 && (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <div className="w-4 h-4 border-2 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
                <span className="hidden sm:inline">Refreshing...</span>
              </div>
            )}
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center gap-2 text-sm"
            >
              <UserPlus className="w-4 h-4" />
              Add User
            </button>
          </div>
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

        {isLoadingUsers && users.length === 0 && !hasLoadedOnce.current ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center gap-2 text-gray-600">
              <div className="w-5 h-5 border-2 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
              <span>Loading users...</span>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto -mx-4 md:mx-0">
            <div className="inline-block min-w-full align-middle">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">User</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 min-w-[150px]">Roles</th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">
                      <div className="flex items-center justify-center gap-2">
                        Actions
                        {isLoadingUsers && users.length > 0 && (
                          <div className="w-3 h-3 border-2 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
                        )}
                      </div>
                    </th>
                  </tr>
                </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="py-8 text-center text-gray-500">
                      No users found
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                <tr key={user.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2 md:gap-3">
                      <div className="w-8 h-8 md:w-10 md:h-10 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-primary-600 font-semibold text-xs md:text-sm">
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="text-sm font-medium text-gray-900 block truncate">{user.name}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    {user.roles && user.roles.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5 min-w-[120px] max-w-[300px]">
                        {user.roles.map((role, index) => (
                          <span
                            key={index}
                            className={`inline-flex items-center gap-1 px-2 md:px-2.5 py-1 rounded-md text-xs font-semibold border ${getRoleColor(role)} whitespace-nowrap transition-colors hover:opacity-90`}
                            title={role}
                          >
                            {role}
                            <button
                              onClick={() => handleRemoveRole(user, role)}
                              className="ml-1 hover:bg-red-100 rounded p-0.5 transition-colors"
                              title={`Remove ${role}`}
                            >
                              <X className="w-3 h-3 text-red-600" />
                            </button>
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold border ${getRoleColor('')}`}>
                        No Role
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center justify-center gap-1 md:gap-2">
                      <button
                        onClick={() => handleAssignRole(user)}
                        className="p-1.5 md:p-2 text-green-600 hover:bg-green-50 rounded transition-colors"
                        title="Assign Role"
                      >
                        <UserCog className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleResetPassword(user)}
                        className="p-1.5 md:p-2 text-purple-600 hover:bg-purple-50 rounded transition-colors"
                        title="Reset Password"
                      >
                        <KeyRound className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
                  ))
                )}
              </tbody>
            </table>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between pt-4">
          <p className="text-sm text-gray-600">
            Showing {filteredUsers.length} of {users.length} users
          </p>
        </div>
      </div>

      {/* Delete User Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteUserModal}
        onClose={() => {
          setShowDeleteUserModal(false)
          setDeletingUserId(null)
        }}
        onConfirm={handleConfirmDeleteUser}
        title="Delete User"
        message="Are you sure you want to delete this user?"
        confirmText="Delete User"
        confirmButtonColor="red"
        details={
          deletingUserId
            ? [
                {
                  label: 'User',
                  value: users.find((u) => u.id === deletingUserId)?.name || '',
                },
              ]
            : []
        }
      />

      {/* Reset Password Confirmation Modal */}
      <ConfirmationModal
        isOpen={showResetPasswordConfirmModal}
        onClose={() => {
          setShowResetPasswordConfirmModal(false)
        }}
        onConfirm={handleConfirmResetPassword}
        title="Reset Password"
        message="Are you sure you want to reset the password for this user?"
        confirmText="Reset Password"
        confirmButtonColor="blue"
        isLoading={isResettingPassword}
        details={
          passwordResettingUser
            ? [
                {
                  label: 'User',
                  value: passwordResettingUser.name,
                },
              ]
            : []
        }
      />
    </div>
  )
}

