'use client'

import { useState } from 'react'
import { Home, Users, Shield } from 'lucide-react'
import PropertiesManagement from './PropertiesManagement'
import UsersManagement from './UsersManagement'
import RolesManagement from './RolesManagement'

type AdminTab = 'properties' | 'users' | 'roles'

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<AdminTab>('properties')

  const tabs = [
    { id: 'properties' as AdminTab, label: 'Properties', icon: Home },
    { id: 'users' as AdminTab, label: 'Users', icon: Users },
    { id: 'roles' as AdminTab, label: 'Roles & Permissions', icon: Shield },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">Admin Panel</h1>
          <p className="text-sm text-gray-600">Manage your platform and data</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          <aside className="lg:w-64 flex-shrink-0">
            <nav className="bg-white rounded-lg border border-gray-200 p-2">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                      activeTab === tab.id
                        ? 'bg-primary-600 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                )
              })}
            </nav>
          </aside>

          <main className="flex-1">
            {activeTab === 'properties' && <PropertiesManagement />}
            {activeTab === 'users' && <UsersManagement />}
            {activeTab === 'roles' && <RolesManagement />}
          </main>
        </div>
      </div>
    </div>
  )
}

