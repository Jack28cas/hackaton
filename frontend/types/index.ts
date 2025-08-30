// Tipos de usuario
export interface User {
  id: string
  email: string
  name: string
  phone?: string
  role: 'CLIENTE' | 'VENDEDOR' | 'ADMIN'
  latitude?: number
  longitude?: number
  address?: string
  isConnected?: boolean
  createdAt: string
  lastLogin?: string
}

// Tipos de producto
export interface Product {
  id: string
  name: string
  description?: string
  price: number
  stock: number
  category?: string
  imageUrl?: string
  isAvailable: boolean
  vendorId: string
  vendor?: User
  createdAt: string
  updatedAt: string
}

// Tipos de orden
export interface OrderItem {
  id: string
  productId: string
  product: Product
  quantity: number
  price: number
}

export interface Order {
  id: string
  status: 'PENDIENTE' | 'ACEPTADO' | 'PREPARANDO' | 'LISTO' | 'ENTREGADO' | 'CANCELADO'
  total: number
  paymentMethod: 'STABLECOIN' | 'EFECTIVO'
  deliveryNotes?: string
  walletAddress?: string
  transactionHash?: string
  blockchainNetwork?: string
  clientId: string
  client: User
  vendorId: string
  vendor: User
  items: OrderItem[]
  createdAt: string
  updatedAt: string
}

// Tipos de ubicación
export interface Location {
  latitude: number
  longitude: number
  address?: string
}

export interface VendorLocation extends Location {
  id: string
  name: string
  isConnected: boolean
  products?: Product[]
  distance?: number
  rating?: number
}

// Tipos de autenticación
export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

export interface AuthResponse {
  user: User
  accessToken: string
  refreshToken: string
  message: string
}

// Tipos de API
export interface ApiResponse<T = any> {
  data?: T
  message?: string
  error?: string
  details?: any
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

// Tipos de WebSocket
export interface SocketEvents {
  // Eventos de vendedor
  vendor_connect: (data: { latitude: number; longitude: number }) => void
  vendor_disconnect: () => void
  update_location: (data: { latitude: number; longitude: number }) => void
  
  // Eventos de cliente
  get_nearby_vendors: (data: { latitude: number; longitude: number; radius?: number }) => void
  
  // Eventos de órdenes
  new_order: (orderData: any) => void
  order_status_update: (data: { orderId: string; status: string; clientId: string }) => void
  
  // Eventos recibidos
  vendor_connected: (data: { vendorId: string; name: string; latitude: number; longitude: number }) => void
  vendor_disconnected: (data: { vendorId: string }) => void
  vendor_location_updated: (data: { vendorId: string; latitude: number; longitude: number }) => void
  nearby_vendors: (vendors: VendorLocation[]) => void
  order_received: (data: { orderId: string; clientName: string; items: any[]; total: number }) => void
  order_status_changed: (data: { orderId: string; status: string; timestamp: string }) => void
  error: (data: { message: string }) => void
}

// Tipos de formularios
export interface LoginForm {
  email: string
  password: string
}

export interface RegisterForm {
  email: string
  password: string
  confirmPassword: string
  name: string
  role: 'CLIENTE' | 'VENDEDOR'
  phone?: string
}

export interface ProductForm {
  name: string
  description?: string
  price: number
  stock: number
  category?: string
  imageUrl?: string
}

export interface OrderForm {
  vendorId: string
  items: Array<{
    productId: string
    quantity: number
    price: number
  }>
  paymentMethod?: 'STABLECOIN' | 'EFECTIVO'
  deliveryNotes?: string
}

// Tipos de estado de la aplicación
export interface AppState {
  user: User | null
  isAuthenticated: boolean
  loading: boolean
  error: string | null
}

export interface VendorState {
  isConnected: boolean
  location: Location | null
  products: Product[]
  activeOrders: Order[]
  todaySales: number
}

export interface ClientState {
  location: Location | null
  nearbyVendors: VendorLocation[]
  cart: CartItem[]
  orderHistory: Order[]
}

export interface CartItem {
  product: Product
  quantity: number
  vendor: User
}

// Tipos para integraciones futuras
export interface MeemawPayment {
  amount: number
  currency: string
  recipientAddress: string
  network: 'base' | 'polygon' | 'ethereum'
  metadata?: Record<string, any>
}

export interface BlockchainTransaction {
  hash: string
  network: string
  status: 'pending' | 'confirmed' | 'failed'
  amount: number
  currency: string
  timestamp: string
}
