# 📚 VendedoresApp - Documentación Completa

## 🏗️ Arquitectura General

VendedoresApp es una aplicación full-stack que conecta vendedores ambulantes con clientes en tiempo real, preparada para pagos con stablecoins.

### 🎯 Estructura del Proyecto (Monorepo)

```
hackaton/
├── 📁 frontend/          # Next.js 14 + React + TailwindCSS
├── 📁 backend/           # Node.js + Express + Socket.io
├── 📁 database/          # PostgreSQL + Prisma ORM
├── 📄 package.json       # Scripts del monorepo
├── 📄 README.md          # Documentación básica
└── 📄 SETUP.md           # Instrucciones de instalación
```

---

## 🎨 Frontend (Next.js 14)

### 📂 Estructura del Frontend

```
frontend/
├── 📁 app/                    # App Router de Next.js 14
│   ├── 📄 layout.tsx          # Layout principal
│   ├── 📄 page.tsx            # Página de inicio
│   ├── 📄 globals.css         # Estilos globales
│   ├── 📁 cliente/
│   │   └── 📄 page.tsx        # Panel del cliente
│   └── 📁 vendedor/
│       └── 📄 page.tsx        # Panel del vendedor
├── 📁 components/             # Componentes reutilizables
│   ├── 📁 ui/                 # Componentes base (Radix UI)
│   │   ├── 📄 button.tsx
│   │   ├── 📄 card.tsx
│   │   └── 📄 dialog.tsx
│   ├── 📄 MapaVendedores.tsx  # Mapa con Leaflet
│   ├── 📄 ModalPedido.tsx     # Modal de pedidos completo
│   └── 📄 NotificacionPedido.tsx # Sistema de notificaciones
├── 📁 hooks/                  # Custom hooks
│   └── 📄 useSocket.ts        # Hook para WebSocket
├── 📁 types/                  # Tipos TypeScript
│   └── 📄 index.ts
├── 📁 utils/                  # Utilidades
│   ├── 📄 api.ts              # Cliente API
│   └── 📄 cn.ts               # Utility para clases CSS
├── 📄 package.json            # Dependencias del frontend
├── 📄 next.config.js          # Configuración Next.js
├── 📄 tailwind.config.js      # Configuración TailwindCSS
├── 📄 tsconfig.json           # Configuración TypeScript
└── 📄 postcss.config.js       # Configuración PostCSS
```

### 🧩 Componentes Principales

#### 1. **Página de Inicio (`app/page.tsx`)**
- Landing page moderna con gradientes
- Selección Cliente/Vendedor
- Secciones de features y CTA
- Diseño responsive y accesible

#### 2. **Panel Cliente (`app/cliente/page.tsx`)**
- Mapa interactivo con vendedores
- Lista de vendedores cercanos
- Búsqueda de productos
- Modal de pedidos integrado

#### 3. **Panel Vendedor (`app/vendedor/page.tsx`)**
- Dashboard con estadísticas
- Gestión de productos
- Sistema de notificaciones
- Estado de conexión WebSocket

#### 4. **Mapa de Vendedores (`components/MapaVendedores.tsx`)**
- Integración con Leaflet
- Marcadores personalizados
- Popups informativos
- Geolocalización del usuario

#### 5. **Modal de Pedido (`components/ModalPedido.tsx`)**
- Flujo de 3 pasos: Productos → Carrito → Pago
- Gestión de cantidades
- Cálculo automático de totales
- Integración WebSocket

#### 6. **Sistema de Notificaciones (`components/NotificacionPedido.tsx`)**
- Notificaciones en tiempo real
- Sonidos y alertas visuales
- Botones Aceptar/Rechazar
- Historial de pedidos

### 🔗 Hook WebSocket (`hooks/useSocket.ts`)

```typescript
interface UseSocketOptions {
  autoConnect?: boolean
  userType?: 'CLIENTE' | 'VENDEDOR'
}

// Funciones disponibles:
const { 
  socket, 
  isConnected, 
  error, 
  connect, 
  disconnect, 
  emit, 
  on, 
  off 
} = useSocket(options)
```

### 📱 Tecnologías Frontend

- **Next.js 14** - Framework React con App Router
- **React 18** - Biblioteca de UI
- **TypeScript** - Tipado estático
- **TailwindCSS** - Framework CSS utility-first
- **Radix UI** - Componentes accesibles
- **Leaflet** - Mapas interactivos
- **Socket.io Client** - WebSocket en tiempo real
- **Lucide React** - Iconos SVG

---

## ⚙️ Backend (Node.js + Express)

### 📂 Estructura del Backend

```
backend/
├── 📁 src/
│   ├── 📄 index.ts            # Punto de entrada principal
│   ├── 📁 controllers/        # Lógica de negocio
│   │   ├── 📄 AuthController.ts
│   │   ├── 📄 UserController.ts
│   │   ├── 📄 ProductController.ts
│   │   ├── 📄 OrderController.ts
│   │   └── 📄 LocationController.ts
│   ├── 📁 routes/             # Definición de rutas
│   │   ├── 📄 auth.ts
│   │   ├── 📄 users.ts
│   │   ├── 📄 products.ts
│   │   ├── 📄 orders.ts
│   │   └── 📄 location.ts
│   ├── 📁 middleware/         # Middlewares
│   │   ├── 📄 auth.ts         # Autenticación JWT
│   │   ├── 📄 errorHandler.ts # Manejo de errores
│   │   └── 📄 validation.ts   # Validación Zod
│   ├── 📁 services/           # Servicios
│   │   └── 📄 socketService.ts # WebSocket/Socket.io
│   └── 📁 utils/              # Utilidades
│       ├── 📄 prisma.ts       # Cliente Prisma
│       ├── 📄 ApiError.ts     # Errores personalizados
│       ├── 📄 asyncHandler.ts # Wrapper async
│       └── 📄 validationSchemas.ts # Esquemas Zod
├── 📄 package.json            # Dependencias del backend
├── 📄 tsconfig.json           # Configuración TypeScript
├── 📄 .env.example            # Variables de entorno
└── 📄 tsconfig-paths.js       # Resolución de paths
```

### 🛠️ Controladores Principales

#### 1. **AuthController (`controllers/AuthController.ts`)**
```typescript
// Endpoints disponibles:
POST /api/auth/register    # Registro de usuarios
POST /api/auth/login       # Login con JWT
POST /api/auth/logout      # Logout
GET  /api/auth/me          # Usuario actual
POST /api/auth/refresh     # Refresh token
```

#### 2. **UserController (`controllers/UserController.ts`)**
```typescript
// Endpoints disponibles:
GET    /api/users/profile     # Perfil del usuario
PUT    /api/users/profile     # Actualizar perfil
PUT    /api/users/location    # Actualizar ubicación
DELETE /api/users/account     # Eliminar cuenta
```

#### 3. **ProductController (`controllers/ProductController.ts`)**
```typescript
// Endpoints disponibles:
GET    /api/products              # Listar productos
GET    /api/products/:id          # Producto específico
POST   /api/products              # Crear producto (vendedor)
PUT    /api/products/:id          # Actualizar producto
DELETE /api/products/:id          # Eliminar producto
PUT    /api/products/:id/toggle   # Toggle disponibilidad
GET    /api/products/vendor/:id   # Productos de un vendedor
```

#### 4. **OrderController (`controllers/OrderController.ts`)**
```typescript
// Endpoints disponibles:
GET  /api/orders                 # Listar pedidos del usuario
GET  /api/orders/:id             # Pedido específico
POST /api/orders                 # Crear pedido
PUT  /api/orders/:id/status      # Actualizar estado
GET  /api/orders/vendor/active   # Pedidos activos (vendedor)
GET  /api/orders/client/history  # Historial cliente
PUT  /api/orders/:id/accept      # Aceptar pedido
PUT  /api/orders/:id/reject      # Rechazar pedido
```

#### 5. **LocationController (`controllers/LocationController.ts`)**
```typescript
// Endpoints disponibles:
PUT  /api/location/update        # Actualizar ubicación
POST /api/location/connect       # Conectar vendedor
POST /api/location/disconnect    # Desconectar vendedor
GET  /api/location/nearby        # Vendedores cercanos
GET  /api/location/status        # Estado de conexión
```

### 🔌 WebSocket Service (`services/socketService.ts`)

```typescript
// Eventos disponibles:

// Cliente → Servidor:
'new_order'              # Nuevo pedido
'get_nearby_vendors'     # Buscar vendedores cercanos

// Vendedor → Servidor:
'vendor_connect'         # Conectar vendedor
'vendor_disconnect'      # Desconectar vendedor
'update_location'        # Actualizar ubicación
'order_status_update'    # Actualizar estado pedido

// Servidor → Cliente:
'order_received'         # Pedido recibido (vendedor)
'order_accepted'         # Pedido aceptado (cliente)
'order_rejected'         # Pedido rechazado (cliente)
'nearby_vendors'         # Lista de vendedores cercanos
'location_updated'       # Ubicación actualizada
```

### 🛡️ Middleware de Seguridad

#### **Autenticación (`middleware/auth.ts`)**
```typescript
// Middlewares disponibles:
authenticateToken()      # Verificar JWT
requireVendor()         # Solo vendedores
requireCliente()        # Solo clientes
requireAdmin()          # Solo administradores
```

#### **Validación (`middleware/validation.ts`)**
```typescript
// Esquemas Zod para validación:
registerSchema          # Registro de usuario
loginSchema            # Login
productSchema          # Productos
orderSchema            # Pedidos
locationSchema         # Ubicación
```

### 🔧 Tecnologías Backend

- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **TypeScript** - Tipado estático
- **Socket.io** - WebSocket en tiempo real
- **Prisma ORM** - ORM para base de datos
- **JWT** - Autenticación con tokens
- **Zod** - Validación de esquemas
- **bcryptjs** - Hashing de contraseñas
- **CORS** - Configuración de CORS
- **Helmet** - Seguridad HTTP
- **Morgan** - Logging de requests

---

## 🗄️ Base de Datos (PostgreSQL + Prisma)

### 📂 Estructura de la Base de Datos

```
database/
├── 📁 prisma/
│   └── 📄 schema.prisma       # Esquema de la base de datos
├── 📁 seeds/
│   └── 📄 index.js            # Datos de prueba
├── 📄 package.json            # Scripts de base de datos
└── 📄 .env                    # Variables de entorno DB
```

### 🏗️ Esquema de Base de Datos (`prisma/schema.prisma`)

```prisma
// Modelos principales:

model User {
  id          String   @id @default(cuid())
  email       String   @unique
  name        String
  phone       String?
  role        Role     @default(CLIENTE)
  password    String
  latitude    Float?
  longitude   Float?
  isConnected Boolean  @default(false)
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  lastLogin   DateTime?
  
  // Relaciones
  products    Product[]
  clientOrders Order[] @relation("ClientOrders")
  vendorOrders Order[] @relation("VendorOrders")
  sessions    Session[]
  vendorConfig VendorConfig?
}

model Product {
  id          String   @id @default(cuid())
  name        String
  description String?
  price       Float
  category    String?
  isAvailable Boolean  @default(true)
  stock       Int      @default(0)
  imageUrl    String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  // Relaciones
  vendor      User     @relation(fields: [vendorId], references: [id])
  vendorId    String
  orderItems  OrderItem[]
}

model Order {
  id          String      @id @default(cuid())
  status      OrderStatus @default(PENDING)
  total       Float
  paymentMethod PaymentMethod @default(CASH)
  notes       String?
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt
  
  // Relaciones
  client      User        @relation("ClientOrders", fields: [clientId], references: [id])
  clientId    String
  vendor      User        @relation("VendorOrders", fields: [vendorId], references: [id])
  vendorId    String
  items       OrderItem[]
}

model OrderItem {
  id        String @id @default(cuid())
  quantity  Int
  price     Float
  
  // Relaciones
  order     Order   @relation(fields: [orderId], references: [id])
  orderId   String
  product   Product @relation(fields: [productId], references: [id])
  productId String
}

// Enums
enum Role {
  CLIENTE
  VENDEDOR
  ADMIN
}

enum OrderStatus {
  PENDING
  ACCEPTED
  PREPARING
  READY
  COMPLETED
  CANCELLED
}

enum PaymentMethod {
  CASH
  STABLECOIN
  CARD
}
```

### 🌱 Datos de Prueba (`seeds/index.js`)

```javascript
// Usuarios de ejemplo:
- Don Carlos (Vendedor) - Tacos
- María (Vendedor) - Empanadas  
- Jorge (Vendedor) - Jugos
- Ana García (Cliente)
- Luis Pérez (Cliente)

// Productos de ejemplo:
- Tacos al Pastor ($25)
- Quesadillas ($30)
- Empanadas de Carne ($15)
- Jugo de Naranja ($10)

// Órdenes de ejemplo:
- Pedidos de prueba con diferentes estados
```

### 📊 Scripts de Base de Datos

```json
{
  "scripts": {
    "db:generate": "prisma generate",
    "db:push": "prisma db push",
    "db:studio": "prisma studio",
    "db:seed": "node seeds/index.js",
    "db:reset": "prisma db push --force-reset && npm run db:seed"
  }
}
```

---

## 🚀 Scripts de Desarrollo

### 📄 Scripts del Monorepo (`package.json`)

```json
{
  "scripts": {
    "dev": "concurrently \"npm run dev --prefix frontend\" \"npm run dev --prefix backend\"",
    "build": "npm run build --prefix frontend && npm run build --prefix backend",
    "start": "npm run start --prefix backend",
    "setup": "npm install && npm install --prefix frontend && npm install --prefix backend && npm install --prefix database"
  }
}
```

### 🎯 Comandos Principales

```bash
# Instalación inicial
npm run setup

# Desarrollo (frontend + backend)
npm run dev

# Solo frontend
cd frontend && npm run dev

# Solo backend  
cd backend && npm run dev

# Base de datos
cd database && npm run db:push
cd database && npm run db:seed
cd database && npm run db:studio

# Construcción para producción
npm run build
```

---

## 🌐 API Endpoints

### 🔐 Autenticación
```
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/me
POST /api/auth/refresh
```

### 👥 Usuarios
```
GET    /api/users/profile
PUT    /api/users/profile
PUT    /api/users/location
DELETE /api/users/account
```

### 🛍️ Productos
```
GET    /api/products
GET    /api/products/:id
POST   /api/products
PUT    /api/products/:id
DELETE /api/products/:id
PUT    /api/products/:id/toggle
GET    /api/products/vendor/:id
```

### 📦 Pedidos
```
GET  /api/orders
GET  /api/orders/:id
POST /api/orders
PUT  /api/orders/:id/status
GET  /api/orders/vendor/active
GET  /api/orders/client/history
PUT  /api/orders/:id/accept
PUT  /api/orders/:id/reject
```

### 📍 Ubicación
```
PUT  /api/location/update
POST /api/location/connect
POST /api/location/disconnect
GET  /api/location/nearby
GET  /api/location/status
```

### ❤️ Salud
```
GET /api/health
```

---

## 🔧 Configuración

### 🌍 Variables de Entorno

#### **Backend (`.env`)**
```env
# Base de datos
DATABASE_URL="postgresql://usuario:contraseña@localhost:5432/hackaton"

# JWT
JWT_SECRET="tu-jwt-secret-super-seguro"
JWT_EXPIRES_IN="7d"

# Servidor
PORT=5000
NODE_ENV="development"

# CORS
FRONTEND_URL="http://localhost:3000"
```

#### **Database (`.env`)**
```env
DATABASE_URL="postgresql://usuario:contraseña@localhost:5432/hackaton"
```

### ⚙️ Configuraciones Principales

#### **Next.js (`frontend/next.config.js`)**
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['localhost'],
  },
}

module.exports = nextConfig
```

#### **TailwindCSS (`frontend/tailwind.config.js`)**
```javascript
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      animation: {
        'pulse-soft': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [require('tailwindcss-animate')],
}
```

---

## 🧪 Testing

### 🎯 Flujos de Prueba

#### **1. Flujo Cliente:**
1. Ir a `/cliente`
2. Permitir geolocalización
3. Ver vendedores en mapa
4. Hacer clic en "Pedir"
5. Completar pedido en modal
6. Confirmar pedido
7. Recibir notificación de confirmación

#### **2. Flujo Vendedor:**
1. Ir a `/vendedor`
2. Hacer clic en "Conectar"
3. Verificar estado WebSocket (verde)
4. Recibir notificación de pedido
5. Aceptar/Rechazar pedido
6. Ver historial de pedidos

#### **3. Flujo Tiempo Real:**
1. Abrir dos pestañas: `/cliente` y `/vendedor`
2. Conectar vendedor
3. Hacer pedido desde cliente
4. Verificar notificación instantánea en vendedor
5. Aceptar pedido en vendedor
6. Verificar confirmación en cliente

---

## 🚀 Despliegue

### 📦 Preparación para Producción

```bash
# 1. Construir aplicación
npm run build

# 2. Configurar variables de entorno de producción
cp .env.example .env.production

# 3. Migrar base de datos
cd database && npm run db:push

# 4. Poblar datos iniciales
cd database && npm run db:seed

# 5. Iniciar en producción
npm start
```

### 🌐 Consideraciones de Despliegue

- **Frontend**: Vercel, Netlify, o servidor estático
- **Backend**: Railway, Render, Heroku, o VPS
- **Base de datos**: PostgreSQL en la nube (Supabase, Railway)
- **WebSocket**: Asegurar compatibilidad con proxy reverso

---

## 🔮 Próximas Funcionalidades

### 💰 Integración de Pagos
- Integración con Meemaw MPC Wallet
- Soporte para múltiples stablecoins
- Pagos automáticos e invisibles
- Interoperabilidad entre redes (Base, Polygon)

### 🔐 Autenticación Completa
- Sistema de login/registro funcional
- Verificación por email/SMS
- Roles y permisos avanzados
- Autenticación con redes sociales

### 📱 PWA y Móvil
- Progressive Web App
- Notificaciones push nativas
- Instalación en dispositivos móviles
- Optimización para touch

### 🎨 Mejoras de UX
- Animaciones avanzadas
- Temas claro/oscuro
- Internacionalización (i18n)
- Accesibilidad mejorada

---

## 🛠️ Solución de Problemas

### ❌ Errores Comunes

#### **1. WebSocket no conecta**
```bash
# Verificar que el backend esté corriendo
curl http://localhost:5000/api/health

# Verificar puerto 5000
netstat -ano | grep :5000

# Reiniciar backend
cd backend && npm run dev
```

#### **2. Base de datos no conecta**
```bash
# Verificar PostgreSQL
pg_isready -h localhost -p 5432

# Regenerar cliente Prisma
cd database && npm run db:generate

# Resetear base de datos
cd database && npm run db:reset
```

#### **3. Frontend no carga**
```bash
# Limpiar cache Next.js
cd frontend && rm -rf .next

# Reinstalar dependencias
cd frontend && npm install

# Verificar puerto 3000
lsof -i :3000
```

---

## 📞 Soporte

### 🤝 Contribuir
1. Fork el repositorio
2. Crear rama feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crear Pull Request

### 📧 Contacto
- **Proyecto**: VendedoresApp - Hackathon 2024
- **Repositorio**: [GitHub](https://github.com/tu-usuario/vendedores-app)
- **Documentación**: Este archivo

---

## 📄 Licencia

Este proyecto fue creado para el Hackathon 2024 y está disponible bajo licencia MIT.

---

**🎉 ¡Gracias por usar VendedoresApp!** 

*Conectando comunidades, un vendedor a la vez* 🛒✨
