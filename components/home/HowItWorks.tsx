import { Search, BarChart3, TrendingUp, Shield } from 'lucide-react'

export default function HowItWorks() {
  const steps = [
    {
      icon: Search,
      title: 'Explore Opportunities',
      description: 'Browse properties with our interactive map and advanced filters to find investment opportunities that match your criteria.',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      icon: BarChart3,
      title: 'Analyze Predictions',
      description: 'View machine-learning powered ROI predictions, arbitrage scores, and risk indicators for each property.',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      icon: TrendingUp,
      title: 'Make Informed Decisions',
      description: 'Compare properties, review detailed analytics, and build your investment portfolio with confidence.',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      icon: Shield,
      title: 'Track Your Portfolio',
      description: 'Save properties, monitor performance, and receive alerts when new opportunities match your criteria.',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ]

  return (
    <div className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Our platform uses advanced machine learning to identify mispriced properties and help you make smarter investment decisions.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <div key={index} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
                <div className={`${step.bgColor} w-16 h-16 rounded-full flex items-center justify-center mb-4`}>
                  <Icon className={`w-8 h-8 ${step.color}`} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

