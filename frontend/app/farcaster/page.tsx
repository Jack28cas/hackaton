'use client'

import { useState } from 'react'
import TestFarcasterAuth from '@/components/TestFarcasterAuth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { ArrowLeft, Users, Shield, Zap } from 'lucide-react'

export default function FarcasterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 p-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-sm text-gray-600 hover:text-gray-800 mb-4">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Volver al inicio
          </Link>
          
          <div className="text-center">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
              Autenticación con Farcaster
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Conecta tu identidad de Farcaster para una experiencia más segura y personalizada en VendedoresApp
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Información sobre Farcaster */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-blue-600" />
                  ¿Por qué Farcaster?
                </CardTitle>
                <CardDescription>
                  Beneficios de usar Farcaster para autenticarte
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <Users className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Identidad Verificada</h4>
                    <p className="text-sm text-gray-600">Tu identidad está verificada en la red Farcaster</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Seguridad Mejorada</h4>
                    <p className="text-sm text-gray-600">Autenticación descentralizada y segura</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Zap className="h-5 w-5 text-purple-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Experiencia Personalizada</h4>
                    <p className="text-sm text-gray-600">Perfil y preferencias sincronizadas</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Estado de Configuración</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Mnemonic configurada:</span>
                    <span className="text-green-600">✅</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Manifest firmado:</span>
                    <span className="text-green-600">✅</span>
                  </div>
                  <div className="flex justify-between">
                    <span>URL configurada:</span>
                    <span className="text-green-600">✅</span>
                  </div>
                </div>
                
                <div className="mt-4 p-3 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-800">
                    <strong>¡Todo configurado!</strong> La integración de Farcaster está lista para usar.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Componente de autenticación */}
          <div className="flex flex-col items-center">
                            <TestFarcasterAuth />
            
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 mb-4">
                Una vez autenticado, podrás acceder a funciones premium
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/cliente">
                  <Button variant="outline" size="sm">
                    Ir a Cliente
                  </Button>
                </Link>
                <Link href="/vendedor">
                  <Button variant="outline" size="sm">
                    Ir a Vendedor
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Información técnica */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-sm">Información Técnica</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
              <div>
                <strong>Dirección Generada:</strong>
                <p className="font-mono break-all">0xB7c1cA4D82A198B3885FCbFFDC34E0fa76E3864f</p>
              </div>
              <div>
                <strong>Red:</strong>
                <p>Mainnet (Optimism)</p>
              </div>
              <div>
                <strong>Protocolo:</strong>
                <p>Farcaster v2</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
