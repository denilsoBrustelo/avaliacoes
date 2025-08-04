'use client'

import { AlertTriangle, RefreshCw } from 'lucide-react'

interface ErrorFallbackProps {
  error?: Error | null
  onRetry?: () => void
  title?: string
  message?: string
}

export default function ErrorFallback({ 
  error, 
  onRetry, 
  title = "Ops! Algo deu errado",
  message = "Não foi possível carregar os dados. Verifique se o backend está rodando."
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
        
        <div className="mt-4 text-xs text-gray-500">
          <p>💡 Dicas para resolver:</p>
          <ul className="text-left mt-2 space-y-1">
            <li>• Verifique se o backend está rodando na porta 8080</li>
            <li>• Teste: <code className="bg-gray-100 px-1 rounded">http://localhost:8080/api/health</code></li>
            <li>• Verifique o console do navegador para mais detalhes</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
