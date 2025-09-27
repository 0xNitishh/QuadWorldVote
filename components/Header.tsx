'use client'


import { useEffect, useState } from 'react'
import { Home, Plus, Vote, Trophy } from 'lucide-react'


interface HeaderProps {
  currentView?: string
  onViewChange?: (view: 'home' | 'organizer' | 'voter' | 'results') => void
  walletAddress?: string | null
  connecting?: boolean
  connectWallet?: () => void
}

export function Header({ currentView, onViewChange, walletAddress, connecting, connectWallet }: HeaderProps) {
  return (
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Vote className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-900">QuadWorldVote</h1>
          </div>

          {onViewChange && (
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
                onClick={() => onViewChange('organizer')}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                  currentView === 'organizer'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Plus className="w-4 h-4" />
                <span>Organizer</span>
              </button>

              <button
                onClick={() => onViewChange('voter')}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                  currentView === 'voter'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Vote className="w-4 h-4" />
                <span>Voter</span>
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

          <div className="flex flex-col items-end space-y-1 min-w-[140px]">
            {walletAddress ? (
              <>
                <button
                  className="bg-gradient-to-r from-green-500 to-green-400 text-white font-semibold px-4 py-2 rounded-lg shadow cursor-default mb-1"
                  disabled
                  style={{ minWidth: 120 }}
                >
                  Connected
                </button>
                <span className="text-xs text-gray-700 break-all text-right">{walletAddress}</span>
              </>
            ) : (
              <button
                id="connectWalletBtn"
                className="bg-gradient-to-r from-orange-400 to-yellow-400 text-white font-semibold px-4 py-2 rounded-lg shadow hover:from-orange-500 hover:to-yellow-500 transition-colors"
                style={{ minWidth: 120 }}
                onClick={connectWallet}
                disabled={connecting}
              >
                {connecting ? 'Connecting...' : 'Connect Wallet'}
              </button>
            )}
          </div>
        </div>
      </div>
  )
}