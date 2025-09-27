'use client'

import { useState, useEffect } from 'react'
import { Slider, CheckCircle, AlertCircle, Users, Zap } from 'lucide-react'
import { MiniKitService, WorldIDProof } from '@/lib/minikit'

interface Project {
  id: string
  title: string
  description: string
  currentVotes: number
}

interface VoterFlowProps {
  contestAddress: string
  contestData: {
    title: string
    description: string
    creditsPerVoter: number
    maxProjects: number
    isActive: boolean
  }
  projects: Project[]
}

export function VoterFlow({ contestAddress, contestData, projects }: VoterFlowProps) {
  const [step, setStep] = useState<'verify' | 'vote' | 'submitting' | 'success'>('verify')
  const [allocations, setAllocations] = useState<number[]>(new Array(projects.length).fill(0))
  const [totalCost, setTotalCost] = useState(0)
  const [worldIDProof, setWorldIDProof] = useState<WorldIDProof | null>(null)
  const [error, setError] = useState<string>('')

  // Calculate total quadratic cost
  useEffect(() => {
    const cost = allocations.reduce((sum, allocation) => sum + allocation * allocation, 0)
    setTotalCost(cost)
  }, [allocations])

  const handleWorldIDVerification = async () => {
    try {
      const minikit = MiniKitService.getInstance()
      const proof = await minikit.getWorldIDProof()
      setWorldIDProof(proof)
      setStep('vote')
    } catch (err) {
      setError('Failed to verify World ID')
    }
  }

  const handleAllocationChange = (projectIndex: number, value: number) => {
    const newAllocations = [...allocations]
    newAllocations[projectIndex] = value
    setAllocations(newAllocations)
  }

  const handleSubmitVote = async () => {
    if (totalCost > contestData.creditsPerVoter) {
      setError(`Total cost (${totalCost}) exceeds available credits (${contestData.creditsPerVoter})`)
      return
    }

    if (!worldIDProof) {
      setError('World ID proof required')
      return
    }

    setStep('submitting')
    setError('')

    try {
      const minikit = MiniKitService.getInstance()
      const txHash = await minikit.castBallot(worldIDProof, allocations)
      setStep('success')
    } catch (err) {
      setError('Failed to submit vote')
      setStep('vote')
    }
  }

  const isVoteValid = totalCost <= contestData.creditsPerVoter && totalCost > 0

  if (step === 'verify') {
    return (
      <div className="max-w-md mx-auto text-center">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Verify You're Human</h2>
          <p className="text-gray-600 mb-6">
            Use World ID to prove you're a unique human and prevent sybil attacks
          </p>
          <button
            onClick={handleWorldIDVerification}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200"
          >
            Verify with World ID
          </button>
          {error && (
            <p className="text-red-600 text-sm mt-4">{error}</p>
          )}
        </div>
      </div>
    )
  }

  if (step === 'vote') {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{contestData.title}</h2>
            <p className="text-gray-600 mb-4">{contestData.description}</p>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span className="flex items-center">
                <Zap className="w-4 h-4 mr-1" />
                {contestData.creditsPerVoter} credits available
              </span>
              <span className="flex items-center">
                <Users className="w-4 h-4 mr-1" />
                {projects.length} projects
              </span>
            </div>
          </div>

          <div className="space-y-6">
            {projects.map((project, index) => (
              <div key={project.id} className="border border-gray-200 rounded-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{project.title}</h3>
                    <p className="text-gray-600 text-sm">{project.description}</p>
                  </div>
                  <div className="text-right ml-4">
                    <div className="text-2xl font-bold text-blue-600">{allocations[index]}</div>
                    <div className="text-xs text-gray-500">credits</div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>0</span>
                    <span>Max: {Math.floor(Math.sqrt(contestData.creditsPerVoter))}</span>
                  </div>
                  <Slider
                    value={[allocations[index]]}
                    onValueChange={([value]) => handleAllocationChange(index, value)}
                    max={Math.floor(Math.sqrt(contestData.creditsPerVoter))}
                    step={1}
                    className="w-full"
                  />
                  <div className="text-xs text-gray-500">
                    Quadratic cost: {allocations[index] * allocations[index]} credits
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 p-6 bg-gray-50 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-semibold text-gray-900">Total Cost</span>
              <div className="text-right">
                <div className={`text-2xl font-bold ${totalCost > contestData.creditsPerVoter ? 'text-red-600' : 'text-green-600'}`}>
                  {totalCost}
                </div>
                <div className="text-sm text-gray-500">/ {contestData.creditsPerVoter} credits</div>
              </div>
            </div>
            
            {totalCost > contestData.creditsPerVoter && (
              <div className="flex items-center text-red-600 text-sm mb-4">
                <AlertCircle className="w-4 h-4 mr-2" />
                Exceeds available credits
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <button
              onClick={handleSubmitVote}
              disabled={!isVoteValid}
              className={`w-full py-3 px-6 rounded-lg font-medium transition-all duration-200 ${
                isVoteValid
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Cast Ballot on World Chain
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (step === 'submitting') {
    return (
      <div className="max-w-md mx-auto text-center">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Submitting Vote</h2>
          <p className="text-gray-600">Verifying proof and casting ballot...</p>
        </div>
      </div>
    )
  }

  if (step === 'success') {
    return (
      <div className="max-w-md mx-auto text-center">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Vote Cast Successfully!</h2>
          <p className="text-gray-600 mb-6">Your quadratic vote has been recorded on World Chain.</p>
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-500">Total Credits Used:</p>
            <p className="text-2xl font-bold text-green-600">{totalCost}</p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            View Results
          </button>
        </div>
      </div>
    )
  }

  return null
}
