'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Minus, Plus, ShoppingCart, MapPin, Star, Clock, CreditCard } from 'lucide-react'
import { useSocket } from '@/hooks/useSocket'
import { useAuth } from '@/contexts/AuthContext'

interface Producto {
  id: string
  nombre: string
  descripcion: string
  precio: number
  disponible: boolean
  categoria: string
}

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

interface ItemCarrito {
  producto: Producto
  cantidad: number
}

interface ModalPedidoProps {
  isOpen: boolean
  onClose: () => void
  vendedor: Vendedor | null
  onConfirmarPedido: (items: ItemCarrito[], total: number) => void
}

export default function ModalPedido({ 
  isOpen, 
  onClose, 
  vendedor, 
  onConfirmarPedido 
}: ModalPedidoProps) {
  const [productos, setProductos] = useState<Producto[]>([])
  const [carrito, setCarrito] = useState<ItemCarrito[]>([])
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState<'productos' | 'carrito' | 'pago'>('productos')
  const { user, token } = useAuth()
  const { emit, isConnected, connect } = useSocket({ 
    userType: 'CLIENTE',
    autoConnect: true,
    token: token || undefined,
    userId: user?.id
  })

  // Productos de ejemplo (en producción vendrían del backend)
  useEffect(() => {
    if (vendedor && isOpen) {
      setLoading(true)
      // Simular carga de productos
      setTimeout(() => {
        const productosEjemplo: Producto[] = [
          {
            id: '1',
            nombre: 'Taco al Pastor',
            descripcion: 'Taco con carne al pastor, piña y salsa',
            precio: 25,
            disponible: true,
            categoria: 'Tacos'
          },
          {
            id: '2',
            nombre: 'Quesadilla',
            descripcion: 'Quesadilla de queso con tortilla de maíz',
            precio: 30,
            disponible: true,
            categoria: 'Quesadillas'
          },
          {
            id: '3',
            nombre: 'Agua Fresca',
            descripcion: 'Agua de horchata natural',
            precio: 15,
            disponible: true,
            categoria: 'Bebidas'
          },
          {
            id: '4',
            nombre: 'Taco de Carnitas',
            descripcion: 'Taco con carnitas y salsa verde',
            precio: 28,
            disponible: false,
            categoria: 'Tacos'
          }
        ]
        setProductos(productosEjemplo)
        setLoading(false)
      }, 1000)
    }
  }, [vendedor, isOpen])

  const agregarAlCarrito = (producto: Producto) => {
    setCarrito(prev => {
      const existente = prev.find(item => item.producto.id === producto.id)
      if (existente) {
        return prev.map(item => 
          item.producto.id === producto.id 
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        )
      }
      return [...prev, { producto, cantidad: 1 }]
    })
  }

  const removerDelCarrito = (productoId: string) => {
    setCarrito(prev => {
      return prev.reduce((acc, item) => {
        if (item.producto.id === productoId) {
          if (item.cantidad > 1) {
            acc.push({ ...item, cantidad: item.cantidad - 1 })
          }
        } else {
          acc.push(item)
        }
        return acc
      }, [] as ItemCarrito[])
    })
  }

  const total = carrito.reduce((sum, item) => sum + (item.producto.precio * item.cantidad), 0)

  const handleConfirmarPedido = () => {
    // Conectar si no está conectado
    if (!isConnected) {
      connect()
    }

    // Crear datos del pedido
    const pedidoData = {
      id: Date.now().toString(),
      vendorId: vendedor?.id,
      clientName: user?.name || 'Cliente Demo',
      clientId: user?.id || 'client-demo-1',
      items: carrito,
      total: total,
      timestamp: new Date().toISOString()
    }

    console.log('📤 Enviando pedido via WebSocket:', pedidoData)
    
    // Enviar via WebSocket
    const success = emit('new_order', pedidoData)
    
    if (success) {
      console.log('✅ Pedido enviado correctamente')
    } else {
      console.log('⚠️ Socket no conectado, pedido no enviado')
    }

    onConfirmarPedido(carrito, total)
    setCarrito([])
    setStep('productos')
    onClose()
  }

  const handleClose = () => {
    setCarrito([])
    setStep('productos')
    onClose()
  }

  if (!vendedor) return null

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <ShoppingCart className="h-5 w-5 text-blue-600" />
            <span>Pedido a {vendedor.nombre}</span>
          </DialogTitle>
          <DialogDescription className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-1">
              <MapPin className="h-4 w-4" />
              <span>{vendedor.distancia}km</span>
            </div>
            <div className="flex items-center space-x-1">
              <Star className="h-4 w-4 text-yellow-500" />
              <span>{vendedor.rating}</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className={`w-2 h-2 rounded-full ${vendedor.conectado ? 'bg-green-500' : 'bg-gray-400'}`} />
              <span>{vendedor.conectado ? 'Conectado' : 'Desconectado'}</span>
            </div>
          </DialogDescription>
        </DialogHeader>

        {/* Navegación de pasos */}
        <div className="flex justify-center space-x-4 my-4">
          <Button
            variant={step === 'productos' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setStep('productos')}
            className="text-xs"
          >
            1. Productos
          </Button>
          <Button
            variant={step === 'carrito' ? 'default' : 'outline'}
            size="sm"
            onClick={() => carrito.length > 0 && setStep('carrito')}
            disabled={carrito.length === 0}
            className="text-xs"
          >
            2. Carrito ({carrito.length})
          </Button>
          <Button
            variant={step === 'pago' ? 'default' : 'outline'}
            size="sm"
            onClick={() => carrito.length > 0 && setStep('pago')}
            disabled={carrito.length === 0}
            className="text-xs"
          >
            3. Pago
          </Button>
        </div>

        {/* Contenido según el paso */}
        {step === 'productos' && (
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Productos Disponibles</h3>
            
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                <p className="text-gray-600">Cargando productos...</p>
              </div>
            ) : (
              <div className="grid gap-3">
                {productos.map((producto) => (
                  <Card key={producto.id} className={`${!producto.disponible ? 'opacity-50' : ''}`}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-medium">{producto.nombre}</h4>
                          <p className="text-sm text-gray-600 mb-2">{producto.descripcion}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-lg font-bold text-green-600">${producto.precio}</span>
                            {producto.disponible ? (
                              <Button
                                size="sm"
                                onClick={() => agregarAlCarrito(producto)}
                                className="bg-blue-600 hover:bg-blue-700"
                              >
                                <Plus className="h-4 w-4 mr-1" />
                                Agregar
                              </Button>
                            ) : (
                              <span className="text-sm text-red-500 font-medium">No disponible</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {carrito.length > 0 && (
              <div className="border-t pt-4">
                <Button
                  onClick={() => setStep('carrito')}
                  className="w-full bg-green-600 hover:bg-green-700"
                  size="lg"
                >
                  Ver Carrito ({carrito.length} productos) - ${total}
                </Button>
              </div>
            )}
          </div>
        )}

        {step === 'carrito' && (
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Tu Carrito</h3>
            
            {carrito.length === 0 ? (
              <div className="text-center py-8">
                <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600">Tu carrito está vacío</p>
                <Button
                  variant="outline"
                  onClick={() => setStep('productos')}
                  className="mt-2"
                >
                  Agregar productos
                </Button>
              </div>
            ) : (
              <>
                <div className="space-y-3">
                  {carrito.map((item) => (
                    <Card key={item.producto.id}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center">
                          <div className="flex-1">
                            <h4 className="font-medium">{item.producto.nombre}</h4>
                            <p className="text-sm text-gray-600">${item.producto.precio} c/u</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => removerDelCarrito(item.producto.id)}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="w-8 text-center font-medium">{item.cantidad}</span>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => agregarAlCarrito(item.producto)}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="ml-4 text-right">
                            <p className="font-bold text-green-600">${item.producto.precio * item.cantidad}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-semibold">Total:</span>
                    <span className="text-2xl font-bold text-green-600">${total}</span>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => setStep('productos')}
                      className="flex-1"
                    >
                      Seguir Comprando
                    </Button>
                    <Button
                      onClick={() => setStep('pago')}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                      Proceder al Pago
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {step === 'pago' && (
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Método de Pago</h3>
            
            {/* Resumen del pedido */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Resumen del Pedido</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {carrito.map((item) => (
                    <div key={item.producto.id} className="flex justify-between text-sm">
                      <span>{item.cantidad}x {item.producto.nombre}</span>
                      <span>${item.producto.precio * item.cantidad}</span>
                    </div>
                  ))}
                  <div className="border-t pt-2 flex justify-between font-bold">
                    <span>Total:</span>
                    <span className="text-green-600">${total}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Métodos de pago */}
            <div className="space-y-3">
              <Card className="border-blue-200 bg-blue-50">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <CreditCard className="h-6 w-6 text-blue-600" />
                    <div className="flex-1">
                      <h4 className="font-medium text-blue-900">Pago con Stablecoins</h4>
                      <p className="text-sm text-blue-700">Pago automático y seguro (Próximamente)</p>
                    </div>
                    <div className="text-blue-600 font-medium">Recomendado</div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <Clock className="h-6 w-6 text-gray-600" />
                    <div className="flex-1">
                      <h4 className="font-medium">Pago en Efectivo</h4>
                      <p className="text-sm text-gray-600">Paga al recibir tu pedido</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="border-t pt-4">
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setStep('carrito')}
                  className="flex-1"
                >
                  Volver
                </Button>
                <Button
                  onClick={handleConfirmarPedido}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  size="lg"
                >
                  Confirmar Pedido
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
