'use client'

import { useEffect, useRef, useState } from 'react'

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
  const mapRef = useRef<HTMLDivElement>(null)
  const [isClient, setIsClient] = useState(false)
  const [mapInstance, setMapInstance] = useState<any>(null)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!isClient || !mapRef.current) return

    const initMap = async () => {
      try {
        const L = await import('leaflet')

        // Limpiar el contenedor si ya hay un mapa
        if (mapRef.current) {
          mapRef.current.innerHTML = ''
        }

        // Crear el mapa
        const map = L.map(mapRef.current!).setView(ubicacionUsuario, 13)
        setMapInstance(map)

        // Agregar capa de tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors'
        }).addTo(map)

        // Marcador del usuario
        L.marker(ubicacionUsuario)
          .addTo(map)
          .bindPopup('<b>Tu ubicación</b>')

        // Marcadores de vendedores
        vendedores.forEach((vendedor) => {
          const marker = L.marker(vendedor.ubicacion)
            .addTo(map)
            .bindPopup(`
              <div style="padding: 8px; min-width: 200px;">
                <h3 style="font-weight: bold; margin: 0 0 4px 0;">${vendedor.nombre}</h3>
                <p style="margin: 0 0 8px 0; color: #666; font-size: 12px;">${vendedor.descripcion}</p>
                <div style="font-size: 12px; color: #f59e0b; margin-bottom: 4px;">
                  ⭐ ${vendedor.rating} • ${vendedor.distancia}km
                </div>
                <div style="font-size: 12px; margin-bottom: 8px;">
                  ${vendedor.productos.slice(0, 2).join(', ')}
                  ${vendedor.productos.length > 2 ? ` +${vendedor.productos.length - 2} más` : ''}
                </div>
                <span style="font-size: 11px; padding: 2px 8px; border-radius: 12px; background: ${vendedor.conectado ? '#dcfce7' : '#f3f4f6'}; color: ${vendedor.conectado ? '#166534' : '#6b7280'};">
                  ${vendedor.conectado ? 'Conectado' : 'Desconectado'}
                </span>
              </div>
            `)

          // Click handler
          if (onVendedorClick) {
            marker.on('click', () => onVendedorClick(vendedor))
          }
        })

      } catch (error) {
        console.error('Error al cargar el mapa:', error)
        // Fallback: mostrar mensaje de error
        if (mapRef.current) {
          mapRef.current.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: center; height: 300px; background: #f3f4f6; border-radius: 8px;">
              <div style="text-align: center; color: #6b7280;">
                <div style="font-size: 24px; margin-bottom: 8px;">🗺️</div>
                <div>Error al cargar el mapa</div>
                <div style="font-size: 12px; margin-top: 4px;">Intenta recargar la página</div>
              </div>
            </div>
          `
        }
      }
    }

    initMap()

    // Cleanup function
    return () => {
      if (mapInstance) {
        mapInstance.remove()
        setMapInstance(null)
      }
    }
  }, [isClient, vendedores, ubicacionUsuario, onVendedorClick])

  if (!isClient) {
    return (
      <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-gray-500">Cargando mapa...</div>
      </div>
    )
  }

  return (
    <div 
      ref={mapRef} 
      className="w-full h-full rounded-lg overflow-hidden"
      style={{ minHeight: '300px' }}
    />
  )
}
