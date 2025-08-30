const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed de la base de datos...')

  // Limpiar datos existentes
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.product.deleteMany()
  await prisma.session.deleteMany()
  await prisma.user.deleteMany()

  // Crear usuarios de prueba
  const hashedPassword = await bcrypt.hash('123456', 12)

  // Crear clientes de prueba
  const cliente1 = await prisma.user.create({
    data: {
      email: 'cliente1@test.com',
      password: hashedPassword,
      name: 'Ana García',
      role: 'CLIENTE',
      phone: '+54 9 11 1234-5678',
      latitude: -34.6037,
      longitude: -58.3816,
      address: 'Av. Corrientes 1234, Buenos Aires',
      isActive: true
    }
  })

  const cliente2 = await prisma.user.create({
    data: {
      email: 'cliente2@test.com',
      password: hashedPassword,
      name: 'Carlos López',
      role: 'CLIENTE',
      phone: '+54 9 11 2345-6789',
      latitude: -34.6047,
      longitude: -58.3826,
      isActive: true
    }
  })

  // Crear vendedores de prueba
  const vendedor1 = await prisma.user.create({
    data: {
      email: 'vendedor1@test.com',
      password: hashedPassword,
      name: 'Don Carlos - Tacos',
      role: 'VENDEDOR',
      phone: '+54 9 11 3456-7890',
      latitude: -34.6037,
      longitude: -58.3816,
      address: 'Esquina de Corrientes y Callao',
      isConnected: true,
      isActive: true
    }
  })

  const vendedor2 = await prisma.user.create({
    data: {
      email: 'vendedor2@test.com',
      password: hashedPassword,
      name: 'María - Empanadas',
      role: 'VENDEDOR',
      phone: '+54 9 11 4567-8901',
      latitude: -34.6047,
      longitude: -58.3826,
      address: 'Plaza San Martín',
      isConnected: true,
      isActive: true
    }
  })

  const vendedor3 = await prisma.user.create({
    data: {
      email: 'vendedor3@test.com',
      password: hashedPassword,
      name: 'Jorge - Jugos Naturales',
      role: 'VENDEDOR',
      phone: '+54 9 11 5678-9012',
      latitude: -34.6027,
      longitude: -58.3806,
      address: 'Parque Rivadavia',
      isConnected: false,
      isActive: true
    }
  })

  // Crear productos para Don Carlos - Tacos
  const tacosPastor = await prisma.product.create({
    data: {
      name: 'Taco al Pastor',
      description: 'Delicioso taco con carne al pastor, piña, cebolla y cilantro',
      price: 25.0,
      stock: 50,
      category: 'Tacos',
      isAvailable: true,
      vendorId: vendedor1.id
    }
  })

  const tacosCarnitas = await prisma.product.create({
    data: {
      name: 'Taco de Carnitas',
      description: 'Taco con carnitas de cerdo, cebolla y salsa verde',
      price: 28.0,
      stock: 30,
      category: 'Tacos',
      isAvailable: true,
      vendorId: vendedor1.id
    }
  })

  const quesadilla = await prisma.product.create({
    data: {
      name: 'Quesadilla',
      description: 'Quesadilla de queso con tortilla de maíz artesanal',
      price: 30.0,
      stock: 20,
      category: 'Quesadillas',
      isAvailable: true,
      vendorId: vendedor1.id
    }
  })

  // Crear productos para María - Empanadas
  const empanadaCarne = await prisma.product.create({
    data: {
      name: 'Empanada de Carne',
      description: 'Empanada casera con carne cortada a cuchillo, cebolla y especias',
      price: 15.0,
      stock: 100,
      category: 'Empanadas',
      isAvailable: true,
      vendorId: vendedor2.id
    }
  })

  const empanadaPollo = await prisma.product.create({
    data: {
      name: 'Empanada de Pollo',
      description: 'Empanada con pollo desmenuzado, verduras y hierbas',
      price: 14.0,
      stock: 80,
      category: 'Empanadas',
      isAvailable: true,
      vendorId: vendedor2.id
    }
  })

  const empanadaQueso = await prisma.product.create({
    data: {
      name: 'Empanada de Queso',
      description: 'Empanada con queso cremoso y un toque de cebolla',
      price: 12.0,
      stock: 60,
      category: 'Empanadas',
      isAvailable: true,
      vendorId: vendedor2.id
    }
  })

  // Crear productos para Jorge - Jugos Naturales
  const jugoNaranja = await prisma.product.create({
    data: {
      name: 'Jugo de Naranja',
      description: 'Jugo de naranja recién exprimido, 100% natural',
      price: 20.0,
      stock: 40,
      category: 'Jugos',
      isAvailable: true,
      vendorId: vendedor3.id
    }
  })

  const batidoFresa = await prisma.product.create({
    data: {
      name: 'Batido de Fresa',
      description: 'Batido cremoso de fresa con leche y un toque de miel',
      price: 25.0,
      stock: 25,
      category: 'Batidos',
      isAvailable: true,
      vendorId: vendedor3.id
    }
  })

  // Crear algunas órdenes de ejemplo
  const orden1 = await prisma.order.create({
    data: {
      status: 'PENDIENTE',
      total: 75.0,
      paymentMethod: 'EFECTIVO',
      deliveryNotes: 'Sin cebolla en los tacos, por favor',
      clientId: cliente1.id,
      vendorId: vendedor1.id
    }
  })

  // Crear items para la orden 1
  await prisma.orderItem.createMany({
    data: [
      {
        orderId: orden1.id,
        productId: tacosPastor.id,
        quantity: 2,
        price: 25.0
      },
      {
        orderId: orden1.id,
        productId: quesadilla.id,
        quantity: 1,
        price: 30.0
      }
    ]
  })

  const orden2 = await prisma.order.create({
    data: {
      status: 'ENTREGADO',
      total: 45.0,
      paymentMethod: 'STABLECOIN',
      clientId: cliente2.id,
      vendorId: vendedor2.id,
      walletAddress: '0x1234567890abcdef1234567890abcdef12345678',
      transactionHash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
      blockchainNetwork: 'base'
    }
  })

  // Crear items para la orden 2
  await prisma.orderItem.createMany({
    data: [
      {
        orderId: orden2.id,
        productId: empanadaCarne.id,
        quantity: 3,
        price: 15.0
      }
    ]
  })

  // Crear configuraciones de la app
  await prisma.appConfig.createMany({
    data: [
      {
        key: 'max_delivery_radius',
        value: '5'
      },
      {
        key: 'default_currency',
        value: 'USDC'
      },
      {
        key: 'supported_networks',
        value: 'base,polygon'
      }
    ]
  })

  console.log('✅ Seed completado exitosamente!')
  console.log('\n📊 Datos creados:')
  console.log(`- ${2} clientes`)
  console.log(`- ${3} vendedores`)
  console.log(`- ${8} productos`)
  console.log(`- ${2} órdenes`)
  console.log(`- ${3} configuraciones`)
  
  console.log('\n🔑 Credenciales de prueba:')
  console.log('Email: cliente1@test.com | Password: 123456 (Cliente)')
  console.log('Email: vendedor1@test.com | Password: 123456 (Vendedor - Don Carlos)')
  console.log('Email: vendedor2@test.com | Password: 123456 (Vendedor - María)')
}

main()
  .catch((e) => {
    console.error('❌ Error durante el seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
