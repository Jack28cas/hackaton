import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import { createServer } from 'http'
import { Server } from 'socket.io'
import dotenv from 'dotenv'
import rateLimit from 'express-rate-limit'

import { authRoutes } from '@/routes/auth'
import { userRoutes } from '@/routes/users'
import { productRoutes } from '@/routes/products'
import { orderRoutes } from '@/routes/orders'
import { locationRoutes } from '@/routes/location'
import { errorHandler } from '@/middleware/errorHandler'
import { socketHandler } from '@/services/socketService'

// Cargar variables de entorno
dotenv.config()

const app = express()
const server = createServer(app)
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
})

const PORT = process.env.PORT || 3001

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100 // máximo 100 requests por ventana por IP
})

// Middleware
app.use(helmet())
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true
}))
app.use(morgan('combined'))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))
app.use(limiter)

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  })
})

// Rutas de la API
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/products', productRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/location', locationRoutes)

// Configurar WebSocket
socketHandler(io)

// Middleware de manejo de errores (debe ir al final)
app.use(errorHandler)

// Manejar rutas no encontradas
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Ruta no encontrada',
    path: req.originalUrl,
    method: req.method
  })
})

server.listen(PORT, () => {
  console.log(`🚀 Servidor ejecutándose en puerto ${PORT}`)
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`)
  console.log(`📡 WebSocket habilitado`)
  console.log(`🔗 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`)
})

// Manejo graceful de cierre
process.on('SIGTERM', () => {
  console.log('SIGTERM recibido, cerrando servidor...')
  server.close(() => {
    console.log('Servidor cerrado')
    process.exit(0)
  })
})

process.on('SIGINT', () => {
  console.log('SIGINT recibido, cerrando servidor...')
  server.close(() => {
    console.log('Servidor cerrado')
    process.exit(0)
  })
})

export { app, server, io }
