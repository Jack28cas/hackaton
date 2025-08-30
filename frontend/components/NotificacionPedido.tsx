'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Bell, Clock, User, DollarSign, CheckCircle, XCircle } from 'lucide-react'
import { useSocket } from '@/hooks/useSocket'

interface ItemPedido {
  producto: {
    id: string
    nombre: string
    precio: number
  }
  cantidad: number
}

interface NotificacionPedido {
  id: string
  clientName: string
  items: ItemPedido[]
  total: number
  timestamp: string
  status: 'pendiente' | 'aceptado' | 'rechazado'
}

interface NotificacionPedidoProps {
  onAceptar: (pedidoId: string) => void
  onRechazar: (pedidoId: string) => void
}

export default function NotificacionPedido({ onAceptar, onRechazar }: NotificacionPedidoProps) {
  const [pedidos, setPedidos] = useState<NotificacionPedido[]>([])
  const [mostrarNotificacion, setMostrarNotificacion] = useState(false)
  const { on, off, connect, isConnected, emit } = useSocket({ 
    userType: 'VENDEDOR', 
    autoConnect: true 
  })

  // Conectar WebSocket y escuchar pedidos
  useEffect(() => {
    // Conectar al WebSocket
    connect()

    // Escuchar pedidos entrantes
    const handleNuevoPedido = (pedidoData: any) => {
      console.log('📥 Nuevo pedido recibido:', pedidoData)
      
      const nuevoPedido: NotificacionPedido = {
        id: pedidoData.id || Date.now().toString(),
        clientName: pedidoData.clientName || 'Cliente Anónimo',
        items: pedidoData.items || [],
        total: pedidoData.total || 0,
        timestamp: pedidoData.timestamp || new Date().toISOString(),
        status: 'pendiente'
      }

      setPedidos(prev => [nuevoPedido, ...prev])
      setMostrarNotificacion(true)

      // Reproducir sonido de notificación
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('¡Nuevo Pedido!', {
          body: `${nuevoPedido.clientName} - $${nuevoPedido.total}`,
          icon: '/favicon.ico'
        })
      }

      // Ocultar notificación después de 5 segundos
      setTimeout(() => {
        setMostrarNotificacion(false)
      }, 5000)
    }

    // Registrar el listener
    on('order_received', handleNuevoPedido)

    // Cleanup al desmontar
    return () => {
      off('order_received', handleNuevoPedido)
    }
  }, [on, off, connect])

  // Solicitar permisos de notificación
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }
  }, [])

  const handleAceptar = (pedidoId: string) => {
    setPedidos(prev => 
      prev.map(pedido => 
        pedido.id === pedidoId 
          ? { ...pedido, status: 'aceptado' }
          : pedido
      )
    )
    
    // Enviar confirmación via WebSocket
    emit('order_status_update', {
      orderId: pedidoId,
      status: 'aceptado',
      vendorMessage: 'Pedido aceptado - Preparando...'
    })
    
    onAceptar(pedidoId)
  }

  const handleRechazar = (pedidoId: string) => {
    setPedidos(prev => 
      prev.map(pedido => 
        pedido.id === pedidoId 
          ? { ...pedido, status: 'rechazado' }
          : pedido
      )
    )
    
    // Enviar rechazo via WebSocket
    emit('order_status_update', {
      orderId: pedidoId,
      status: 'rechazado',
      vendorMessage: 'Pedido rechazado - No disponible'
    })
    
    onRechazar(pedidoId)
  }

  const formatearTiempo = (timestamp: string) => {
    const fecha = new Date(timestamp)
    return fecha.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  return (
    <div className="space-y-4">
      {/* Notificación flotante */}
      {mostrarNotificacion && pedidos.length > 0 && pedidos[0].status === 'pendiente' && (
        <div className="fixed top-4 right-4 z-50 bg-blue-500 text-white px-6 py-4 rounded-lg shadow-2xl animate-in slide-in-from-top-2 border border-blue-400">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-400 rounded-full">
              <Bell className="h-5 w-5 animate-bounce" />
            </div>
            <div>
              <div className="font-bold">¡Nuevo Pedido!</div>
              <div className="text-sm opacity-90">
                {pedidos[0].clientName} - ${pedidos[0].total}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Lista de pedidos */}
      <div className="space-y-3">
        <h3 className="font-semibold text-lg flex items-center space-x-2">
          <Bell className="h-5 w-5" />
          <span>Pedidos Recientes</span>
          {pedidos.filter(p => p.status === 'pendiente').length > 0 && (
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
              {pedidos.filter(p => p.status === 'pendiente').length}
            </span>
          )}
        </h3>

        {pedidos.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center text-gray-500">
              <Bell className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No hay pedidos recientes</p>
              <p className="text-sm">Los pedidos aparecerán aquí en tiempo real</p>
            </CardContent>
          </Card>
        ) : (
          pedidos.map((pedido) => (
            <Card 
              key={pedido.id} 
              className={`transition-all duration-300 ${
                pedido.status === 'pendiente' 
                  ? 'border-blue-200 bg-blue-50 shadow-md' 
                  : pedido.status === 'aceptado'
                  ? 'border-green-200 bg-green-50'
                  : 'border-red-200 bg-red-50'
              }`}
            >
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between text-base">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span>{pedido.clientName}</span>
                    {pedido.status === 'pendiente' && (
                      <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full animate-pulse">
                        Nuevo
                      </span>
                    )}
                    {pedido.status === 'aceptado' && (
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                        Aceptado
                      </span>
                    )}
                    {pedido.status === 'rechazado' && (
                      <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                        Rechazado
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Clock className="h-4 w-4" />
                    <span>{formatearTiempo(pedido.timestamp)}</span>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Items del pedido */}
                <div className="space-y-2 mb-4">
                  {pedido.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center text-sm">
                      <span>{item.cantidad}x {item.producto.nombre}</span>
                      <span className="font-medium">${item.producto.precio * item.cantidad}</span>
                    </div>
                  ))}
                  <div className="border-t pt-2 flex justify-between items-center font-bold">
                    <span className="flex items-center space-x-1">
                      <DollarSign className="h-4 w-4" />
                      <span>Total:</span>
                    </span>
                    <span className="text-green-600 text-lg">${pedido.total}</span>
                  </div>
                </div>

                {/* Botones de acción */}
                {pedido.status === 'pendiente' && (
                  <div className="flex space-x-2">
                    <Button
                      onClick={() => handleAceptar(pedido.id)}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                      size="sm"
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Aceptar
                    </Button>
                    <Button
                      onClick={() => handleRechazar(pedido.id)}
                      variant="outline"
                      className="flex-1 border-red-300 text-red-600 hover:bg-red-50"
                      size="sm"
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      Rechazar
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
