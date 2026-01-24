'use client'

import { useState } from 'react'
import { FileText, FileSpreadsheet, Loader2, Download } from 'lucide-react'
import { Property } from '@/types/property'

interface ExportReportProps {
  property: Property
}

export default function ExportReport({ property }: ExportReportProps) {
  const [exportingType, setExportingType] = useState<'pdf' | 'csv' | null>(null)

  const exportToPDF = async () => {
    setExportingType('pdf')
    try {
      // TODO: Implement PDF export
      // This would typically use a library like jsPDF or call a backend API
      const reportData = {
        property: {
          address: property.address,
          price: property.price,
          predictedROI: property.predictedROI,
          arbitrageScore: property.arbitrageScore,
          riskIndicator: property.riskIndicator,
          size: property.size,
          rooms: property.rooms,
          propertyType: property.propertyType,
        },
        timestamp: new Date().toISOString(),
      }

      // For now, create a simple text representation
      const text = `
Property Investment Report
========================

Property Details:
- Address: ${property.address}
- Neighborhood: ${property.neighborhood}
- Price: €${property.price.toLocaleString()}
- Price per m²: €${property.pricePerSqm.toLocaleString()}
- Size: ${property.size} m²
- Rooms: ${property.rooms}
- Type: ${property.propertyType}

Investment Metrics:
- Predicted ROI: ${property.predictedROI}%
- Arbitrage Score: ${property.arbitrageScore.toFixed(2)}
- Risk Level: ${property.riskIndicator.toUpperCase()}
${property.predictionInterval ? `- ROI Range: ${property.predictionInterval.lower}% - ${property.predictionInterval.upper}%` : ''}

Generated: ${new Date().toLocaleString()}
      `.trim()

      const blob = new Blob([text], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `property-report-${property.id}.txt`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Export failed:', error)
      alert('Failed to export report. Please try again.')
    } finally {
      setExportingType(null)
    }
  }

  const exportToCSV = async () => {
    setExportingType('csv')
    try {
      const csvData = [
        ['Field', 'Value'],
        ['Address', property.address],
        ['Neighborhood', property.neighborhood],
        ['Price (€)', property.price],
        ['Price per m² (€)', property.pricePerSqm],
        ['Size (m²)', property.size],
        ['Rooms', property.rooms],
        ['Property Type', property.propertyType],
        ['Predicted ROI (%)', property.predictedROI],
        ['Arbitrage Score', property.arbitrageScore],
        ['Risk Indicator', property.riskIndicator],
        ['Latitude', property.latitude],
        ['Longitude', property.longitude],
        ...(property.predictionInterval
          ? [
              ['ROI Lower Bound (%)', property.predictionInterval.lower],
              ['ROI Upper Bound (%)', property.predictionInterval.upper],
            ]
          : []),
      ]

      const csv = csvData.map((row) => row.map((cell) => `"${cell}"`).join(',')).join('\n')
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `property-${property.id}.csv`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Export failed:', error)
      alert('Failed to export CSV. Please try again.')
    } finally {
      setExportingType(null)
    }
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={exportToPDF}
        disabled={!!exportingType}
        className="group flex items-center gap-2 px-4 py-2.5 bg-white text-gray-700 border border-gray-300 rounded-lg font-medium text-sm hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 shadow-sm hover:shadow disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {exportingType === 'pdf' ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Exporting...</span>
          </>
        ) : (
          <>
            <FileText className="w-4 h-4 text-red-600 group-hover:text-red-700 transition-colors" />
            <span>Export PDF</span>
          </>
        )}
      </button>
      <button
        onClick={exportToCSV}
        disabled={!!exportingType}
        className="group flex items-center gap-2 px-4 py-2.5 bg-white text-gray-700 border border-gray-300 rounded-lg font-medium text-sm hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 shadow-sm hover:shadow disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {exportingType === 'csv' ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Exporting...</span>
          </>
        ) : (
          <>
            <FileSpreadsheet className="w-4 h-4 text-green-600 group-hover:text-green-700 transition-colors" />
            <span>Export CSV</span>
          </>
        )}
      </button>
    </div>
  )
}

