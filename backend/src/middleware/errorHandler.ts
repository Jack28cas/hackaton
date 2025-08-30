import { Request, Response, NextFunction } from 'express'
import { ApiError } from '@/utils/ApiError'

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error('Error:', error)

  // Error personalizado de la API
  if (error instanceof ApiError) {
    res.status(error.statusCode).json({
      error: error.message,
      ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
    })
    return
  }

  // Errores de Prisma
  if (error.name === 'PrismaClientKnownRequestError') {
    const prismaError = error as any
    
    // Violación de restricción única
    if (prismaError.code === 'P2002') {
      res.status(400).json({
        error: 'Ya existe un registro con estos datos',
        field: prismaError.meta?.target
      })
      return
    }
    
    // Registro no encontrado
    if (prismaError.code === 'P2025') {
      res.status(404).json({
        error: 'Registro no encontrado'
      })
      return
    }
  }

  // Errores de validación de Zod
  if (error.name === 'ZodError') {
    const zodError = error as any
    res.status(400).json({
      error: 'Datos de entrada inválidos',
      details: zodError.errors.map((err: any) => ({
        field: err.path.join('.'),
        message: err.message
      }))
    })
    return
  }

  // Error de JSON malformado
  if (error instanceof SyntaxError && 'body' in error) {
    res.status(400).json({
      error: 'JSON malformado en el cuerpo de la petición'
    })
    return
  }

  // Error genérico del servidor
  res.status(500).json({
    error: 'Error interno del servidor',
    ...(process.env.NODE_ENV === 'development' && { 
      message: error.message,
      stack: error.stack 
    })
  })
}
