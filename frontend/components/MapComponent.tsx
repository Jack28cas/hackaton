'use client'

import { useEffect, useRef, useState } from 'react'

export default function MapComponent() {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const routingControlRef = useRef<any>(null)
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null)
  const [selectedVendor, setSelectedVendor] = useState<any>(null)
  const [isMapReady, setIsMapReady] = useState(false)
  const [isInitializing, setIsInitializing] = useState(false)
  const [locationStatus, setLocationStatus] = useState<string>('Obteniendo ubicación...')

  // Función para obtener ruta usando OSRM (gratuita y confiable)
  const getRoute = async (from: {lat: number, lng: number}, to: {lat: number, lng: number}) => {
    try {
      const url = `https://router.project-osrm.org/route/v1/driving/${from.lng},${from.lat};${to.lng},${to.lat}?overview=full&geometries=geojson`
      
      const response = await fetch(url)
      
      if (!response.ok) {
        throw new Error('Error en la API de routing')
      }

      const data = await response.json()
      
      if (data.routes && data.routes.length > 0) {
        // Convertir coordenadas de GeoJSON a formato Leaflet [lat, lng]
        return data.routes[0].geometry.coordinates.map((coord: number[]) => [coord[1], coord[0]])
      }
      
      return null
    } catch (error) {
      console.error('Error obteniendo ruta:', error)
      return null
    }
  }

  useEffect(() => {
    // Verificaciones múltiples para evitar reinicialización
    if (!mapRef.current || isInitializing || mapInstanceRef.current) {
      return
    }

    // Verificar si el contenedor ya tiene un mapa usando una verificación más segura
    const container = mapRef.current as any
    if (container._leaflet_id) {
      console.log('Mapa ya inicializado en este contenedor')
      return
    }

    const initMap = async () => {
      try {
        setIsInitializing(true)
        const L = await import('leaflet')
        
        const link = document.createElement('link')
        link.rel = 'stylesheet'
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
        document.head.appendChild(link)

        // Verificación final antes de crear el mapa
        if (!mapRef.current) {
          setIsInitializing(false)
          return
        }

        const container = mapRef.current as any
        if (container._leaflet_id) {
          setIsInitializing(false)
          return
        }

        const lat = -31.4167
        const lng = -64.1833
        const zoom = 13

        const map = L.map(mapRef.current).setView([lat, lng], zoom)
        mapInstanceRef.current = map

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors'
        }).addTo(map)

        // Obtener ubicación del usuario con mejor manejo de errores
        const getUserLocation = () => {
          return new Promise<{lat: number, lng: number}>((resolve) => {
            if (!navigator.geolocation) {
              console.log('Geolocalización no soportada')
              setLocationStatus('Geolocalización no soportada')
              resolve({ lat, lng })
              return
            }

            setLocationStatus('Obteniendo tu ubicación...')

            const options = {
              enableHighAccuracy: true,
              timeout: 15000,
              maximumAge: 0 // Siempre obtener ubicación fresca
            }

            navigator.geolocation.getCurrentPosition(
              (position) => {
                const userLat = position.coords.latitude
                const userLng = position.coords.longitude
                const accuracy = position.coords.accuracy
                
                console.log('Ubicación obtenida:', userLat, userLng, 'Precisión:', accuracy, 'metros')
                setLocationStatus(`Ubicación obtenida (precisión: ${Math.round(accuracy)}m)`)
                resolve({ lat: userLat, lng: userLng })
              },
              (error) => {
                console.log('Error obteniendo ubicación:', error.message)
                let errorMessage = 'Error obteniendo ubicación'
                
                switch(error.code) {
                  case error.PERMISSION_DENIED:
                    errorMessage = 'Permiso denegado para ubicación'
                    break
                  case error.POSITION_UNAVAILABLE:
                    errorMessage = 'Ubicación no disponible'
                    break
                  case error.TIMEOUT:
                    errorMessage = 'Tiempo de espera agotado'
                    break
                }
                
                setLocationStatus(errorMessage)
                resolve({ lat, lng })
              },
              options
            )
          })
        }

        // Obtener ubicación y configurar marcador
        getUserLocation().then((location) => {
          setUserLocation(location)
          
          const userMarker = L.marker([location.lat, location.lng])
            .addTo(map)
            .bindPopup(`
              <b>Tu ubicación</b><br>
              Lat: ${location.lat.toFixed(6)}<br>
              Lng: ${location.lng.toFixed(6)}<br>
              <small>${locationStatus}</small>
            `)
          
          userMarker.setIcon(L.divIcon({
            className: 'custom-div-icon',
            html: `<div style="background-color: #3b82f6; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
            iconSize: [20, 20],
            iconAnchor: [10, 10]
          }))

          // Centrar el mapa en la ubicación del usuario
          map.setView([location.lat, location.lng], 15)
        })

        const vendors = [
          { lat: -31.4167, lng: -64.1833, name: 'Don Carlos - Tacos', distance: '0.2km' },
          { lat: -31.4180, lng: -64.1850, name: 'María - Empanadas', distance: '0.4km' },
          { lat: -31.4150, lng: -64.1810, name: 'Jorge - Jugos Naturales', distance: '0.1km' },
          { lat: -31.4200, lng: -64.1800, name: 'Ana - Pizzas', distance: '0.8km' },
          { lat: -31.4140, lng: -64.1860, name: 'Luis - Hamburguesas', distance: '0.3km' }
        ]

        vendors.forEach(vendor => {
          const marker = L.marker([vendor.lat, vendor.lng])
            .addTo(map)
            .bindPopup(`
              <b>${vendor.name}</b><br>
              Distancia: ${vendor.distance}<br>
              <button onclick="window.showRoute(${vendor.lat}, ${vendor.lng}, '${vendor.name}')" 
                      style="background: #22c55e; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer; margin-top: 5px;">
                Ver ruta
              </button>
            `)
          
          marker.setIcon(L.divIcon({
            className: 'custom-div-icon',
            html: `<div style="background-color: #22c55e; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
            iconSize: [20, 20],
            iconAnchor: [10, 10]
          }))
        })

        // Función global para mostrar ruta con routing real
        ;(window as any).showRoute = async (vendorLat: number, vendorLng: number, vendorName: string) => {
          // Usar la ubicación actual del usuario
          const currentUserLocation = userLocation || { lat, lng }
          
          if (!userLocation) {
            console.log('Ubicación del usuario no disponible, usando ubicación por defecto')
            setLocationStatus('Usando ubicación por defecto')
          }

          const from = currentUserLocation
          const to = { lat: vendorLat, lng: vendorLng }

          console.log('Mostrando ruta desde tu ubicación:', from, 'hacia:', to)

          // Remover ruta anterior
          if (routingControlRef.current) {
            map.removeLayer(routingControlRef.current)
            routingControlRef.current = null
          }

          try {
            // Intentar obtener ruta real
            const routeCoordinates = await getRoute(from, to)
            
            if (routeCoordinates && routeCoordinates.length > 0) {
              // Crear ruta real que sigue las calles
              const routeLine = L.polyline(routeCoordinates, {
                color: '#22c55e',
                weight: 6,
                opacity: 0.8
              }).addTo(map)
              
              routingControlRef.current = routeLine
              
              // Ajustar vista para mostrar toda la ruta
              map.fitBounds(routeLine.getBounds(), { padding: [20, 20] })
              
              setSelectedVendor({ name: vendorName, lat: vendorLat, lng: vendorLng })
              
              console.log('Ruta real creada exitosamente desde tu ubicación')
            } else {
              // Fallback: línea directa si no se puede obtener ruta real
              const routeLine = L.polyline([
                [from.lat, from.lng],
                [to.lat, to.lng]
              ], {
                color: '#22c55e',
                weight: 6,
                opacity: 0.8,
                dashArray: '10, 10'
              }).addTo(map)
              
              routingControlRef.current = routeLine
              
              // Ajustar vista para mostrar toda la ruta
              const bounds = L.latLngBounds([from.lat, from.lng], [to.lat, to.lng])
              map.fitBounds(bounds, { padding: [20, 20] })
              
              setSelectedVendor({ name: vendorName, lat: vendorLat, lng: vendorLng })
              
              console.log('Ruta de fallback creada desde tu ubicación')
            }
          } catch (error) {
            console.error('Error al crear la ruta:', error)
            
            // Fallback: línea directa
            const routeLine = L.polyline([
              [from.lat, from.lng],
              [to.lat, to.lng]
            ], {
              color: '#22c55e',
              weight: 6,
              opacity: 0.8,
              dashArray: '10, 10'
            }).addTo(map)
            
            routingControlRef.current = routeLine
            
            // Ajustar vista para mostrar toda la ruta
            const bounds = L.latLngBounds([from.lat, from.lng], [to.lat, to.lng])
            map.fitBounds(bounds, { padding: [20, 20] })
            
            setSelectedVendor({ name: vendorName, lat: vendorLat, lng: vendorLng })
            
            console.log('Ruta de fallback creada por error desde tu ubicación')
          }
        }

        setIsMapReady(true)
        setIsInitializing(false)

      } catch (error) {
        console.error('Error al cargar el mapa:', error)
        setIsInitializing(false)
      }
    }

    initMap()

    return () => {
      if (routingControlRef.current && mapInstanceRef.current) {
        mapInstanceRef.current.removeLayer(routingControlRef.current)
      }
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
      setIsInitializing(false)
    }
  }, [])

  return (
    <div className="w-full h-full relative">
      <div 
        ref={mapRef} 
        className="w-full h-full rounded-lg"
        style={{ minHeight: '400px' }}
      />
      
      {/* Panel de estado de ubicación */}
      <div className="absolute top-4 right-4 bg-white p-3 rounded-lg shadow-lg max-w-xs">
        <h4 className="font-semibold text-blue-600 mb-1">Tu ubicación</h4>
        <p className="text-xs text-gray-600">{locationStatus}</p>
        {userLocation && (
          <p className="text-xs text-gray-500 mt-1">
            {userLocation.lat.toFixed(6)}, {userLocation.lng.toFixed(6)}
          </p>
        )}
      </div>
      
      {selectedVendor && (
        <div className="absolute top-4 left-4 bg-white p-4 rounded-lg shadow-lg max-w-xs">
          <h3 className="font-semibold text-green-600 mb-2">Ruta activa</h3>
          <p className="text-sm mb-2">Hacia: <strong>{selectedVendor.name}</strong></p>
          <p className="text-xs text-gray-600 mb-3">
            {routingControlRef.current && routingControlRef.current.options.dashArray ? 
              'Línea punteada: ruta directa' : 
              'Línea sólida: ruta siguiendo calles'
            }
          </p>
          <button 
            onClick={() => {
              if (routingControlRef.current && mapInstanceRef.current) {
                mapInstanceRef.current.removeLayer(routingControlRef.current)
                routingControlRef.current = null
              }
              setSelectedVendor(null)
            }}
            className="bg-red-500 text-white px-3 py-1 rounded text-xs hover:bg-red-600"
          >
            Limpiar ruta
          </button>
        </div>
      )}
    </div>
  )
}
