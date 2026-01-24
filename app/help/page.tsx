'use client'

import { HelpCircle, BookOpen, Search, Filter, Map, TrendingUp, Award, BarChart3, Info } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

interface GlossaryTerm {
  term: string
  definition: string
  category: string
}

const glossaryTerms: GlossaryTerm[] = [
  {
    term: 'ROI (Return on Investment)',
    definition: 'The annualized return percentage expected from a property investment, calculated based on predicted price appreciation and rental yield.',
    category: 'Financial',
  },
  {
    term: 'Arbitrage Score',
    definition: 'A standardized measure (0-1) indicating the degree of mispricing. Higher scores indicate better investment opportunities where the listing price is below the predicted fair value.',
    category: 'Financial',
  },
  {
    term: 'Predicted ROI',
    definition: 'The machine learning model\'s forecast of the annualized return percentage for a property, based on historical patterns and property characteristics.',
    category: 'Financial',
  },
  {
    term: 'Fair Value',
    definition: 'The model-estimated market value of a property, calculated using machine learning algorithms trained on historical transaction data.',
    category: 'Financial',
  },
  {
    term: 'Prediction Interval',
    definition: 'A range of plausible ROI values, representing the uncertainty in the model\'s prediction. Wider intervals indicate higher uncertainty.',
    category: 'Financial',
  },
  {
    term: 'Risk Indicator',
    definition: 'A classification (Low, Medium, High) indicating the level of uncertainty and potential volatility in the predicted returns.',
    category: 'Risk',
  },
  {
    term: 'Cluster',
    definition: 'A group of properties with similar characteristics (price, location, type) identified through clustering analysis. Clusters help identify investment patterns.',
    category: 'Analysis',
  },
  {
    term: 'Feature Importance',
    definition: 'A measure of how much each property characteristic (e.g., location, size, price per m²) contributes to the model\'s prediction, calculated using SHAP values.',
    category: 'Analysis',
  },
  {
    term: 'SHAP Values',
    definition: 'SHapley Additive exPlanations - a method to explain individual predictions by quantifying each feature\'s contribution to the model output.',
    category: 'Analysis',
  },
  {
    term: 'Comparables',
    definition: 'Similar properties in the same area used for comparison. These properties have similar characteristics and help assess whether a property is fairly priced.',
    category: 'Analysis',
  },
  {
    term: 'Top 1%/5%/10%',
    definition: 'Properties ranked in the top percentile by arbitrage score, indicating the best investment opportunities in the market.',
    category: 'Ranking',
  },
  {
    term: 'Mispricing',
    definition: 'The difference between a property\'s listing price and its predicted fair value. Positive mispricing indicates undervalued properties.',
    category: 'Financial',
  },
  {
    term: 'Yield',
    definition: 'The rental income as a percentage of property value, used to calculate rental return on investment.',
    category: 'Financial',
  },
  {
    term: 'Holding Period',
    definition: 'The expected duration (in months) an investor plans to hold a property before selling.',
    category: 'Investment',
  },
]

const faqs = [
  {
    question: 'How accurate are the predictions?',
    answer: 'Our models are validated on out-of-sample data using metrics like RMSE and MAE. However, predictions are based on historical patterns and cannot account for unforeseen market changes. All predictions include uncertainty measures (prediction intervals) to reflect this.',
  },
  {
    question: 'How often are predictions updated?',
    answer: 'Predictions are recomputed at fixed intervals (typically nightly or weekly) using the latest property listings and market data. The exact schedule depends on data availability from external providers.',
  },
  {
    question: 'What does the arbitrage score mean?',
    answer: 'The arbitrage score (0-1) measures how mispriced a property is. A score of 0.95 means the property is in the top 5% of opportunities, where the listing price is significantly below the predicted fair value.',
  },
  {
    question: 'How should I interpret the risk indicator?',
    answer: 'Risk indicators (Low, Medium, High) reflect the uncertainty in predictions. Low risk means more confident predictions with narrower intervals. High risk indicates higher uncertainty, which could mean either higher potential returns or higher volatility.',
  },
  {
    question: 'Can I trust the feature importance values?',
    answer: 'Feature importance is calculated using SHAP values, a well-established method for explaining machine learning predictions. However, these values show correlation, not causation, and should be interpreted alongside domain knowledge.',
  },
  {
    question: 'What is a cluster and why is it useful?',
    answer: 'Clusters group properties with similar characteristics. They help identify investment patterns and can be useful for portfolio construction. For example, "Cluster 4: top units in terms of prices" groups high-value properties together.',
  },
  {
    question: 'How do I filter properties effectively?',
    answer: 'Start with broad filters (location, budget) and gradually refine. Use arbitrage score filters (Top 1%, 5%, 10%) to focus on the best opportunities. Combine multiple filters to find properties matching your specific criteria.',
  },
  {
    question: 'What should I do with saved properties?',
    answer: 'Save properties to track them over time, receive alerts when new similar opportunities appear, and build a portfolio for analysis. You can export saved properties for further analysis or client presentations.',
  },
]

export default function HelpPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('All')

  const categories = ['All', ...Array.from(new Set(glossaryTerms.map((t) => t.category)))]

  const filteredTerms = glossaryTerms.filter((term) => {
    const matchesSearch = term.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
      term.definition.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || term.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b bg-white">
        <div className="container mx-auto px-4 py-6">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-4">
            ← Back to Home
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
              <HelpCircle className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Help & Glossary</h1>
              <p className="text-gray-600 mt-1">Learn how to use the platform and understand key terms</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Quick Links */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Link
              href="/explore"
              className="bg-white border border-gray-200 rounded-lg p-4 hover:border-primary-300 hover:shadow-md transition-all"
            >
              <Map className="w-5 h-5 text-primary-600 mb-2" />
              <h3 className="font-semibold text-gray-900 mb-1">Explore Properties</h3>
              <p className="text-sm text-gray-600">Browse and filter investment opportunities</p>
            </Link>
            <Link
              href="/analytics"
              className="bg-white border border-gray-200 rounded-lg p-4 hover:border-primary-300 hover:shadow-md transition-all"
            >
              <BarChart3 className="w-5 h-5 text-primary-600 mb-2" />
              <h3 className="font-semibold text-gray-900 mb-1">Analytics</h3>
              <p className="text-sm text-gray-600">View market insights and trends</p>
            </Link>
            <Link
              href="/portfolio"
              className="bg-white border border-gray-200 rounded-lg p-4 hover:border-primary-300 hover:shadow-md transition-all"
            >
              <TrendingUp className="w-5 h-5 text-primary-600 mb-2" />
              <h3 className="font-semibold text-gray-900 mb-1">Portfolio</h3>
              <p className="text-sm text-gray-600">Manage saved properties</p>
            </Link>
            <Link
              href="/methodology"
              className="bg-white border border-gray-200 rounded-lg p-4 hover:border-primary-300 hover:shadow-md transition-all"
            >
              <BookOpen className="w-5 h-5 text-primary-600 mb-2" />
              <h3 className="font-semibold text-gray-900 mb-1">Methodology</h3>
              <p className="text-sm text-gray-600">Learn about our models</p>
            </Link>
          </div>

          {/* Glossary Section */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <BookOpen className="w-6 h-6 text-primary-600" />
              <h2 className="text-2xl font-semibold text-gray-900">Glossary</h2>
            </div>

            {/* Search and Filter */}
            <div className="mb-6 space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search terms..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      selectedCategory === category
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Terms List */}
            <div className="space-y-4">
              {filteredTerms.length === 0 ? (
                <p className="text-gray-600 text-center py-8">No terms found matching your search.</p>
              ) : (
                filteredTerms.map((term, index) => (
                  <div key={index} className="border-b border-gray-100 pb-4 last:border-0">
                    <div className="flex items-start gap-3">
                      <Info className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-gray-900">{term.term}</h3>
                          <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
                            {term.category}
                          </span>
                        </div>
                        <p className="text-gray-700">{term.definition}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* FAQs Section */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-6">
              <HelpCircle className="w-6 h-6 text-primary-600" />
              <h2 className="text-2xl font-semibold text-gray-900">Frequently Asked Questions</h2>
            </div>
            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <div key={index} className="border-b border-gray-100 pb-6 last:border-0">
                  <h3 className="font-semibold text-gray-900 mb-2">{faq.question}</h3>
                  <p className="text-gray-700">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

