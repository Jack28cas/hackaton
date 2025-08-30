'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Plus, Edit, Trash2, Package, DollarSign, FileText } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

interface Producto {
  id: string
  name: string
  description: string
  price: number
  stock: number
  category: string
  imageUrl?: string
}

interface GestionProductosProps {
  isOpen: boolean
  onClose: () => void
}

export default function GestionProductos({ isOpen, onClose }: GestionProductosProps) {
  const [productos, setProductos] = useState<Producto[]>([])
  const [modalAbierto, setModalAbierto] = useState(false)
  const [productoEditando, setProductoEditando] = useState<Producto | null>(null)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    stock: '',
    categoria: 'Comida'
  })

  const { user, token } = useAuth()

  // Debug: Verificar contexto de autenticación
  useEffect(() => {
    console.log('🔍 GestionProductos - Auth context:', { 
      hasUser: !!user, 
      hasToken: !!token, 
      userId: user?.id,
      userRole: user?.role,
      token: token?.substring(0, 20) + '...'
    })
  }, [user, token])

  // Cargar productos del vendedor
  useEffect(() => {
    if (isOpen && user) {
      cargarProductos()
    }
  }, [isOpen, user])

  const cargarProductos = async () => {
    if (!user || !token) {
      console.log('🚫 No user or token:', { user: !!user, token: !!token })
      return
    }

    console.log('📤 Loading products for user:', user.id, 'with token:', token?.substring(0, 20) + '...')

    try {
      setLoading(true)
      const response = await fetch(`http://localhost:3001/api/products/vendor/${user.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        console.log('✅ Productos cargados:', data)
        // El backend devuelve {products: [...]} o directamente [...]
        const productosArray = data.products || data
        setProductos(Array.isArray(productosArray) ? productosArray : [])
      } else {
        console.error('Error cargando productos:', response.status, response.statusText)
        setProductos([]) // Asegurar que sea array vacío en caso de error
      }
    } catch (error) {
      console.error('Error:', error)
      setProductos([]) // Asegurar que sea array vacío en caso de error
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !token) return

    const productoData = {
      name: formData.nombre,
      description: formData.descripcion,
      price: parseFloat(formData.precio),
      stock: parseInt(formData.stock),
      category: formData.categoria,
      vendorId: user.id
    }

    console.log('💾 Saving product:', productoData)
    console.log('🎫 Using token:', token?.substring(0, 20) + '...')

    try {
      setLoading(true)
      let response

      if (productoEditando) {
        // Actualizar producto existente
        response = await fetch(`http://localhost:3001/api/products/${productoEditando.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(productoData)
        })
      } else {
        // Crear nuevo producto
        response = await fetch('http://localhost:3001/api/products', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(productoData)
        })
      }

      if (response.ok) {
        await cargarProductos()
        cerrarModal()
      } else {
        const errorData = await response.json().catch(() => null)
        console.error('Error guardando producto:', response.status, errorData)
      }
    } catch (error) {
      console.error('Error:', error)
      setProductos([]) // Asegurar que sea array vacío en caso de error
    } finally {
      setLoading(false)
    }
  }

  const eliminarProducto = async (id: string) => {
    if (!token || !confirm('¿Estás seguro de eliminar este producto?')) return

    try {
      const response = await fetch(`http://localhost:3001/api/products/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        await cargarProductos()
      }
    } catch (error) {
      console.error('Error eliminando producto:', error)
    }
  }

  const abrirModal = (producto?: Producto) => {
    if (producto) {
      setProductoEditando(producto)
      setFormData({
        nombre: producto.name,
        descripcion: producto.description,
        precio: producto.price.toString(),
        stock: producto.stock.toString(),
        categoria: producto.category
      })
    } else {
      setProductoEditando(null)
      setFormData({
        nombre: '',
        descripcion: '',
        precio: '',
        stock: '',
        categoria: 'Comida'
      })
    }
    setModalAbierto(true)
  }

  const cerrarModal = () => {
    setModalAbierto(false)
    setProductoEditando(null)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Gestión de Productos
            </DialogTitle>
            <DialogDescription>
              Administra tu catálogo de productos
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Botón Agregar Producto */}
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Mis Productos ({productos.length})</h3>
              <Button onClick={() => abrirModal()} className="bg-green-600 hover:bg-green-700">
                <Plus className="h-4 w-4 mr-2" />
                Agregar Producto
              </Button>
            </div>

            {/* Lista de Productos */}
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Cargando productos...</p>
              </div>
            ) : productos.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No tienes productos</h3>
                <p className="text-gray-600 mb-4">Comienza agregando tu primer producto</p>
                <Button onClick={() => abrirModal()} className="bg-green-600 hover:bg-green-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar Primer Producto
                </Button>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {productos.map((producto) => (
                  <Card key={producto.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{producto.name}</CardTitle>
                          <p className="text-sm text-gray-600 mt-1">{producto.category}</p>
                        </div>
                        <div className="flex space-x-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => abrirModal(producto)}
                            className="h-8 w-8 p-0"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => eliminarProducto(producto.id)}
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-700 mb-3">{producto.description}</p>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center text-green-600 font-semibold">
                          <DollarSign className="h-4 w-4" />
                          {producto.price}
                        </div>
                        <div className="text-sm text-gray-600">
                          Stock: {producto.stock}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal Agregar/Editar Producto */}
      <Dialog open={modalAbierto} onOpenChange={cerrarModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {productoEditando ? 'Editar Producto' : 'Agregar Producto'}
            </DialogTitle>
            <DialogDescription>
              {productoEditando ? 'Modifica los datos del producto' : 'Completa la información del nuevo producto'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre del Producto
              </label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ej: Tacos de Pastor"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descripción
              </label>
              <textarea
                name="descripcion"
                value={formData.descripcion}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Describe tu producto..."
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Precio ($)
                </label>
                <input
                  type="number"
                  name="precio"
                  value={formData.precio}
                  onChange={handleInputChange}
                  step="0.01"
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.00"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Stock
                </label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Categoría
              </label>
              <select
                name="categoria"
                value={formData.categoria}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Comida">Comida</option>
                <option value="Bebidas">Bebidas</option>
                <option value="Postres">Postres</option>
                <option value="Snacks">Snacks</option>
                <option value="Otros">Otros</option>
              </select>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Button type="button" variant="ghost" onClick={cerrarModal}>
                Cancelar
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Guardando...' : (productoEditando ? 'Actualizar' : 'Crear Producto')}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
