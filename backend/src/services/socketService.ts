import { Server } from 'socket.io'
import jwt from 'jsonwebtoken'
import { prisma } from '@/utils/prisma'

interface SocketUser {
  id: string
  role: string
  email: string
  name: string
}

import { Socket } from 'socket.io'

interface AuthenticatedSocket extends Socket {
  user?: SocketUser
}

export const socketHandler = (io: Server) => {
  console.log('🔌 Configurando WebSocket handlers...')
  
  // Middleware de autenticación para WebSocket
  io.use(async (socket: any, next) => {
    try {
      const token = socket.handshake.auth?.token
      const userType = socket.handshake.auth?.userType || 'CLIENTE'
      const userId = socket.handshake.auth?.userId

      // Si hay token, intentar autenticación real
      if (token && token !== 'undefined') {
        try {
          const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string; role: string }
          
          const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            select: {
              id: true,
              email: true,
              name: true,
              role: true,
              isActive: true
            }
          })

          if (user && user.isActive) {
            socket.user = user
            console.log(`🔗 Socket autenticado - ${socket.user.role}:`, socket.user.name)
            next()
            return
          }
        } catch (jwtError) {
          console.log('Token inválido, usando modo demo')
        }
      }

      // Fallback: Modo demo para usuarios sin autenticar
      socket.user = {
        id: userId || (userType === 'VENDEDOR' ? 'vendor-demo-1' : 'client-demo-1'),
        role: userType,
        email: userType === 'VENDEDOR' ? 'vendedor@demo.com' : 'cliente@demo.com',
        name: userType === 'VENDEDOR' ? 'Vendedor Demo' : 'Cliente Demo',
        isActive: true
      }
      
      console.log(`🔗 Socket demo - ${socket.user.role}:`, socket.user.name)
      next()
    } catch (error) {
      console.error('❌ Error en socket middleware:', error)
      next(new Error('Error de autenticación'))
    }
  })

  io.on('connection', (socket: AuthenticatedSocket) => {
    console.log(`🔗 Usuario conectado: ${socket.user?.name} (${socket.user?.role})`)
    console.log(`📍 Socket ID: ${socket.id}`)

    // Unir al usuario a su sala personal
    const userRoom = `user_${socket.user?.id}`
    socket.join(userRoom)
    console.log(`🏠 Usuario unido a sala: ${userRoom}`)

    // Si es vendedor, unirse a la sala de vendedores
    if (socket.user?.role === 'VENDEDOR') {
      socket.join('vendors')
      
      // Manejar conexión/desconexión de vendedor
      socket.on('vendor_connect', async (data) => {
        try {
          const { latitude, longitude } = data
          
          if (!socket.user?.id) {
            socket.emit('error', { message: 'Usuario no autenticado' })
            return
          }
          
          // MODO DEMO: Skip DB operations for demo users
          if (socket.user.id === 'vendor-demo-1' || socket.user.id === 'client-demo-1') {
            console.log('🔄 Demo mode: Skipping DB update for vendor connect')
          } else {
            await prisma.user.update({
              where: { id: socket.user.id },
              data: {
                latitude,
                longitude,
                isConnected: true,
                lastSeen: new Date()
              }
            })
          }

          // Notificar a todos los clientes que un vendedor se conectó
          socket.broadcast.emit('vendor_connected', {
            vendorId: socket.user?.id,
            name: socket.user?.name,
            latitude,
            longitude
          })

          console.log(`Vendedor ${socket.user?.name} se conectó en ${latitude}, ${longitude}`)
        } catch (error) {
          console.error('Error conectando vendedor:', error)
          socket.emit('error', { message: 'Error al conectar vendedor' })
        }
      })

      socket.on('vendor_disconnect', async () => {
        try {
          if (!socket.user?.id) {
            socket.emit('error', { message: 'Usuario no autenticado' })
            return
          }
          
          await prisma.user.update({
            where: { id: socket.user.id },
            data: {
              isConnected: false,
              lastSeen: new Date()
            }
          })

          // Notificar a todos los clientes que un vendedor se desconectó
          socket.broadcast.emit('vendor_disconnected', {
            vendorId: socket.user?.id
          })

          console.log(`Vendedor ${socket.user?.name} se desconectó`)
        } catch (error) {
          console.error('Error desconectando vendedor:', error)
        }
      })

      // Actualizar ubicación en tiempo real
      socket.on('update_location', async (data) => {
        try {
          const { latitude, longitude } = data
          
          if (!socket.user?.id) {
            socket.emit('error', { message: 'Usuario no autenticado' })
            return
          }
          
          await prisma.user.update({
            where: { id: socket.user.id },
            data: {
              latitude,
              longitude,
              lastSeen: new Date()
            }
          })

          // Notificar cambio de ubicación a los clientes
          socket.broadcast.emit('vendor_location_updated', {
            vendorId: socket.user?.id,
            latitude,
            longitude
          })
        } catch (error) {
          console.error('Error actualizando ubicación:', error)
        }
      })
    }

    // Si es cliente, unirse a la sala de clientes
    if (socket.user?.role === 'CLIENTE') {
      socket.join('clients')

      // Solicitar vendedores cercanos
      socket.on('get_nearby_vendors', async (data) => {
        try {
          const { latitude, longitude, radius = 5 } = data

          // Aquí implementarías la lógica de búsqueda geoespacial
          // Por ahora, simulamos con todos los vendedores conectados
          const nearbyVendors = await prisma.user.findMany({
            where: {
              role: 'VENDEDOR',
              isConnected: true,
              latitude: { not: null },
              longitude: { not: null }
            },
            select: {
              id: true,
              name: true,
              latitude: true,
              longitude: true,
              products: {
                where: { isAvailable: true },
                select: {
                  id: true,
                  name: true,
                  price: true,
                  description: true
                }
              }
            }
          })

          socket.emit('nearby_vendors', nearbyVendors)
        } catch (error) {
          console.error('Error obteniendo vendedores cercanos:', error)
          socket.emit('error', { message: 'Error al obtener vendedores cercanos' })
        }
      })
    }

    // Manejo de órdenes en tiempo real
    socket.on('new_order', async (orderData) => {
      try {
        console.log('📥 Pedido recibido en backend:', {
          from: socket.user?.name,
          to: orderData.vendorId,
          total: orderData.total,
          items: orderData.items?.length || 0
        })

        // Notificar al vendedor sobre la nueva orden
        const notification = {
          id: orderData.id,
          orderId: orderData.id,
          clientName: socket.user?.name || 'Cliente Anónimo',
          items: orderData.items,
          total: orderData.total,
          timestamp: orderData.timestamp || new Date().toISOString()
        }

        console.log('📤 Enviando notificación a vendedor:', `user_${orderData.vendorId}`)
        io.to(`user_${orderData.vendorId}`).emit('order_received', notification)
        
        // También enviar a todos los vendedores como fallback
        io.to('vendors').emit('order_received', notification)

        console.log(`✅ Nueva orden procesada: ${socket.user?.name} → vendedor ${orderData.vendorId}`)
      } catch (error) {
        console.error('❌ Error procesando nueva orden:', error)
      }
    })

    socket.on('order_status_update', async (data) => {
      try {
        const { orderId, status, clientId } = data

        // Notificar al cliente sobre el cambio de estado
        io.to(`user_${clientId}`).emit('order_status_changed', {
          orderId,
          status,
          timestamp: new Date()
        })

        console.log(`Orden ${orderId} cambió a estado: ${status}`)
      } catch (error) {
        console.error('Error actualizando estado de orden:', error)
      }
    })

    // Manejo de desconexión
    socket.on('disconnect', async () => {
      console.log(`Usuario desconectado: ${socket.user?.name}`)

      // Si era un vendedor, marcarlo como desconectado
      if (socket.user?.role === 'VENDEDOR') {
        try {
          // MODO DEMO: Skip DB operations for demo users
          if (socket.user.id === 'vendor-demo-1' || socket.user.id === 'client-demo-1') {
            console.log('🔄 Demo mode: Skipping DB update for disconnect')
          } else {
            // Verificar que el usuario existe antes de actualizar
            const userExists = await prisma.user.findUnique({
              where: { id: socket.user.id }
            })
            
            if (userExists) {
              await prisma.user.update({
                where: { id: socket.user.id },
                data: {
                  isConnected: false,
                  lastSeen: new Date()
                }
              })
              console.log(`🔴 Vendedor ${socket.user.name} marcado como desconectado`)
            } else {
              console.log(`⚠️ Usuario ${socket.user.id} no encontrado en BD`)
            }
          }

          // Notificar a los clientes
          socket.broadcast.emit('vendor_disconnected', {
            vendorId: socket.user.id
          })
        } catch (error) {
          console.error('Error marcando vendedor como desconectado:', error)
        }
      }
    })

    // Manejo de errores
    socket.on('error', (error) => {
      console.error(`Error en socket de ${socket.user?.name}:`, error)
    })
  })

  console.log('🔌 Servicio de WebSocket inicializado')
}
