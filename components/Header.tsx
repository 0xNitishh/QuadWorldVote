'use client'

import { ConnectButton } from '@rainbow-me/rainbowkit'
import { Home, Plus, Vote, Trophy } from 'lucide-react'

interface HeaderProps {
  currentView: string
  onViewChange: (view: 'home' | 'create' | 'vote' | 'results') => void
  isConnected: boolean
  isVerified: boolean
}

export function Header({ currentView, onViewChange, isConnected, isVerified }: HeaderProps) {
  if (!isConnected) return null

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Vote className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-900">QuadWorldVote</h1>
          </div>
          
          {isVerified && (
            <nav className="flex items-center space-x-4">
              <button
                onClick={() => onViewChange('home')}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                  currentView === 'home'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Home className="w-4 h-4" />
                <span>Home</span>
              </button>
              
              <button
                onClick={() => onViewChange('create')}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                  currentView === 'create'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Plus className="w-4 h-4" />
                <span>Create Contest</span>
              </button>
              
              <button
                onClick={() => onViewChange('results')}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                  currentView === 'results'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Trophy className="w-4 h-4" />
                <span>Results</span>
              </button>
            </nav>
          )}
          
          <div className="flex items-center space-x-4">
            {isVerified && (
              <div className="flex items-center space-x-2 text-sm text-green-600">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Verified Human</span>
              </div>
            )}
            <ConnectButton />
          </div>
        </div>
      </div>
    </header>
  )
}
