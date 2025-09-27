'use client'

import { Home, Plus, Vote, Trophy } from 'lucide-react'

interface HeaderProps {
  currentView?: string
  onViewChange?: (view: 'home' | 'organizer' | 'voter' | 'results') => void
}

export function Header({ currentView, onViewChange }: HeaderProps) {
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
          
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-600">Powered by World Chain</div>
          </div>
        </div>
      </div>
    </header>
  )
}