import { Router } from 'express'
import { OrderController } from '@/controllers/OrderController'
import { authenticateToken } from '@/middleware/auth'
import { validateRequest } from '@/middleware/validation'
import { createOrderSchema, updateOrderStatusSchema } from '@/utils/validationSchemas'

const router = Router()
const orderController = new OrderController()

// Todas las rutas requieren autenticación
router.use(authenticateToken)

// GET /api/orders - Obtener órdenes del usuario (cliente: sus pedidos, vendedor: pedidos recibidos)
router.get('/', orderController.getOrders)

// GET /api/orders/:id - Obtener orden específica
router.get('/:id', orderController.getOrderById)

// POST /api/orders - Crear nueva orden (solo clientes)
router.post('/', validateRequest(createOrderSchema), orderController.createOrder)

// PUT /api/orders/:id/status - Actualizar estado de la orden
router.put('/:id/status', validateRequest(updateOrderStatusSchema), orderController.updateOrderStatus)

// GET /api/orders/vendor/active - Obtener órdenes activas para el vendedor
router.get('/vendor/active', orderController.getActiveOrdersForVendor)

// GET /api/orders/client/history - Obtener historial de órdenes del cliente
router.get('/client/history', orderController.getClientOrderHistory)

// PUT /api/orders/:id/accept - Aceptar orden (solo vendedores)
router.put('/:id/accept', orderController.acceptOrder)

// PUT /api/orders/:id/reject - Rechazar orden (solo vendedores)
router.put('/:id/reject', orderController.rejectOrder)

export { router as orderRoutes }
