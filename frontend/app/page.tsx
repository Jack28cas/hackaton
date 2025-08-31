'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { MapPin, ShoppingCart, Smartphone, Zap, Users, Clock, Shield, Star, ArrowRight, CheckCircle } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header - Responsive */}
      <header className="container mx-auto px-4 py-4 md:py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-2 md:space-x-3">
            <div className="p-1.5 md:p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl">
              <ShoppingCart className="h-6 w-6 md:h-8 md:w-8 text-white" />
            </div>
            <div>
              <h1 className="text-lg md:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                HawkerChain
              </h1>
              <p className="text-xs text-gray-500 hidden sm:block">Conectando comunidades</p>
            </div>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-4">
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

          {/* Mobile Navigation */}
          <div className="flex lg:hidden items-center space-x-1">
                         <Link href="/login">
               <Button variant="ghost" size="sm" className="text-xs px-2">
                 Entrar
               </Button>
             </Link>
            <Link href="/register">
              <Button size="sm" className="text-xs px-2">
                Registro
              </Button>
            </Link>
            <Link href="/wallet">
              <Button variant="outline" size="sm" className="text-xs px-2">
                Wallet
              </Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-8 md:py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center px-3 md:px-4 py-2 bg-white/50 backdrop-blur-sm rounded-full border border-blue-200 mb-6 md:mb-8">
            <Star className="h-3 w-3 md:h-4 md:w-4 text-yellow-500 mr-1 md:mr-2" />
            <span className="text-xs md:text-sm font-medium text-gray-700">La app #1 para vendedores ambulantes</span>
          </div>
          
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-4 md:mb-6 leading-tight px-2">
            Encuentra tu
            <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              vendedor favorito
            </span>
          </h2>
          
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 mb-6 md:mb-8 max-w-2xl mx-auto leading-relaxed px-4">
            Conecta con vendedores ambulantes en tiempo real. Pagos seguros con stablecoins. 
            <span className="font-semibold text-gray-800">Simple, rápido y confiable.</span>
          </p>

          {/* Stats - Responsive */}
          <div className="grid grid-cols-3 gap-3 sm:gap-4 md:gap-6 mb-8 md:mb-12 max-w-lg md:max-w-2xl mx-auto px-4">
            <div className="text-center">
              <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-blue-600 mb-1">500+</div>
              <div className="text-xs sm:text-sm text-gray-600">Vendedores</div>
            </div>
            <div className="text-center">
              <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-purple-600 mb-1">24/7</div>
              <div className="text-xs sm:text-sm text-gray-600">Disponible</div>
            </div>
            <div className="text-center">
              <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-pink-600 mb-1">100%</div>
              <div className="text-xs sm:text-sm text-gray-600">Seguro</div>
            </div>
          </div>

          {/* User Type Selection - Responsive */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 max-w-4xl mx-auto px-4">
            <Card className="group cursor-pointer transition-all duration-300 hover:shadow-2xl hover:scale-105 border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="text-center pb-3 md:pb-4 p-4 md:p-6">
                <div className="mx-auto mb-3 md:mb-4 p-3 md:p-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl w-14 h-14 md:w-18 md:h-18 lg:w-20 lg:h-20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <MapPin className="h-6 w-6 md:h-8 md:w-8 lg:h-10 lg:w-10 text-white" />
                </div>
                <CardTitle className="text-xl md:text-2xl lg:text-3xl mb-2 text-gray-900">Soy Cliente</CardTitle>
                <CardDescription className="text-sm md:text-base lg:text-lg text-gray-600 px-2">
                  Encuentra vendedores cercanos y realiza pedidos al instante
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0 p-4 md:p-6">
                <div className="space-y-2 md:space-y-3 mb-4 md:mb-6">
                  <div className="flex items-center space-x-2 md:space-x-3 text-xs md:text-sm text-gray-600">
                    <CheckCircle className="h-3 w-3 md:h-4 md:w-4 text-green-500 flex-shrink-0" />
                    <span>Mapa en tiempo real</span>
                  </div>
                  <div className="flex items-center space-x-2 md:space-x-3 text-xs md:text-sm text-gray-600">
                    <CheckCircle className="h-3 w-3 md:h-4 md:w-4 text-green-500 flex-shrink-0" />
                    <span>Pagos automáticos</span>
                  </div>
                  <div className="flex items-center space-x-2 md:space-x-3 text-xs md:text-sm text-gray-600">
                    <CheckCircle className="h-3 w-3 md:h-4 md:w-4 text-green-500 flex-shrink-0" />
                    <span>Notificaciones instantáneas</span>
                  </div>
                </div>
                <Link href="/cliente">
                  <Button className="w-full h-10 md:h-12 text-sm md:text-base lg:text-lg bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 group-hover:shadow-lg transition-all duration-300">
                    Buscar Vendedores
                    <ArrowRight className="ml-1 md:ml-2 h-4 w-4 md:h-5 md:w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="group cursor-pointer transition-all duration-300 hover:shadow-2xl hover:scale-105 border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="text-center pb-3 md:pb-4 p-4 md:p-6">
                <div className="mx-auto mb-3 md:mb-4 p-3 md:p-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl w-14 h-14 md:w-18 md:h-18 lg:w-20 lg:h-20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Smartphone className="h-6 w-6 md:h-8 md:w-8 lg:h-10 lg:w-10 text-white" />
                </div>
                <CardTitle className="text-xl md:text-2xl lg:text-3xl mb-2 text-gray-900">Soy Vendedor</CardTitle>
                <CardDescription className="text-sm md:text-base lg:text-lg text-gray-600 px-2">
                  Conecta con más clientes y aumenta tus ventas
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0 p-4 md:p-6">
                <div className="space-y-2 md:space-y-3 mb-4 md:mb-6">
                  <div className="flex items-center space-x-2 md:space-x-3 text-xs md:text-sm text-gray-600">
                    <CheckCircle className="h-3 w-3 md:h-4 md:w-4 text-green-500 flex-shrink-0" />
                    <span>Gestión de productos</span>
                  </div>
                  <div className="flex items-center space-x-2 md:space-x-3 text-xs md:text-sm text-gray-600">
                    <CheckCircle className="h-3 w-3 md:h-4 md:w-4 text-green-500 flex-shrink-0" />
                    <span>Pedidos en tiempo real</span>
                  </div>
                  <div className="flex items-center space-x-2 md:space-x-3 text-xs md:text-sm text-gray-600">
                    <CheckCircle className="h-3 w-3 md:h-4 md:w-4 text-green-500 flex-shrink-0" />
                    <span>Pagos instantáneos</span>
                  </div>
                </div>
                <Link href="/vendedor">
                  <Button className="w-full h-10 md:h-12 text-sm md:text-base lg:text-lg bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 group-hover:shadow-lg transition-all duration-300">
                    Empezar a Vender
                    <ArrowRight className="ml-1 md:ml-2 h-4 w-4 md:h-5 md:w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white/50 backdrop-blur-sm py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 md:mb-16">
            <h3 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-4 md:mb-6">
              ¿Por qué elegir HawkerChain?
            </h3>
            <p className="text-base md:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto px-4">
              La plataforma más completa y segura para conectar vendedores con clientes
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 max-w-5xl mx-auto px-4">
            <div className="group text-center">
              <div className="mx-auto mb-4 md:mb-6 p-3 md:p-4 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl w-16 h-16 md:w-20 md:h-20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Clock className="h-8 w-8 md:h-10 md:w-10 text-white" />
              </div>
              <h4 className="text-lg md:text-xl lg:text-2xl font-bold mb-3 md:mb-4 text-gray-900">Tiempo Real</h4>
              <p className="text-gray-600 text-sm md:text-base lg:text-lg leading-relaxed">
                Ubicación exacta de vendedores, actualizaciones instantáneas y notificaciones al momento
              </p>
            </div>

            <div className="group text-center">
              <div className="mx-auto mb-4 md:mb-6 p-3 md:p-4 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl w-16 h-16 md:w-20 md:h-20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Zap className="h-8 w-8 md:h-10 md:w-10 text-white" />
              </div>
              <h4 className="text-lg md:text-xl lg:text-2xl font-bold mb-3 md:mb-4 text-gray-900">Pagos Inteligentes</h4>
              <p className="text-gray-600 text-sm md:text-base lg:text-lg leading-relaxed">
                Stablecoins, pagos automáticos y transacciones seguras sin intermediarios
              </p>
            </div>

            <div className="group text-center">
              <div className="mx-auto mb-4 md:mb-6 p-3 md:p-4 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl w-16 h-16 md:w-20 md:h-20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Shield className="h-8 w-8 md:h-10 md:w-10 text-white" />
              </div>
              <h4 className="text-lg md:text-xl lg:text-2xl font-bold mb-3 md:mb-4 text-gray-900">Súper Fácil</h4>
              <p className="text-gray-600 text-sm md:text-base lg:text-lg leading-relaxed">
                Interfaz intuitiva diseñada para todos. Si tu abuela puede usarlo, tú también
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 py-12 md:py-16 lg:py-20">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-4 md:mb-6">
            ¿Listo para empezar?
          </h3>
          <p className="text-base md:text-lg lg:text-xl text-blue-100 mb-6 md:mb-8 max-w-2xl mx-auto px-4">
            Únete a miles de usuarios que ya están conectando en tiempo real
          </p>
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center max-w-md sm:max-w-none mx-auto">
            <Link href="/cliente">
              <Button size="lg" className="w-full sm:w-auto h-12 md:h-14 px-6 md:px-8 text-sm md:text-base lg:text-lg bg-white text-blue-600 hover:bg-blue-50">
                <Users className="mr-1 md:mr-2 h-4 w-4 md:h-5 md:w-5" />
                Buscar Vendedores
              </Button>
            </Link>
            <Link href="/vendedor">
              <Button size="lg" variant="outline" className="w-full sm:w-auto h-12 md:h-14 px-6 md:px-8 text-sm md:text-base lg:text-lg border-white text-white hover:bg-white hover:text-blue-600">
                <Smartphone className="mr-1 md:mr-2 h-4 w-4 md:h-5 md:w-5" />
                Vender Ahora
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="p-1.5 md:p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl">
                <ShoppingCart className="h-5 w-5 md:h-6 md:w-6 text-white" />
              </div>
              <div>
                <div className="text-lg md:text-xl font-bold">HawkerChain</div>
                <div className="text-xs md:text-sm text-gray-400">Conectando comunidades</div>
              </div>
            </div>
            <div className="text-center md:text-right">
              <p className="text-sm md:text-base text-gray-400">&copy; 2024 HawkerChain</p>
              <p className="text-xs md:text-sm text-gray-500 mt-1">
                Innovación que transforma el comercio local
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
