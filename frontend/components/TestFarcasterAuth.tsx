'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AuthKitProvider, SignInButton, useProfile, useSignIn } from '@farcaster/auth-kit'

// Configuración hardcodeada para testing
const config = {
  rpcUrl: 'https://mainnet.optimism.io',
  domain: 'localhost',
  siweUri: 'http://localhost:3000',
}

function FarcasterSignIn() {
  const { isAuthenticated, profile } = useProfile()
  const signInState = useSignIn()
  const [buttonClicked, setButtonClicked] = useState(false)
  const [authUrl, setAuthUrl] = useState<string | null>(null)

  useEffect(() => {
    console.log('🔍 Profile State:', { isAuthenticated, profile })
    console.log('🔍 SignIn State:', signInState)
    
    // Si hay un nonce, generar la URL de autenticación
    if (signInState && 'nonce' in signInState && signInState.nonce) {
      const url = `https://warpcast.com/~/sign-in-with-farcaster?nonce=${signInState.nonce}&siweUri=${encodeURIComponent('http://localhost:3000')}&domain=${encodeURIComponent('localhost')}`
      setAuthUrl(url)
      console.log('🔗 Auth URL generated:', url)
    }
  }, [isAuthenticated, profile, signInState])

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
        <CardTitle>Test Farcaster Auth</CardTitle>
        <CardDescription>
          Configuración simplificada para testing
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-xs text-gray-600 space-y-1">
          <p><strong>Domain:</strong> {config.domain}</p>
          <p><strong>RPC:</strong> {config.rpcUrl}</p>
          <p><strong>SIWE URI:</strong> {config.siweUri}</p>
        </div>
        
        <div 
          onClick={() => {
            console.log('🖱️ SignInButton clicked')
            setButtonClicked(true)
          }}
          className="w-full"
        >
          <SignInButton 
            onSuccess={(data) => {
              console.log('✅ Farcaster sign in success!', data)
            }}
            onError={(error) => {
              console.error('❌ Farcaster sign in error:', error)
            }}
            onStatusResponse={(res) => {
              console.log('📊 Status response:', res)
            }}
          />
        </div>

        {buttonClicked && (
          <div className="text-sm text-blue-600">
            Botón clickeado - revisa la consola para logs
          </div>
        )}

        {authUrl && (
          <div className="space-y-3 p-4 bg-blue-50 rounded-lg">
            <div className="text-sm font-medium text-blue-800">
              🎯 ¡Autenticación iniciada!
            </div>
            <div className="text-xs text-blue-700">
              <p className="mb-2">Para completar la autenticación:</p>
              <ol className="list-decimal list-inside space-y-1">
                <li>Abre la app Warpcast en tu teléfono</li>
                <li>Ve a Settings → Sign in with Farcaster</li>
                <li>O haz clic en el enlace de abajo</li>
              </ol>
            </div>
            <Button 
              size="sm" 
              className="w-full"
              onClick={() => window.open(authUrl, '_blank')}
            >
              🔗 Abrir en Warpcast
            </Button>
            <div className="text-xs text-gray-500 break-all">
              URL: {authUrl}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default function TestFarcasterAuth() {
  console.log('🚀 TestFarcasterAuth component loaded')
  
  return (
    <div className="space-y-4">
      <div className="text-center text-sm text-gray-600">
        <p>Versión de testing sin variables de entorno</p>
      </div>
      
      <AuthKitProvider config={config}>
        <FarcasterSignIn />
      </AuthKitProvider>
    </div>
  )
}
