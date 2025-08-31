'use client'

import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Wallet, ExternalLink } from 'lucide-react'
import Link from 'next/link'

export function SafeWalletConnect() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return (
      <Button disabled className="w-full">
        <Wallet className="h-4 w-4 mr-2" />
        Cargando...
      </Button>
    )
  }

  return (
    <div className="space-y-3">
      <div className="text-sm text-gray-600 text-center">
        <p>Conecta tu wallet Web3 para pagos con crypto</p>
      </div>
      
      <Link href="/wallet">
        <Button className="w-full">
          <Wallet className="h-4 w-4 mr-2" />
          Ir a Wallet
        </Button>
      </Link>
      
      <div className="text-xs text-gray-500 text-center">
        <p>Soporta MetaMask, Coinbase Wallet y más</p>
      </div>
    </div>
  )
}

export function SafeWalletInfo() {
  const { address, isConnected } = useAccount()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return (
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!isConnected) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Wallet className="h-5 w-5 mr-2" />
            Conectar Wallet
          </CardTitle>
          <CardDescription>
            Conecta tu wallet para acceder a funciones Web3
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SafeWalletConnect />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-green-600 flex items-center">
          <Wallet className="h-5 w-5 mr-2" />
          ¡Wallet Conectada!
        </CardTitle>
        <CardDescription>
          Tu wallet está conectada a Base
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-sm font-medium text-gray-700">Dirección:</p>
            <p className="text-xs font-mono text-gray-600 break-all">
              {address}
            </p>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Estado:</span>
            <span className="text-sm text-green-600 font-medium">✅ Conectada</span>
          </div>
          
          <Link href="/wallet">
            <Button variant="outline" className="w-full">
              <ExternalLink className="h-4 w-4 mr-2" />
              Ver Detalles
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
