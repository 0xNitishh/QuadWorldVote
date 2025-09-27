'use client'

import React, { useCallback } from 'react'

interface WorldIDWidgetProps {
  onSuccess: () => void
}

export function WorldIDWidget({ onSuccess }: WorldIDWidgetProps) {
  const handleSuccess = useCallback(() => {
    // Simulate World ID verification
    setTimeout(() => {
      onSuccess()
    }, 2000)
  }, [onSuccess])

  return (
    <div className="flex justify-center">
      <button
        onClick={handleSuccess}
        className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
      >
        Verify with World ID (Demo)
      </button>
    </div>
  )
}
