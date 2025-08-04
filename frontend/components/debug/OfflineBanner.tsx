'use client'

import { Info } from 'lucide-react'

export default function OfflineBanner() {
  return (
    <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
      <div className="flex">
        <div className="flex-shrink-0">
          <Info className="h-5 w-5 text-blue-400" />
        </div>
        <div className="ml-3">
          <p className="text-sm text-blue-700">
            <strong>Modo Demonstração:</strong> O sistema está funcionando com dados de exemplo. 
            Para funcionalidade completa, inicie o backend Spring Boot.
          </p>
          <p className="text-xs text-blue-600 mt-1">
            Execute: <code className="bg-blue-100 px-1 rounded">cd backend && mvn spring-boot:run</code>
          </p>
        </div>
      </div>
    </div>
  )
}
