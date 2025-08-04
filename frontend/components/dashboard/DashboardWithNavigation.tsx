'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { UserRole } from '@/types'
import Dashboard from './Dashboard'
import UsersPage from '../admin/UsersPage'
import ConfigPage from '../admin/ConfigPage'
import QuestoesPage from '../questoes/QuestoesPage'
import AvaliacoesPage from '../avaliacoes/AvaliacoesPage'

export default function DashboardWithNavigation() {
  const { hasRole } = useAuth()
  const [currentPage, setCurrentPage] = useState('dashboard')

  const renderPage = () => {
    switch (currentPage) {
      case 'usuarios':
        return hasRole(UserRole.ADMIN) ? <UsersPage /> : <Dashboard />
      case 'configuracoes':
        return hasRole(UserRole.ADMIN) ? <ConfigPage /> : <Dashboard />
      case 'questoes':
        return (hasRole(UserRole.ADMIN) || hasRole(UserRole.PROFESSOR)) ? <QuestoesPage /> : <Dashboard />
      default:
        return <Dashboard />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 mb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <button
              onClick={() => setCurrentPage('dashboard')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                currentPage === 'dashboard'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Dashboard
            </button>
            
            {hasRole(UserRole.ADMIN) && (
              <button
                onClick={() => setCurrentPage('usuarios')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  currentPage === 'usuarios'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Usuários
              </button>
            )}

            {(hasRole(UserRole.ADMIN) || hasRole(UserRole.PROFESSOR)) && (
              <button
                onClick={() => setCurrentPage('questoes')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  currentPage === 'questoes'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Questões
              </button>
            )}

            {hasRole(UserRole.ADMIN) && (
              <button
                onClick={() => setCurrentPage('configuracoes')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  currentPage === 'configuracoes'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Configurações
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {renderPage()}
      </div>
    </div>
  )
}
