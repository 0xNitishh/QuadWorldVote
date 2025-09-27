'use client'

import { useState } from 'react'
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { ContestFactoryABI } from '@/lib/contracts'
import { Calendar, Clock, Users, Settings } from 'lucide-react'

interface CreateContestProps {
  onContestCreated: () => void
}

export function CreateContest({ onContestCreated }: CreateContestProps) {
  const { address } = useAccount()
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startTime: '',
    endTime: '',
    creditsPerVoter: '100',
    maxProjects: '10',
    allowSelfSubmit: false
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { writeContract, data: hash, error, isPending } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!address) return

    setIsSubmitting(true)
    
    const startTimestamp = Math.floor(new Date(formData.startTime).getTime() / 1000)
    const endTimestamp = Math.floor(new Date(formData.endTime).getTime() / 1000)

    try {
      writeContract({
        address: process.env.NEXT_PUBLIC_CONTEST_FACTORY_ADDRESS as `0x${string}`,
        abi: ContestFactoryABI,
        functionName: 'createContest',
        args: [
          formData.title,
          formData.description,
          BigInt(startTimestamp),
          BigInt(endTimestamp),
          BigInt(formData.creditsPerVoter),
          BigInt(formData.maxProjects),
          formData.allowSelfSubmit
        ],
      })
    } catch (err) {
      console.error('Error creating contest:', err)
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    onContestCreated()
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-6 h-6 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold text-green-800 mb-2">Contest Created Successfully!</h3>
          <p className="text-green-600">Your quadratic voting contest is now live on World Chain.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <Settings className="w-5 h-5 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Create New Contest</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contest Title
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter contest title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              required
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Describe your contest"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Clock className="w-4 h-4 inline mr-1" />
                Start Time
              </label>
              <input
                type="datetime-local"
                required
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Clock className="w-4 h-4 inline mr-1" />
                End Time
              </label>
              <input
                type="datetime-local"
                required
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Users className="w-4 h-4 inline mr-1" />
                Credits per Voter
              </label>
              <input
                type="number"
                required
                min="1"
                value={formData.creditsPerVoter}
                onChange={(e) => setFormData({ ...formData, creditsPerVoter: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="100"
              />
              <p className="text-xs text-gray-500 mt-1">
                Total quadratic voting credits each voter can allocate
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max Projects
              </label>
              <input
                type="number"
                required
                min="1"
                value={formData.maxProjects}
                onChange={(e) => setFormData({ ...formData, maxProjects: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="10"
              />
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="allowSelfSubmit"
              checked={formData.allowSelfSubmit}
              onChange={(e) => setFormData({ ...formData, allowSelfSubmit: e.target.checked })}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="allowSelfSubmit" className="ml-2 block text-sm text-gray-700">
              Allow public project submissions
            </label>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-600 text-sm">Error: {error.message}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isPending || isConfirming || isSubmitting}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {isPending || isConfirming ? 'Creating Contest...' : 'Create Contest'}
          </button>
        </form>
      </div>
    </div>
  )
}
