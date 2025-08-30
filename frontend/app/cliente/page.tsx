'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Search, MapPin, ShoppingCart, User, Star, CheckCircle } from 'lucide-react'
import ModalPedido from '@/components/ModalPedido'

// Importar el mapa dinámicamente para evitar errores de SSR
const MapaVendedoresConRutas = dynamic(() => import('@/components/MapaVendedoresConRutas'), {
  ssr: false,
  loading: () => <div className="h-96 bg-gray-100 rounded-lg animate-pulse flex items-center justify-center">Cargando mapa...</div>
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

  // Simular datos de vendedores (luego vendrá del backend)
  useEffect(() => {
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
    setVendedores(vendedoresMock)
  }, [])

  // Obtener ubicación del usuario
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUbicacionUsuario([position.coords.latitude, position.coords.longitude])
        },
        (error) => {
          console.log('Error obteniendo ubicación:', error)
          // Ubicación por defecto (Córdoba, Argentina - cerca de los vendedores)
          setUbicacionUsuario([-31.4167, -64.1833])
        }
      )
    } else {
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

      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ShoppingCart className="h-6 w-6 text-blue-600" />
              <h1 className="text-xl font-bold text-gray-900">Cliente</h1>
            </div>
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Panel de búsqueda y lista */}
          <div className="lg:col-span-1 space-y-4">
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

            {/* Lista de vendedores */}
            <div className="space-y-3">
              <h2 className="font-semibold text-gray-900">Vendedores Cercanos</h2>
              {vendedoresFiltrados.map((vendedor) => (
                <Card key={vendedor.id} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-sm flex items-center gap-2">
                          {vendedor.nombre}
                          {vendedor.conectado && (
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse-soft" />
                          )}
                        </CardTitle>
                        <CardDescription className="text-xs">
                          {vendedor.descripcion}
                        </CardDescription>
                      </div>
                      <div className="text-right">
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
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex flex-wrap gap-1 mb-2">
                      {vendedor.productos.slice(0, 2).map((producto, idx) => (
                        <span key={idx} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          {producto}
                        </span>
                      ))}
                      {vendedor.productos.length > 2 && (
                        <span className="text-xs text-gray-500">+{vendedor.productos.length - 2}</span>
                      )}
                    </div>
                    <Button 
                      size="sm" 
                      className="w-full"
                      disabled={!vendedor.conectado}
                      onClick={() => handlePedido(vendedor)}
                    >
                      {vendedor.conectado ? 'Pedir' : 'No disponible'}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Mapa */}
          <div className="lg:col-span-2">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Vendedores en tu área</CardTitle>
                <CardDescription>
                  Los puntos verdes muestran vendedores conectados
                </CardDescription>
              </CardHeader>
              <CardContent className="h-96">
                {ubicacionUsuario && (
                  <MapaVendedoresConRutas 
                    vendedores={vendedores}
                    ubicacionUsuario={ubicacionUsuario}
                    onVendedorClick={setVendedorSeleccionado}
                  />
                )}
              </CardContent>
            </Card>
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
