'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AuthKitProvider, SignInButton, useProfile } from '@farcaster/auth-kit'
import { validateFarcasterConfig, createFarcasterManifest } from '@/lib/farcaster'

const config = {
  rpcUrl: 'https://mainnet.optimism.io',
  domain: 'c61058eb15dd.ngrok-free.app', // Usar el dominio de ngrok
  siweUri: process.env.NEXT_PUBLIC_URL || 'https://c61058eb15dd.ngrok-free.app',
}

function FarcasterProfile() {
  const {
    isAuthenticated,
    profile,
    logout
  } = useProfile()

  // Debug logging
  useEffect(() => {
    console.log('🎭 Farcaster Profile State:', { isAuthenticated, profile })
  }, [isAuthenticated, profile])

  if (isAuthenticated && profile) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <img 
              src={profile.pfpUrl} 
              alt={profile.displayName} 
              className="w-8 h-8 rounded-full"
            />
            {profile.displayName}
          </CardTitle>
          <CardDescription>
            @{profile.username} • FID: {profile.fid}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-gray-600 mb-2">Bio:</p>
            <p className="text-sm">{profile.bio}</p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">
              {profile.followerCount} seguidores
            </Badge>
            <Badge variant="secondary">
              {profile.followingCount} siguiendo
            </Badge>
          </div>

          <div className="pt-4">
            <Button 
              onClick={logout}
              variant="outline"
              className="w-full"
            >
              Cerrar Sesión Farcaster
            </Button>
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
      <CardContent>
        <div onClick={() => console.log('🔍 SignInButton clicked!')}>
          <SignInButton 
            onSuccess={() => console.log('✅ Farcaster sign in success!')}
            onError={(error) => console.error('❌ Farcaster sign in error:', error)}
          />
        </div>
      </CardContent>
    </Card>
  )
}

export default function FarcasterAuth() {
  const [configValid, setConfigValid] = useState(false)
  const [configDetails, setConfigDetails] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function checkConfig() {
      try {
        const response = await fetch('/api/farcaster/config')
        const config = await response.json()
        
        setConfigValid(config.configured)
        setConfigDetails(config)
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
          <CardTitle className="text-red-600">Configuración Faltante</CardTitle>
          <CardDescription>
            Falta configurar las variables de entorno de Farcaster
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-sm space-y-2">
            <p>Estado de configuración:</p>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span>Mnemonic:</span>
                <span className={configDetails?.hasMnemonic ? 'text-green-600' : 'text-red-600'}>
                  {configDetails?.hasMnemonic ? '✅' : '❌'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Header:</span>
                <span className={configDetails?.hasHeader ? 'text-green-600' : 'text-red-600'}>
                  {configDetails?.hasHeader ? '✅' : '❌'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Payload:</span>
                <span className={configDetails?.hasPayload ? 'text-green-600' : 'text-red-600'}>
                  {configDetails?.hasPayload ? '✅' : '❌'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Signature:</span>
                <span className={configDetails?.hasSignature ? 'text-green-600' : 'text-red-600'}>
                  {configDetails?.hasSignature ? '✅' : '❌'}
                </span>
              </div>
            </div>
            <p className="text-xs text-gray-600 mt-3">
              Reinicia el servidor de desarrollo si acabas de configurar las variables.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <AuthKitProvider config={config}>
      <div className="space-y-4">
        <FarcasterProfile />
        
        {configDetails && (
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-sm">Configuración Activa</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs space-y-1">
                <p><strong>URL Base:</strong> {configDetails.baseUrl}</p>
                <p><strong>Header:</strong> {configDetails.hasHeader ? '✅' : '❌'}</p>
                <p><strong>Payload:</strong> {configDetails.hasPayload ? '✅' : '❌'}</p>
                <p><strong>Signature:</strong> {configDetails.hasSignature ? '✅' : '❌'}</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AuthKitProvider>
  )
}
