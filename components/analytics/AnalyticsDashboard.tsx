'use client'

import { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from 'recharts'
import { TrendingUp, Map, BarChart3, DollarSign, Target, Zap, ArrowUpRight, ArrowDownRight, Activity, Building2, Home, TrendingDown, Layers } from 'lucide-react'

const roiDistribution = [
  { range: '5-6%', count: 120 },
  { range: '6-7%', count: 280 },
  { range: '7-8%', count: 450 },
  { range: '8-9%', count: 320 },
  { range: '9-10%', count: 150 },
  { range: '10%+', count: 75 },
]

const neighborhoodROI = [
  { neighborhood: 'Centro', avgROI: 8.5, count: 245, trend: 2.3 },
  { neighborhood: 'Salamanca', avgROI: 7.2, count: 189, trend: -0.5 },
  { neighborhood: 'Retiro', avgROI: 7.8, count: 156, trend: 1.2 },
  { neighborhood: 'Moncloa', avgROI: 9.1, count: 134, trend: 3.1 },
  { neighborhood: 'Chamberí', avgROI: 8.2, count: 198, trend: 1.8 },
]

const propertyTypeDistribution = [
  { name: 'Apartment', value: 65, color: '#0ea5e9' },
  { name: 'House', value: 25, color: '#10b981' },
  { name: 'Studio', value: 10, color: '#f59e0b' },
]

const monthlyTrend = [
  { month: 'Jan', roi: 7.2, properties: 980 },
  { month: 'Feb', roi: 7.4, properties: 1020 },
  { month: 'Mar', roi: 7.5, properties: 1080 },
  { month: 'Apr', roi: 7.6, properties: 1120 },
  { month: 'May', roi: 7.7, properties: 1180 },
  { month: 'Jun', roi: 7.8, properties: 1247 },
]

const mispricingTimeSeries = [
  { month: 'Jan', avgMispricing: 0.12, top5Percent: 0.25, top1Percent: 0.35 },
  { month: 'Feb', avgMispricing: 0.14, top5Percent: 0.27, top1Percent: 0.37 },
  { month: 'Mar', avgMispricing: 0.13, top5Percent: 0.26, top1Percent: 0.36 },
  { month: 'Apr', avgMispricing: 0.15, top5Percent: 0.28, top1Percent: 0.38 },
  { month: 'May', avgMispricing: 0.16, top5Percent: 0.29, top1Percent: 0.39 },
  { month: 'Jun', avgMispricing: 0.17, top5Percent: 0.30, top1Percent: 0.40 },
]

// Boxplot data structure for ROI by neighborhood
const roiBoxplotData = [
  { neighborhood: 'Centro', min: 6.5, q1: 7.8, median: 8.5, q3: 9.2, max: 10.5 },
  { neighborhood: 'Salamanca', min: 5.8, q1: 6.9, median: 7.2, q3: 7.8, max: 8.5 },
  { neighborhood: 'Retiro', min: 6.2, q1: 7.3, median: 7.8, q3: 8.4, max: 9.1 },
  { neighborhood: 'Moncloa', min: 7.5, q1: 8.6, median: 9.1, q3: 9.8, max: 10.8 },
  { neighborhood: 'Chamberí', min: 6.8, q1: 7.9, median: 8.2, q3: 8.8, max: 9.5 },
]

function AnimatedNumber({ value, suffix = '', decimals = 0 }: { value: number; suffix?: string; decimals?: number }) {
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    const duration = 1500
    const steps = 60
    const increment = value / steps
    let current = 0
    let step = 0

    const timer = setInterval(() => {
      step++
      current = Math.min(increment * step, value)
      setDisplayValue(current)
      if (step >= steps) {
        clearInterval(timer)
        setDisplayValue(value)
      }
    }, duration / steps)

    return () => clearInterval(timer)
  }, [value])

  return <span>{displayValue.toFixed(decimals)}{suffix}</span>
}

export default function AnalyticsDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '30d' | '90d' | 'all'>('30d')

  const stats = [
    {
      title: 'Total Properties',
      value: 1247,
      suffix: '',
      change: '+12.5%',
      trend: 'up',
      icon: Map,
      bgColor: 'bg-primary-50',
      iconColor: 'text-primary-600',
    },
    {
      title: 'Average ROI',
      value: 7.8,
      suffix: '%',
      change: '+0.3%',
      trend: 'up',
      icon: TrendingUp,
      bgColor: 'bg-primary-50',
      iconColor: 'text-primary-600',
    },
    {
      title: 'Top Opportunities',
      value: 62,
      suffix: '',
      change: '+8',
      trend: 'up',
      icon: Zap,
      bgColor: 'bg-primary-50',
      iconColor: 'text-primary-600',
      subtitle: 'Top 5%',
    },
    {
      title: 'Market Value',
      value: 485,
      suffix: 'M€',
      change: '+5.2%',
      trend: 'up',
      icon: DollarSign,
      bgColor: 'bg-primary-50',
      iconColor: 'text-primary-600',
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6 md:py-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
                Analytics Dashboard
              </h1>
              <p className="text-gray-600 text-sm">Market insights and investment analytics</p>
            </div>
            <div className="flex gap-2 mt-4 md:mt-0">
              {(['7d', '30d', '90d', 'all'] as const).map((period) => (
                <button
                  key={period}
                  onClick={() => setSelectedPeriod(period)}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                    selectedPeriod === period
                      ? 'bg-primary-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                  }`}
                >
                  {period === '7d' ? '7 Days' : period === '30d' ? '30 Days' : period === '90d' ? '90 Days' : 'All Time'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Key Metrics Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <div key={index} className="bg-white border border-gray-200 rounded-lg p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">{stat.title}</span>
                  <Icon className="w-4 h-4 text-gray-400" />
                </div>
                <div className="space-y-1">
                  <p className="text-2xl font-semibold text-gray-900">
                    <AnimatedNumber value={stat.value} suffix={stat.suffix} decimals={stat.suffix === '%' ? 1 : 0} />
                  </p>
                  {stat.subtitle ? (
                    <p className="text-sm text-gray-600">{stat.subtitle}</p>
                  ) : (
                    <div className="flex items-center gap-1">
                      {stat.trend === 'up' ? (
                        <ArrowUpRight className="w-3 h-3 text-green-600" />
                      ) : (
                        <ArrowDownRight className="w-3 h-3 text-red-600" />
                      )}
                      <span className={`text-xs font-medium ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                        {stat.change}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* ROI Distribution */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="w-5 h-5 text-gray-600" />
              <h2 className="text-lg font-semibold text-gray-900">ROI Distribution</h2>
            </div>
            <div className="w-full" style={{ height: '300px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={roiDistribution}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="range" tick={{ fill: '#6b7280' }} />
                  <YAxis tick={{ fill: '#6b7280' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                    }}
                  />
                  <Bar dataKey="count" fill="#0ea5e9" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Property Type Distribution */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <Building2 className="w-5 h-5 text-gray-600" />
              <h2 className="text-lg font-semibold text-gray-900">Property Types</h2>
            </div>
            <div className="w-full" style={{ height: '300px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={propertyTypeDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    innerRadius={50}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {propertyTypeDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-6 mt-4">
              {propertyTypeDistribution.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded" style={{ backgroundColor: item.color }}></div>
                  <span className="text-sm text-gray-600">{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Monthly Trend */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-5 h-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">Market Trend</h2>
          </div>
            <div className="w-full" style={{ height: '350px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyTrend}>
                  <defs>
                    <linearGradient id="roiArea" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="propertiesArea" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" tick={{ fill: '#6b7280' }} />
                  <YAxis yAxisId="left" tick={{ fill: '#6b7280' }} />
                  <YAxis yAxisId="right" orientation="right" tick={{ fill: '#6b7280' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                    }}
                  />
                  <Legend />
                  <Area
                    yAxisId="left"
                    type="monotone"
                    dataKey="roi"
                    stroke="#0ea5e9"
                    strokeWidth={3}
                    fill="url(#roiArea)"
                    name="ROI (%)"
                  />
                  <Area
                    yAxisId="right"
                    type="monotone"
                    dataKey="properties"
                    stroke="#0ea5e9"
                    strokeWidth={3}
                    strokeDasharray="5 5"
                    fill="url(#propertiesArea)"
                    name="Properties"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
        </div>

        {/* Mispricing Time Series */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">Mispricing Indicators Over Time</h2>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Average mispricing index showing market efficiency trends
          </p>
          <div className="w-full" style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mispricingTimeSeries}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fill: '#6b7280' }} />
                <YAxis tick={{ fill: '#6b7280' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="avgMispricing"
                  stroke="#0ea5e9"
                  strokeWidth={2}
                  name="Average Mispricing"
                />
                <Line
                  type="monotone"
                  dataKey="top5Percent"
                  stroke="#10b981"
                  strokeWidth={2}
                  name="Top 5% Mispricing"
                />
                <Line
                  type="monotone"
                  dataKey="top1Percent"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  name="Top 1% Mispricing"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ROI Boxplot by Neighborhood */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">ROI Distribution by Neighborhood (Boxplot)</h2>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Distribution of ROI values showing quartiles, median, and outliers
          </p>
          <div className="w-full" style={{ height: '350px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={roiBoxplotData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis type="number" tick={{ fill: '#6b7280' }} />
                <YAxis dataKey="neighborhood" type="category" width={120} tick={{ fill: '#6b7280' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                  }}
                  formatter={(value: any, name: string) => {
                    if (name === 'roi') return [`${value}%`, 'ROI']
                    return [value, name]
                  }}
                />
                <Bar dataKey="median" fill="#0ea5e9" name="Median ROI" />
                <Bar dataKey="q1" fill="#3b82f6" name="Q1" />
                <Bar dataKey="q3" fill="#3b82f6" name="Q3" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 flex items-center gap-4 text-xs text-gray-600">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded"></div>
              <span>Q1-Q3 Range</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-primary-600 rounded"></div>
              <span>Median</span>
            </div>
          </div>
        </div>

        {/* Neighborhood ROI */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Map className="w-5 h-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">Neighborhood Performance</h2>
          </div>
          <div className="w-full" style={{ height: '350px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={neighborhoodROI} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis type="number" tick={{ fill: '#6b7280' }} />
                <YAxis dataKey="neighborhood" type="category" width={120} tick={{ fill: '#6b7280' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                  }}
                />
                <Bar dataKey="avgROI" fill="#0ea5e9" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-5 gap-4">
            {neighborhoodROI.map((neighborhood) => (
              <div key={neighborhood.neighborhood} className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-600 mb-2">{neighborhood.neighborhood}</p>
                  <p className="text-2xl font-semibold text-gray-900 mb-1">{neighborhood.avgROI}%</p>
                  <div className="flex items-center justify-center gap-1 mb-2">
                    {neighborhood.trend > 0 ? (
                      <TrendingUp className="w-3 h-3 text-green-600" />
                    ) : (
                      <TrendingDown className="w-3 h-3 text-red-600" />
                    )}
                    <span className={`text-xs font-medium ${neighborhood.trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {neighborhood.trend > 0 ? '+' : ''}{neighborhood.trend}%
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">{neighborhood.count} properties</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cluster Statistics */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Layers className="w-5 h-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">Cluster-Level Statistics</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { id: 'cluster-1', label: 'Premium Properties', count: 245, avgROI: 8.5, avgScore: 0.92 },
              { id: 'cluster-2', label: 'Mid-Range', count: 456, avgROI: 7.8, avgScore: 0.85 },
              { id: 'cluster-3', label: 'Budget-Friendly', count: 546, avgROI: 9.2, avgScore: 0.88 },
            ].map((cluster) => (
              <div key={cluster.id} className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">{cluster.label}</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Properties</span>
                    <span className="font-semibold text-gray-900">{cluster.count}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Avg. ROI</span>
                    <span className="font-semibold text-primary-600">{cluster.avgROI}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Avg. Score</span>
                    <span className="font-semibold text-gray-900">{cluster.avgScore}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Heatmap */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-5 h-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">Investment Heatmap</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {neighborhoodROI.map((neighborhood) => {
              const intensity = neighborhood.avgROI / 10
              return (
                <div key={neighborhood.neighborhood} className="text-center group">
                  <div
                    className="h-32 rounded-xl flex flex-col items-center justify-center text-white font-bold mb-3 shadow-lg group-hover:scale-105 transition-transform"
                    style={{
                      backgroundColor: `rgba(14, 165, 233, ${intensity})`,
                    }}
                  >
                    <span className="text-3xl mb-1">{neighborhood.avgROI}%</span>
                    <span className="text-xs opacity-90">ROI</span>
                  </div>
                  <p className="text-sm font-semibold text-gray-900 mb-1">{neighborhood.neighborhood}</p>
                  <p className="text-xs text-gray-600">{neighborhood.count} properties</p>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

