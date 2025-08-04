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

      if (connected) {
        alert('✅ Backend conectado com sucesso!\n\n' +
              '🔗 URL: http://localhost:8080/api/health\n' +
              '📚 Agora você pode usar todas as funcionalidades.')
        setLastError(null)
      } else {
        setLastError('Backend não responde na porta 8080')
        alert('❌ Backend não está rodando!\n\n' +
              '💡 Para iniciar o backend:\n' +
              '1. Abra um terminal\n' +
              '2. Execute: cd backend && mvn spring-boot:run\n' +
              '3. Aguarde a mensagem "Started SistemaAvaliacoesApplication"')
      }
    } catch (error) {
      setIsConnected(false)
      const errorMsg = error instanceof Error ? error.message : 'Erro desconhecido'
      setLastError(errorMsg)

      alert('⚠️ Erro ao testar conexão!\n\n' +
            `Detalhes: ${errorMsg}\n\n` +
            'Verifique se o backend está rodando na porta 8080.')
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
