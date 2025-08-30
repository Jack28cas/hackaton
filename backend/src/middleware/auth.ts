import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { prisma } from '@/utils/prisma'
import { ApiError } from '@/utils/ApiError'

interface JwtPayload {
  userId: string
  role: string
}

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string
        role: string
        email: string
        name: string
      }
    }
  }
}

export const authenticateToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1] // Bearer TOKEN

    console.log('🔐 Auth Header:', authHeader)
    console.log('🎫 Token:', token ? 'Present' : 'Missing')

    if (!token) {
      console.log('❌ No token provided')
      throw new ApiError(401, 'Token de acceso requerido')
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload

    // Verificar que el usuario existe y está activo
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

    if (!user || !user.isActive) {
      throw new ApiError(401, 'Usuario no válido')
    }

    req.user = user
    next()
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({ error: 'Token inválido' })
      return
    }
    next(error)
  }
}

export const requireVendor = (req: Request, res: Response, next: NextFunction): void => {
  if (!req.user) {
    res.status(401).json({ error: 'No autorizado' })
    return
  }

  if (req.user.role !== 'VENDEDOR') {
    res.status(403).json({ error: 'Acceso denegado. Se requiere rol de vendedor' })
    return
  }

  next()
}

export const requireCliente = (req: Request, res: Response, next: NextFunction): void => {
  if (!req.user) {
    res.status(401).json({ error: 'No autorizado' })
    return
  }

  if (req.user.role !== 'CLIENTE') {
    res.status(403).json({ error: 'Acceso denegado. Se requiere rol de cliente' })
    return
  }

  next()
}

export const requireAdmin = (req: Request, res: Response, next: NextFunction): void => {
  if (!req.user) {
    res.status(401).json({ error: 'No autorizado' })
    return
  }

  if (req.user.role !== 'ADMIN') {
    res.status(403).json({ error: 'Acceso denegado. Se requiere rol de administrador' })
    return
  }

  next()
}
