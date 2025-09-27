'use client'


import { useEffect, useState } from 'react'
import { Header } from '@/components/Header'
import { OrganizerFlow } from '@/components/OrganizerFlow'
import { VoterFlow } from '@/components/VoterFlow'
import { ResultsFlow } from '@/components/ResultsFlow'

export default function Home() {
  const [currentView, setCurrentView] = useState<'home' | 'organizer' | 'voter' | 'results'>('home')
  const [selectedContest, setSelectedContest] = useState<string | null>(null)
  const [walletAddress, setWalletAddress] = useState<string | null>(null)
  const [connecting, setConnecting] = useState(false)

  // Wallet connection logic (lifted from Header)
  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).ethereum) {
      (window as any).ethereum.request({ method: 'eth_accounts' }).then((accounts: string[]) => {
        if (accounts && accounts.length > 0) {
          setWalletAddress(accounts[0])
        } else {
          connectWallet()
        }
      })
      ;(window as any).ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts && accounts.length > 0) {
          setWalletAddress(accounts[0])
        } else {
          setWalletAddress(null)
        }
      })
    }
    // eslint-disable-next-line
  }, [])

  const connectWallet = async () => {
    if (typeof window !== 'undefined' && (window as any).ethereum) {
      setConnecting(true)
      try {
        const accounts = await (window as any).ethereum.request({ method: 'eth_requestAccounts' })
        if (accounts && accounts.length > 0) {
          setWalletAddress(accounts[0])
        }
      } catch (err) {
        // User rejected or error
      } finally {
        setConnecting(false)
      }
    } else {
      alert('MetaMask is not installed.')
    }
  }

  // Mock contest data for demonstration
  const mockContestData = {
    title: 'Community Development Fund',
    description: 'Vote on how to allocate $10,000 for community projects',
    creditsPerVoter: 100,
    maxProjects: 10,
    isActive: true,
    endTime: Math.floor(Date.now() / 1000) + 86400 // 24 hours from now
  }

  const mockProjects = [
    {
      id: '1',
      title: 'Decentralized Social Network',
      description: 'A privacy-focused social platform',
      currentVotes: 156
    },
    {
      id: '2',
      title: 'Carbon Credit Marketplace',
      description: 'Blockchain-based carbon trading',
      currentVotes: 134
    },
    {
      id: '3',
      title: 'AI Research Grant',
      description: 'Funding for open-source AI research',
      currentVotes: 98
    },
    {
      id: '4',
      title: 'Community Garden Initiative',
      description: 'Urban farming and sustainability',
      currentVotes: 87
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <Header walletAddress={walletAddress} connecting={connecting} connectWallet={connectWallet} />
      <main className="container mx-auto px-4 py-8">
        {currentView === 'home' && (
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Welcome to QuadWorldVote
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Quadratic voting on World Chain - where every voice matters
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
                <h3 className="text-xl font-semibold mb-3">Organizer</h3>
                <p className="text-gray-600 mb-4">Create and manage quadratic voting contests</p>
                <button
                  onClick={() => setCurrentView('organizer')}
                  className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Create Contest
                </button>
              </div>
              
              <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
                <h3 className="text-xl font-semibold mb-3">Voter</h3>
                <p className="text-gray-600 mb-4">Participate in active contests with World ID</p>
                <button
                  onClick={() => setCurrentView('voter')}
                  className="w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors"
                >
                  Start Voting
                </button>
              </div>
              
              <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
                <h3 className="text-xl font-semibold mb-3">Results</h3>
                <p className="text-gray-600 mb-4">View contest outcomes and leaderboards</p>
                <button
                  onClick={() => setCurrentView('results')}
                  className="w-full bg-purple-500 text-white py-2 px-4 rounded-lg hover:bg-purple-600 transition-colors"
                >
                  View Results
                </button>
              </div>
            </div>

            <div className="mt-12 max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">How It Works</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                <div className="bg-white rounded-lg p-6 shadow-lg">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <span className="text-2xl font-bold text-blue-600">1</span>
                  </div>
                  <h3 className="font-semibold mb-2">Create Contest</h3>
                  <p className="text-sm text-gray-600">Organizers set up contests with World Chain deployment</p>
                </div>
                <div className="bg-white rounded-lg p-6 shadow-lg">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                    <span className="text-2xl font-bold text-green-600">2</span>
                  </div>
                  <h3 className="font-semibold mb-2">Verify & Vote</h3>
                  <p className="text-sm text-gray-600">Voters verify with World ID and cast quadratic votes</p>
                </div>
                <div className="bg-white rounded-lg p-6 shadow-lg">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                    <span className="text-2xl font-bold text-purple-600">3</span>
                  </div>
                  <h3 className="font-semibold mb-2">View Results</h3>
                  <p className="text-sm text-gray-600">See verifiable on-chain results and leaderboards</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {currentView === 'organizer' && (
          <div>
            <div className="mb-6">
              <button
                onClick={() => setCurrentView('home')}
                className="text-blue-500 hover:text-blue-600 mb-4"
              >
                ← Back to Home
              </button>
            </div>
            <OrganizerFlow onContestCreated={() => setCurrentView('home')} walletAddress={walletAddress} />
          </div>
        )}

        {currentView === 'voter' && (
          <div>
            <div className="mb-6">
              <button
                onClick={() => setCurrentView('home')}
                className="text-blue-500 hover:text-blue-600 mb-4"
              >
                ← Back to Home
              </button>
            </div>
            <VoterFlow 
              contestAddress="0x1234567890123456789012345678901234567890"
              contestData={mockContestData}
              projects={mockProjects}
            />
          </div>
        )}

        {currentView === 'results' && (
          <div>
            <div className="mb-6">
              <button
                onClick={() => setCurrentView('home')}
                className="text-blue-500 hover:text-blue-600 mb-4"
              >
                ← Back to Home
              </button>
            </div>
            <ResultsFlow 
              contestAddress="0x1234567890123456789012345678901234567890"
              contestData={mockContestData}
            />
          </div>
        )}
      </main>
    </div>
  )
}