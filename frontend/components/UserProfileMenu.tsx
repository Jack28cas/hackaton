'use client'

import { useState, useRef, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { SafeWalletConnect } from '@/components/SafeWalletAuth'
import TestFarcasterAuth from '@/components/TestFarcasterAuth'

import { User, LogOut, Wallet, Settings, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface UserProfileMenuProps {
  isOpen: boolean
  onClose: () => void
}

export default function UserProfileMenu({ isOpen, onClose }: UserProfileMenuProps) {
  const { user, logout, clearAuth } = useAuth()
  const router = useRouter()
  const menuRef = useRef<HTMLDivElement>(null)

  // Cerrar menú al hacer clic fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onClose])

  const handleLogout = () => {
    logout()
    onClose()
    router.push('/')
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm">
      <div className="absolute top-16 right-4 w-96 max-w-[90vw] max-h-[80vh]">
        <div ref={menuRef} className="bg-white rounded-lg shadow-xl border overflow-hidden flex flex-col max-h-[80vh]">
          {/* Header del perfil */}
          <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 p-6 text-white relative overflow-hidden flex-shrink-0">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative flex items-center space-x-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center border-2 border-white/30 shadow-lg">
                <span className="text-white font-bold text-xl">
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </span>
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-xl mb-1">{user?.name || 'Usuario'}</h3>
                <p className="text-blue-100 text-sm mb-2">{user?.email}</p>
                <div className="flex items-center">
                  <span className={`px-3 py-1 text-xs rounded-full font-medium ${
                    user?.role === 'VENDEDOR' 
                      ? 'bg-green-500/20 text-green-100 border border-green-300/30' 
                      : 'bg-blue-500/20 text-blue-100 border border-blue-300/30'
                  }`}>
                    {user?.role === 'VENDEDOR' ? '🛍️ Vendedor' : '🛒 Cliente'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Información del usuario - Contenido scrolleable */}
          <div className="p-4 space-y-4 overflow-y-auto flex-1">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
              <div className="pb-2 border-b border-gray-200">
                <h3 className="text-xs font-semibold text-gray-900 flex items-center">
                  <User className="h-3 w-3 mr-1.5 text-blue-600" />
                  Información Personal
                </h3>
              </div>
              <div className="space-y-1.5 pt-2">
                <div className="flex justify-between items-center py-0.5">
                  <span className="text-xs text-gray-600 font-medium">Teléfono:</span>
                  <span className="text-xs text-gray-900">{user?.phone || 'No especificado'}</span>
                </div>
                <div className="flex justify-between items-center py-0.5">
                  <span className="text-xs text-gray-600 font-medium">Rol:</span>
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                    user?.role === 'VENDEDOR' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {user?.role === 'VENDEDOR' ? '🛍️ Vendedor' : '🛒 Cliente'}
                  </span>
                </div>
                <div className="flex justify-between items-center py-0.5">
                  <span className="text-xs text-gray-600 font-medium">Miembro desde:</span>
                  <span className="text-xs text-gray-900">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Hoy'}</span>
                </div>
                <div className="flex justify-between items-center py-0.5">
                  <span className="text-xs text-gray-600 font-medium">Email:</span>
                  <span className="text-xs text-gray-900">{user?.email || 'No especificado'}</span>
                </div>
              </div>
            </div>

            {/* Wallet Web3 */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="pb-3 border-b border-blue-200">
                <h3 className="text-sm font-semibold text-blue-900 flex items-center">
                  <Wallet className="h-4 w-4 mr-2 text-blue-600" />
                  Wallet Web3
                </h3>
                <p className="text-sm text-blue-700 mt-1">
                  Conecta tu wallet para pagos con crypto
                </p>
              </div>
              <div className="pt-3">
                <SafeWalletConnect />
              </div>
            </div>

            {/* Farcaster Auth */}
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <div className="pb-3 border-b border-purple-200">
                <h3 className="text-sm font-semibold text-purple-900 flex items-center">
                  🎭 Farcaster
                </h3>
                <p className="text-sm text-purple-700 mt-1">
                  Conecta tu identidad de Farcaster
                </p>
              </div>
              <div className="pt-3">
                <TestFarcasterAuth />
              </div>
            </div>

            {/* Acciones rápidas */}
            <div className="space-y-3 pt-2">
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Acciones Rápidas</h4>
              
              <Link href="/wallet">
                <button className="w-full justify-start px-4 py-3 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-all flex items-center group" onClick={onClose}>
                  <div className="p-2 bg-blue-100 rounded-lg mr-3 group-hover:bg-blue-200 transition-colors">
                    <Wallet className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-gray-900">Gestionar Wallet</div>
                    <div className="text-xs text-gray-500">Configurar pagos crypto</div>
                  </div>
                </button>
              </Link>
              
              <Link href="/farcaster">
                <button className="w-full justify-start px-4 py-3 border border-gray-200 rounded-lg hover:bg-purple-50 hover:border-purple-300 transition-all flex items-center group" onClick={onClose}>
                  <div className="p-2 bg-purple-100 rounded-lg mr-3 group-hover:bg-purple-200 transition-colors">
                    <ExternalLink className="h-4 w-4 text-purple-600" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-gray-900">Página de Farcaster</div>
                    <div className="text-xs text-gray-500">Configurar identidad social</div>
                  </div>
                </button>
              </Link>

              <button 
                className="w-full justify-start px-4 py-3 border border-gray-200 rounded-lg hover:bg-red-50 hover:border-red-300 transition-all flex items-center group mt-4"
                onClick={handleLogout}
              >
                <div className="p-2 bg-red-100 rounded-lg mr-3 group-hover:bg-red-200 transition-colors">
                  <LogOut className="h-4 w-4 text-red-600" />
                </div>
                <div className="text-left">
                  <div className="font-medium text-red-600">Cerrar Sesión</div>
                  <div className="text-xs text-red-500">Salir de la aplicación</div>
                </div>
              </button>

              {/* Botón temporal para debug */}
              <button 
                className="w-full justify-start px-4 py-3 border border-orange-200 rounded-lg hover:bg-orange-50 hover:border-orange-300 transition-all flex items-center group mt-2"
                onClick={() => {
                  clearAuth()
                  onClose()
                  router.push('/')
                }}
              >
                <div className="p-2 bg-orange-100 rounded-lg mr-3 group-hover:bg-orange-200 transition-colors">
                  <Settings className="h-4 w-4 text-orange-600" />
                </div>
                <div className="text-left">
                  <div className="font-medium text-orange-600">Limpiar Auth (Debug)</div>
                  <div className="text-xs text-orange-500">Forzar nueva sesión</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
