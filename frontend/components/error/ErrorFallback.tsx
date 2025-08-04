'use client'

import { AlertTriangle, RefreshCw } from 'lucide-react'
import BackendInstructions from '../debug/BackendInstructions'

interface ErrorFallbackProps {
  error?: Error | null
  onRetry?: () => void
  title?: string
  message?: string
}

export default function ErrorFallback({
  error,
  onRetry,
  title = "Backend Desconectado",
  message = "O sistema está funcionando com dados de exemplo. Inicie o backend para funcionalidade completa."
}: ErrorFallbackProps) {
  return (
    <div className="min-h-64 flex items-center justify-center">
      <div className="text-center">
        <AlertTriangle className="h-12 w-12 text-orange-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 mb-4 max-w-md">{message}</p>
        
        {error && (
          <details className="text-left mb-4">
            <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
              Detalhes do erro
            </summary>
            <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
              {error.message}
            </div>
          </details>
        )}
        
        {onRetry && (
          <button
            onClick={onRetry}
            className="btn-primary flex items-center mx-auto"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Tentar Novamente
          </button>
        )}
        
        <BackendInstructions />
      </div>
    </div>
  )
}
