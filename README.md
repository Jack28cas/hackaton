# 🛒 Vendedores Ambulantes App

Una aplicación que conecta vendedores ambulantes con clientes en tiempo real, con pagos invisibles usando stablecoins.

## 🏗️ Arquitectura del Proyecto

Este es un monorepo que contiene:

- **Frontend**: Next.js 14 + React + TailwindCSS + Radix UI
- **Backend**: Node.js + Express + WebSocket
- **Database**: PostgreSQL + Prisma ORM

## 🚀 Inicio Rápido

```bash
# Instalar todas las dependencias
npm run install:all

# Ejecutar en modo desarrollo (frontend + backend)
npm run dev
```

## 📁 Estructura del Proyecto

```
/
├── frontend/           # App Next.js
│   ├── components/     # Componentes reutilizables
│   ├── pages/         # Páginas de la app
│   ├── styles/        # Estilos con Tailwind
│   └── utils/         # Utilidades
├── backend/           # API Node.js
│   ├── controllers/   # Lógica de controladores
│   ├── routes/        # Rutas de la API
│   ├── models/        # Modelos de datos
│   ├── services/      # Servicios de negocio
│   └── middleware/    # Middleware personalizado
├── database/          # Configuración de BD
│   ├── prisma/        # Esquemas y migraciones
│   └── seeds/         # Datos de prueba
└── docs/             # Documentación
```

## 🎯 Funcionalidades Principales

### Para Clientes:
- 🗺️ Mapa en tiempo real con vendedores cercanos
- 🔍 Búsqueda de productos
- 📱 Botón "pedir" intuitivo
- 💳 Pagos invisibles con stablecoins

### Para Vendedores:
- 📝 Registro y login simple
- 🍕 Menú para subir productos con precios
- 📍 Modo "conectado" para aparecer en el mapa
- 🔔 Notificaciones de pedidos en tiempo real

## 🔮 Integraciones Futuras

- **Meemaw MPC Wallet**: Pagos invisibles en stablecoins
- **Interoperabilidad**: Soporte para Base, Polygon y otras redes
- **Accesibilidad**: Diseño simple para usuarios no técnicos

## 🛠️ Tecnologías

- **Frontend**: Next.js 14, React 18, TailwindCSS, Radix UI
- **Backend**: Node.js, Express, Socket.io
- **Database**: PostgreSQL, Prisma ORM
- **Pagos**: Integración futura con Meemaw
- **Tiempo Real**: WebSocket / Supabase Realtime
# hackaton
