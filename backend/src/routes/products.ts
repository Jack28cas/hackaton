import { Router } from 'express'
import { ProductController } from '@/controllers/ProductController'
import { authenticateToken, requireVendor } from '@/middleware/auth'
import { validateRequest } from '@/middleware/validation'
import { createProductSchema, updateProductSchema } from '@/utils/validationSchemas'

const router = Router()
const productController = new ProductController()

// Todas las rutas requieren autenticación
router.use(authenticateToken)

// GET /api/products/vendor/:vendorId - Obtener productos de un vendedor específico (DEBE IR ANTES DE /:id)
router.get('/vendor/:vendorId', productController.getProductsByVendor)

// GET /api/products - Obtener productos (filtrable por vendedor)
router.get('/', productController.getProducts)

// GET /api/products/:id - Obtener producto específico
router.get('/:id', productController.getProductById)

// POST /api/products - Crear nuevo producto (solo vendedores)
router.post('/', requireVendor, validateRequest(createProductSchema), productController.createProduct)

// PUT /api/products/:id - Actualizar producto (solo el vendedor propietario)
router.put('/:id', requireVendor, validateRequest(updateProductSchema), productController.updateProduct)

// DELETE /api/products/:id - Eliminar producto (solo el vendedor propietario)
router.delete('/:id', requireVendor, productController.deleteProduct)

// PUT /api/products/:id/availability - Cambiar disponibilidad del producto
router.put('/:id/availability', requireVendor, productController.toggleAvailability)

export { router as productRoutes }
