import { z } from 'zod'

// Esquemas de autenticación
export const registerSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  role: z.enum(['CLIENTE', 'VENDEDOR']).optional(),
  phone: z.string().optional()
})

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Contraseña requerida')
})

// Esquemas de usuario
export const updateProfileSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').optional(),
  phone: z.string().optional(),
  email: z.string().email('Email inválido').optional()
})

export const updateLocationSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180)
})

// Esquemas de productos
export const createProductSchema = z.object({
  name: z.string().min(1, 'Nombre del producto requerido'),
  description: z.string().optional(),
  price: z.number().positive('El precio debe ser positivo'),
  stock: z.number().int().min(0, 'El stock no puede ser negativo').optional(),
  category: z.string().optional(),
  imageUrl: z.string().url('URL de imagen inválida').optional()
})

export const updateProductSchema = z.object({
  name: z.string().min(1, 'Nombre del producto requerido').optional(),
  description: z.string().optional(),
  price: z.number().positive('El precio debe ser positivo').optional(),
  stock: z.number().int().min(0, 'El stock no puede ser negativo').optional(),
  category: z.string().optional(),
  imageUrl: z.string().url('URL de imagen inválida').optional(),
  isAvailable: z.boolean().optional()
})

// Esquemas de órdenes
export const createOrderSchema = z.object({
  vendorId: z.string().uuid('ID de vendedor inválido'),
  items: z.array(z.object({
    productId: z.string().uuid('ID de producto inválido'),
    quantity: z.number().int().positive('La cantidad debe ser positiva'),
    price: z.number().positive('El precio debe ser positivo')
  })).min(1, 'Debe incluir al menos un producto'),
  paymentMethod: z.enum(['STABLECOIN', 'EFECTIVO']).optional(),
  deliveryNotes: z.string().optional()
})

export const updateOrderStatusSchema = z.object({
  status: z.enum(['PENDIENTE', 'ACEPTADO', 'PREPARANDO', 'LISTO', 'ENTREGADO', 'CANCELADO'])
})

// Esquemas de ubicación
export const nearbyVendorsSchema = z.object({
  latitude: z.string().transform(val => parseFloat(val)),
  longitude: z.string().transform(val => parseFloat(val)),
  radius: z.string().transform(val => parseFloat(val)).optional().default('5')
})

// Esquemas de parámetros
export const uuidParamSchema = z.object({
  id: z.string().uuid('ID inválido')
})

// Esquemas de paginación
export const paginationSchema = z.object({
  page: z.string().transform(val => parseInt(val) || 1).optional(),
  limit: z.string().transform(val => parseInt(val) || 10).optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional()
})
