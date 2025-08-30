import { Request, Response } from 'express'
import { prisma } from '@/utils/prisma'
import { ApiError } from '@/utils/ApiError'
import { asyncHandler } from '@/utils/asyncHandler'

export class LocationController {
  updateLocation = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id
    const { latitude, longitude } = req.body

    if (!userId) {
      throw new ApiError(401, 'No autorizado')
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        latitude,
        longitude,
        lastSeen: new Date()
      },
      select: {
        id: true,
        name: true,
        latitude: true,
        longitude: true,
        lastSeen: true
      }
    })

    res.json({
      message: 'Ubicación actualizada exitosamente',
      location: updatedUser
    })
  })

  getNearbyVendors = asyncHandler(async (req: Request, res: Response) => {
    const { latitude, longitude, radius = 5 } = req.query

    if (!latitude || !longitude) {
      throw new ApiError(400, 'Ubicación requerida')
    }

    const lat = parseFloat(latitude as string)
    const lng = parseFloat(longitude as string)
    const radiusKm = parseFloat(radius as string)

    // Obtener vendedores conectados
    const vendors = await prisma.user.findMany({
      where: {
        role: 'VENDEDOR',
        isConnected: true,
        isActive: true,
        latitude: { not: null },
        longitude: { not: null }
      },
      select: {
        id: true,
        name: true,
        latitude: true,
        longitude: true,
        address: true,
        lastSeen: true,
        products: {
          where: { isAvailable: true },
          select: {
            id: true,
            name: true,
            description: true,
            price: true,
            category: true,
            imageUrl: true
          },
          take: 5
        }
      }
    })

    // Calcular distancia y filtrar por radio
    const vendorsWithDistance = vendors
      .map((vendor: any) => {
        if (!vendor.latitude || !vendor.longitude) return null
        
        const distance = calculateDistance(lat, lng, vendor.latitude, vendor.longitude)
        
        return {
          ...vendor,
          distance: Math.round(distance * 100) / 100
        }
      })
      .filter((vendor: any) => vendor !== null && vendor.distance <= radiusKm)
      .sort((a: any, b: any) => a!.distance - b!.distance)

    res.json({
      vendors: vendorsWithDistance,
      count: vendorsWithDistance.length
    })
  })

  connectVendor = asyncHandler(async (req: Request, res: Response) => {
    const vendorId = req.user?.id

    if (!vendorId) {
      throw new ApiError(401, 'No autorizado')
    }

    if (req.user?.role !== 'VENDEDOR') {
      throw new ApiError(403, 'Solo los vendedores pueden conectarse')
    }

    const updatedVendor = await prisma.user.update({
      where: { id: vendorId },
      data: {
        isConnected: true,
        lastSeen: new Date()
      },
      select: {
        id: true,
        name: true,
        isConnected: true,
        latitude: true,
        longitude: true
      }
    })

    res.json({
      message: 'Vendedor conectado exitosamente',
      vendor: updatedVendor
    })
  })

  disconnectVendor = asyncHandler(async (req: Request, res: Response) => {
    const vendorId = req.user?.id

    if (!vendorId) {
      throw new ApiError(401, 'No autorizado')
    }

    if (req.user?.role !== 'VENDEDOR') {
      throw new ApiError(403, 'Solo los vendedores pueden desconectarse')
    }

    const updatedVendor = await prisma.user.update({
      where: { id: vendorId },
      data: {
        isConnected: false,
        lastSeen: new Date()
      },
      select: {
        id: true,
        name: true,
        isConnected: true
      }
    })

    res.json({
      message: 'Vendedor desconectado exitosamente',
      vendor: updatedVendor
    })
  })

  getVendorStatus = asyncHandler(async (req: Request, res: Response) => {
    const vendorId = req.user?.id

    if (!vendorId) {
      throw new ApiError(401, 'No autorizado')
    }

    if (req.user?.role !== 'VENDEDOR') {
      throw new ApiError(403, 'Solo los vendedores pueden consultar su estado')
    }

    const vendor = await prisma.user.findUnique({
      where: { id: vendorId },
      select: {
        id: true,
        name: true,
        isConnected: true,
        latitude: true,
        longitude: true,
        lastSeen: true,
        products: {
          where: { isAvailable: true },
          select: {
            id: true,
            name: true,
            stock: true
          }
        }
      }
    })

    if (!vendor) {
      throw new ApiError(404, 'Vendedor no encontrado')
    }

    res.json({ vendor })
  })
}

// Función para calcular distancia entre dos puntos usando la fórmula de Haversine
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371 // Radio de la Tierra en kilómetros
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  return R * c
}
