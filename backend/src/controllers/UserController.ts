import { Request, Response } from 'express'
import { prisma } from '@/utils/prisma'
import { ApiError } from '@/utils/ApiError'
import { asyncHandler } from '@/utils/asyncHandler'

export class UserController {
  getProfile = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id

    if (!userId) {
      throw new ApiError(401, 'No autorizado')
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        latitude: true,
        longitude: true,
        address: true,
        isConnected: true,
        createdAt: true,
        lastLogin: true
      }
    })

    if (!user) {
      throw new ApiError(404, 'Usuario no encontrado')
    }

    res.json({ user })
  })

  updateProfile = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id
    const { name, phone, email, address } = req.body

    if (!userId) {
      throw new ApiError(401, 'No autorizado')
    }

    // Si se está cambiando el email, verificar que no exista
    if (email) {
      const existingUser = await prisma.user.findFirst({
        where: {
          email,
          id: { not: userId }
        }
      })

      if (existingUser) {
        throw new ApiError(400, 'Este email ya está en uso')
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(name && { name }),
        ...(phone && { phone }),
        ...(email && { email }),
        ...(address && { address })
      },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        address: true,
        updatedAt: true
      }
    })

    res.json({
      message: 'Perfil actualizado exitosamente',
      user: updatedUser
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

    // Consulta simple para obtener vendedores conectados
    // En producción, usarías una consulta geoespacial más eficiente
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
          distance: Math.round(distance * 100) / 100 // Redondear a 2 decimales
        }
      })
      .filter((vendor: any) => vendor !== null && vendor.distance <= radiusKm)
      .sort((a: any, b: any) => a!.distance - b!.distance)

    res.json({
      vendors: vendorsWithDistance,
      count: vendorsWithDistance.length
    })
  })

  updateLocation = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id
    const { latitude, longitude, address } = req.body

    if (!userId) {
      throw new ApiError(401, 'No autorizado')
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        latitude,
        longitude,
        ...(address && { address }),
        lastSeen: new Date()
      },
      select: {
        id: true,
        latitude: true,
        longitude: true,
        address: true,
        lastSeen: true
      }
    })

    res.json({
      message: 'Ubicación actualizada exitosamente',
      location: updatedUser
    })
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
