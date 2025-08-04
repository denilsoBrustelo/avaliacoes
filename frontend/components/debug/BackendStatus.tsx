'use client'

import { useState, useEffect } from 'react'
import { apiClient } from '@/lib/api'
import { CheckCircle, XCircle, Clock } from 'lucide-react'
import BackendInstructions from './BackendInstructions'

export default function BackendStatus() {
  const [isConnected, setIsConnected] = useState<boolean | null>(false)
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

  // Removed automatic connection checking to prevent fetch errors
  // Connection is now only checked when user clicks the "Reconectar" button

  if (isChecking && isConnected === null) {
    return (
      <div className="flex items-center space-x-2 text-sm text-gray-600">
        <Clock className="h-4 w-4 animate-spin" />
        <span>Verificando backend...</span>
      </div>
    )
  }

  return (
    <div className="text-center py-4">
      <div className="inline-flex items-center space-x-3 px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-center space-x-2 text-sm">
          {isConnected ? (
            <>
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-green-700">Backend conectado</span>
            </>
          ) : (
            <>
              <XCircle className="h-4 w-4 text-blue-500" />
              <span className="text-blue-700">Modo Offline</span>
            </>
          )}
        </div>

        <button
          onClick={checkConnection}
          className="text-blue-600 hover:text-blue-800 underline text-sm"
          disabled={isChecking}
        >
          {isChecking ? 'Verificando...' : 'Testar Conexão'}
        </button>

        <button
          onClick={() => setShowInstructions(!showInstructions)}
          className="text-blue-600 hover:text-blue-800 underline text-sm"
        >
          {showInstructions ? 'Ocultar' : 'Ajuda'}
        </button>
      </div>

      {showInstructions && (
        <div className="mt-4">
          <BackendInstructions />
        </div>
      )}
    </div>
  )
}
