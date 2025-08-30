import { Request, Response } from 'express'
import { prisma } from '@/utils/prisma'
import { ApiError } from '@/utils/ApiError'
import { asyncHandler } from '@/utils/asyncHandler'

export class OrderController {
  getOrders = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id
    const userRole = req.user?.role

    if (!userId) {
      throw new ApiError(401, 'No autorizado')
    }

    let where: any = {}
    
    if (userRole === 'CLIENTE') {
      where.clientId = userId
    } else if (userRole === 'VENDEDOR') {
      where.vendorId = userId
    }

    const orders = await prisma.order.findMany({
      where,
      include: {
        client: {
          select: {
            id: true,
            name: true,
            phone: true
          }
        },
        vendor: {
          select: {
            id: true,
            name: true,
            phone: true
          }
        },
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                description: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    res.json({ orders })
  })

  getOrderById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params
    const userId = req.user?.id

    if (!id) {
      throw new ApiError(400, 'ID de la orden requerido')
    }

    if (!userId) {
      throw new ApiError(401, 'No autorizado')
    }

    const order = await prisma.order.findFirst({
      where: {
        id,
        OR: [
          { clientId: userId },
          { vendorId: userId }
        ]
      },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            phone: true
          }
        },
        vendor: {
          select: {
            id: true,
            name: true,
            phone: true
          }
        },
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                description: true,
                imageUrl: true
              }
            }
          }
        }
      }
    })

    if (!order) {
      throw new ApiError(404, 'Orden no encontrada')
    }

    res.json({ order })
  })

  createOrder = asyncHandler(async (req: Request, res: Response) => {
    const clientId = req.user?.id
    const { vendorId, items, paymentMethod, deliveryNotes } = req.body

    if (!clientId) {
      throw new ApiError(401, 'No autorizado')
    }

    // Verificar que el vendedor existe y está conectado
    const vendor = await prisma.user.findUnique({
      where: { id: vendorId, role: 'VENDEDOR' }
    })

    if (!vendor) {
      throw new ApiError(404, 'Vendedor no encontrado')
    }

    if (!vendor.isConnected) {
      throw new ApiError(400, 'El vendedor no está disponible en este momento')
    }

    // Verificar que todos los productos existen y están disponibles
    const productIds = items.map((item: any) => item.productId)
    const products = await prisma.product.findMany({
      where: {
        id: { in: productIds },
        vendorId,
        isAvailable: true
      }
    })

    if (products.length !== productIds.length) {
      throw new ApiError(400, 'Algunos productos no están disponibles')
    }

    // Calcular el total
    let total = 0
    const orderItems = items.map((item: any) => {
      const product = products.find((p: any) => p.id === item.productId)
      if (!product) {
        throw new ApiError(400, `Producto ${item.productId} no encontrado`)
      }
      
      const itemTotal = product.price * item.quantity
      total += itemTotal
      
      return {
        productId: item.productId,
        quantity: item.quantity,
        price: product.price
      }
    })

    // Crear la orden
    const order = await prisma.order.create({
      data: {
        clientId,
        vendorId,
        total,
        paymentMethod: paymentMethod || 'EFECTIVO',
        deliveryNotes,
        status: 'PENDIENTE',
        items: {
          create: orderItems
        }
      },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            phone: true
          }
        },
        vendor: {
          select: {
            id: true,
            name: true,
            phone: true
          }
        },
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                description: true
              }
            }
          }
        }
      }
    })

    res.status(201).json({
      message: 'Orden creada exitosamente',
      order
    })
  })

  updateOrderStatus = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params
    const { status } = req.body
    const userId = req.user?.id

    if (!id) {
      throw new ApiError(400, 'ID de la orden requerido')
    }

    if (!userId) {
      throw new ApiError(401, 'No autorizado')
    }

    // Verificar que la orden existe y el usuario tiene permisos
    const existingOrder = await prisma.order.findFirst({
      where: {
        id,
        OR: [
          { clientId: userId },
          { vendorId: userId }
        ]
      }
    })

    if (!existingOrder) {
      throw new ApiError(404, 'Orden no encontrada')
    }

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: { status },
      include: {
        client: {
          select: {
            id: true,
            name: true
          }
        },
        vendor: {
          select: {
            id: true,
            name: true
          }
        }
      }
    })

    res.json({
      message: 'Estado de la orden actualizado exitosamente',
      order: updatedOrder
    })
  })

  getActiveOrdersForVendor = asyncHandler(async (req: Request, res: Response) => {
    const vendorId = req.user?.id

    if (!vendorId) {
      throw new ApiError(401, 'No autorizado')
    }

    const orders = await prisma.order.findMany({
      where: {
        vendorId,
        status: {
          in: ['PENDIENTE', 'ACEPTADO', 'PREPARANDO', 'LISTO']
        }
      },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            phone: true
          }
        },
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'asc'
      }
    })

    res.json({ orders })
  })

  getClientOrderHistory = asyncHandler(async (req: Request, res: Response) => {
    const clientId = req.user?.id

    if (!clientId) {
      throw new ApiError(401, 'No autorizado')
    }

    const orders = await prisma.order.findMany({
      where: { clientId },
      include: {
        vendor: {
          select: {
            id: true,
            name: true
          }
        },
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    res.json({ orders })
  })

  acceptOrder = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params
    const vendorId = req.user?.id

    if (!id) {
      throw new ApiError(400, 'ID de la orden requerido')
    }

    if (!vendorId) {
      throw new ApiError(401, 'No autorizado')
    }

    const order = await prisma.order.findFirst({
      where: {
        id,
        vendorId,
        status: 'PENDIENTE'
      }
    })

    if (!order) {
      throw new ApiError(404, 'Orden no encontrada o ya fue procesada')
    }

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: { status: 'ACEPTADO' },
      include: {
        client: {
          select: {
            id: true,
            name: true
          }
        }
      }
    })

    res.json({
      message: 'Orden aceptada exitosamente',
      order: updatedOrder
    })
  })

  rejectOrder = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params
    const vendorId = req.user?.id

    if (!id) {
      throw new ApiError(400, 'ID de la orden requerido')
    }

    if (!vendorId) {
      throw new ApiError(401, 'No autorizado')
    }

    const order = await prisma.order.findFirst({
      where: {
        id,
        vendorId,
        status: 'PENDIENTE'
      }
    })

    if (!order) {
      throw new ApiError(404, 'Orden no encontrada o ya fue procesada')
    }

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: { status: 'CANCELADO' }
    })

    res.json({
      message: 'Orden rechazada',
      order: updatedOrder
    })
  })
}
