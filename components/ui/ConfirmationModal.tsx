'use client'

import { useEffect } from 'react'
import { X } from 'lucide-react'

interface ConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  confirmButtonColor?: 'red' | 'blue' | 'green' | 'yellow'
  isLoading?: boolean
  details?: { label: string; value: string }[]
}

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmButtonColor = 'red',
  isLoading = false,
  details = [],
}: ConfirmationModalProps) {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  const buttonColors = {
    red: 'bg-red-600 hover:bg-red-700',
    blue: 'bg-blue-600 hover:bg-blue-700',
    green: 'bg-green-600 hover:bg-green-700',
    yellow: 'bg-yellow-600 hover:bg-yellow-700',
  }

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-[9999]"
        onClick={!isLoading ? onClose : undefined}
      />
      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-[9999] p-4 pointer-events-none">
        <div className="bg-white rounded-lg max-w-md w-full pointer-events-auto">
          <div className="p-6 border-b flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-gray-900">{title}</h3>
            <p className="text-sm text-gray-600 mt-1">{message}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            disabled={isLoading}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {details.length > 0 && (
          <div className="p-6">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              {details.map((detail, index) => (
                <p key={index} className="text-sm text-gray-700 mt-2 first:mt-0">
                  <span className="font-semibold">{detail.label}:</span> {detail.value}
                </p>
              ))}
            </div>
          </div>
        )}

        <div className="p-6 border-t flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`px-4 py-2 text-white rounded-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${buttonColors[confirmButtonColor]}`}
          >
            {isLoading ? 'Processing...' : confirmText}
          </button>
        </div>
        </div>
      </div>
    </>
  )
}

