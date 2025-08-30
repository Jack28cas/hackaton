'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { MapPin, ShoppingCart, Smartphone, Zap, Users, Clock, Shield, Star, ArrowRight, CheckCircle } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl">
              <ShoppingCart className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                VendedoresApp
              </h1>
              <p className="text-xs text-gray-500">Conectando comunidades</p>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>En línea</span>
            </div>
                      <div className="flex items-center space-x-2">
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Iniciar Sesión
              </Button>
            </Link>
            <Link href="/register">
              <Button size="sm">
                Registrarse
              </Button>
            </Link>
            <Link href="/wallet">
              <Button variant="outline" size="sm">
                Wallet
              </Button>
            </Link>
            <Link href="/farcaster">
              <Button variant="outline" size="sm">
                Farcaster
              </Button>
            </Link>
          </div>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center px-4 py-2 bg-white/50 backdrop-blur-sm rounded-full border border-blue-200 mb-8">
            <Star className="h-4 w-4 text-yellow-500 mr-2" />
            <span className="text-sm font-medium text-gray-700">La app #1 para vendedores ambulantes</span>
          </div>
          
          <h2 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            Encuentra tu
            <br />
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              vendedor favorito
            </span>
          </h2>
          
          <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            Conecta con vendedores ambulantes en tiempo real. Pagos seguros con stablecoins. 
            <span className="font-semibold text-gray-800">Simple, rápido y confiable.</span>
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mb-16 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-1">500+</div>
              <div className="text-sm text-gray-600">Vendedores activos</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-1">24/7</div>
              <div className="text-sm text-gray-600">Disponibilidad</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-pink-600 mb-1">100%</div>
              <div className="text-sm text-gray-600">Pagos seguros</div>
            </div>
          </div>

          {/* User Type Selection */}
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <Card className="group cursor-pointer transition-all duration-300 hover:shadow-2xl hover:scale-105 border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto mb-6 p-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl w-20 h-20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <MapPin className="h-10 w-10 text-white" />
                </div>
                <CardTitle className="text-3xl mb-2 text-gray-900">Soy Cliente</CardTitle>
                <CardDescription className="text-lg text-gray-600">
                  Encuentra vendedores cercanos y realiza pedidos al instante
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3 mb-6">
                  <div className="flex items-center space-x-3 text-sm text-gray-600">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Mapa en tiempo real</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm text-gray-600">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Pagos automáticos</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm text-gray-600">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Notificaciones instantáneas</span>
                  </div>
                </div>
                <Link href="/cliente">
                  <Button className="w-full h-12 text-lg bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 group-hover:shadow-lg transition-all duration-300">
                    Buscar Vendedores
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="group cursor-pointer transition-all duration-300 hover:shadow-2xl hover:scale-105 border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto mb-6 p-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl w-20 h-20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Smartphone className="h-10 w-10 text-white" />
                </div>
                <CardTitle className="text-3xl mb-2 text-gray-900">Soy Vendedor</CardTitle>
                <CardDescription className="text-lg text-gray-600">
                  Conecta con más clientes y aumenta tus ventas
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3 mb-6">
                  <div className="flex items-center space-x-3 text-sm text-gray-600">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Gestión de productos</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm text-gray-600">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Pedidos en tiempo real</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm text-gray-600">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Pagos instantáneos</span>
                  </div>
                </div>
                <Link href="/vendedor">
                  <Button className="w-full h-12 text-lg bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 group-hover:shadow-lg transition-all duration-300">
                    Empezar a Vender
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white/50 backdrop-blur-sm py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              ¿Por qué elegir VendedoresApp?
            </h3>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              La plataforma más completa y segura para conectar vendedores con clientes
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto">
            <div className="group text-center">
              <div className="mx-auto mb-6 p-4 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl w-20 h-20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Clock className="h-10 w-10 text-white" />
              </div>
              <h4 className="text-2xl font-bold mb-4 text-gray-900">Tiempo Real</h4>
              <p className="text-gray-600 text-lg leading-relaxed">
                Ubicación exacta de vendedores, actualizaciones instantáneas y notificaciones al momento
              </p>
            </div>

            <div className="group text-center">
              <div className="mx-auto mb-6 p-4 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl w-20 h-20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Zap className="h-10 w-10 text-white" />
              </div>
              <h4 className="text-2xl font-bold mb-4 text-gray-900">Pagos Inteligentes</h4>
              <p className="text-gray-600 text-lg leading-relaxed">
                Stablecoins, pagos automáticos y transacciones seguras sin intermediarios
              </p>
            </div>

            <div className="group text-center">
              <div className="mx-auto mb-6 p-4 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl w-20 h-20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Shield className="h-10 w-10 text-white" />
              </div>
              <h4 className="text-2xl font-bold mb-4 text-gray-900">Súper Fácil</h4>
              <p className="text-gray-600 text-lg leading-relaxed">
                Interfaz intuitiva diseñada para todos. Si tu abuela puede usarlo, tú también
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 py-20">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-4xl md:text-5xl font-bold text-white mb-6">
            ¿Listo para empezar?
          </h3>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Únete a miles de usuarios que ya están conectando en tiempo real
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/cliente">
              <Button size="lg" className="h-14 px-8 text-lg bg-white text-blue-600 hover:bg-blue-50">
                <Users className="mr-2 h-5 w-5" />
                Buscar Vendedores
              </Button>
            </Link>
            <Link href="/vendedor">
              <Button size="lg" variant="outline" className="h-14 px-8 text-lg border-white text-white hover:bg-white hover:text-blue-600">
                <Smartphone className="mr-2 h-5 w-5" />
                Vender Ahora
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl">
                <ShoppingCart className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="text-xl font-bold">VendedoresApp</div>
                <div className="text-sm text-gray-400">Conectando comunidades</div>
              </div>
            </div>
            <div className="text-center md:text-right">
              <p className="text-gray-400">&copy; 2024 VendedoresApp</p>
              <p className="text-sm text-gray-500 mt-1">
                Innovación que transforma el comercio local
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
