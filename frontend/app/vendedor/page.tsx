'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

import NotificacionPedido from '@/components/NotificacionPedido'
import { useSocket } from '@/hooks/useSocket'
import { useAuth } from '@/contexts/AuthContext'
import GestionProductos from '@/components/GestionProductos'
import UserProfileButton from '@/components/UserProfileButton'
import { 
  Store, 
  Plus, 
  Power, 
  Bell, 
  MapPin, 
  DollarSign, 
  Package,
  Clock,
  User,
  ArrowLeft
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
             {/* Header - Responsive */}
       <header className="bg-gradient-to-r from-green-600 to-blue-600 shadow-lg">
         <div className="container mx-auto px-4 py-4 md:py-5">
           {/* Desktop Header */}
           <div className="hidden md:flex items-center justify-between">
             {/* Left Section - Navigation & Title */}
             <div className="flex items-center space-x-6">
               <Link href="/" className="flex items-center text-white hover:text-blue-200 transition-colors group">
                 <ArrowLeft className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
                 <span className="text-base font-medium">Volver</span>
               </Link>
               <div className="flex items-center space-x-3">
                 <div className="p-2 bg-white/10 rounded-lg">
                   <Store className="h-6 w-6 text-white" />
                 </div>
                                   <div className="flex flex-col">
                    <h1 className="text-lg font-bold text-white">Vendedor</h1>
                    <div className="flex items-center space-x-2 mt-1">
                      <div className={`w-2 h-2 rounded-full ${conectado ? 'bg-green-400' : 'bg-red-400'}`} />
                      <span className="text-sm text-white/90 font-medium">
                        {conectado ? 'Conectado' : 'Desconectado'}
                      </span>
                    </div>
                  </div>
               </div>
             </div>

             {/* Right Section - Controls */}
             <div className="flex items-center space-x-4">
               <div className="flex items-center space-x-3 bg-white/10 rounded-lg px-4 py-2">
                 <div className="flex items-center space-x-2">
                   <div className={`w-2 h-2 rounded-full ${conectado ? 'bg-green-400' : 'bg-red-400'}`} />
                   <span className="text-sm text-white/90 font-medium">
                     {conectado ? 'Conectado' : 'Desconectado'}
                   </span>
                 </div>
               </div>
               <button
                 onClick={toggleConexion}
                 className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                   conectado 
                     ? "bg-white/20 hover:bg-white/30 text-white border border-white/30 hover:shadow-lg" 
                     : "bg-white text-green-600 hover:bg-white/95 border border-white shadow-md hover:shadow-lg"
                 }`}
               >
                 <Power className="h-4 w-4 mr-2 inline" />
                 {conectado ? 'Desconectar' : 'Conectar'}
               </button>
               <UserProfileButton />
             </div>
           </div>

                       {/* Mobile Header */}
            <div className="md:hidden">
              {/* Top Row - Main Controls */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Link href="/" className="flex items-center text-white hover:text-blue-200 transition-colors">
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    <span className="text-sm font-medium">Volver</span>
                  </Link>
                  <div className="flex items-center space-x-2">
                    <div className="p-1.5 bg-white/10 rounded-md">
                      <Store className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex flex-col">
                      <h1 className="text-base font-bold text-white">Vendedor</h1>
                      <div className="flex items-center space-x-1 mt-0.5">
                        <div className={`w-1.5 h-1.5 rounded-full ${conectado ? 'bg-green-400' : 'bg-red-400'}`} />
                        <span className="text-xs text-white/90">
                          {conectado ? 'Conectado' : 'Desconectado'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={toggleConexion}
                    className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                      conectado 
                        ? "bg-white/20 hover:bg-white/30 text-white border border-white/30" 
                        : "bg-white text-green-600 hover:bg-white/95 border border-white shadow-sm"
                    }`}
                  >
                    <Power className="h-3 w-3 mr-1 inline" />
                    {conectado ? 'Off' : 'On'}
                  </button>
                  <UserProfileButton />
                </div>
              </div>
            </div>
         </div>
       </header>

      <div className="container mx-auto px-4 py-4 md:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          {/* Panel principal - Responsive */}
          <div className="order-2 lg:order-1 lg:col-span-2 space-y-4 md:space-y-6">
            {/* Estadísticas rápidas - Responsive */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
                <div className="pb-2 p-3 md:p-4">
                  <h3 className="text-xs md:text-sm font-medium text-gray-600">Ventas Hoy</h3>
                </div>
                <div className="p-3 md:p-4 pt-0">
                  <div className="flex items-center">
                    <DollarSign className="h-3 w-3 md:h-4 md:w-4 text-green-600 mr-1" />
                    <span className="text-lg md:text-2xl font-bold">${ventasHoy}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
                <div className="pb-2 p-3 md:p-4">
                  <h3 className="text-xs md:text-sm font-medium text-gray-600">Pedidos Nuevos</h3>
                </div>
                <div className="p-3 md:p-4 pt-0">
                  <div className="flex items-center">
                    <Bell className="h-3 w-3 md:h-4 md:w-4 text-orange-600 mr-1" />
                    <span className="text-lg md:text-2xl font-bold">{pedidosNuevos.length}</span>
                  </div>
                </div>
              </div>

              <div className="col-span-2 md:col-span-1 bg-white border border-gray-200 rounded-lg shadow-sm">
                <div className="pb-2 p-3 md:p-4">
                  <h3 className="text-xs md:text-sm font-medium text-gray-600">Ubicación</h3>
                </div>
                <div className="p-3 md:p-4 pt-0">
                  <div className="flex items-center">
                    <MapPin className="h-3 w-3 md:h-4 md:w-4 text-blue-600 mr-1 flex-shrink-0" />
                    <span className="text-xs text-gray-600 truncate">{ubicacion}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Pedidos nuevos */}
            {pedidosNuevos.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="flex items-center gap-2 font-semibold text-gray-900">
                    <Bell className="h-5 w-5 text-orange-500" />
                    Pedidos Nuevos
                  </h3>
                </div>
                <div className="p-4">
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
                          <button 
                            className="px-3 py-1.5 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition-colors"
                            onClick={() => aceptarPedido(pedido.id)}
                          >
                            Aceptar
                          </button>
                          <button className="px-3 py-1.5 border border-gray-300 text-gray-700 text-sm rounded-md hover:bg-gray-50 transition-colors">
                            Rechazar
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Pedidos activos */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
              <div className="p-4 border-b border-gray-200">
                <h3 className="font-semibold text-gray-900">Pedidos en Proceso</h3>
              </div>
              <div className="p-4">
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
                            <button 
                              className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
                              onClick={() => cambiarEstadoPedido(pedido.id, 'preparando')}
                            >
                              Empezar a Preparar
                            </button>
                          )}
                          {pedido.estado === 'preparando' && (
                            <button 
                              className="px-3 py-1.5 bg-yellow-600 text-white text-sm rounded-md hover:bg-yellow-700 transition-colors"
                              onClick={() => cambiarEstadoPedido(pedido.id, 'listo')}
                            >
                              Marcar Listo
                            </button>
                          )}
                          {pedido.estado === 'listo' && (
                            <button 
                              className="px-3 py-1.5 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition-colors"
                              onClick={() => cambiarEstadoPedido(pedido.id, 'entregado')}
                            >
                              Entregar
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Panel lateral - Productos - Responsive */}
          <div className="order-1 lg:order-2 space-y-4 md:space-y-6">
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
              <div className="p-3 md:p-4 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-base md:text-lg font-semibold text-gray-900">Mis Productos</h3>
                  <button 
                    onClick={() => setGestionProductosAbierto(true)} 
                    className="px-2 md:px-3 py-1.5 bg-blue-600 text-white text-xs rounded-md hover:bg-blue-700 transition-colors flex items-center"
                  >
                    <Plus className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                    <span className="hidden sm:inline">Gestionar</span>
                    <span className="sm:hidden">+</span>
                  </button>
                </div>
              </div>
              <div className="p-3 md:p-4">
                <div className="space-y-3">
                  {productos.length === 0 ? (
                    <div className="text-center py-6 md:py-8 text-gray-500">
                      <Package className="h-8 w-8 md:h-12 md:w-12 mx-auto mb-2 md:mb-3 text-gray-300" />
                      <p className="text-xs md:text-sm mb-2">No tienes productos registrados</p>
                                             <button 
                         onClick={() => setGestionProductosAbierto(true)}
                         className="bg-green-600 hover:bg-green-700 text-white text-xs px-3 py-2 rounded-md transition-colors flex items-center"
                       >
                         <Plus className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                         <span className="hidden sm:inline">Agregar Primer Producto</span>
                         <span className="sm:hidden">Agregar</span>
                       </button>
                    </div>
                  ) : (
                    productos.map((producto) => (
                    <div key={producto.id} className="border rounded-lg p-2 md:p-3">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-xs md:text-sm truncate">{producto.nombre}</h4>
                          <p className="text-xs text-gray-600 line-clamp-2">{producto.descripcion}</p>
                        </div>
                        <div className="text-right flex-shrink-0 ml-2">
                          <p className="font-bold text-green-600 text-sm">${producto.precio}</p>
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
                                                 <button className="text-xs px-2 py-1 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded transition-colors">
                           Editar
                         </button>
                       </div>
                     </div>
                   ))
                   )}
                 </div>
               </div>
             </div>

            {/* Notificaciones de Pedidos */}
            <NotificacionPedido 
              onAceptar={handleAceptarPedido}
              onRechazar={handleRechazarPedido}
            />

                         {/* Estado de conexión - Responsive */}
             <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
               <div className="p-3 md:p-4 border-b border-gray-200">
                 <h3 className="text-sm md:text-base font-semibold text-gray-900">Estado de Conexión</h3>
               </div>
               <div className="p-3 md:p-4">
                 <div className="space-y-2">
                   <div className="flex items-center justify-between">
                     <span className="text-xs md:text-sm text-gray-600">Visible en mapa</span>
                     <div className={`w-3 h-3 rounded-full ${conectado ? 'bg-green-500' : 'bg-gray-400'}`} />
                   </div>
                   <div className="flex items-center justify-between">
                     <span className="text-xs md:text-sm text-gray-600">WebSocket conectado</span>
                     <div className={`w-3 h-3 rounded-full ${socketConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                   </div>
                   <div className="flex items-center justify-between">
                     <span className="text-xs md:text-sm text-gray-600">Recibiendo pedidos</span>
                     <div className={`w-3 h-3 rounded-full ${conectado && socketConnected ? 'bg-green-500' : 'bg-gray-400'}`} />
                   </div>
                   <div className="flex items-center justify-between">
                     <span className="text-xs md:text-sm text-gray-600">Ubicación actualizada</span>
                     <Clock className="h-3 w-3 text-green-500" />
                   </div>
                 </div>
               </div>
             </div>
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
