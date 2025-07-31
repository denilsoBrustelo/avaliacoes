'use client'

import { useAuth } from '@/contexts/AuthContext'
import { UserRole } from '@/types'
import { LogOut, User, Settings, BookOpen, FileText, Users, BarChart3 } from 'lucide-react'

export default function Navbar() {
  const { user, logout, hasRole } = useAuth()

  const navigation = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: BarChart3,
      show: true
    },
    {
      name: 'Usuários',
      href: '/usuarios',
      icon: Users,
      show: hasRole(UserRole.ADMIN)
    },
    {
      name: 'Questões',
      href: '/questoes',
      icon: FileText,
      show: hasRole(UserRole.ADMIN) || hasRole(UserRole.PROFESSOR)
    },
    {
      name: 'Avaliações',
      href: '/avaliacoes',
      icon: BookOpen,
      show: hasRole(UserRole.ADMIN) || hasRole(UserRole.PROFESSOR)
    },
    {
      name: 'Minhas Provas',
      href: '/minhas-provas',
      icon: BookOpen,
      show: hasRole(UserRole.ALUNO)
    },
    {
      name: 'Configurações',
      href: '/configuracoes',
      icon: Settings,
      show: hasRole(UserRole.ADMIN)
    }
  ]

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-xl font-bold text-gray-900">
                Sistema de Avaliações
              </h1>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navigation.filter(item => item.show).map((item) => {
                const Icon = item.icon
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                  >
                    <Icon className="h-4 w-4 mr-1" />
                    {item.name}
                  </a>
                )
              })}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5 text-gray-400" />
              <span className="text-sm text-gray-700">{user?.nome}</span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                {user?.roles[0]?.replace('ROLE_', '')}
              </span>
            </div>
            <button
              onClick={logout}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <LogOut className="h-4 w-4 mr-1" />
              Sair
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
