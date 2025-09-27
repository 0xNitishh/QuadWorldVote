'use client'

import { useState } from 'react'
import { Calendar, Clock, Users, Settings, Plus, CheckCircle } from 'lucide-react'
import { MiniKitService } from '@/lib/minikit'

interface ContestFormData {
  title: string
  description: string
  startTime: string
  endTime: string
  creditsPerVoter: string
  maxProjects: string
  allowSelfSubmit: boolean
}

interface OrganizerFlowProps {
  onContestCreated: (contestAddress: string) => void
}

export function OrganizerFlow({ onContestCreated }: OrganizerFlowProps) {
  const [step, setStep] = useState<'connect' | 'form' | 'creating' | 'success'>('connect')
  const [walletAddress, setWalletAddress] = useState<string>('')
  const [formData, setFormData] = useState<ContestFormData>({
    title: '',
    description: '',
    startTime: '',
    endTime: '',
    creditsPerVoter: '100',
    maxProjects: '10',
    allowSelfSubmit: false
  })
  const [contestAddress, setContestAddress] = useState<string>('')
  const [error, setError] = useState<string>('')

  const handleConnectWallet = async () => {
    try {
      const minikit = MiniKitService.getInstance()
      const address = await minikit.connectWallet()
      setWalletAddress(address)
      setStep('form')
    } catch (err) {
      setError('Failed to connect wallet')
    }
  }

  const handleSubmitContest = async (e: React.FormEvent) => {
    e.preventDefault()
    setStep('creating')
    setError('')

    try {
      const minikit = MiniKitService.getInstance()
      const address = await minikit.createContest({
        title: formData.title,
        description: formData.description,
        startTime: new Date(formData.startTime).getTime() / 1000,
        endTime: new Date(formData.endTime).getTime() / 1000,
        creditsPerVoter: parseInt(formData.creditsPerVoter),
        maxProjects: parseInt(formData.maxProjects),
        allowSelfSubmit: formData.allowSelfSubmit
      })
      
      setContestAddress(address)
      setStep('success')
      onContestCreated(address)
    } catch (err) {
      setError('Failed to create contest')
      setStep('form')
    }
  }

  if (step === 'connect') {
    return (
      <div className="max-w-md mx-auto text-center">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Settings className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Organizer Setup</h2>
          <p className="text-gray-600 mb-6">
            Connect your wallet to create and manage quadratic voting contests
          </p>
          <button
            onClick={handleConnectWallet}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200"
          >
            Connect Wallet via MiniKit
          </button>
          {error && (
            <p className="text-red-600 text-sm mt-4">{error}</p>
          )}
        </div>
      </div>
    )
  }

  if (step === 'form') {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Plus className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Create New Contest</h2>
              <p className="text-sm text-gray-500">Connected: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}</p>
            </div>
          </div>

          <form onSubmit={handleSubmitContest} className="space-y-6">
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
                  Credits per Voter (B)
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
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200"
            >
              Create Contest on World Chain
            </button>
          </form>
        </div>
      </div>
    )
  }

  if (step === 'creating') {
    return (
      <div className="max-w-md mx-auto text-center">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Creating Contest</h2>
          <p className="text-gray-600">Deploying to World Chain...</p>
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
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Contest Created!</h2>
          <p className="text-gray-600 mb-4">Your quadratic voting contest is now live on World Chain.</p>
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-500">Contract Address:</p>
            <p className="font-mono text-sm text-gray-900 break-all">{contestAddress}</p>
          </div>
          <button
            onClick={() => setStep('form')}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Create Another Contest
          </button>
        </div>
      </div>
    )
  }

  return null
}
