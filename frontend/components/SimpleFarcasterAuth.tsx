'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AuthKitProvider, SignInButton, useProfile, useSignIn } from '@farcaster/auth-kit'

// Configuración simplificada
const config = {
  rpcUrl: 'https://mainnet.optimism.io',
  domain: 'c61058eb15dd.ngrok-free.app',
  siweUri: 'https://c61058eb15dd.ngrok-free.app',
}

function FarcasterSignIn() {
  const { isAuthenticated, profile } = useProfile()

  useEffect(() => {
    console.log('🔍 Profile State:', { isAuthenticated, profile })
  }, [isAuthenticated, profile])

  if (isAuthenticated && profile) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-green-600">¡Conectado con Farcaster!</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <img 
                src={profile.pfpUrl} 
                alt={profile.displayName} 
                className="w-10 h-10 rounded-full"
              />
              <div>
                <p className="font-semibold">{profile.displayName}</p>
                <p className="text-sm text-gray-600">@{profile.username}</p>
              </div>
            </div>
            <div className="text-xs text-gray-500">
              FID: {profile.fid}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Conectar con Farcaster</CardTitle>
        <CardDescription>
          Autentica tu identidad usando Farcaster
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div 
          onClick={() => console.log('🖱️ SignInButton area clicked')}
          className="w-full"
        >
          <SignInButton 
            onSuccess={() => console.log('✅ Farcaster sign in success!')}
            onError={(error) => console.error('❌ Farcaster sign in error:', error)}
          />
        </div>
      </CardContent>
    </Card>
  )
}

export default function SimpleFarcasterAuth() {
  const [configValid, setConfigValid] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function checkConfig() {
      try {
        const response = await fetch('/api/farcaster/config')
        const config = await response.json()
        setConfigValid(config.configured)
      } catch (error) {
        console.error('Error checking config:', error)
        setConfigValid(false)
      } finally {
        setLoading(false)
      }
    }
    
    checkConfig()
  }, [])

  if (loading) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Verificando Configuración...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        </CardContent>
      </Card>
    )
  }

  if (!configValid) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-red-600">Configuración Incompleta</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600">
            Las variables de entorno de Farcaster no están configuradas correctamente.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <AuthKitProvider config={config}>
      <div className="space-y-4">
        <FarcasterSignIn />
      </div>
    </AuthKitProvider>
  )
}
