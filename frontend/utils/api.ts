import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

// Crear instancia de axios con configuración base
export const api = axios.create({
  baseURL: `${API_URL}/api`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptor para agregar token de autenticación
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Interceptor para manejar respuestas y errores
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // Si el token expiró, intentar renovarlo
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const refreshToken = localStorage.getItem('refreshToken')
        if (refreshToken) {
          const response = await axios.post(`${API_URL}/api/auth/refresh`, {
            refreshToken
          })

          const { accessToken } = response.data
          localStorage.setItem('accessToken', accessToken)

          // Reintentar la petición original
          originalRequest.headers.Authorization = `Bearer ${accessToken}`
          return api(originalRequest)
        }
      } catch (refreshError) {
        // Si no se puede renovar el token, limpiar storage y redirigir al login
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        window.location.href = '/auth/login'
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

// Funciones de la API

// Autenticación
export const authAPI = {
  register: (userData: {
    email: string
    password: string
    name: string
    role?: 'CLIENTE' | 'VENDEDOR'
    phone?: string
  }) => api.post('/auth/register', userData),

  login: (credentials: { email: string; password: string }) =>
    api.post('/auth/login', credentials),

  logout: (refreshToken: string) =>
    api.post('/auth/logout', { refreshToken }),

  getCurrentUser: () => api.get('/auth/me'),

  refreshToken: (refreshToken: string) =>
    api.post('/auth/refresh', { refreshToken }),
}

// Usuarios
export const userAPI = {
  getProfile: () => api.get('/users/profile'),

  updateProfile: (data: {
    name?: string
    phone?: string
    email?: string
    address?: string
  }) => api.put('/users/profile', data),

  getNearbyVendors: (params: {
    latitude: number
    longitude: number
    radius?: number
  }) => api.get('/users/vendors/nearby', { params }),

  updateLocation: (location: {
    latitude: number
    longitude: number
    address?: string
  }) => api.put('/users/location', location),
}

// Productos
export const productAPI = {
  getProducts: (params?: {
    vendorId?: string
    category?: string
    available?: boolean
  }) => api.get('/products', { params }),

  getProductById: (id: string) => api.get(`/products/${id}`),

  createProduct: (productData: {
    name: string
    description?: string
    price: number
    stock?: number
    category?: string
    imageUrl?: string
  }) => api.post('/products', productData),

  updateProduct: (id: string, productData: Partial<{
    name: string
    description: string
    price: number
    stock: number
    category: string
    imageUrl: string
    isAvailable: boolean
  }>) => api.put(`/products/${id}`, productData),

  deleteProduct: (id: string) => api.delete(`/products/${id}`),

  toggleAvailability: (id: string) =>
    api.put(`/products/${id}/availability`),

  getProductsByVendor: (vendorId: string) =>
    api.get(`/products/vendor/${vendorId}`),
}

// Órdenes
export const orderAPI = {
  getOrders: () => api.get('/orders'),

  getOrderById: (id: string) => api.get(`/orders/${id}`),

  createOrder: (orderData: {
    vendorId: string
    items: Array<{
      productId: string
      quantity: number
      price: number
    }>
    paymentMethod?: 'STABLECOIN' | 'EFECTIVO'
    deliveryNotes?: string
  }) => api.post('/orders', orderData),

  updateOrderStatus: (id: string, status: string) =>
    api.put(`/orders/${id}/status`, { status }),

  getActiveOrdersForVendor: () => api.get('/orders/vendor/active'),

  getClientOrderHistory: () => api.get('/orders/client/history'),

  acceptOrder: (id: string) => api.put(`/orders/${id}/accept`),

  rejectOrder: (id: string) => api.put(`/orders/${id}/reject`),
}

// Ubicación
export const locationAPI = {
  updateLocation: (location: {
    latitude: number
    longitude: number
  }) => api.put('/location', location),

  getNearbyVendors: (params: {
    latitude: number
    longitude: number
    radius?: number
  }) => api.get('/location/vendors/nearby', { params }),

  connectVendor: () => api.post('/location/vendor/connect'),

  disconnectVendor: () => api.post('/location/vendor/disconnect'),

  getVendorStatus: () => api.get('/location/vendor/status'),
}
