import { Router } from 'express'
import { AuthController } from '@/controllers/AuthController'
import { validateRequest } from '@/middleware/validation'
import { loginSchema, registerSchema } from '@/utils/validationSchemas'

const router = Router()
const authController = new AuthController()

// POST /api/auth/register - Registrar nuevo usuario
router.post('/register', validateRequest(registerSchema), authController.register)

// POST /api/auth/login - Iniciar sesión
router.post('/login', validateRequest(loginSchema), authController.login)

// POST /api/auth/logout - Cerrar sesión
router.post('/logout', authController.logout)

// POST /api/auth/refresh - Refrescar token
router.post('/refresh', authController.refreshToken)

// GET /api/auth/me - Obtener información del usuario actual
router.get('/me', authController.getCurrentUser)

export { router as authRoutes }
