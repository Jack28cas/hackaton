import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { prisma } from '@/utils/prisma'
import { ApiError } from '@/utils/ApiError'
import { asyncHandler } from '@/utils/asyncHandler'

export class AuthController {
  register = asyncHandler(async (req: Request, res: Response) => {
    const { email, password, name, role, phone } = req.body

    // Verificar si el usuario ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      throw new ApiError(400, 'El usuario ya existe con este email')
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 12)

    // Crear el usuario
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: role || 'CLIENTE',
        phone: phone || null,
        isActive: true
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        phone: true,
        createdAt: true
      }
    })

    // Generar tokens
    const accessToken = this.generateAccessToken(user.id, user.role)
    const refreshToken = this.generateRefreshToken(user.id)

    // Guardar refresh token en la base de datos
    await prisma.session.create({
      data: {
        userId: user.id,
        refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 días
      }
    })

    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      user,
      accessToken,
      refreshToken
    })
  })

  login = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body

    // Buscar el usuario
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user || !user.isActive) {
      throw new ApiError(401, 'Credenciales inválidas')
    }

    // Verificar la contraseña
    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      throw new ApiError(401, 'Credenciales inválidas')
    }

    // Generar tokens
    const accessToken = this.generateAccessToken(user.id, user.role)
    const refreshToken = this.generateRefreshToken(user.id)

    // Limpiar sesiones anteriores y crear nueva
    await prisma.session.deleteMany({
      where: { userId: user.id }
    })

    await prisma.session.create({
      data: {
        userId: user.id,
        refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      }
    })

    // Actualizar último login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() }
    })

    const { password: _, ...userWithoutPassword } = user

    res.json({
      message: 'Login exitoso',
      user: userWithoutPassword,
      accessToken,
      refreshToken
    })
  })

  logout = asyncHandler(async (req: Request, res: Response) => {
    const { refreshToken } = req.body

    if (refreshToken) {
      await prisma.session.deleteMany({
        where: { refreshToken }
      })
    }

    res.json({ message: 'Logout exitoso' })
  })

  refreshToken = asyncHandler(async (req: Request, res: Response) => {
    const { refreshToken } = req.body

    if (!refreshToken) {
      throw new ApiError(401, 'Refresh token requerido')
    }

    // Verificar el refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as { userId: string }

    // Buscar la sesión
    const session = await prisma.session.findFirst({
      where: {
        refreshToken,
        expiresAt: { gt: new Date() }
      },
      include: { user: true }
    })

    if (!session || !session.user.isActive) {
      throw new ApiError(401, 'Refresh token inválido')
    }

    // Generar nuevos tokens
    const newAccessToken = this.generateAccessToken(session.user.id, session.user.role)
    const newRefreshToken = this.generateRefreshToken(session.user.id)

    // Actualizar la sesión
    await prisma.session.update({
      where: { id: session.id },
      data: {
        refreshToken: newRefreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      }
    })

    const { password: _, ...userWithoutPassword } = session.user

    res.json({
      user: userWithoutPassword,
      accessToken: newAccessToken,
      refreshToken: newRefreshToken
    })
  })

  getCurrentUser = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user?.id

    if (!userId) {
      throw new ApiError(401, 'No autorizado')
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        phone: true,
        latitude: true,
        longitude: true,
        isConnected: true,
        isActive: true,
        createdAt: true,
        lastLogin: true
      }
    })

    if (!user || !user.isActive) {
      throw new ApiError(404, 'Usuario no encontrado')
    }

    res.json({ user })
  })

  private generateAccessToken(userId: string, role: string): string {
    return jwt.sign(
      { userId, role },
      process.env.JWT_SECRET!,
      { expiresIn: '15m' }
    )
  }

  private generateRefreshToken(userId: string): string {
    return jwt.sign(
      { userId },
      process.env.JWT_REFRESH_SECRET!,
      { expiresIn: '7d' }
    )
  }
}
