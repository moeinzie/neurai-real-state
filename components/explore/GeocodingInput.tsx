'use client'

import { useState, useEffect } from 'react'
import { MapPin, Search, Loader2 } from 'lucide-react'

interface GeocodingInputProps {
  onLocationSelect: (location: { lat: number; lng: number; address: string }) => void
  placeholder?: string
}

export default function GeocodingInput({ onLocationSelect, placeholder = 'Enter address...' }: GeocodingInputProps) {
  const [query, setQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [suggestions, setSuggestions] = useState<Array<{ display_name: string; lat: string; lon: string }>>([])
  const [showSuggestions, setShowSuggestions] = useState(false)

  // Mock geocoding - in production, use a real geocoding service like Nominatim, Google Maps, etc.
  const geocodeAddress = async (address: string) => {
    setIsLoading(true)
    try {
      // TODO: Replace with actual geocoding API call
      // Example using Nominatim (OpenStreetMap):
      // const response = await fetch(
      //   `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=5`
      // )
      // const data = await response.json()

      // Mock data for now
      await new Promise((resolve) => setTimeout(resolve, 500))
      const mockSuggestions = [
        {
          display_name: `${address}, Madrid, Spain`,
          lat: '40.4168',
          lon: '-3.7038',
        },
        {
          display_name: `${address} Street, Madrid, Spain`,
          lat: '40.4200',
          lon: '-3.7000',
        },
      ]
      setSuggestions(mockSuggestions)
      setShowSuggestions(true)
    } catch (error) {
      console.error('Geocoding error:', error)
      setSuggestions([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (query.length > 3) {
      const timeoutId = setTimeout(() => {
        geocodeAddress(query)
      }, 300)
      return () => clearTimeout(timeoutId)
    } else {
      setSuggestions([])
      setShowSuggestions(false)
    }
  }, [query])

  const handleSelect = (suggestion: { display_name: string; lat: string; lon: string }) => {
    setQuery(suggestion.display_name)
    setShowSuggestions(false)
    onLocationSelect({
      lat: parseFloat(suggestion.lat),
      lng: parseFloat(suggestion.lon),
      address: suggestion.display_name,
    })
  }

  return (
    <div className="relative">
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            if (suggestions.length > 0) setShowSuggestions(true)
          }}
          onBlur={() => {
            // Delay to allow click on suggestion
            setTimeout(() => setShowSuggestions(false), 200)
          }}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
        />
        {isLoading && (
          <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 animate-spin" />
        )}
        {!isLoading && query && (
          <button
            onClick={() => {
              setQuery('')
              setSuggestions([])
            }}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            ×
          </button>
        )}
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => handleSelect(suggestion)}
              className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0"
            >
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-700">{suggestion.display_name}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

