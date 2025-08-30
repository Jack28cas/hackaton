import { Router } from 'express'
import { LocationController } from '@/controllers/LocationController'
import { authenticateToken } from '@/middleware/auth'
import { validateRequest } from '@/middleware/validation'
import { updateLocationSchema } from '@/utils/validationSchemas'

const router = Router()
const locationController = new LocationController()

// Todas las rutas requieren autenticación
router.use(authenticateToken)

// PUT /api/location - Actualizar ubicación del usuario
router.put('/', validateRequest(updateLocationSchema), locationController.updateLocation)

// GET /api/location/vendors/nearby - Obtener vendedores cercanos
router.get('/vendors/nearby', locationController.getNearbyVendors)

// POST /api/location/vendor/connect - Conectar vendedor (aparecer en mapa)
router.post('/vendor/connect', locationController.connectVendor)

// POST /api/location/vendor/disconnect - Desconectar vendedor (desaparecer del mapa)
router.post('/vendor/disconnect', locationController.disconnectVendor)

// GET /api/location/vendor/status - Obtener estado de conexión del vendedor
router.get('/vendor/status', locationController.getVendorStatus)

export { router as locationRoutes }
