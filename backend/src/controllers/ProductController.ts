import { Request, Response } from 'express'
import { prisma } from '@/utils/prisma'
import { ApiError } from '@/utils/ApiError'
import { asyncHandler } from '@/utils/asyncHandler'

export class ProductController {
  getProducts = asyncHandler(async (req: Request, res: Response) => {
    const { vendorId, category, available } = req.query

    const where: any = {}
    if (vendorId) where.vendorId = vendorId as string
    if (category) where.category = category as string
    if (available !== undefined) where.isAvailable = available === 'true'

    const products = await prisma.product.findMany({
      where,
      include: {
        vendor: {
          select: {
            id: true,
            name: true,
            isConnected: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    res.json({ products })
  })

  getProductById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params

    if (!id) {
      throw new ApiError(400, 'ID del producto requerido')
    }

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        vendor: {
          select: {
            id: true,
            name: true,
            isConnected: true,
            latitude: true,
            longitude: true
          }
        }
      }
    })

    if (!product) {
      throw new ApiError(404, 'Producto no encontrado')
    }

    res.json({ product })
  })

  createProduct = asyncHandler(async (req: Request, res: Response) => {
    const vendorId = req.user?.id
    const { name, description, price, stock, category, imageUrl } = req.body

    if (!vendorId) {
      throw new ApiError(401, 'No autorizado')
    }

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price,
        stock: stock || 0,
        category,
        imageUrl,
        vendorId,
        isAvailable: true
      },
      include: {
        vendor: {
          select: {
            id: true,
            name: true
          }
        }
      }
    })

    res.status(201).json({
      message: 'Producto creado exitosamente',
      product
    })
  })

  updateProduct = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params
    const vendorId = req.user?.id
    const updateData = req.body

    if (!id) {
      throw new ApiError(400, 'ID del producto requerido')
    }

    if (!vendorId) {
      throw new ApiError(401, 'No autorizado')
    }

    // Verificar que el producto existe y pertenece al vendedor
    const existingProduct = await prisma.product.findFirst({
      where: {
        id,
        vendorId
      }
    })

    if (!existingProduct) {
      throw new ApiError(404, 'Producto no encontrado o no tienes permisos para editarlo')
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: updateData,
      include: {
        vendor: {
          select: {
            id: true,
            name: true
          }
        }
      }
    })

    res.json({
      message: 'Producto actualizado exitosamente',
      product: updatedProduct
    })
  })

  deleteProduct = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params
    const vendorId = req.user?.id

    if (!id) {
      throw new ApiError(400, 'ID del producto requerido')
    }

    if (!vendorId) {
      throw new ApiError(401, 'No autorizado')
    }

    // Verificar que el producto existe y pertenece al vendedor
    const existingProduct = await prisma.product.findFirst({
      where: {
        id,
        vendorId
      }
    })

    if (!existingProduct) {
      throw new ApiError(404, 'Producto no encontrado o no tienes permisos para eliminarlo')
    }

    await prisma.product.delete({
      where: { id }
    })

    res.json({
      message: 'Producto eliminado exitosamente'
    })
  })

  toggleAvailability = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params
    const vendorId = req.user?.id

    if (!id) {
      throw new ApiError(400, 'ID del producto requerido')
    }

    if (!vendorId) {
      throw new ApiError(401, 'No autorizado')
    }

    const existingProduct = await prisma.product.findFirst({
      where: {
        id,
        vendorId
      }
    })

    if (!existingProduct) {
      throw new ApiError(404, 'Producto no encontrado')
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        isAvailable: !existingProduct.isAvailable
      }
    })

    res.json({
      message: `Producto ${updatedProduct.isAvailable ? 'activado' : 'desactivado'} exitosamente`,
      product: updatedProduct
    })
  })

  getProductsByVendor = asyncHandler(async (req: Request, res: Response) => {
    const { vendorId } = req.params

    if (!vendorId) {
      throw new ApiError(400, 'ID del vendedor requerido')
    }

    const products = await prisma.product.findMany({
      where: { vendorId },
      include: {
        vendor: {
          select: {
            id: true,
            name: true,
            isConnected: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    res.json({ products })
  })
}
