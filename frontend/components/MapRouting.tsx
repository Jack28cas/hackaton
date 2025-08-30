'use client'

import { useEffect } from 'react'
import { useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet-routing-machine'

interface RoutingProps {
  from: {
    lat: number
    lng: number
  }
  to: {
    lat: number
    lng: number
  }
  show: boolean
}

function MapRouting({ from, to, show }: RoutingProps) {
  const map = useMap()

  useEffect(() => {
    if (!map || !show) return

    console.log('🗺️ Creando ruta desde:', from, 'hasta:', to)

    let routingControl: L.Routing.Control | null = null

    try {
      routingControl = L.Routing.control({
        waypoints: [
          L.latLng(from.lat, from.lng),
          L.latLng(to.lat, to.lng)
        ],
        routeWhileDragging: false,
        showAlternatives: false,
        addWaypoints: false,
        createMarker: function() { return null; }, // No crear marcadores adicionales
        lineOptions: {
          styles: [
            { 
              color: '#3B82F6', 
              weight: 4, 
              opacity: 0.8,
              className: 'route-line'
            }
          ]
        },
        show: false, // No mostrar el panel de instrucciones
        collapsible: true,
        fitSelectedRoutes: true
      })

      // Agregar el control al mapa
      routingControl.addTo(map)

      // Ocultar el contenedor de instrucciones después de un pequeño delay
      setTimeout(() => {
        const routingContainer = routingControl?.getContainer()
        if (routingContainer) {
          routingContainer.style.display = 'none'
        }
      }, 100)

    } catch (error) {
      console.error('Error creando ruta:', error)
    }

    return () => {
      if (routingControl && map) {
        try {
          // Verificar que el control aún existe antes de removerlo
          if (map.hasLayer && routingControl._map) {
            map.removeControl(routingControl)
          }
        } catch (error) {
          console.warn('Error limpiando ruta:', error)
        }
      }
    }
  }, [map, from, to, show])

  return null
}

export default MapRouting
