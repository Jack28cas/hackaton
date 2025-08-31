'use client'

import { useState, useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'

// Importar Leaflet dinámicamente solo en el cliente
const MapComponent = dynamic(() => import('./MapComponent'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center">
      <div className="text-gray-500">Cargando mapa...</div>
    </div>
  )
})

export default function MapaVendedoresSimple() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return (
      <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-gray-500">Cargando mapa...</div>
      </div>
    )
  }

  return (
    <div className="w-full h-full rounded-lg overflow-hidden">
      <MapComponent />
    </div>
  )
}
