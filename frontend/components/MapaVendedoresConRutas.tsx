'use client'

import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import MapRouting from './MapRouting'
import { Button } from '@/components/ui/button'

// Fix para los iconos de Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

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

// Componente para centrar el mapa cuando cambie la ubicación
function MapUpdater({ center }: { center: [number, number] }) {
  const map = useMap()
  
  useEffect(() => {
    map.setView(center, map.getZoom())
  }, [map, center])
  
  return null
}

export default function MapaVendedoresConRutas({ 
  vendedores, 
  ubicacionUsuario, 
  onVendedorClick 
}: MapaVendedoresProps) {
  const [vendedorSeleccionado, setVendedorSeleccionado] = useState<Vendedor | null>(null)
  const [mostrarRuta, setMostrarRuta] = useState(false)
  const [rutaCargando, setRutaCargando] = useState(false)

  // Iconos personalizados
  const iconoUsuario = new L.Icon({
    iconUrl: 'data:image/svg+xml;base64,' + btoa(`
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="8" fill="#3B82F6" stroke="white" stroke-width="2"/>
        <circle cx="12" cy="12" r="3" fill="white"/>
      </svg>
    `),
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12],
  })

  const iconoVendedorConectado = new L.Icon({
    iconUrl: 'data:image/svg+xml;base64,' + btoa(`
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="16" cy="16" r="12" fill="#10B981" stroke="white" stroke-width="2"/>
        <circle cx="16" cy="16" r="4" fill="white"/>
        <circle cx="24" cy="8" r="3" fill="#EF4444"/>
      </svg>
    `),
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
  })

  const iconoVendedorDesconectado = new L.Icon({
    iconUrl: 'data:image/svg+xml;base64=' + btoa(`
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="16" cy="16" r="12" fill="#6B7280" stroke="white" stroke-width="2"/>
        <circle cx="16" cy="16" r="4" fill="white"/>
      </svg>
    `),
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
  })

  const handleVendedorClick = (vendedor: Vendedor) => {
    setVendedorSeleccionado(vendedor)
    if (onVendedorClick) {
      onVendedorClick(vendedor)
    }
  }

  const handleMostrarRuta = async (vendedor: Vendedor) => {
    if (rutaCargando) return // Evitar múltiples clicks rápidos
    
    setRutaCargando(true)
    
    // Si hay una ruta anterior, ocultarla primero
    if (mostrarRuta) {
      setMostrarRuta(false)
      await new Promise(resolve => setTimeout(resolve, 300)) // Pequeño delay
    }
    
    setVendedorSeleccionado(vendedor)
    setMostrarRuta(true)
    setRutaCargando(false)
  }

  const handleOcultarRuta = async () => {
    if (rutaCargando) return
    
    setRutaCargando(true)
    setMostrarRuta(false)
    
    // Delay antes de limpiar el vendedor seleccionado
    setTimeout(() => {
      setVendedorSeleccionado(null)
      setRutaCargando(false)
    }, 200)
  }

  return (
    <div className="relative w-full h-full">
      <MapContainer 
        center={ubicacionUsuario || [-31.4167, -64.1833]} 
        zoom={15} 
        className="w-full h-full rounded-lg"
        style={{ minHeight: '300px' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='© OpenStreetMap contributors'
        />
        
        <MapUpdater center={ubicacionUsuario} />
        
        {/* Marcador del usuario */}
        <Marker position={ubicacionUsuario} icon={iconoUsuario}>
          <Popup>
            <div className="text-center">
              <b>Tu ubicación</b>
            </div>
          </Popup>
        </Marker>

        {/* Marcadores de vendedores */}
        {vendedores.map((vendedor) => (
          <Marker
            key={vendedor.id}
            position={vendedor.ubicacion}
            icon={vendedor.conectado ? iconoVendedorConectado : iconoVendedorDesconectado}
            eventHandlers={{
              click: () => handleVendedorClick(vendedor),
            }}
          >
            <Popup>
              <div className="p-2 min-w-[200px]">
                <h3 className="font-bold text-sm mb-1">{vendedor.nombre}</h3>
                <p className="text-xs text-gray-600 mb-2">{vendedor.descripcion}</p>
                <div className="flex items-center text-xs text-yellow-600 mb-2">
                  ⭐ {vendedor.rating} • {vendedor.distancia}km
                </div>
                <div className="text-xs mb-3">
                  <strong>Productos:</strong><br/>
                  {vendedor.productos.slice(0, 2).join(', ')}
                  {vendedor.productos.length > 2 && ` +${vendedor.productos.length - 2} más`}
                </div>
                <div className="flex items-center justify-between">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    vendedor.conectado 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {vendedor.conectado ? 'Conectado' : 'Desconectado'}
                  </span>
                  {vendedor.conectado && (
                    <Button 
                      size="sm" 
                      onClick={() => handleMostrarRuta(vendedor)}
                      className="text-xs h-6 px-2"
                      disabled={rutaCargando}
                    >
                      {rutaCargando ? 'Cargando...' : 'Ver Ruta'}
                    </Button>
                  )}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Componente de routing */}
        {mostrarRuta && vendedorSeleccionado && (
          <MapRouting
            from={{ lat: ubicacionUsuario[0], lng: ubicacionUsuario[1] }}
            to={{ lat: vendedorSeleccionado.ubicacion[0], lng: vendedorSeleccionado.ubicacion[1] }}
            show={mostrarRuta}
          />
        )}
      </MapContainer>

      {/* Controles de ruta */}
      {mostrarRuta && vendedorSeleccionado && (
        <div className="absolute top-4 right-4 bg-white p-3 rounded-lg shadow-lg z-[1000]">
          <div className="text-sm font-medium mb-2">
            Ruta a {vendedorSeleccionado.nombre}
          </div>
          <div className="text-xs text-gray-600 mb-3">
            Distancia: ~{vendedorSeleccionado.distancia}km
          </div>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={handleOcultarRuta}
            className="w-full"
            disabled={rutaCargando}
          >
            {rutaCargando ? 'Ocultando...' : 'Ocultar Ruta'}
          </Button>
        </div>
      )}
    </div>
  )
}
