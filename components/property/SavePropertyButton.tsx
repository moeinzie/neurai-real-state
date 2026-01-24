'use client'

import { useState } from 'react'
import { Bookmark, BookmarkCheck, Loader2 } from 'lucide-react'
import { Property } from '@/types/property'

interface SavePropertyButtonProps {
  property: Property
}

export default function SavePropertyButton({ property }: SavePropertyButtonProps) {
  const [isSaved, setIsSaved] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSave = async () => {
    setIsLoading(true)
    // TODO: Implement API call to save property
    // await fetch('/api/properties/save', { method: 'POST', body: JSON.stringify({ propertyId: property.id }) })
    
    // Simulate API call
    setTimeout(() => {
      setIsSaved(!isSaved)
      setIsLoading(false)
    }, 300)
  }

  return (
    <button
      onClick={handleSave}
      disabled={isLoading}
      className={`group flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 ${
        isSaved
          ? 'bg-primary-600 text-white hover:bg-primary-700 shadow-sm hover:shadow-md'
          : 'bg-white text-gray-700 border border-gray-300 hover:border-gray-400 hover:bg-gray-50 shadow-sm hover:shadow'
      } ${isLoading ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Saving...</span>
        </>
      ) : isSaved ? (
        <>
          <BookmarkCheck className="w-4 h-4" />
          <span>Saved</span>
        </>
      ) : (
        <>
          <Bookmark className="w-4 h-4 group-hover:fill-gray-400 transition-colors" />
          <span>Save Property</span>
        </>
      )}
    </button>
  )
}

