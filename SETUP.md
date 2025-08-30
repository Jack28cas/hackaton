# 🚀 Guía de Instalación - VendedoresApp

Esta guía te ayudará a configurar el proyecto completo paso a paso.

## 📋 Prerrequisitos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** (versión 18 o superior)
- **npm** o **yarn**
- **PostgreSQL** (versión 13 o superior)
- **Git**

## 🏗️ Instalación Paso a Paso

### 1. Clonar y configurar el proyecto

```bash
# Si aún no tienes el proyecto, estos serían los pasos:
# git clone <repository-url>
# cd vendedores-ambulantes-app

# Instalar dependencias del proyecto principal
npm install

# Instalar dependencias de todos los subproyectos
npm run install:all
```

### 2. Configurar la Base de Datos

```bash
# Crear la base de datos PostgreSQL
createdb vendedores_db

# O usando psql:
# psql -U postgres
# CREATE DATABASE vendedores_db;
```

### 3. Configurar Variables de Entorno

#### Backend (.env)
```bash
# Ir al directorio backend
cd backend

# Copiar el archivo de ejemplo
cp env.example .env

# Editar el archivo .env con tus configuraciones
nano .env
```

Configura las siguientes variables:
```env
NODE_ENV=development
PORT=3001
FRONTEND_URL=http://localhost:3000

# Actualiza con tus credenciales de PostgreSQL
DATABASE_URL="postgresql://tu_usuario:tu_password@localhost:5432/vendedores_db?schema=public"

# Genera claves secretas seguras
JWT_SECRET=tu-clave-jwt-super-secreta-aqui
JWT_REFRESH_SECRET=tu-clave-refresh-super-secreta-aqui
```

#### Frontend (.env.local)
```bash
# Ir al directorio frontend
cd ../frontend

# Crear archivo de variables de entorno
nano .env.local
```

Agrega:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_WS_URL=ws://localhost:3001
```

### 4. Configurar la Base de Datos con Prisma

```bash
# Desde el directorio backend
cd ../backend

# Generar el cliente de Prisma
npx prisma generate

# Ejecutar migraciones
npx prisma db push

# Poblar la base de datos con datos de prueba
cd ../database
npm run db:seed
```

### 5. Instalar dependencias faltantes

```bash
# En el frontend, instalar tailwindcss-animate
cd ../frontend
npm install tailwindcss-animate tailwindcss-merge

# En el backend, instalar bcryptjs para el seeding
cd ../backend
npm install bcryptjs
npm install -D @types/bcryptjs
```

## 🚀 Ejecutar la Aplicación

### Opción 1: Ejecutar todo junto (recomendado)
```bash
# Desde la raíz del proyecto
npm run dev
```

### Opción 2: Ejecutar por separado
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

## 📱 Acceder a la Aplicación

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Prisma Studio**: `npx prisma studio` (desde /backend)

## 🔑 Credenciales de Prueba

Después del seeding, puedes usar estas credenciales:

### Clientes
- **Email**: cliente1@test.com
- **Password**: 123456

### Vendedores
- **Email**: vendedor1@test.com (Don Carlos - Tacos)
- **Password**: 123456

- **Email**: vendedor2@test.com (María - Empanadas)
- **Password**: 123456

## 🛠️ Comandos Útiles

### Base de Datos
```bash
# Ver la base de datos gráficamente
cd backend && npx prisma studio

# Resetear la base de datos
cd database && npm run db:reset

# Ejecutar migraciones en producción
cd backend && npx prisma migrate deploy
```

### Desarrollo
```bash
# Linting
cd frontend && npm run lint
cd backend && npm run lint

# Build para producción
npm run build
```

## 🔧 Solución de Problemas Comunes

### Error de conexión a PostgreSQL
1. Verifica que PostgreSQL esté ejecutándose
2. Confirma las credenciales en el archivo `.env`
3. Asegúrate de que la base de datos `vendedores_db` exista

### Error de permisos en Windows
```bash
# Ejecutar como administrador o usar:
npm install --legacy-peer-deps
```

### Error de CORS
- Verifica que `FRONTEND_URL` en el backend coincida con la URL del frontend

### Problemas con el mapa
- Asegúrate de que la ubicación esté habilitada en tu navegador
- Verifica la conexión a internet para cargar los tiles de OpenStreetMap

## 🚀 Próximos Pasos

Una vez que tengas todo funcionando:

1. **Explorar las funcionalidades**:
   - Registrarte como cliente y vendedor
   - Probar el mapa en tiempo real
   - Crear productos como vendedor
   - Hacer pedidos como cliente

2. **Integrar Meemaw** (próximamente):
   - Configurar API keys de Meemaw
   - Implementar pagos con stablecoins
   - Configurar webhooks

3. **Desplegar en producción**:
   - Configurar base de datos en la nube
   - Desplegar backend en Railway/Heroku
   - Desplegar frontend en Vercel/Netlify

## 📞 Soporte

Si encuentras algún problema durante la instalación, revisa:

1. Los logs de la consola
2. Los archivos de configuración
3. Las versiones de Node.js y PostgreSQL

¡Listo! Ya tienes tu app de vendedores ambulantes funcionando 🎉
