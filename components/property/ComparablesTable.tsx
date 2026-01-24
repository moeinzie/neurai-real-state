'use client'

import { Property } from '@/types/property'
import Link from 'next/link'

interface ComparablesTableProps {
  property: Property
}

export default function ComparablesTable({ property }: ComparablesTableProps) {
  const comparables = property.comparables || [
    {
      id: 'comp-1',
      address: 'Similar property in same neighborhood',
      price: 340000,
      pricePerSqm: 5667,
      size: 60,
      predictedROI: 8.2,
      arbitrageScore: 0.88,
    },
    {
      id: 'comp-2',
      address: 'Comparable unit nearby',
      price: 365000,
      pricePerSqm: 6083,
      size: 60,
      predictedROI: 7.9,
      arbitrageScore: 0.85,
    },
  ]

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Comparable Properties</h2>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px]">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wide">Address</th>
              <th className="text-right py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wide">Price</th>
              <th className="text-right py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wide hidden sm:table-cell">Price/m²</th>
              <th className="text-right py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wide">Size</th>
              <th className="text-right py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wide">ROI</th>
              <th className="text-right py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wide hidden md:table-cell">Score</th>
            </tr>
          </thead>
          <tbody>
            {comparables.map((comp) => (
              <tr key={comp.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="py-3 px-4">
                  <Link href={`/property/${comp.id}`} className="text-sm text-gray-900 hover:text-gray-700 font-medium">
                    {comp.address}
                  </Link>
                </td>
                <td className="py-3 px-4 text-right text-sm font-medium text-gray-900">€{comp.price.toLocaleString()}</td>
                <td className="py-3 px-4 text-right text-sm text-gray-600 hidden sm:table-cell">€{comp.pricePerSqm.toLocaleString()}</td>
                <td className="py-3 px-4 text-right text-sm text-gray-600">{comp.size} m²</td>
                <td className="py-3 px-4 text-right text-sm font-medium text-gray-900">{comp.predictedROI}%</td>
                <td className="py-3 px-4 text-right text-sm font-mono text-gray-600 hidden md:table-cell">{comp.arbitrageScore.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

