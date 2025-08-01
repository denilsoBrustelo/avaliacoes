'use client'

import { useState, useEffect } from 'react'
import { 
  UsuarioApiService, 
  QuestaoApiService, 
  AvaliacaoApiService,
  RespostaApiService,
  ParticipanteApiService 
} from '@/lib/api'
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  FileText, 
  Download, 
  Calendar,
  PieChart,
  Activity
} from 'lucide-react'

export default function RelatoriosPage() {
  const [dashboardData, setDashboardData] = useState<any>(null)
  const [selectedReport, setSelectedReport] = useState<string>('geral')
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState({
    inicio: '',
    fim: ''
  })

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      const [
        usuarioStats,
        questaoStats,
        avaliacaoStats
      ] = await Promise.all([
        UsuarioApiService.getStatistics(),
        QuestaoApiService.getStatistics(),
        AvaliacaoApiService.getStatistics()
      ])

      setDashboardData({
        usuarios: usuarioStats,
        questoes: questaoStats,
        avaliacoes: avaliacaoStats
      })
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  const exportarRelatorio = (tipo: string) => {
    // Implementar exportação para PDF/Excel
    console.log(`Exportando relatório: ${tipo}`)
    alert(`Funcionalidade de exportação em desenvolvimento para: ${tipo}`)
  }

  const reports = [
    {
      id: 'geral',
      title: 'Relatório Geral',
      description: 'Visão geral do sistema',
      icon: BarChart3
    },
    {
      id: 'usuarios',
      title: 'Relatório de Usuários',
      description: 'Estatísticas de usuários',
      icon: Users
    },
    {
      id: 'questoes',
      title: 'Relatório de Questões',
      description: 'Análise do banco de questões',
      icon: FileText
    },
    {
      id: 'avaliacoes',
      title: 'Relatório de Avaliações',
      description: 'Desempenho das avaliações',
      icon: Activity
    },
    {
      id: 'desempenho',
      title: 'Relatório de Desempenho',
      description: 'Análise de resultados',
      icon: TrendingUp
    }
  ]

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Relatórios e Análises</h2>
          <p className="text-gray-600">Dashboard executivo e relatórios detalhados</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <input
              type="date"
              value={dateRange.inicio}
              onChange={(e) => setDateRange(prev => ({ ...prev, inicio: e.target.value }))}
              className="input-field text-sm"
            />
            <span className="text-gray-500">até</span>
            <input
              type="date"
              value={dateRange.fim}
              onChange={(e) => setDateRange(prev => ({ ...prev, fim: e.target.value }))}
              className="input-field text-sm"
            />
          </div>
          <button
            onClick={() => exportarRelatorio(selectedReport)}
            className="btn-primary flex items-center"
          >
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </button>
        </div>
      </div>

      {/* Dashboard Cards */}
      {dashboardData && (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="card">
            <div className="card-content">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-500" />
                <div className="ml-4">
                  <div className="text-2xl font-bold text-gray-900">
                    {dashboardData.usuarios?.totalUsuarios || 0}
                  </div>
                  <div className="text-sm text-gray-500">Total de Usuários</div>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-content">
              <div className="flex items-center">
                <FileText className="h-8 w-8 text-green-500" />
                <div className="ml-4">
                  <div className="text-2xl font-bold text-gray-900">
                    {dashboardData.questoes?.totalQuestoes || 0}
                  </div>
                  <div className="text-sm text-gray-500">Questões Cadastradas</div>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-content">
              <div className="flex items-center">
                <Activity className="h-8 w-8 text-purple-500" />
                <div className="ml-4">
                  <div className="text-2xl font-bold text-gray-900">
                    {dashboardData.avaliacoes?.totalAvaliacoes || 0}
                  </div>
                  <div className="text-sm text-gray-500">Avaliações Criadas</div>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-content">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-orange-500" />
                <div className="ml-4">
                  <div className="text-2xl font-bold text-gray-900">
                    {((dashboardData.questoes?.questoesAprovadas || 0) / (dashboardData.questoes?.totalQuestoes || 1) * 100).toFixed(1)}%
                  </div>
                  <div className="text-sm text-gray-500">Taxa de Aprovação</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Menu de Relatórios */}
        <div className="lg:col-span-1">
          <div className="card">
            <div className="card-header">
              <h3 className="text-md font-medium">Tipos de Relatório</h3>
            </div>
            <div className="card-content p-0">
              <nav className="space-y-1">
                {reports.map((report) => {
                  const Icon = report.icon
                  return (
                    <button
                      key={report.id}
                      onClick={() => setSelectedReport(report.id)}
                      className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors ${
                        selectedReport === report.id ? 'bg-primary-50 border-r-2 border-primary-500' : ''
                      }`}
                    >
                      <div className="flex items-center">
                        <Icon className={`h-5 w-5 mr-3 ${
                          selectedReport === report.id ? 'text-primary-600' : 'text-gray-400'
                        }`} />
                        <div>
                          <div className={`text-sm font-medium ${
                            selectedReport === report.id ? 'text-primary-900' : 'text-gray-900'
                          }`}>
                            {report.title}
                          </div>
                          <div className="text-xs text-gray-500">
                            {report.description}
                          </div>
                        </div>
                      </div>
                    </button>
                  )
                })}
              </nav>
            </div>
          </div>
        </div>

        {/* Conteúdo do Relatório */}
        <div className="lg:col-span-3">
          {selectedReport === 'geral' && (
            <div className="space-y-6">
              <div className="card">
                <div className="card-header">
                  <h3 className="text-lg font-medium">Visão Geral do Sistema</h3>
                </div>
                <div className="card-content">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Estatísticas de Usuários */}
                    <div>
                      <h4 className="text-md font-medium mb-4">Distribuiç��o de Usuários</h4>
                      {dashboardData?.usuarios && (
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Administradores:</span>
                            <span className="text-sm font-medium">{dashboardData.usuarios.totalAdmins}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Professores:</span>
                            <span className="text-sm font-medium">{dashboardData.usuarios.totalProfessores}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Alunos:</span>
                            <span className="text-sm font-medium">{dashboardData.usuarios.totalAlunos}</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Estatísticas de Questões */}
                    <div>
                      <h4 className="text-md font-medium mb-4">Status das Questões</h4>
                      {dashboardData?.questoes && (
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Pendentes:</span>
                            <span className="text-sm font-medium text-orange-600">
                              {dashboardData.questoes.questoesPendentes}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Aprovadas:</span>
                            <span className="text-sm font-medium text-green-600">
                              {dashboardData.questoes.questoesAprovadas}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Canceladas:</span>
                            <span className="text-sm font-medium text-red-600">
                              {dashboardData.questoes.questoesCanceladas}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Gráfico de Atividade */}
              <div className="card">
                <div className="card-header">
                  <h3 className="text-lg font-medium">Atividade Recente</h3>
                </div>
                <div className="card-content">
                  <div className="text-center py-12 text-gray-500">
                    <PieChart className="mx-auto h-12 w-12 mb-4" />
                    <p>Gráficos de atividade em desenvolvimento</p>
                    <p className="text-sm">Aqui serão exibidos gráficos de linha temporal, pizza e barras</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {selectedReport === 'usuarios' && (
            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-medium">Relatório Detalhado de Usuários</h3>
              </div>
              <div className="card-content">
                {dashboardData?.usuarios ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">
                          {dashboardData.usuarios.totalAdmins}
                        </div>
                        <div className="text-sm text-blue-800">Administradores</div>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">
                          {dashboardData.usuarios.totalProfessores}
                        </div>
                        <div className="text-sm text-green-800">Professores</div>
                      </div>
                      <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">
                          {dashboardData.usuarios.totalAlunos}
                        </div>
                        <div className="text-sm text-purple-800">Alunos</div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-3">Análise de Crescimento</h4>
                      <div className="text-gray-500 text-center py-8">
                        <BarChart3 className="mx-auto h-12 w-12 mb-2" />
                        <p>Gráfico de crescimento de usuários por período</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    Carregando dados de usuários...
                  </div>
                )}
              </div>
            </div>
          )}

          {selectedReport === 'questoes' && (
            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-medium">Relatório do Banco de Questões</h3>
              </div>
              <div className="card-content">
                {dashboardData?.questoes ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-orange-50 rounded-lg">
                        <div className="text-2xl font-bold text-orange-600">
                          {dashboardData.questoes.questoesPendentes}
                        </div>
                        <div className="text-sm text-orange-800">Pendentes</div>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">
                          {dashboardData.questoes.questoesAprovadas}
                        </div>
                        <div className="text-sm text-green-800">Aprovadas</div>
                      </div>
                      <div className="text-center p-4 bg-red-50 rounded-lg">
                        <div className="text-2xl font-bold text-red-600">
                          {dashboardData.questoes.questoesCanceladas}
                        </div>
                        <div className="text-sm text-red-800">Canceladas</div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-3">Distribuição por Disciplina</h4>
                      <div className="text-gray-500 text-center py-8">
                        <PieChart className="mx-auto h-12 w-12 mb-2" />
                        <p>Gráfico de questões por disciplina</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    Carregando dados de questões...
                  </div>
                )}
              </div>
            </div>
          )}

          {selectedReport === 'avaliacoes' && (
            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-medium">Relatório de Avaliações</h3>
              </div>
              <div className="card-content">
                {dashboardData?.avaliacoes ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-orange-50 rounded-lg">
                        <div className="text-2xl font-bold text-orange-600">
                          {dashboardData.avaliacoes.avaliacoesPendentes}
                        </div>
                        <div className="text-sm text-orange-800">Pendentes</div>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">
                          {dashboardData.avaliacoes.avaliacoesAprovadas}
                        </div>
                        <div className="text-sm text-green-800">Aprovadas</div>
                      </div>
                      <div className="text-center p-4 bg-red-50 rounded-lg">
                        <div className="text-2xl font-bold text-red-600">
                          {dashboardData.avaliacoes.avaliacoesCanceladas}
                        </div>
                        <div className="text-sm text-red-800">Canceladas</div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-3">Performance das Avaliações</h4>
                      <div className="text-gray-500 text-center py-8">
                        <BarChart3 className="mx-auto h-12 w-12 mb-2" />
                        <p>Gráfico de performance por tipo de avaliação</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    Carregando dados de avaliações...
                  </div>
                )}
              </div>
            </div>
          )}

          {selectedReport === 'desempenho' && (
            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-medium">Relatório de Desempenho</h3>
              </div>
              <div className="card-content">
                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium mb-3">Métricas de Desempenho</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <div className="text-lg font-bold text-blue-600">85.5%</div>
                        <div className="text-sm text-blue-800">Taxa Média de Acerto</div>
                      </div>
                      <div className="p-4 bg-green-50 rounded-lg">
                        <div className="text-lg font-bold text-green-600">12 min</div>
                        <div className="text-sm text-green-800">Tempo Médio por Questão</div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-3">Análise Temporal</h4>
                    <div className="text-gray-500 text-center py-8">
                      <TrendingUp className="mx-auto h-12 w-12 mb-2" />
                      <p>Gráfico de evolução do desempenho ao longo do tempo</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
