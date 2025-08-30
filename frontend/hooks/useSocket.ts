'use client'

import { useEffect, useRef, useState } from 'react'
import { io, Socket } from 'socket.io-client'

interface UseSocketOptions {
  autoConnect?: boolean
  userType?: 'CLIENTE' | 'VENDEDOR'
  token?: string
  userId?: string
}

export const useSocket = (options: UseSocketOptions = {}) => {
  const { autoConnect = false, userType = 'CLIENTE', token, userId } = options
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const socketRef = useRef<Socket | null>(null)

  const connect = () => {
    if (socketRef.current?.connected) return

    try {
      socketRef.current = io('http://localhost:3001', {
        transports: ['websocket', 'polling'],
        autoConnect: true,
        auth: {
          userType: userType,
          token: token,
          userId: userId
        }
      })

      socketRef.current.on('connect', () => {
        console.log(`🔗 Socket conectado como ${userType}`)
        setIsConnected(true)
        setError(null)
      })

      socketRef.current.on('disconnect', (reason) => {
        console.log('🔌 Socket desconectado:', reason)
        setIsConnected(false)
      })

      socketRef.current.on('connect_error', (err) => {
        console.error('❌ Error de conexión:', err.message)
        setError(err.message)
        setIsConnected(false)
      })

      socketRef.current.on('reconnect', (attemptNumber) => {
        console.log(`🔄 Reconectado después de ${attemptNumber} intentos`)
      })

      socketRef.current.on('reconnect_error', (err) => {
        console.error('❌ Error de reconexión:', err.message)
      })

    } catch (err) {
      console.error('Error creando socket:', err)
      setError('Error de conexión')
    }
  }

  const disconnect = () => {
    if (socketRef.current) {
      socketRef.current.disconnect()
      socketRef.current = null
      setIsConnected(false)
    }
  }

  const emit = (event: string, data?: any) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit(event, data)
      return true
    } else {
      console.warn('Socket no conectado, no se puede enviar:', event)
      return false
    }
  }

  const on = (event: string, callback: (...args: any[]) => void) => {
    if (socketRef.current) {
      socketRef.current.on(event, callback)
    }
  }

  const off = (event: string, callback?: (...args: any[]) => void) => {
    if (socketRef.current) {
      socketRef.current.off(event, callback)
    }
  }

  useEffect(() => {
    if (autoConnect) {
      connect()
    }

    return () => {
      disconnect()
    }
  }, [autoConnect])

  return {
    socket: socketRef.current,
    isConnected,
    error,
    connect,
    disconnect,
    emit,
    on,
    off
  }
}
