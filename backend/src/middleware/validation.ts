import { Request, Response, NextFunction } from 'express'
import { ZodSchema } from 'zod'
import { ApiError } from '@/utils/ApiError'

export const validateRequest = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body)
      next()
    } catch (error: any) {
      if (error.name === 'ZodError') {
        const errorMessages = error.errors.map((err: any) => ({
          field: err.path.join('.'),
          message: err.message
        }))
        
        throw new ApiError(400, 'Datos de entrada inválidos', errorMessages)
      }
      next(error)
    }
  }
}

export const validateQuery = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.query)
      next()
    } catch (error: any) {
      if (error.name === 'ZodError') {
        const errorMessages = error.errors.map((err: any) => ({
          field: err.path.join('.'),
          message: err.message
        }))
        
        throw new ApiError(400, 'Parámetros de consulta inválidos', errorMessages)
      }
      next(error)
    }
  }
}

export const validateParams = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.params)
      next()
    } catch (error: any) {
      if (error.name === 'ZodError') {
        const errorMessages = error.errors.map((err: any) => ({
          field: err.path.join('.'),
          message: err.message
        }))
        
        throw new ApiError(400, 'Parámetros de ruta inválidos', errorMessages)
      }
      next(error)
    }
  }
}
