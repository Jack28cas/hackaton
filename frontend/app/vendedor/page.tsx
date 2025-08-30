'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import NotificacionPedido from '@/components/NotificacionPedido'
import { useSocket } from '@/hooks/useSocket'
import { useAuth } from '@/contexts/AuthContext'
import GestionProductos from '@/components/GestionProductos'
import { 
  Store, 
  Plus, 
  Power, 
  Bell, 
  MapPin, 
  DollarSign, 
  Package,
  Clock,
  User
} from 'lucide-react'

interface Producto {
  id: string
  nombre: string
  descripcion: string
  precio: number
  stock: number
  disponible: boolean
}

interface Pedido {
  id: string
  cliente: string
  productos: { nombre: string; cantidad: number; precio: number }[]
  total: number
  estado: 'nuevo' | 'aceptado' | 'preparando' | 'listo' | 'entregado'
  timestamp: Date
}

export default function VendedorPage() {
  const [conectado, setConectado] = useState(false)
  const [productos, setProductos] = useState<Producto[]>([])
  const [pedidos, setPedidos] = useState<Pedido[]>([])
  const [ventasHoy, setVentasHoy] = useState(0)
  const [ubicacion, setUbicacion] = useState<string>('Obteniendo ubicación...')
  const [gestionProductosAbierto, setGestionProductosAbierto] = useState(false)
  const { user, token } = useAuth()
  const { isConnected: socketConnected } = useSocket({ 
    userType: 'VENDEDOR',
    autoConnect: true,
    token: token || undefined,
    userId: user?.id
  })

  // Cargar datos reales del usuario
  useEffect(() => {
    if (user) {
      // Limpiar productos mock - ahora empezamos con 0 productos
      setProductos([])
      // Aquí podrías cargar productos reales desde la API
    }

    const pedidosMock: Pedido[] = [
      {
        id: '1',
        cliente: 'Ana García',
        productos: [{ nombre: 'Taco al Pastor', cantidad: 2, precio: 25 }],
        total: 50,
        estado: 'nuevo',
        timestamp: new Date()
      }
    ]
    setPedidos(pedidosMock)
    setVentasHoy(250)
  }, [])

  // Obtener ubicación
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUbicacion(`${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`)
        },
        () => setUbicacion('Ubicación no disponible')
      )
    }
  }, [])

  const toggleConexion = () => {
    setConectado(!conectado)
  }

  const aceptarPedido = (pedidoId: string) => {
    setPedidos(pedidos.map(pedido => 
      pedido.id === pedidoId 
        ? { ...pedido, estado: 'aceptado' as const }
        : pedido
    ))
  }

  const cambiarEstadoPedido = (pedidoId: string, nuevoEstado: Pedido['estado']) => {
    setPedidos(pedidos.map(pedido => 
      pedido.id === pedidoId 
        ? { ...pedido, estado: nuevoEstado }
        : pedido
    ))
  }

  const pedidosNuevos = pedidos.filter(p => p.estado === 'nuevo')
  const pedidosActivos = pedidos.filter(p => ['aceptado', 'preparando', 'listo'].includes(p.estado))

  const handleAceptarPedido = (pedidoId: string) => {
    console.log('Pedido aceptado:', pedidoId)
    // Aquí se enviaría la confirmación al cliente via WebSocket
    // socket.emit('order_accepted', { orderId: pedidoId })
  }

  const handleRechazarPedido = (pedidoId: string) => {
    console.log('Pedido rechazado:', pedidoId)
    // Aquí se enviaría el rechazo al cliente via WebSocket
    // socket.emit('order_rejected', { orderId: pedidoId })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Store className="h-6 w-6 text-green-600" />
              <h1 className="text-xl font-bold text-gray-900">Panel Vendedor</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${conectado ? 'bg-green-500' : 'bg-gray-400'}`} />
                <span className="text-sm text-gray-600">
                  {conectado ? 'Conectado' : 'Desconectado'}
                </span>
              </div>
              <Button
                variant={conectado ? "destructive" : "default"}
                size="sm"
                onClick={toggleConexion}
              >
                <Power className="h-4 w-4 mr-2" />
                {conectado ? 'Desconectar' : 'Conectar'}
              </Button>
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Panel principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Estadísticas rápidas */}
            <div className="grid md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Ventas Hoy</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <DollarSign className="h-4 w-4 text-green-600 mr-1" />
                    <span className="text-2xl font-bold">${ventasHoy}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Pedidos Nuevos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <Bell className="h-4 w-4 text-orange-600 mr-1" />
                    <span className="text-2xl font-bold">{pedidosNuevos.length}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Ubicación</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 text-blue-600 mr-1" />
                    <span className="text-xs text-gray-600 truncate">{ubicacion}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Pedidos nuevos */}
            {pedidosNuevos.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5 text-orange-500" />
                    Pedidos Nuevos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {pedidosNuevos.map((pedido) => (
                      <div key={pedido.id} className="border rounded-lg p-4 bg-orange-50">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-medium">{pedido.cliente}</h4>
                            <p className="text-sm text-gray-600">
                              {pedido.productos.map(p => `${p.cantidad}x ${p.nombre}`).join(', ')}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-green-600">${pedido.total}</p>
                            <p className="text-xs text-gray-500">
                              {pedido.timestamp.toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" onClick={() => aceptarPedido(pedido.id)}>
                            Aceptar
                          </Button>
                          <Button size="sm" variant="outline">
                            Rechazar
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Pedidos activos */}
            <Card>
              <CardHeader>
                <CardTitle>Pedidos en Proceso</CardTitle>
              </CardHeader>
              <CardContent>
                {pedidosActivos.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No hay pedidos en proceso</p>
                ) : (
                  <div className="space-y-4">
                    {pedidosActivos.map((pedido) => (
                      <div key={pedido.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-medium">{pedido.cliente}</h4>
                            <p className="text-sm text-gray-600">
                              {pedido.productos.map(p => `${p.cantidad}x ${p.nombre}`).join(', ')}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-green-600">${pedido.total}</p>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              pedido.estado === 'aceptado' ? 'bg-blue-100 text-blue-800' :
                              pedido.estado === 'preparando' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {pedido.estado}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {pedido.estado === 'aceptado' && (
                            <Button size="sm" onClick={() => cambiarEstadoPedido(pedido.id, 'preparando')}>
                              Empezar a Preparar
                            </Button>
                          )}
                          {pedido.estado === 'preparando' && (
                            <Button size="sm" onClick={() => cambiarEstadoPedido(pedido.id, 'listo')}>
                              Marcar Listo
                            </Button>
                          )}
                          {pedido.estado === 'listo' && (
                            <Button size="sm" onClick={() => cambiarEstadoPedido(pedido.id, 'entregado')}>
                              Entregar
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Panel lateral - Productos */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Mis Productos</CardTitle>
                  <Button size="sm" onClick={() => setGestionProductosAbierto(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Gestionar
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {productos.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Package className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                      <p className="text-sm mb-2">No tienes productos registrados</p>
                      <Button 
                        size="sm" 
                        onClick={() => setGestionProductosAbierto(true)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Agregar Primer Producto
                      </Button>
                    </div>
                  ) : (
                    productos.map((producto) => (
                    <div key={producto.id} className="border rounded-lg p-3">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{producto.nombre}</h4>
                          <p className="text-xs text-gray-600">{producto.descripcion}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-green-600">${producto.precio}</p>
                          <div className="flex items-center text-xs text-gray-500">
                            <Package className="h-3 w-3 mr-1" />
                            {producto.stock}
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          producto.disponible ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {producto.disponible ? 'Disponible' : 'Agotado'}
                        </span>
                        <Button size="sm" variant="ghost">
                          Editar
                        </Button>
                      </div>
                    </div>
                  ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Notificaciones de Pedidos */}
            <NotificacionPedido 
              onAceptar={handleAceptarPedido}
              onRechazar={handleRechazarPedido}
            />

            {/* Estado de conexión */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Estado de Conexión</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Visible en mapa</span>
                    <div className={`w-3 h-3 rounded-full ${conectado ? 'bg-green-500' : 'bg-gray-400'}`} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">WebSocket conectado</span>
                    <div className={`w-3 h-3 rounded-full ${socketConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Recibiendo pedidos</span>
                    <div className={`w-3 h-3 rounded-full ${conectado && socketConnected ? 'bg-green-500' : 'bg-gray-400'}`} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Ubicación actualizada</span>
                    <Clock className="h-3 w-3 text-green-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      {/* Modal de Gestión de Productos */}
      <GestionProductos 
        isOpen={gestionProductosAbierto}
        onClose={() => setGestionProductosAbierto(false)}
      />
    </div>
  )
}
