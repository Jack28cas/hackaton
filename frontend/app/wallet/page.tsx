'use client'

import { useState } from 'react'
import { WalletConnect, WalletInfo } from '@/components/WalletAuth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { ArrowLeft, Wallet, Zap, Shield, Coins } from 'lucide-react'
import { useAccount } from 'wagmi'
import {
  Transaction,
  TransactionButton,
  TransactionToast,
  TransactionToastAction,
  TransactionToastIcon,
  TransactionToastLabel,
  TransactionStatus,
  TransactionStatusAction,
  TransactionStatusLabel,
} from "@coinbase/onchainkit/transaction";
import { useMemo } from 'react'

export default function WalletPage() {
  const { address, isConnected } = useAccount();

  // Example transaction call - sending 0 ETH to self
  const calls = useMemo(() => address
    ? [
        {
          to: address,
          data: "0x" as `0x${string}`,
          value: BigInt(0),
        },
      ]
    : [], [address]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/" className="flex items-center text-white hover:text-blue-200 transition-colors">
            <ArrowLeft className="h-5 w-5 mr-2" />
            Volver al Inicio
          </Link>
          
          <div className="text-white">
            <h1 className="text-3xl font-bold mb-2">Wallet Web3</h1>
            <p className="text-blue-200">Conecta tu wallet y gestiona tus transacciones</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Wallet Connection */}
          <div className="space-y-6">
            <WalletInfo />

            {/* Features */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-yellow-500" />
                  ¿Por qué conectar tu wallet?
                </CardTitle>
                <CardDescription>
                  Beneficios de usar Web3 en VendedoresApp
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Shield className="h-5 w-5 text-green-500 mt-1" />
                    <div>
                      <h4 className="font-semibold">Pagos Seguros</h4>
                      <p className="text-sm text-gray-600">Transacciones directas sin intermediarios</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Coins className="h-5 w-5 text-blue-500 mt-1" />
                    <div>
                      <h4 className="font-semibold">Stablecoins</h4>
                      <p className="text-sm text-gray-600">Pagos estables con USDC en Base</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Wallet className="h-5 w-5 text-purple-500 mt-1" />
                    <div>
                      <h4 className="font-semibold">Control Total</h4>
                      <p className="text-sm text-gray-600">Tú controlas tus fondos completamente</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Transaction Demo */}
          <div className="space-y-6">
            {isConnected && (
              <Card>
                <CardHeader>
                  <CardTitle>Transacción de Prueba</CardTitle>
                  <CardDescription>
                    Envía una transacción de prueba en Base
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-sm text-gray-600">
                      Esta transacción enviará 0 ETH a tu propia dirección como demostración.
                    </p>
                    
                    <Transaction
                      calls={calls}
                      onSuccess={(response) => {
                        const hash = response.transactionReceipts[0].transactionHash;
                        console.log(`✅ Transacción exitosa: ${hash}`);
                      }}
                      onError={(error) => {
                        console.error("❌ Transacción fallida:", error);
                      }}
                    >
                      <TransactionButton className="w-full bg-blue-600 hover:bg-blue-700 text-white" />
                      <TransactionStatus>
                        <TransactionStatusAction />
                        <TransactionStatusLabel />
                      </TransactionStatus>
                      <TransactionToast>
                        <TransactionToastIcon />
                        <TransactionToastLabel />
                        <TransactionToastAction />
                      </TransactionToast>
                    </Transaction>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Navigation */}
            <Card>
              <CardHeader>
                <CardTitle>Explorar la App</CardTitle>
                <CardDescription>
                  Descubre todas las funcionalidades
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <Link href="/cliente">
                    <Button variant="outline" className="w-full h-16 flex flex-col items-center justify-center">
                      <span className="text-lg mb-1">🛒</span>
                      <span className="text-sm">Cliente</span>
                    </Button>
                  </Link>
                  
                  <Link href="/vendedor">
                    <Button variant="outline" className="w-full h-16 flex flex-col items-center justify-center">
                      <span className="text-lg mb-1">🛍️</span>
                      <span className="text-sm">Vendedor</span>
                    </Button>
                  </Link>
                  
                  <Link href="/farcaster">
                    <Button variant="outline" className="w-full h-16 flex flex-col items-center justify-center">
                      <span className="text-lg mb-1">🎭</span>
                      <span className="text-sm">Farcaster</span>
                    </Button>
                  </Link>
                  
                  <Link href="/login">
                    <Button variant="outline" className="w-full h-16 flex flex-col items-center justify-center">
                      <span className="text-lg mb-1">🔐</span>
                      <span className="text-sm">Login</span>
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
