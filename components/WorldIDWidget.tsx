'use client'

import { IDKitWidget } from '@worldcoin/idkit'
import { useCallback } from 'react'

interface WorldIDWidgetProps {
  onSuccess: () => void
}

export function WorldIDWidget({ onSuccess }: WorldIDWidgetProps) {
  const handleSuccess = useCallback(() => {
    onSuccess()
  }, [onSuccess])

  return (
    <div className="flex justify-center">
      <IDKitWidget
        app_id="app_staging_1234567890abcdef" // Replace with your actual app ID
        action="quadvote-verification"
        signal="user-verification"
        onSuccess={handleSuccess}
        verification_level="orb"
      >
        {({ open }) => (
          <button
            onClick={open}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Verify with World ID
          </button>
        )}
      </IDKitWidget>
    </div>
  )
}
