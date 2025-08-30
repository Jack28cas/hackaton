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

    const routingControl = L.Routing.control({
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
    }).addTo(map)

    // Ocultar el contenedor de instrucciones
    const routingContainer = routingControl.getContainer()
    if (routingContainer) {
      routingContainer.style.display = 'none'
    }

    return () => {
      if (map && routingControl) {
        map.removeControl(routingControl)
      }
    }
  }, [map, from, to, show])

  return null
}

export default MapRouting
