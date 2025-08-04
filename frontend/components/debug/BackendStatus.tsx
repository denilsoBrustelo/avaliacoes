'use client'

import { useState, useEffect } from 'react'
import { apiClient } from '@/lib/api'
import { CheckCircle, XCircle, Clock } from 'lucide-react'

export default function BackendStatus() {
  const [isConnected, setIsConnected] = useState<boolean | null>(null)
  const [isChecking, setIsChecking] = useState(false)
  const [lastError, setLastError] = useState<string | null>(null)

  const checkConnection = async () => {
    setIsChecking(true)
    try {
      const connected = await apiClient.testConnection()
      setIsConnected(connected)
    } catch (error) {
      setIsConnected(false)
    } finally {
      setIsChecking(false)
    }
  }

  useEffect(() => {
    checkConnection()
    // Check every 30 seconds
    const interval = setInterval(checkConnection, 30000)
    return () => clearInterval(interval)
  }, [])

  if (isChecking && isConnected === null) {
    return (
      <div className="flex items-center space-x-2 text-sm text-gray-600">
        <Clock className="h-4 w-4 animate-spin" />
        <span>Verificando backend...</span>
      </div>
    )
  }

  return (
    <div className="flex items-center space-x-2 text-sm">
      {isConnected ? (
        <>
          <CheckCircle className="h-4 w-4 text-green-500" />
          <span className="text-green-700">Backend conectado</span>
        </>
      ) : (
        <>
          <XCircle className="h-4 w-4 text-red-500" />
          <span className="text-red-700">Backend desconectado</span>
          <button 
            onClick={checkConnection}
            className="text-blue-600 hover:text-blue-800 underline"
            disabled={isChecking}
          >
            Tentar novamente
          </button>
        </>
      )}
    </div>
  )
}
