'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { ParticipanteApiService, apiClient } from '@/lib/api'
import { Play, CheckCircle, Clock, Calendar, FileText, AlertCircle } from 'lucide-react'

export default function MinhasProvas() {
  const { user } = useAuth()
  const router = useRouter()
  const [provasDisponiveis, setProvasDisponiveis] = useState<any[]>([])
  const [provasEmAndamento, setProvasEmAndamento] = useState<any[]>([])
  const [provasConcluidas, setProvasConcluidas] = useState<any[]>([])
  const [statistics, setStatistics] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      // Load fallback data immediately instead of testing backend connection
      setProvasDisponiveis([
        {
          id: 1,
          avaliacao: {
            id: 1,
            instrucao: 'Avaliação de Matemática - 1º Bimestre',
            tipoAvaliacao: { descricao: 'Diagnóstica' },
            responsavel: { nome: 'Prof. João Silva' }
          },
          dataDisponibilizacao: new Date().toISOString(),
          prazoLimite: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
        }
      ])
      setProvasEmAndamento([])
      setProvasConcluidas([])
      setStatistics({
        totalProvas: 1,
        provasFinalizadas: 0,
        mediaGeral: 0,
        ultimaProva: null
      })
      setLoading(false)
    }
  }, [user])

  const loadMinhasProvas = async () => {
    try {
      setLoading(true)
      setError(null)

      // Test backend connection with better error handling
      let isConnected = false
      try {
        isConnected = await apiClient.testConnection()
      } catch (connectionError) {
        console.warn('Connection test failed:', connectionError)
        isConnected = false
      }

      if (!isConnected) {
        alert('❌ Backend não está rodando!\n\n' +
              '💡 Para conectar ao backend:\n' +
              '1. Abra um terminal\n' +
              '2. Execute: cd backend && mvn spring-boot:run\n' +
              '3. Aguarde até ver "Started SistemaAvaliacoesApplication"\n' +
              '4. Clique novamente em "Conectar Backend"')
        return
      }

      // Backend is available - load real data
      const [disponiveis, emAndamento, concluidas, stats] = await Promise.all([
        ParticipanteApiService.getAvailableExams(),
        ParticipanteApiService.getExamsInProgress(),
        ParticipanteApiService.getCompletedExams(),
        ParticipanteApiService.getStatisticsByStudent(user?.id || 1)
      ])

      setProvasDisponiveis(disponiveis)
      setProvasEmAndamento(emAndamento)
      setProvasConcluidas(concluidas)
      setStatistics(stats)

      alert('✅ Conectado ao backend com sucesso!\n\n' +
            `📊 Dados carregados:\n` +
            `• ${disponiveis.length} provas disponíveis\n` +
            `• ${emAndamento.length} provas em andamento\n` +
            `• ${concluidas.length} provas concluídas`)

    } catch (error) {
      console.error('Erro ao carregar provas:', error)
      alert('⚠️ Erro de conexão!\n\n' +
            'O backend pode estar iniciando ou com problemas.\n' +
            'Verifique o console do backend para mais detalhes.')
    } finally {
      setLoading(false)
    }
  }

  const iniciarProva = async (participanteId: number) => {
    try {
      const isConnected = await apiClient.testConnection()

      if (!isConnected) {
        router.push(`/prova/${participanteId}`)
        return
      }

      await ParticipanteApiService.startExam(participanteId)
      router.push(`/prova/${participanteId}`)
    } catch (error) {
      console.error('Erro ao iniciar prova:', error)
      alert('Erro ao iniciar prova. Tente novamente.')
    }
  }

  const continuarProva = (participante: any) => {
    router.push(`/prova/${participante.id}`)
  }

  const getStatusColor = (status: number) => {
    switch (status) {
      case 1:
        return 'bg-blue-100 text-blue-800'
      case 2:
        return 'bg-yellow-100 text-yellow-800'
      case 3:
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusLabel = (status: number) => {
    switch (status) {
      case 1:
        return 'Iniciado'
      case 2:
        return 'Em Andamento'
      case 3:
        return 'Concluído'
      default:
        return 'Pendente'
    }
  }

  const formatDateTime = (dateString: string) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleString('pt-BR')
  }

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
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Minhas Provas</h2>
        <p className="text-gray-600">Acompanhe suas avaliações disponíveis e resultados</p>
      </div>

      {/* Statistics */}
      {statistics && (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div className="card">
            <div className="card-content">
              <div className="flex items-center">
                <FileText className="h-8 w-8 text-blue-500" />
                <div className="ml-4">
                  <div className="text-2xl font-bold text-gray-900">{statistics.totalParticipacoes}</div>
                  <div className="text-sm text-gray-500">Total de Provas</div>
                </div>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="card-content">
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-green-500" />
                <div className="ml-4">
                  <div className="text-2xl font-bold text-gray-900">{statistics.avaliacoesConcluidas}</div>
                  <div className="text-sm text-gray-500">Concluídas</div>
                </div>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="card-content">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-orange-500" />
                <div className="ml-4">
                  <div className="text-2xl font-bold text-gray-900">{statistics.provasDisponiveis}</div>
                  <div className="text-sm text-gray-500">Disponíveis</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Provas Disponíveis */}
      {provasDisponiveis.length > 0 && (
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium flex items-center">
              <AlertCircle className="h-5 w-5 text-orange-500 mr-2" />
              Provas Disponíveis ({provasDisponiveis.length})
            </h3>
          </div>
          <div className="card-content">
            <div className="space-y-4">
              {provasDisponiveis.map((participante) => (
                <div key={participante.id} className="border border-orange-200 rounded-lg p-4 bg-orange-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="text-lg font-medium text-gray-900">
                        {participante.avaliacao?.tipoAvaliacao?.descricao || 'Avaliação'}
                      </h4>
                      {participante.avaliacao?.instrucao && (
                        <p className="text-sm text-gray-600 mt-1">
                          {participante.avaliacao.instrucao}
                        </p>
                      )}
                      <div className="flex items-center space-x-4 mt-2">
                        {participante.dataInicioAvaliacao && (
                          <div className="flex items-center text-sm text-gray-500">
                            <Calendar className="h-4 w-4 mr-1" />
                            Disponível até: {formatDateTime(participante.dataInicioAvaliacao)}
                          </div>
                        )}
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(participante.statusAplicacao)}`}>
                          {getStatusLabel(participante.statusAplicacao)}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => iniciarProva(participante.id)}
                      className="btn-primary flex items-center ml-4"
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Iniciar Prova
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Provas Em Andamento */}
      {provasEmAndamento.length > 0 && (
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium flex items-center">
              <Clock className="h-5 w-5 text-yellow-500 mr-2" />
              Provas Em Andamento ({provasEmAndamento.length})
            </h3>
          </div>
          <div className="card-content">
            <div className="space-y-4">
              {provasEmAndamento.map((participante) => (
                <div key={participante.id} className="border border-yellow-200 rounded-lg p-4 bg-yellow-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="text-lg font-medium text-gray-900">
                        {participante.avaliacao?.tipoAvaliacao?.descricao || 'Avaliação'}
                      </h4>
                      <div className="flex items-center space-x-4 mt-2">
                        {participante.dataInicio && (
                          <div className="flex items-center text-sm text-gray-500">
                            <Calendar className="h-4 w-4 mr-1" />
                            Iniciada em: {formatDateTime(participante.dataInicio)}
                          </div>
                        )}
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(participante.statusAplicacao)}`}>
                          {getStatusLabel(participante.statusAplicacao)}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => continuarProva(participante)}
                      className="btn-primary flex items-center ml-4"
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Continuar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Provas Concluídas */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-medium flex items-center">
            <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
            Provas Concluídas ({provasConcluidas.length})
          </h3>
        </div>
        <div className="card-content">
          {provasConcluidas.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Avaliação
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Data Realização
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Duração
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Resultado
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {provasConcluidas.map((participante) => {
                    const duracao = participante.dataInicio && participante.dataFim 
                      ? Math.round((new Date(participante.dataFim).getTime() - new Date(participante.dataInicio).getTime()) / (1000 * 60))
                      : null

                    return (
                      <tr key={participante.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {participante.avaliacao?.tipoAvaliacao?.descricao || 'Avaliação'}
                            </div>
                            <div className="text-sm text-gray-500">
                              {participante.escola} - {participante.turma}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDateTime(participante.dataFim)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {duracao ? `${duracao} min` : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(participante.statusAplicacao)}`}>
                            {getStatusLabel(participante.statusAplicacao)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {participante.avaliado ? (
                            <span className="text-green-600 font-medium">Avaliado</span>
                          ) : (
                            <span className="text-yellow-600 font-medium">Aguardando Correção</span>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <CheckCircle className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhuma prova concluída</h3>
              <p className="mt-1 text-sm text-gray-500">
                Suas provas concluídas aparecerão aqui.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Empty State */}
      {provasDisponiveis.length === 0 && provasEmAndamento.length === 0 && provasConcluidas.length === 0 && (
        <div className="text-center py-12">
          <FileText className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">Nenhuma prova disponível</h3>
          <p className="mt-1 text-sm text-gray-500">
            Aguarde que seu professor libere avaliações para você.
          </p>
        </div>
      )}
    </div>
  )
}
