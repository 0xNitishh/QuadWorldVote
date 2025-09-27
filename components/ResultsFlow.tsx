'use client'

import { useState, useEffect } from 'react'
import { Trophy, Medal, Award, Users, CheckCircle, Clock, Zap } from 'lucide-react'
import { MiniKitService } from '@/lib/minikit'

interface Project {
  id: string
  title: string
  description: string
  totalVotes: number
  quadraticScore: number
  rank: number
}

interface ContestResults {
  isFinalized: boolean
  totalVoters: number
  totalCreditsUsed: number
  projects: Project[]
}

interface ResultsFlowProps {
  contestAddress: string
  contestData: {
    title: string
    description: string
    endTime: number
    isActive: boolean
  }
}

export function ResultsFlow({ contestAddress, contestData }: ResultsFlowProps) {
  const [results, setResults] = useState<ContestResults | null>(null)
  const [isFinalizing, setIsFinalizing] = useState(false)
  const [error, setError] = useState<string>('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadResults()
  }, [contestAddress])

  const loadResults = async () => {
    try {
      // Simulate loading results from contract
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const mockResults: ContestResults = {
        isFinalized: false,
        totalVoters: 42,
        totalCreditsUsed: 3780,
        projects: [
          {
            id: '1',
            title: 'Decentralized Social Network',
            description: 'A privacy-focused social platform',
            totalVotes: 156,
            quadraticScore: 24.5,
            rank: 1
          },
          {
            id: '2',
            title: 'Carbon Credit Marketplace',
            description: 'Blockchain-based carbon trading',
            totalVotes: 134,
            quadraticScore: 20.8,
            rank: 2
          },
          {
            id: '3',
            title: 'AI Research Grant',
            description: 'Funding for open-source AI research',
            totalVotes: 98,
            quadraticScore: 18.2,
            rank: 3
          },
          {
            id: '4',
            title: 'Community Garden Initiative',
            description: 'Urban farming and sustainability',
            totalVotes: 87,
            quadraticScore: 15.6,
            rank: 4
          }
        ]
      }
      
      setResults(mockResults)
    } catch (err) {
      setError('Failed to load results')
    } finally {
      setLoading(false)
    }
  }

  const handleFinalize = async () => {
    setIsFinalizing(true)
    setError('')

    try {
      const minikit = MiniKitService.getInstance()
      await minikit.finalizeContest(contestAddress)
      
      // Reload results after finalization
      await loadResults()
    } catch (err) {
      setError('Failed to finalize contest')
    } finally {
      setIsFinalizing(false)
    }
  }

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-6 h-6 text-yellow-500" />
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />
      case 3:
        return <Award className="w-6 h-6 text-amber-600" />
      default:
        return <span className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-sm font-bold text-gray-600">
          {rank}
        </span>
    }
  }

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'border-yellow-200 bg-yellow-50'
      case 2:
        return 'border-gray-200 bg-gray-50'
      case 3:
        return 'border-amber-200 bg-amber-50'
      default:
        return 'border-gray-200 bg-white'
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3 mb-8"></div>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-24 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!results) {
    return (
      <div className="max-w-md mx-auto text-center">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-red-600 mb-4">
            <AlertCircle className="w-12 h-12 mx-auto" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Results</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    )
  }

  const isContestEnded = new Date(contestData.endTime * 1000) < new Date()

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="mb-8">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{contestData.title}</h2>
              <p className="text-gray-600">{contestData.description}</p>
            </div>
            <div className="text-right">
              {results.isFinalized ? (
                <div className="flex items-center text-green-600">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  <span className="font-medium">Finalized</span>
                </div>
              ) : (
                <div className="flex items-center text-orange-600">
                  <Clock className="w-5 h-5 mr-2" />
                  <span className="font-medium">Live Results</span>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center">
                <Users className="w-5 h-5 text-blue-600 mr-2" />
                <span className="text-sm font-medium text-blue-900">Total Voters</span>
              </div>
              <div className="text-2xl font-bold text-blue-600 mt-1">{results.totalVoters}</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center">
                <Zap className="w-5 h-5 text-green-600 mr-2" />
                <span className="text-sm font-medium text-green-900">Credits Used</span>
              </div>
              <div className="text-2xl font-bold text-green-600 mt-1">{results.totalCreditsUsed}</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="flex items-center">
                <Trophy className="w-5 h-5 text-purple-600 mr-2" />
                <span className="text-sm font-medium text-purple-900">Projects</span>
              </div>
              <div className="text-2xl font-bold text-purple-600 mt-1">{results.projects.length}</div>
            </div>
          </div>

          {!results.isFinalized && isContestEnded && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium text-orange-900">Contest Ended</h3>
                  <p className="text-sm text-orange-700">Finalize the contest to lock in results</p>
                </div>
                <button
                  onClick={handleFinalize}
                  disabled={isFinalizing}
                  className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50"
                >
                  {isFinalizing ? 'Finalizing...' : 'Finalize'}
                </button>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Leaderboard</h3>
          {results.projects.map((project) => (
            <div
              key={project.id}
              className={`border-2 rounded-lg p-6 ${getRankColor(project.rank)}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {getRankIcon(project.rank)}
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-gray-900">{project.title}</h4>
                    <p className="text-gray-600 text-sm">{project.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">{project.quadraticScore.toFixed(1)}</div>
                  <div className="text-sm text-gray-500">quadratic score</div>
                  <div className="text-xs text-gray-400 mt-1">{project.totalVotes} total votes</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 p-6 bg-gray-50 rounded-lg">
          <h4 className="font-semibold text-gray-900 mb-2">How Quadratic Voting Works</h4>
          <p className="text-sm text-gray-600 mb-4">
            Each voter gets {contestData.creditsPerVoter} credits to allocate across projects. 
            The cost of voting for a project is the square of the number of credits allocated.
          </p>
          <div className="text-xs text-gray-500">
            <p>• 1 credit = 1 cost</p>
            <p>• 2 credits = 4 cost</p>
            <p>• 3 credits = 9 cost</p>
            <p>• 4 credits = 16 cost</p>
          </div>
        </div>
      </div>
    </div>
  )
}
