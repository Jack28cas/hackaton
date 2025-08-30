import { Router } from 'express'
import { UserController } from '@/controllers/UserController'
import { authenticateToken } from '@/middleware/auth'
import { validateRequest } from '@/middleware/validation'
import { updateProfileSchema } from '@/utils/validationSchemas'

const router = Router()
const userController = new UserController()

// Todas las rutas requieren autenticación
router.use(authenticateToken)

// GET /api/users/profile - Obtener perfil del usuario
router.get('/profile', userController.getProfile)

// PUT /api/users/profile - Actualizar perfil del usuario
router.put('/profile', validateRequest(updateProfileSchema), userController.updateProfile)

// GET /api/users/vendors/nearby - Obtener vendedores cercanos (solo para clientes)
router.get('/vendors/nearby', userController.getNearbyVendors)

// PUT /api/users/location - Actualizar ubicación del usuario
router.put('/location', userController.updateLocation)

export { router as userRoutes }
