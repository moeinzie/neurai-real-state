import SearchPanel from '@/components/home/SearchPanel'
import StatsStrip from '@/components/home/StatsStrip'
import Link from 'next/link'
import { Map, BarChart3, FolderOpen, Settings, Building2 } from 'lucide-react'

export default function Home() {
  const quickActions = [
    {
      title: 'Explore Properties',
      description: 'Browse and analyze investment opportunities',
      href: '/explore',
      icon: Map,
    },
    {
      title: 'Analytics Dashboard',
      description: 'View market insights and trends',
      href: '/analytics',
      icon: BarChart3,
    },
    {
      title: 'Portfolio',
      description: 'Manage your saved properties',
      href: '/portfolio',
      icon: FolderOpen,
    },
    {
      title: 'Admin Panel',
      description: 'System administration',
      href: '/admin',
      icon: Settings,
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b bg-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
              <Building2 className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
              <p className="text-xs text-gray-500">Real estate investment platform</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Stats Overview */}
        <div className="mb-6">
          <StatsStrip />
        </div>

        {/* Quick Actions */}
        <div className="mb-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon
              return (
                <Link
                  key={index}
                  href={action.href}
                  className="bg-white border border-gray-200 rounded-lg p-5 hover:border-gray-300 transition-colors group"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                      <Icon className="w-5 h-5 text-gray-600" />
                    </div>
                    <h3 className="text-base font-semibold text-gray-900">{action.title}</h3>
                  </div>
                  <p className="text-sm text-gray-600 ml-[52px]">{action.description}</p>
                </Link>
              )
            })}
          </div>
        </div>

        {/* Search Panel */}
        <div className="mb-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Find Properties</h2>
          </div>
          <SearchPanel />
        </div>
      </div>
    </div>
  )
}

