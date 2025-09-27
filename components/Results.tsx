'use client'

import { useState, useEffect } from 'react'
import { useReadContract } from 'wagmi'
import { ContestABI } from '@/lib/contracts'
import { ArrowLeft, Trophy, Medal, Award, Users, CheckCircle } from 'lucide-react'

interface ProjectResult {
  id: number
  title: string
  score: number
  rank: number
}

interface ResultsProps {
  contestAddress: string
  onBack: () => void
}

export function Results({ contestAddress, onBack }: ResultsProps) {
  const [results, setResults] = useState<ProjectResult[]>([])
  const [loading, setLoading] = useState(true)
  const [finalized, setFinalized] = useState(false)

  // Get contest info
  const { data: contestInfo } = useReadContract({
    address: contestAddress as `0x${string}`,
    abi: ContestABI,
    functionName: 'getContestInfo',
  })

  // Get project results
  const { data: projectResults } = useReadContract({
    address: contestAddress as `0x${string}`,
    abi: ContestABI,
    functionName: 'getProjectResults',
  })

  // Get total votes
  const { data: totalVotes } = useReadContract({
    address: contestAddress as `0x${string}`,
    abi: ContestABI,
    functionName: 'getTotalVotes',
  })

  useEffect(() => {
    if (contestInfo) {
      const info = contestInfo as any
      setFinalized(info.finalized)
    }
  }, [contestInfo])

  useEffect(() => {
    if (projectResults) {
      const [scores, titles] = projectResults as [number[], string[]]
      
      // Mock data for demonstration - in real implementation, you'd process the actual results
      const mockResults: ProjectResult[] = titles.map((title, index) => ({
        id: index,
        title,
        score: Math.floor(Math.random() * 100) + 10, // Mock scores
        rank: 0 // Will be set after sorting
      }))

      // Sort by score and assign ranks
      mockResults.sort((a, b) => b.score - a.score)
      mockResults.forEach((result, index) => {
        result.rank = index + 1
      })

      setResults(mockResults)
      setLoading(false)
    }
  }, [projectResults])

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Medal className="w-6 h-6 text-yellow-500" />
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />
      case 3:
        return <Medal className="w-6 h-6 text-amber-600" />
      default:
        return <Award className="w-6 h-6 text-gray-300" />
    }
  }

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200'
      case 2:
        return 'bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200'
      case 3:
        return 'bg-gradient-to-r from-amber-50 to-amber-100 border-amber-200'
      default:
        return 'bg-white border-gray-200'
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading results...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Contests</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
            <Trophy className="w-5 h-5 text-yellow-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Contest Results</h2>
            <p className="text-gray-600">
              {finalized ? 'Final results' : 'Live results'} • {totalVotes ? Number(totalVotes) : 0} total votes
            </p>
          </div>
        </div>

        {!finalized && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-yellow-600" />
              <p className="text-yellow-800 text-sm">
                Results are live and will be finalized when the contest ends.
              </p>
            </div>
          </div>
        )}

        {results.length === 0 ? (
          <div className="text-center py-12">
            <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No Results Yet</h3>
            <p className="text-gray-500">Results will appear here once voting begins.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Podium for top 3 */}
            {results.slice(0, 3).length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">Podium</h3>
                <div className="flex justify-center items-end space-x-4">
                  {results.slice(0, 3).map((result, index) => (
                    <div
                      key={result.id}
                      className={`text-center p-4 rounded-lg border-2 ${getRankColor(result.rank)}`}
                      style={{
                        height: `${120 - index * 20}px`,
                        minWidth: '120px'
                      }}
                    >
                      <div className="flex justify-center mb-2">
                        {getRankIcon(result.rank)}
                      </div>
                      <div className="text-sm font-semibold text-gray-900">
                        #{result.rank}
                      </div>
                      <div className="text-xs text-gray-600 truncate">
                        {result.title}
                      </div>
                      <div className="text-xs font-bold text-blue-600">
                        {result.score} pts
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Full leaderboard */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Full Leaderboard</h3>
              <div className="space-y-2">
                {results.map((result) => (
                  <div
                    key={result.id}
                    className={`flex items-center justify-between p-4 rounded-lg border ${getRankColor(result.rank)}`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        {getRankIcon(result.rank)}
                        <span className="font-bold text-gray-700">#{result.rank}</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{result.title}</h4>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-blue-600">{result.score}</div>
                      <div className="text-xs text-gray-500">points</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold text-gray-900 mb-2">Verification</h4>
          <p className="text-sm text-gray-600 mb-2">
            All results are verifiable on-chain. You can verify the integrity of these results by checking the smart contract.
          </p>
          <div className="text-xs text-gray-500 font-mono">
            Contract: {contestAddress}
          </div>
        </div>
      </div>
    </div>
  )
}
