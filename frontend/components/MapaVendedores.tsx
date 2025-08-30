'use client'

import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

interface Vendedor {
  id: string
  nombre: string
  descripcion: string
  ubicacion: [number, number]
  productos: string[]
  rating: number
  distancia: number
  conectado: boolean
}

interface MapaVendedoresProps {
  vendedores: Vendedor[]
  ubicacionUsuario: [number, number]
  onVendedorClick?: (vendedor: Vendedor) => void
}

export default function MapaVendedores({ 
  vendedores, 
  ubicacionUsuario, 
  onVendedorClick 
}: MapaVendedoresProps) {
  const mapRef = useRef<L.Map | null>(null)
  const mapContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!mapContainerRef.current) return

    // Inicializar el mapa
    mapRef.current = L.map(mapContainerRef.current).setView(ubicacionUsuario, 15)

    // Agregar capa de OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(mapRef.current)

    // Crear iconos personalizados
    const iconoUsuario = L.divIcon({
      html: `<div class="w-4 h-4 bg-blue-600 rounded-full border-2 border-white shadow-lg"></div>`,
      className: 'custom-marker',
      iconSize: [16, 16],
      iconAnchor: [8, 8]
    })

    const iconoVendedorConectado = L.divIcon({
      html: `<div class="w-6 h-6 bg-green-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
        <div class="w-2 h-2 bg-white rounded-full"></div>
      </div>`,
      className: 'custom-marker',
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    })

    const iconoVendedorDesconectado = L.divIcon({
      html: `<div class="w-6 h-6 bg-gray-400 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
        <div class="w-2 h-2 bg-white rounded-full"></div>
      </div>`,
      className: 'custom-marker',
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    })

    // Agregar marcador del usuario
    L.marker(ubicacionUsuario, { icon: iconoUsuario })
      .addTo(mapRef.current)
      .bindPopup('<b>Tu ubicación</b>')

    // Agregar marcadores de vendedores
    vendedores.forEach((vendedor) => {
      const icono = vendedor.conectado ? iconoVendedorConectado : iconoVendedorDesconectado
      
      const marker = L.marker(vendedor.ubicacion, { icon: icono })
        .addTo(mapRef.current!)
        .bindPopup(`
          <div class="p-2">
            <h3 class="font-bold text-sm">${vendedor.nombre}</h3>
            <p class="text-xs text-gray-600 mb-2">${vendedor.descripcion}</p>
            <div class="flex items-center text-xs text-yellow-600 mb-1">
              ⭐ ${vendedor.rating} • ${vendedor.distancia}km
            </div>
            <div class="text-xs">
              ${vendedor.productos.slice(0, 2).join(', ')}
              ${vendedor.productos.length > 2 ? ` +${vendedor.productos.length - 2} más` : ''}
            </div>
            <div class="mt-2">
              <span class="text-xs px-2 py-1 rounded-full ${
                vendedor.conectado 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-gray-100 text-gray-600'
              }">
                ${vendedor.conectado ? 'Conectado' : 'Desconectado'}
              </span>
            </div>
          </div>
        `)

      // Agregar click handler
      if (onVendedorClick) {
        marker.on('click', () => onVendedorClick(vendedor))
      }
    })

    // Cleanup al desmontar
    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [vendedores, ubicacionUsuario, onVendedorClick])

  return (
    <div 
      ref={mapContainerRef} 
      className="w-full h-full rounded-lg overflow-hidden"
      style={{ minHeight: '300px' }}
    />
  )
}
