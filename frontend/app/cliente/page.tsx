'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
// Removemos las importaciones problemáticas de Radix UI
import { Search, MapPin, ShoppingCart, User, Star, CheckCircle, ArrowLeft } from 'lucide-react'
import ModalPedido from '@/components/ModalPedido'
import UserProfileButton from '@/components/UserProfileButton'

// Importar el mapa dinámicamente para evitar errores de SSR
const MapaVendedoresSimple = dynamic(() => import('@/components/MapaVendedoresSimple'), {
  ssr: false,
  loading: () => (
    <div className="h-full bg-gray-100 rounded-lg animate-pulse flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
        <p className="text-gray-600">Cargando mapa...</p>
      </div>
    </div>
  )
})

interface Vendedor {
  id: string
  nombre: string
  descripcion: string
  ubicacion: [number, number]
  productos: string[]
  rating: number
  distancia: number
  conectado: boolean
}

export default function ClientePage() {
  const [vendedores, setVendedores] = useState<Vendedor[]>([])
  const [busqueda, setBusqueda] = useState('')
  const [ubicacionUsuario, setUbicacionUsuario] = useState<[number, number] | null>(null)
  const [vendedorSeleccionado, setVendedorSeleccionado] = useState<Vendedor | null>(null)
  const [modalPedidoAbierto, setModalPedidoAbierto] = useState(false)
  const [pedidoConfirmado, setPedidoConfirmado] = useState(false)

  console.log('🔄 ClientePage: Renderizando con ubicación:', ubicacionUsuario, 'vendedores:', vendedores.length)

  // Simular datos de vendedores (luego vendrá del backend)
  useEffect(() => {
    console.log('🏪 ClientePage: Cargando vendedores mock')
    const vendedoresMock: Vendedor[] = [
      {
        id: '1',
        nombre: 'Don Carlos - Tacos',
        descripcion: 'Los mejores tacos de la ciudad',
        ubicacion: [-31.426554, -64.191430],
        productos: ['Tacos al pastor', 'Tacos de carnitas', 'Quesadillas'],
        rating: 4.8,
        distancia: 0.2,
        conectado: true
      },
      {
        id: '2', 
        nombre: 'María - Empanadas',
        descripcion: 'Empanadas caseras recién hechas',
        ubicacion: [-31.424554, -64.189430], // Ligeramente diferente para variedad
        productos: ['Empanadas de carne', 'Empanadas de pollo', 'Empanadas de queso'],
        rating: 4.6,
        distancia: 0.4,
        conectado: true
      },
      {
        id: '3',
        nombre: 'Jorge - Jugos Naturales',
        descripcion: 'Jugos frescos y batidos',
        ubicacion: [-31.428554, -64.193430], // Otra variación cercana
        productos: ['Jugo de naranja', 'Batido de fresa', 'Agua de coco'],
        rating: 4.9,
        distancia: 0.1,
        conectado: false
      }
    ]
    console.log('🏪 ClientePage: Vendedores cargados:', vendedoresMock.length)
    setVendedores(vendedoresMock)
  }, [])

  // Obtener ubicación del usuario
  useEffect(() => {
    console.log('📍 ClientePage: Iniciando obtención de ubicación')
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log('📍 ClientePage: Ubicación obtenida:', position.coords.latitude, position.coords.longitude)
          setUbicacionUsuario([position.coords.latitude, position.coords.longitude])
        },
        (error) => {
          console.log('📍 ClientePage: Error obteniendo ubicación:', error)
          // Ubicación por defecto (Córdoba, Argentina - cerca de los vendedores)
          setUbicacionUsuario([-31.4167, -64.1833])
        }
      )
    } else {
      console.log('📍 ClientePage: Geolocalización no disponible, usando ubicación por defecto')
      // Fallback si no hay geolocalización (Córdoba, Argentina)
      setUbicacionUsuario([-31.4167, -64.1833])
    }
  }, [])

  const vendedoresFiltrados = vendedores.filter(vendedor =>
    vendedor.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    vendedor.productos.some(producto => 
      producto.toLowerCase().includes(busqueda.toLowerCase())
    )
  )

  const handlePedido = (vendedor: Vendedor) => {
    setVendedorSeleccionado(vendedor)
    setModalPedidoAbierto(true)
  }

  const handleConfirmarPedido = (items: any[], total: number) => {
    console.log('Pedido confirmado:', { vendedor: vendedorSeleccionado, items, total })
    setPedidoConfirmado(true)
    setModalPedidoAbierto(false)
    
    // Mostrar confirmación por 3 segundos
    setTimeout(() => {
      setPedidoConfirmado(false)
    }, 3000)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Notificación de pedido confirmado */}
      {pedidoConfirmado && (
        <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2 animate-in slide-in-from-top-2">
          <CheckCircle className="h-5 w-5" />
          <span className="font-medium">¡Pedido enviado al vendedor!</span>
        </div>
      )}

      {/* Header - Responsive */}
      <header className="bg-gradient-to-r from-blue-600 to-purple-600 shadow-sm">
        <div className="container mx-auto px-4 py-3 md:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Link href="/" className="flex items-center text-white hover:text-blue-200 transition-colors">
                <ArrowLeft className="h-4 w-4 md:h-5 md:w-5 mr-1" />
                <span className="text-sm md:text-base">Volver</span>
              </Link>
              <div className="flex items-center space-x-2">
                <ShoppingCart className="h-5 w-5 md:h-6 md:w-6 text-white" />
                <h1 className="text-lg md:text-xl font-bold text-white">Panel de Cliente</h1>
              </div>
            </div>
                         <UserProfileButton />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-4 md:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          {/* Panel de búsqueda y lista - Responsive */}
          <div className="order-2 lg:order-1 lg:col-span-1 space-y-4">
            {/* Barra de búsqueda */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Buscar vendedores o productos..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Lista de vendedores - Responsive */}
            <div className="space-y-3">
              <h2 className="font-semibold text-gray-900 text-base md:text-lg">Vendedores Cercanos</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
                {vendedoresFiltrados.map((vendedor) => (
                  <div key={vendedor.id} className="bg-white rounded-lg shadow-sm border cursor-pointer hover:shadow-md transition-shadow">
                    <div className="pb-2 p-3 md:p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm md:text-base font-semibold text-gray-900 flex items-center gap-2 truncate">
                            {vendedor.nombre}
                            {vendedor.conectado && (
                              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse flex-shrink-0" />
                            )}
                          </h3>
                          <p className="text-xs md:text-sm text-gray-600 line-clamp-2 mt-1">
                            {vendedor.descripcion}
                          </p>
                        </div>
                        <div className="text-right flex-shrink-0 ml-2">
                          <div className="flex items-center text-xs text-yellow-600">
                            <Star className="h-3 w-3 fill-current mr-1" />
                            {vendedor.rating}
                          </div>
                          <div className="flex items-center text-xs text-gray-500 mt-1">
                            <MapPin className="h-3 w-3 mr-1" />
                            {vendedor.distancia}km
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="pt-0 p-3 md:p-4">
                      <div className="flex flex-wrap gap-1 mb-3">
                        {vendedor.productos.slice(0, 2).map((producto, idx) => (
                          <span key={idx} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded truncate">
                            {producto}
                          </span>
                        ))}
                        {vendedor.productos.length > 2 && (
                          <span className="text-xs text-gray-500 flex-shrink-0">+{vendedor.productos.length - 2}</span>
                        )}
                      </div>
                      <button 
                        className={`w-full text-sm px-3 py-2 rounded-md transition-colors ${
                          vendedor.conectado
                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                        disabled={!vendedor.conectado}
                        onClick={() => handlePedido(vendedor)}
                      >
                        {vendedor.conectado ? 'Pedir' : 'No disponible'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Mapa - Responsive */}
          <div className="order-1 lg:order-2 lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md border h-full">
              <div className="p-3 md:p-4 border-b">
                <h3 className="text-base md:text-lg font-semibold text-gray-900">Vendedores en tu área</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Los puntos verdes muestran vendedores conectados
                </p>
              </div>
              <div className="h-64 sm:h-80 md:h-96 p-3 md:p-4">
                <MapaVendedoresSimple />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Pedido */}
      <ModalPedido
        isOpen={modalPedidoAbierto}
        onClose={() => setModalPedidoAbierto(false)}
        vendedor={vendedorSeleccionado}
        onConfirmarPedido={handleConfirmarPedido}
      />
    </div>
  )
}
