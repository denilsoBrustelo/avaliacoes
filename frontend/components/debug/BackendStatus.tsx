'use client'

import { useState, useEffect } from 'react'
import { apiClient } from '@/lib/api'
import { CheckCircle, XCircle, Clock } from 'lucide-react'
import BackendInstructions from './BackendInstructions'

export default function BackendStatus() {
  const [isConnected, setIsConnected] = useState<boolean | null>(null)
  const [isChecking, setIsChecking] = useState(false)
  const [lastError, setLastError] = useState<string | null>(null)
  const [showInstructions, setShowInstructions] = useState(false)

  const checkConnection = async () => {
    setIsChecking(true)
    setLastError(null)
    try {
      const connected = await apiClient.testConnection()
      setIsConnected(connected)
      if (!connected) {
        setLastError('Health endpoint returned non-200 status')
      }
    } catch (error) {
      setIsConnected(false)
      setLastError(error instanceof Error ? error.message : 'Unknown error')
    } finally {
      setIsChecking(false)
    }
  }

  useEffect(() => {
    checkConnection()
    // Check every 60 seconds (less frequent to reduce noise)
    const interval = setInterval(checkConnection, 60000)
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
    <div className="p-3 bg-gray-50 rounded-lg border">
      <div className="flex items-center justify-between mb-2">
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
                Reconectar
              </button>
            </>
          )}
        </div>

        {!isConnected && (
          <button
            onClick={() => setShowInstructions(!showInstructions)}
            className="text-xs text-blue-600 hover:text-blue-800 underline"
          >
            {showInstructions ? 'Ocultar' : 'Como iniciar?'}
          </button>
        )}
      </div>

      <div className="text-xs text-gray-600">
        <div>URL: {process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'}</div>
        {lastError && (
          <div className="text-red-600 mt-1">Status: {lastError}</div>
        )}
      </div>

      {!isConnected && showInstructions && (
        <BackendInstructions />
      )}
    </div>
  )
}
