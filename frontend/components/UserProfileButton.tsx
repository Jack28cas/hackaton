'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import UserProfileMenu from './UserProfileMenu'
import { User, ChevronDown } from 'lucide-react'

export default function UserProfileButton() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user } = useAuth()

  console.log('🔍 UserProfileButton render:', { 
    hasUser: !!user, 
    userName: user?.name, 
    userRole: user?.role 
  })

  // Si no hay usuario autenticado, no mostrar nada
  if (!user) {
    console.log('❌ No user authenticated')
    return null
  }

  return (
    <>
      <button
        className="flex items-center space-x-2 hover:bg-white/10 p-1 rounded-md transition-colors relative z-50"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        style={{ minWidth: 'fit-content' }}
      >
        <div className="relative">
          <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center border-2 border-white shadow-lg ring-2 ring-white/50">
            <span className="text-white font-bold text-sm">
              {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </span>
          </div>
          {/* Notification dot */}
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full border-2 border-red-500"></div>
        </div>
        <div className="hidden md:flex flex-col items-start">
          <span className="text-sm font-medium text-white">{user.name}</span>
          <span className="text-xs text-white/70">{user.role === 'VENDEDOR' ? 'Vendedor' : 'Cliente'}</span>
        </div>
        <ChevronDown className={`h-4 w-4 text-white transition-transform ${isMenuOpen ? 'rotate-180' : ''}`} />
      </button>

      <UserProfileMenu 
        isOpen={isMenuOpen} 
        onClose={() => setIsMenuOpen(false)} 
      />
    </>
  )
}
