'use client'

import { useState } from 'react'
import { Calculator, TrendingUp, DollarSign, Calendar, AlertCircle } from 'lucide-react'
import { Property } from '@/types/property'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts'

interface ScenarioSimulatorProps {
  properties: Property[]
}

interface Scenario {
  name: string
  interestRate: number
  holdingPeriod: number
  marketGrowth: number
  rentalYield: number
}

export default function ScenarioSimulator({ properties }: ScenarioSimulatorProps) {
  const [scenarios, setScenarios] = useState<Scenario[]>([
    {
      name: 'Base Case',
      interestRate: 3.5,
      holdingPeriod: 24,
      marketGrowth: 2.5,
      rentalYield: 4.0,
    },
    {
      name: 'Optimistic',
      interestRate: 2.5,
      holdingPeriod: 24,
      marketGrowth: 5.0,
      rentalYield: 5.0,
    },
    {
      name: 'Pessimistic',
      interestRate: 5.0,
      holdingPeriod: 24,
      marketGrowth: 0.0,
      rentalYield: 3.0,
    },
  ])

  const calculateReturns = (property: Property, scenario: Scenario) => {
    const initialInvestment = property.price
    const monthlyRental = (initialInvestment * scenario.rentalYield) / 100 / 12
    const monthlyInterest = (initialInvestment * scenario.interestRate) / 100 / 12
    const netMonthlyCashFlow = monthlyRental - monthlyInterest

    const finalValue = initialInvestment * (1 + scenario.marketGrowth / 100) ** (scenario.holdingPeriod / 12)
    const appreciation = finalValue - initialInvestment
    const totalRentalIncome = monthlyRental * scenario.holdingPeriod
    const totalInterest = monthlyInterest * scenario.holdingPeriod
    const netCashFlow = totalRentalIncome - totalInterest

    const totalReturn = appreciation + netCashFlow
    const totalROI = (totalReturn / initialInvestment) * 100
    const annualizedROI = (totalROI / scenario.holdingPeriod) * 12

    return {
      initialInvestment,
      finalValue,
      appreciation,
      totalRentalIncome,
      totalInterest,
      netCashFlow,
      totalReturn,
      totalROI,
      annualizedROI,
    }
  }

  const portfolioResults = properties.map((property) => {
    const scenarioResults = scenarios.map((scenario) => ({
      scenario: scenario.name,
      ...calculateReturns(property, scenario),
    }))

    return {
      property: property.address,
      scenarios: scenarioResults,
    }
  })

  const summaryData = scenarios.map((scenario) => {
    const totalInitial = properties.reduce((sum, p) => sum + p.price, 0)
    const avgResults = properties.map((p) => calculateReturns(p, scenario))
    const totalReturn = avgResults.reduce((sum, r) => sum + r.totalReturn, 0)
    const avgROI = (totalReturn / totalInitial) * 100
    const annualizedROI = (avgROI / scenario.holdingPeriod) * 12

    return {
      scenario: scenario.name,
      totalInitial,
      totalReturn,
      avgROI,
      annualizedROI,
    }
  })

  const chartData = scenarios.map((scenario) => ({
    name: scenario.name,
    roi: summaryData.find((s) => s.scenario === scenario.name)?.annualizedROI || 0,
  }))

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex items-center gap-2 mb-6">
        <Calculator className="w-5 h-5 text-gray-600" />
        <h2 className="text-lg font-semibold text-gray-900">Portfolio Scenario Simulation</h2>
      </div>

      {/* Scenario Comparison Chart */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-700 mb-4">Annualized ROI by Scenario</h3>
        <div className="w-full" style={{ height: '250px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fill: '#6b7280' }} />
              <YAxis tick={{ fill: '#6b7280' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                }}
                formatter={(value: number) => [`${value.toFixed(1)}%`, 'Annualized ROI']}
              />
              <Bar dataKey="roi" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Scenario Details */}
      <div className="space-y-4">
        {summaryData.map((result) => (
          <div key={result.scenario} className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-3">{result.scenario} Scenario</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <div className="text-gray-600 mb-1">Total Investment</div>
                <div className="font-semibold text-gray-900">€{Math.round(result.totalInitial).toLocaleString()}</div>
              </div>
              <div>
                <div className="text-gray-600 mb-1">Total Return</div>
                <div className="font-semibold text-gray-900">€{Math.round(result.totalReturn).toLocaleString()}</div>
              </div>
              <div>
                <div className="text-gray-600 mb-1">Total ROI</div>
                <div className="font-semibold text-primary-600">{result.avgROI.toFixed(1)}%</div>
              </div>
              <div>
                <div className="text-gray-600 mb-1">Annualized ROI</div>
                <div className="font-semibold text-primary-600">{result.annualizedROI.toFixed(1)}%</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Info Box */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-blue-900 font-medium mb-1">About Scenarios</p>
            <p className="text-xs text-blue-800">
              Scenarios simulate different market conditions. Adjust interest rates, holding periods, 
              market growth, and rental yields to see how they impact your portfolio returns.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

