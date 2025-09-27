'use client'

import { useState, useEffect } from 'react'
import { Calendar, Clock, Users, ArrowRight, Trophy } from 'lucide-react'

interface Contest {
  address: string
  title: string
  description: string
  startTime: number
  endTime: number
  creditsPerVoter: number
  maxProjects: number
  projectCount: number
  totalVotes: number
  finalized: boolean
}

export function ContestList({ onContestSelect }: { onContestSelect: (address: string) => void }) {
  const [contests, setContests] = useState<Contest[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock data for demonstration
    const mockContests: Contest[] = [
      {
        address: '0x1234567890123456789012345678901234567890',
        title: 'Best DeFi Protocol 2024',
        description: 'Vote for the most innovative DeFi protocol of the year',
        startTime: Date.now() / 1000 - 3600,
        endTime: Date.now() / 1000 + 86400,
        creditsPerVoter: 100,
        maxProjects: 10,
        projectCount: 5,
        totalVotes: 23,
        finalized: false
      },
      {
        address: '0x2345678901234567890123456789012345678901',
        title: 'Community Grant Allocation',
        description: 'Decide how to allocate community development grants',
        startTime: Date.now() / 1000 - 7200,
        endTime: Date.now() / 1000 + 172800,
        creditsPerVoter: 150,
        maxProjects: 8,
        projectCount: 6,
        totalVotes: 45,
        finalized: false
      }
    ]

    setTimeout(() => {
      setContests(mockContests)
      setLoading(false)
    }, 1000)
  }, [])

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp * 1000)
    return date.toLocaleString()
  }

  const getContestStatus = (contest: Contest) => {
    const now = Date.now() / 1000
    if (contest.finalized) return { status: 'Finalized', color: 'bg-gray-100 text-gray-800' }
    if (now < contest.startTime) return { status: 'Upcoming', color: 'bg-blue-100 text-blue-800' }
    if (now > contest.endTime) return { status: 'Ended', color: 'bg-red-100 text-red-800' }
    return { status: 'Active', color: 'bg-green-100 text-green-800' }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading contests...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Quadratic Voting Contests</h2>
        <p className="text-gray-600">Participate in decentralized decision-making on World Chain</p>
      </div>

      {contests.length === 0 ? (
        <div className="text-center py-12">
          <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No Contests Yet</h3>
          <p className="text-gray-500">Be the first to create a quadratic voting contest!</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {contests.map((contest) => {
            const status = getContestStatus(contest)
            return (
              <div
                key={contest.address}
                className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer"
                onClick={() => onContestSelect(contest.address)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {contest.title}
                    </h3>
                    <p className="text-gray-600 mb-4">{contest.description}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${status.color}`}>
                    {status.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>Start: {formatTime(contest.startTime)}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>End: {formatTime(contest.endTime)}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Users className="w-4 h-4" />
                    <span>{contest.totalVotes} votes</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Trophy className="w-4 h-4" />
                    <span>{contest.projectCount} projects</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    Credits per voter: {contest.creditsPerVoter}
                  </div>
                  <div className="flex items-center space-x-2 text-blue-600">
                    <span className="text-sm font-medium">
                      {status.status === 'Finalized' ? 'View Results' : 'Participate'}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}