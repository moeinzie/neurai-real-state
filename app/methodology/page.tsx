'use client'

import { BookOpen, BarChart3, TrendingUp, Shield, AlertCircle, CheckCircle, Info } from 'lucide-react'
import Link from 'next/link'

export default function MethodologyPage() {
  const sections = [
    {
      id: 'overview',
      title: 'Overview',
      icon: BookOpen,
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">
            This platform uses machine learning models to identify arbitrage opportunities in the Madrid real estate market. 
            Our approach combines property-level data with advanced predictive analytics to forecast expected returns and 
            highlight mispriced properties.
          </p>
          <p className="text-gray-700">
            The methodology is based on research by Bali et al. (2025), which provides a quantitative framework for 
            identifying investment opportunities through data-driven analysis.
          </p>
        </div>
      ),
    },
    {
      id: 'data-sources',
      title: 'Data Sources',
      icon: BarChart3,
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">
            Our models are trained on comprehensive datasets including:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
            <li>Property listings with physical attributes (size, rooms, features)</li>
            <li>Historical transaction prices and market trends</li>
            <li>Geospatial data (neighborhood characteristics, proximity to amenities)</li>
            <li>Rental yield estimates and vacancy assumptions</li>
            <li>Auxiliary datasets (schools, transit, income indices, zoning)</li>
          </ul>
          <p className="text-sm text-gray-600 italic">
            Note: Some datasets require periodic updates from external providers (e.g., Fotocasa, Google Places).
          </p>
        </div>
      ),
    },
    {
      id: 'model-approach',
      title: 'Modeling Approach',
      icon: TrendingUp,
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">
            We employ multiple machine learning algorithms including:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
            <li><strong>Gradient Boosting:</strong> For capturing complex non-linear relationships</li>
            <li><strong>Random Forests:</strong> For robust feature importance analysis</li>
            <li><strong>Ensemble Methods:</strong> Combining multiple models for improved accuracy</li>
          </ul>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-blue-900 font-medium mb-1">Model Selection</p>
                <p className="text-sm text-blue-800">
                  Models are evaluated using out-of-sample metrics (RMSE, MAE) with time-based splits to avoid 
                  look-ahead bias. The production model is versioned and tracked in a model registry.
                </p>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'predictions',
      title: 'Predictions & Scoring',
      icon: BarChart3,
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">
            For each property, the model predicts:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
            <li><strong>Expected Return:</strong> Annualized ROI based on predicted price appreciation and rental yield</li>
            <li><strong>Fair Value:</strong> Model-estimated property value</li>
            <li><strong>Arbitrage Score:</strong> Standardized difference between fair price and listing price</li>
            <li><strong>Risk Indicators:</strong> Uncertainty measures and prediction intervals</li>
          </ul>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-yellow-900 font-medium mb-1">High-Opportunity Flagging</p>
                <p className="text-sm text-yellow-800">
                  Properties exceeding pre-defined thresholds (e.g., top 5% mispriced) are flagged as high-opportunity 
                  investments. These thresholds are calibrated based on historical performance.
                </p>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'clustering',
      title: 'Clustering Analysis',
      icon: BarChart3,
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">
            Properties are grouped into clusters based on similar characteristics:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
            <li>Price range and property type</li>
            <li>Location characteristics and neighborhood features</li>
            <li>Investment potential and risk profile</li>
          </ul>
          <p className="text-gray-700">
            Cluster-level statistics help identify patterns relevant for portfolio construction and policy analysis.
          </p>
        </div>
      ),
    },
    {
      id: 'limitations',
      title: 'Limitations & Validation',
      icon: Shield,
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">
            Important considerations:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
            <li>Predictions are based on historical patterns and may not account for unforeseen market changes</li>
            <li>Model performance is validated on out-of-sample data, but past performance doesn&apos;t guarantee future results</li>
            <li>Property-level predictions have inherent uncertainty, reflected in prediction intervals</li>
            <li>Market conditions, interest rates, and economic factors can significantly impact actual returns</li>
          </ul>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-green-900 font-medium mb-1">Transparency</p>
                <p className="text-sm text-green-800">
                  All predictions include uncertainty measures and feature importance explanations to help users 
                  understand model reasoning and limitations.
                </p>
              </div>
            </div>
          </div>
        </div>
      ),
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b bg-white">
        <div className="container mx-auto px-4 py-6">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-4">
            ← Back to Home
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Methodology</h1>
              <p className="text-gray-600 mt-1">Understanding our prediction models and approach</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Table of Contents */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Table of Contents</h2>
            <nav className="space-y-2">
              {sections.map((section) => {
                const Icon = section.icon
                return (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className="flex items-center gap-3 text-sm text-gray-700 hover:text-primary-600 transition-colors py-2"
                  >
                    <Icon className="w-4 h-4" />
                    <span>{section.title}</span>
                  </a>
                )
              })}
            </nav>
          </div>

          {/* Sections */}
          <div className="space-y-6">
            {sections.map((section) => {
              const Icon = section.icon
              return (
                <div
                  key={section.id}
                  id={section.id}
                  className="bg-white border border-gray-200 rounded-lg p-6 scroll-mt-8"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <Icon className="w-6 h-6 text-primary-600" />
                    <h2 className="text-2xl font-semibold text-gray-900">{section.title}</h2>
                  </div>
                  {section.content}
                </div>
              )
            })}
          </div>

          {/* Footer Note */}
          <div className="mt-8 bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
            <p className="text-sm text-gray-600">
              For technical details and research paper references, please contact our team or refer to the 
              supplementary documentation.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

