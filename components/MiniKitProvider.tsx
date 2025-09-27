'use client'

import { useEffect, useState } from 'react'

interface MiniKitProviderProps {
  children: React.ReactNode
}

export function MiniKitProvider({ children }: MiniKitProviderProps) {
  const [isMiniKit, setIsMiniKit] = useState(false)

  useEffect(() => {
    // Check if running in MiniKit environment
    const checkMiniKit = () => {
      // Check for MiniKit-specific properties
      if (typeof window !== 'undefined') {
        const isInMiniKit = 
          window.parent !== window || // Running in iframe
          navigator.userAgent.includes('MiniKit') ||
          (window as any).MiniKit !== undefined
        
        setIsMiniKit(isInMiniKit)
      }
    }

    checkMiniKit()
  }, [])

  // If not in MiniKit, show regular interface
  if (!isMiniKit) {
    return <>{children}</>
  }

  // MiniKit-specific functionality would go here
  // For now, just show the regular interface
  return <>{children}</>
}
