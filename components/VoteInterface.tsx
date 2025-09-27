'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, Vote, CheckCircle, AlertCircle } from 'lucide-react'

interface Project {
  id: number
  title: string
  description: string
  submitter: string
}

interface VoteInterfaceProps {
  contestAddress: string
  onBack: () => void
}

export function VoteInterface({ contestAddress, onBack }: VoteInterfaceProps) {
  const [projects, setProjects] = useState<Project[]>([])
  const [allocations, setAllocations] = useState<number[]>([])
  const [totalCost, setTotalCost] = useState(0)
  const [creditsPerVoter, setCreditsPerVoter] = useState(100)
  const [hasVoted, setHasVoted] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock projects data
    const mockProjects: Project[] = [
      {
        id: 0,
        title: 'Uniswap V4',
        description: 'Next generation DEX with hooks architecture',
        submitter: '0x1234...5678'
      },
      {
        id: 1,
        title: 'Aave V4',
        description: 'Advanced lending protocol with cross-chain support',
        submitter: '0x2345...6789'
      },
      {
        id: 2,
        title: 'Compound V3',
        description: 'Capital efficient lending with isolated markets',
        submitter: '0x3456...7890'
      }
    ]

    setProjects(mockProjects)
    setAllocations(new Array(mockProjects.length).fill(0))
    setLoading(false)
  }, [])

  useEffect(() => {
    const cost = allocations.reduce((sum, allocation) => sum + allocation * allocation, 0)
    setTotalCost(cost)
  }, [allocations])

  const handleAllocationChange = (projectId: number, value: number) => {
    const newAllocations = [...allocations]
    newAllocations[projectId] = Math.max(0, value)
    setAllocations(newAllocations)
  }

  const handleVote = async () => {
    // Simulate voting
    setTimeout(() => {
      setHasVoted(true)
    }, 2000)
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading contest...</p>
        </div>
      </div>
    )
  }

  if (hasVoted) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Vote Submitted!</h2>
            <p className="text-gray-600 mb-6">Your quadratic vote has been recorded on World Chain.</p>
            <button
              onClick={onBack}
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Back to Contests
            </button>
          </div>
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
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <Vote className="w-5 h-5 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Cast Your Vote</h2>
        </div>

        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <AlertCircle className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-blue-800">Quadratic Voting Rules</h3>
          </div>
          <p className="text-blue-700 text-sm">
            Allocate your {creditsPerVoter} credits across projects. The cost of each vote is the square of the allocation.
            Total cost must not exceed {creditsPerVoter} credits.
          </p>
        </div>

        <div className="space-y-6">
          {projects.map((project, index) => (
            <div key={project.id} className="border border-gray-200 rounded-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {project.title}
                  </h3>
                  <p className="text-gray-600 mb-2">{project.description}</p>
                  <p className="text-sm text-gray-500">
                    Submitted by: {project.submitter}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-600">
                    {allocations[index]}
                  </div>
                  <div className="text-sm text-gray-500">
                    Cost: {allocations[index] * allocations[index]} credits
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Allocation</span>
                  <span>{allocations[index]} credits</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={allocations[index]}
                  onChange={(e) => handleAllocationChange(index, parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>0</span>
                  <span>10</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 p-6 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Vote Summary</h3>
            <div className={`text-lg font-bold ${totalCost > creditsPerVoter ? 'text-red-600' : 'text-green-600'}`}>
              {totalCost} / {creditsPerVoter} credits
            </div>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${
                totalCost > creditsPerVoter ? 'bg-red-500' : 'bg-green-500'
              }`}
              style={{ width: `${Math.min((totalCost / creditsPerVoter) * 100, 100)}%` }}
            ></div>
          </div>

          {totalCost > creditsPerVoter && (
            <p className="text-red-600 text-sm mb-4">
              You've exceeded the credit limit. Please reduce your allocations.
            </p>
          )}

          <button
            onClick={handleVote}
            disabled={totalCost > creditsPerVoter || totalCost === 0}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            Cast Vote
          </button>
        </div>
      </div>
    </div>
  )
}