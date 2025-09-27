'use client'

import { useState } from 'react'
import { useAccount, useConnect } from 'wagmi'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { WorldIDWidget } from '@/components/WorldIDWidget'
import { CreateContest } from '@/components/CreateContest'
import { ContestList } from '@/components/ContestList'
import { VoteInterface } from '@/components/VoteInterface'
import { Results } from '@/components/Results'
import { Header } from '@/components/Header'
import { MiniKitProvider } from '@/components/MiniKitProvider'

export default function Home() {
  const { address, isConnected } = useAccount()
  const [currentView, setCurrentView] = useState<'home' | 'create' | 'vote' | 'results'>('home')
  const [selectedContest, setSelectedContest] = useState<string | null>(null)
  const [isVerified, setIsVerified] = useState(false)

  const handleContestSelect = (contestAddress: string) => {
    setSelectedContest(contestAddress)
    setCurrentView('vote')
  }

  const handleVerificationSuccess = () => {
    setIsVerified(true)
  }

  return (
    <MiniKitProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Header 
          currentView={currentView}
          onViewChange={setCurrentView}
          isConnected={isConnected}
          isVerified={isVerified}
        />
        
        <main className="container mx-auto px-4 py-8">
          {!isConnected ? (
            <div className="max-w-md mx-auto text-center">
              <div className="bg-white rounded-lg shadow-lg p-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Welcome to QuadWorldVote
              </h1>
                <p className="text-gray-600 mb-6">
                  A decentralized quadratic voting platform on World Chain
                </p>
                <ConnectButton />
              </div>
            </div>
          ) : !isVerified ? (
            <div className="max-w-md mx-auto text-center">
              <div className="bg-white rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Verify You're Human
                </h2>
                <p className="text-gray-600 mb-6">
                  Use World ID to verify your humanity and participate in voting
                </p>
                <WorldIDWidget onSuccess={handleVerificationSuccess} />
              </div>
            </div>
          ) : (
            <>
              {currentView === 'home' && (
                <ContestList onContestSelect={handleContestSelect} />
              )}
              {currentView === 'create' && (
                <CreateContest onContestCreated={() => setCurrentView('home')} />
              )}
              {currentView === 'vote' && selectedContest && (
                <VoteInterface 
                  contestAddress={selectedContest}
                  onBack={() => setCurrentView('home')}
                />
              )}
              {currentView === 'results' && selectedContest && (
                <Results 
                  contestAddress={selectedContest}
                  onBack={() => setCurrentView('home')}
                />
              )}
            </>
          )}
        </main>
      </div>
    </MiniKitProvider>
  )
}
