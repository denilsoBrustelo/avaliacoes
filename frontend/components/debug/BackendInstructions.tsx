'use client'

import { Terminal, Play, CheckCircle } from 'lucide-react'

export default function BackendInstructions() {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
      <div className="flex items-start space-x-3">
        <Terminal className="h-6 w-6 text-blue-600 mt-1" />
        <div className="flex-1">
          <h3 className="text-lg font-medium text-blue-900 mb-2">
            Como iniciar o Backend
          </h3>
          
          <div className="space-y-3 text-sm text-blue-800">
            <div className="flex items-start space-x-2">
              <span className="bg-blue-200 text-blue-900 px-2 py-1 rounded text-xs font-mono">1</span>
              <div>
                <p className="font-medium">Abra um terminal no diretório do backend:</p>
                <code className="bg-blue-100 px-2 py-1 rounded text-xs block mt-1">cd backend</code>
              </div>
            </div>
            
            <div className="flex items-start space-x-2">
              <span className="bg-blue-200 text-blue-900 px-2 py-1 rounded text-xs font-mono">2</span>
              <div>
                <p className="font-medium">Execute o Spring Boot:</p>
                <code className="bg-blue-100 px-2 py-1 rounded text-xs block mt-1">mvn spring-boot:run</code>
                <p className="text-xs mt-1 text-blue-600">ou</p>
                <code className="bg-blue-100 px-2 py-1 rounded text-xs block mt-1">./mvnw spring-boot:run</code>
              </div>
            </div>
            
            <div className="flex items-start space-x-2">
              <span className="bg-blue-200 text-blue-900 px-2 py-1 rounded text-xs font-mono">3</span>
              <div>
                <p className="font-medium">Aguarde até ver:</p>
                <code className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs block mt-1">
                  Started SistemaAvaliacoesApplication in X.XXX seconds
                </code>
              </div>
            </div>
            
            <div className="flex items-start space-x-2">
              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
              <div>
                <p className="font-medium text-green-800">Verifique se está funcionando:</p>
                <a 
                  href="http://localhost:8080/api/health" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline text-xs"
                >
                  http://localhost:8080/api/health
                </a>
              </div>
            </div>
          </div>
          
          <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-800">
            <strong>💡 Dica:</strong> Enquanto o backend não estiver rodando, o sistema funcionará com dados de exemplo.
          </div>
        </div>
      </div>
    </div>
  )
}
