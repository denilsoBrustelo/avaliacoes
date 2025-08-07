'use client'

import { useAuth } from '@/contexts/AuthContext'
import { UserRole } from '@/types'
import { 
  Users, 
  FileText, 
  BookOpen, 
  CheckCircle, 
  Clock, 
  TrendingUp,
  AlertCircle 
} from 'lucide-react'

interface StatCard {
  title: string
  value: string
  change?: string
  changeType?: 'positive' | 'negative' | 'neutral'
  icon: React.ComponentType<any>
  color: string
}

interface DashboardProps {
  onPageChange?: (page: string) => void
}

export default function Dashboard({ onPageChange }: DashboardProps) {
  const { user, hasRole } = useAuth()

  // Dados mockados para estatísticas
  const adminStats: StatCard[] = [
    {
      title: 'Total de Usuários',
      value: '1,247',
      change: '+12%',
      changeType: 'positive',
      icon: Users,
      color: 'bg-blue-500'
    },
    {
      title: 'Questões Cadastradas',
      value: '3,891',
      change: '+18%',
      changeType: 'positive',
      icon: FileText,
      color: 'bg-green-500'
    },
    {
      title: 'Avaliações Ativas',
      value: '156',
      change: '+5%',
      changeType: 'positive',
      icon: BookOpen,
      color: 'bg-purple-500'
    },
    {
      title: 'Avaliações Concluídas',
      value: '2,341',
      change: '+23%',
      changeType: 'positive',
      icon: CheckCircle,
      color: 'bg-indigo-500'
    }
  ]

  const professorStats: StatCard[] = [
    {
      title: 'Minhas Questões',
      value: '234',
      change: '+8%',
      changeType: 'positive',
      icon: FileText,
      color: 'bg-green-500'
    },
    {
      title: 'Avaliações Criadas',
      value: '42',
      change: '+3%',
      changeType: 'positive',
      icon: BookOpen,
      color: 'bg-purple-500'
    },
    {
      title: 'Pendentes Correção',
      value: '18',
      change: '-5%',
      changeType: 'negative',
      icon: Clock,
      color: 'bg-orange-500'
    },
    {
      title: 'Taxa de Aprovação',
      value: '78%',
      change: '+12%',
      changeType: 'positive',
      icon: TrendingUp,
      color: 'bg-blue-500'
    }
  ]

  const alunoStats: StatCard[] = [
    {
      title: 'Provas Disponíveis',
      value: '5',
      icon: BookOpen,
      color: 'bg-green-500'
    },
    {
      title: 'Provas Realizadas',
      value: '28',
      icon: CheckCircle,
      color: 'bg-blue-500'
    },
    {
      title: 'Aguardando Resultado',
      value: '3',
      icon: Clock,
      color: 'bg-orange-500'
    },
    {
      title: 'Média Geral',
      value: '8.5',
      change: '+0.3',
      changeType: 'positive',
      icon: TrendingUp,
      color: 'bg-purple-500'
    }
  ]

  const getStats = () => {
    if (hasRole(UserRole.ADMIN)) return adminStats
    if (hasRole(UserRole.PROFESSOR)) return professorStats
    return alunoStats
  }

  const getRoleTitle = () => {
    if (hasRole(UserRole.ADMIN)) return 'Painel Administrativo'
    if (hasRole(UserRole.PROFESSOR)) return 'Painel do Professor'
    return 'Painel do Aluno'
  }

  const getWelcomeMessage = () => {
    if (hasRole(UserRole.ADMIN)) return 'Visão geral do sistema e estatísticas gerais'
    if (hasRole(UserRole.PROFESSOR)) return 'Gerencie suas questões e avaliações'
    return 'Suas avaliações e resultados'
  }

  const stats = getStats()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{getRoleTitle()}</h1>
        <p className="mt-1 text-sm text-gray-600">
          Bem-vindo, {user?.nome}! {getWelcomeMessage()}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div key={index} className="card">
              <div className="card-content">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className={`${stat.color} p-3 rounded-md`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        {stat.title}
                      </dt>
                      <dd className="flex items-baseline">
                        <div className="text-2xl font-semibold text-gray-900">
                          {stat.value}
                        </div>
                        {stat.change && (
                          <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                            stat.changeType === 'positive' ? 'text-green-600' : 
                            stat.changeType === 'negative' ? 'text-red-600' : 
                            'text-gray-600'
                          }`}>
                            {stat.change}
                          </div>
                        )}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* Ações Rápidas */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium">Ações Rápidas</h3>
          </div>
          <div className="card-content">
            <div className="space-y-3">
              {hasRole(UserRole.ADMIN) && (
                <>
                  <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center">
                      <Users className="h-5 w-5 text-blue-500 mr-3" />
                      <div>
                        <p className="font-medium">Gerenciar Usuários</p>
                        <p className="text-sm text-gray-500">Adicionar e editar usuários</p>
                      </div>
                    </div>
                  </button>
                  <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center">
                      <FileText className="h-5 w-5 text-green-500 mr-3" />
                      <div>
                        <p className="font-medium">Banco de Questões</p>
                        <p className="text-sm text-gray-500">Visualizar todas as questões</p>
                      </div>
                    </div>
                  </button>
                </>
              )}
              
              {hasRole(UserRole.PROFESSOR) && (
                <>
                  <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center">
                      <FileText className="h-5 w-5 text-green-500 mr-3" />
                      <div>
                        <p className="font-medium">Nova Questão</p>
                        <p className="text-sm text-gray-500">Criar uma nova questão</p>
                      </div>
                    </div>
                  </button>
                  <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center">
                      <BookOpen className="h-5 w-5 text-purple-500 mr-3" />
                      <div>
                        <p className="font-medium">Nova Avaliação</p>
                        <p className="text-sm text-gray-500">Criar uma nova avaliação</p>
                      </div>
                    </div>
                  </button>
                </>
              )}

              {hasRole(UserRole.ALUNO) && (
                <>
                  <button
                    onClick={() => onPageChange?.('minhas-provas')}
                    className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center">
                      <BookOpen className="h-5 w-5 text-green-500 mr-3" />
                      <div>
                        <p className="font-medium">Minhas Provas</p>
                        <p className="text-sm text-gray-500">Ver e realizar avaliações</p>
                      </div>
                    </div>
                  </button>
                  <button
                    onClick={() => onPageChange?.('minhas-provas')}
                    className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-blue-500 mr-3" />
                      <div>
                        <p className="font-medium">Ver Resultados</p>
                        <p className="text-sm text-gray-500">Consultar notas e histórico</p>
                      </div>
                    </div>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Atividades Recentes */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium">Atividades Recentes</h3>
          </div>
          <div className="card-content">
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-gray-900">
                    Avaliação "Matemática - 1º Bimestre" foi concluída
                  </p>
                  <p className="text-xs text-gray-500">2 horas atrás</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <FileText className="h-5 w-5 text-blue-500" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-gray-900">
                    15 novas questões foram aprovadas
                  </p>
                  <p className="text-xs text-gray-500">1 dia atrás</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-orange-500" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-gray-900">
                    3 questões precisam de revisão
                  </p>
                  <p className="text-xs text-gray-500">2 dias atrás</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
