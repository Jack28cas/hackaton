'use client'

import { useState } from 'react'
import { SafeWalletConnect, SafeWalletInfo } from '@/components/SafeWalletAuth'
import Link from 'next/link'
import { ArrowLeft, Wallet, Zap, Shield, Coins, ExternalLink } from 'lucide-react'
import { useAccount } from 'wagmi'
import React from 'react'

export default function WalletPage() {
  const { address, isConnected } = useAccount();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-800 flex flex-col">
      {/* Header - Mobile First */}
      <div className="px-4 pt-6 pb-4">
        <div className="flex items-center justify-between mb-6">
          <Link href="/" className="flex items-center text-white hover:text-blue-200 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            <span className="text-sm">Volver al Inicio</span>
          </Link>
        </div>
        
        <div className="text-center text-white mb-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Wallet Web3</h1>
          <p className="text-sm md:text-base text-blue-200">Conecta tu wallet y gestiona tus transacciones</p>
        </div>
      </div>

      {/* Main Content - Mobile First */}
      <div className="flex-1 px-4 pb-6">
        <div className="max-w-md mx-auto space-y-6">
          
          {/* Wallet Status Card */}
          <div className="bg-white/95 backdrop-blur-sm shadow-xl rounded-lg">
            <div className="p-6">
              {isConnected ? (
                <div className="space-y-4">
                  {/* Connection Status */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-green-100 rounded-full">
                      <Wallet className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-green-600">¡Wallet Conectada!</h3>
                      <p className="text-sm text-gray-600">Tu wallet está conectada a Base</p>
                    </div>
                  </div>

                  {/* Wallet Address */}
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm font-medium text-gray-700 mb-1">Dirección:</p>
                    <p className="text-xs font-mono text-gray-600 break-all">
                      {address || '0xd7Ebf3fC998e6A3140Fe6116980c10b71429dc0e'}
                    </p>
                  </div>

                  {/* Connection State */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Estado:</span>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-green-600 font-medium">Conectada</span>
                    </div>
                  </div>

                  {/* Details Button */}
                  <button className="w-full mt-4 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Ver Detalles
                  </button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Wallet className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Conecta tu Wallet</h3>
                  <p className="text-sm text-gray-600 mb-4">Para acceder a funciones Web3</p>
                  <SafeWalletConnect />
                </div>
              )}
            </div>
          </div>

          {/* Benefits Card */}
          <div className="bg-white/95 backdrop-blur-sm shadow-xl rounded-lg">
            <div className="p-6 pb-4">
              <div className="flex items-center gap-2 text-lg font-semibold mb-2">
                <Zap className="h-5 w-5 text-yellow-500" />
                ¿Por qué conectar tu wallet?
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Beneficios de usar Web3 en HawkerChain
              </p>
            </div>
            <div className="px-6 pb-6 space-y-4">
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-gray-900">Pagos Seguros</h4>
                  <p className="text-sm text-gray-600">Transacciones directas sin intermediarios</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Coins className="h-5 w-5 text-blue-500 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-gray-900">Stablecoins</h4>
                  <p className="text-sm text-gray-600">Pagos estables con USDC en Base</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-3">
            <Link href="/cliente">
              <button className="w-full h-12 flex flex-col items-center justify-center bg-white/95 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <span className="text-lg mb-1">🛒</span>
                <span className="text-xs">Cliente</span>
              </button>
            </Link>
            
            <Link href="/vendedor">
              <button className="w-full h-12 flex flex-col items-center justify-center bg-white/95 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <span className="text-lg mb-1">🛍️</span>
                <span className="text-xs">Vendedor</span>
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Floating Profile Button */}
      <div className="fixed bottom-6 right-6">
        <button className="w-12 h-12 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors flex items-center justify-center">
          <span className="text-white font-semibold">N</span>
        </button>
      </div>
    </div>
  )
}
