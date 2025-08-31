'use client'

import { useEffect, useRef } from 'react'

export default function MapComponent() {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return

    const initMap = async () => {
      try {
        // Importar Leaflet dinámicamente
        const L = await import('leaflet')
        await import('leaflet/dist/leaflet.css')

        // Coordenadas de Córdoba, Argentina
        const lat = -31.4167
        const lng = -64.1833
        const zoom = 13

        // Crear el mapa
        const map = L.map(mapRef.current!).setView([lat, lng], zoom)

        // Agregar capa de tiles (OpenStreetMap)
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors'
        }).addTo(map)

        // Agregar algunos marcadores de ejemplo para vendedores
        const vendors = [
          { lat: -31.4167, lng: -64.1833, name: 'Don Carlos - Tacos' },
          { lat: -31.4180, lng: -64.1850, name: 'María - Empanadas' },
          { lat: -31.4150, lng: -64.1810, name: 'Jorge - Jugos Naturales' },
          { lat: -31.4200, lng: -64.1800, name: 'Ana - Pizzas' },
          { lat: -31.4140, lng: -64.1860, name: 'Luis - Hamburguesas' }
        ]

        vendors.forEach(vendor => {
          const marker = L.marker([vendor.lat, vendor.lng])
            .addTo(map)
            .bindPopup(`<b>${vendor.name}</b><br>Vendedor conectado`)
          
          // Hacer el marcador verde para indicar que está conectado
          marker.setIcon(L.divIcon({
            className: 'custom-div-icon',
            html: `<div style="background-color: #22c55e; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
            iconSize: [20, 20],
            iconAnchor: [10, 10]
          }))
        })

        mapInstanceRef.current = map

        // Limpiar el mapa cuando el componente se desmonte
        return () => {
          if (mapInstanceRef.current) {
            mapInstanceRef.current.remove()
            mapInstanceRef.current = null
          }
        }
      } catch (error) {
        console.error('Error al cargar el mapa:', error)
      }
    }

    initMap()
  }, [])

  return (
    <div 
      ref={mapRef} 
      className="w-full h-full rounded-lg"
      style={{ minHeight: '400px' }}
    />
  )
}
