import { Brain, Map, BarChart, Lock, Zap, Users } from 'lucide-react'
import Link from 'next/link'

export default function Features() {
  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Predictions',
      description: 'Machine learning models analyze market data to predict property returns and identify arbitrage opportunities.',
    },
    {
      icon: Map,
      title: 'Interactive Maps',
      description: 'Explore properties on an interactive map with color-coded markers showing investment potential.',
    },
    {
      icon: BarChart,
      title: 'Comprehensive Analytics',
      description: 'Access detailed market analytics, ROI distributions, and neighborhood insights to guide your decisions.',
    },
    {
      icon: Lock,
      title: 'Risk Assessment',
      description: 'Get risk indicators and prediction intervals to understand the uncertainty in each investment.',
    },
    {
      icon: Zap,
      title: 'Real-Time Updates',
      description: 'Stay informed with regular data updates and new property listings as they become available.',
    },
    {
      icon: Users,
      title: 'Portfolio Management',
      description: 'Save properties, track your investments, and manage your portfolio all in one place.',
    },
  ]

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Platform Features</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Everything you need to make informed real estate investment decisions in Madrid.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div key={index} className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                    <Icon className="w-6 h-6 text-primary-600" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              </div>
            )
          })}
        </div>
        <div className="text-center">
          <Link
            href="/explore"
            className="inline-block bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition"
          >
            Start Exploring Properties
          </Link>
        </div>
      </div>
    </div>
  )
}

