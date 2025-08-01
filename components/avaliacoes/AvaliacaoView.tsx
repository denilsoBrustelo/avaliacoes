'use client'

import { useState, useEffect } from 'react'
import { AvaliacaoApiService, ParticipanteApiService } from '@/lib/api'
import { X, Edit, FileText, Users, Calendar, CheckCircle, XCircle, Clock, User } from 'lucide-react'

interface AvaliacaoViewProps {
  avaliacao: any | null
  isOpen: boolean
  onClose: () => void
  onEdit: (avaliacao: any) => void
}

export default function AvaliacaoView({ avaliacao, isOpen, onClose, onEdit }: AvaliacaoViewProps) {
  const [questoes, setQuestoes] = useState<any[]>([])
  const [participantes, setParticipantes] = useState<any[]>([])
  const [statistics, setStatistics] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isOpen && avaliacao?.id) {
      loadAvaliacaoDetails()
    }
  }, [isOpen, avaliacao])

  const loadAvaliacaoDetails = async () => {
    if (!avaliacao?.id) return

    try {
      setLoading(true)
      const [questoesData, participantesData, statsData] = await Promise.all([
        AvaliacaoApiService.getQuestions(avaliacao.id),
        ParticipanteApiService.getByEvaluation(avaliacao.id),
        ParticipanteApiService.getStatisticsByEvaluation(avaliacao.id)
      ])
      
      setQuestoes(questoesData)
      setParticipantes(participantesData)
      setStatistics(statsData)
    } catch (error) {
      console.error('Erro ao carregar detalhes da avaliação:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: number) => {
    switch (status) {
      case 1:
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 2:
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return <Clock className="h-5 w-5 text-orange-500" />
    }
  }

  const getStatusLabel = (status: number) => {
    switch (status) {
      case 1:
        return 'Aprovado'
      case 2:
        return 'Cancelado'
      default:
        return 'Pendente'
    }
  }

  const getStatusColor = (status: number) => {
    switch (status) {
      case 1:
        return 'bg-green-100 text-green-800'
      case 2:
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-orange-100 text-orange-800'
    }
  }

  const getParticipantStatusLabel = (status: number) => {
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

  const getParticipantStatusColor = (status: number) => {
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

  const handleEdit = () => {
    if (avaliacao) {
      onEdit(avaliacao)
      onClose()
    }
  }

  if (!isOpen || !avaliacao) return null

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-10 mx-auto p-5 border w-full max-w-6xl shadow-lg rounded-md bg-white">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <FileText className="h-6 w-6 text-primary-600 mr-3" />
            <div>
              <h3 className="text-lg font-medium text-gray-900">Visualizar Avaliação</h3>
              <p className="text-sm text-gray-500">ID: {avaliacao.id}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleEdit}
              className="btn-secondary flex items-center"
            >
              <Edit className="h-4 w-4 mr-2" />
              Editar
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Status Badge */}
        <div className="mb-6">
          <div className="flex items-center">
            {getStatusIcon(avaliacao.statusAvaliacao)}
            <span className={`ml-2 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(avaliacao.statusAvaliacao)}`}>
              {getStatusLabel(avaliacao.statusAvaliacao)}
            </span>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Informações básicas */}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <div className="card">
                <div className="card-header">
                  <h4 className="text-md font-medium">Informações Gerais</h4>
                </div>
                <div className="card-content space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500">Tipo:</span>
                    <span className="text-sm text-gray-900">{avaliacao.tipoAvaliacao?.descricao || 'Não informado'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500">Responsável:</span>
                    <span className="text-sm text-gray-900">{avaliacao.responsavel?.nome || 'Não informado'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500">Data de Criação:</span>
                    <span className="text-sm text-gray-900">
                      {new Date(avaliacao.dataCadastro).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                </div>
              </div>

              {statistics && (
                <div className="card">
                  <div className="card-header">
                    <h4 className="text-md font-medium">Estatísticas</h4>
                  </div>
                  <div className="card-content space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-500">Total de Participantes:</span>
                      <span className="text-sm text-gray-900">{statistics.totalParticipantes}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-500">Pendentes:</span>
                      <span className="text-sm text-gray-900">{statistics.pendentes}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-500">Em Andamento:</span>
                      <span className="text-sm text-gray-900">{statistics.emAndamento}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-500">Concluídos:</span>
                      <span className="text-sm text-gray-900">{statistics.concluidos}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Instruções */}
            {avaliacao.instrucao && (
              <div className="card">
                <div className="card-header">
                  <h4 className="text-md font-medium">Instruções</h4>
                </div>
                <div className="card-content">
                  <p className="text-gray-900 leading-relaxed whitespace-pre-wrap">
                    {avaliacao.instrucao}
                  </p>
                </div>
              </div>
            )}

            {/* Questões */}
            <div className="card">
              <div className="card-header">
                <h4 className="text-md font-medium">Questões ({questoes.length})</h4>
              </div>
              <div className="card-content">
                {questoes.length > 0 ? (
                  <div className="space-y-4">
                    {questoes.map((questao, index) => (
                      <div key={questao.id} className="border-l-4 border-primary-500 pl-4 py-2">
                        <div className="flex items-start space-x-3">
                          <div className="text-sm font-medium text-primary-600">
                            {index + 1}.
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">
                              {questao.pergunta}
                            </p>
                            <div className="flex items-center space-x-4 mt-1">
                              <span className="text-xs text-gray-500">
                                {questao.disciplina?.descricao || 'Sem disciplina'}
                              </span>
                              <span className="text-xs text-gray-500">
                                {questao.nivelDificuldade?.descricao || 'Sem nível'}
                              </span>
                              {questao.pontuacao && (
                                <span className="text-xs text-gray-500">
                                  {questao.pontuacao} pts
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">Nenhuma questão adicionada a esta avaliação</p>
                )}
              </div>
            </div>

            {/* Participantes */}
            <div className="card">
              <div className="card-header">
                <h4 className="text-md font-medium">Participantes ({participantes.length})</h4>
              </div>
              <div className="card-content">
                {participantes.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                            Aluno
                          </th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                            Escola/Turma
                          </th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                            Status
                          </th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                            Data Início
                          </th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                            Avaliado
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {participantes.map((participante) => (
                          <tr key={participante.id}>
                            <td className="px-4 py-2 text-sm text-gray-900">
                              {participante.usuario?.nome || 'Nome não disponível'}
                            </td>
                            <td className="px-4 py-2 text-sm text-gray-500">
                              {participante.escola && participante.turma 
                                ? `${participante.escola} - ${participante.turma}`
                                : participante.escola || participante.turma || '-'
                              }
                            </td>
                            <td className="px-4 py-2">
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getParticipantStatusColor(participante.statusAplicacao)}`}>
                                {getParticipantStatusLabel(participante.statusAplicacao)}
                              </span>
                            </td>
                            <td className="px-4 py-2 text-sm text-gray-500">
                              {participante.dataInicio 
                                ? new Date(participante.dataInicio).toLocaleDateString('pt-BR')
                                : '-'
                              }
                            </td>
                            <td className="px-4 py-2">
                              {participante.avaliado ? (
                                <CheckCircle className="h-4 w-4 text-green-500" />
                              ) : (
                                <XCircle className="h-4 w-4 text-gray-400" />
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-gray-500">Nenhum participante cadastrado para esta avaliação</p>
                )}
              </div>
            </div>

            {/* Metadados */}
            <div className="card">
              <div className="card-header">
                <h4 className="text-md font-medium">Informações do Sistema</h4>
              </div>
              <div className="card-content">
                <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>Criado em: {new Date(avaliacao.dataCadastro).toLocaleDateString('pt-BR')}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <FileText className="h-4 w-4 mr-2" />
                    <span>ID da avaliação: {avaliacao.id}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <User className="h-4 w-4 mr-2" />
                    <span>Responsável: {avaliacao.responsavel?.nome || 'Não informado'}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="h-4 w-4 mr-2" />
                    <span>Questões: {questoes.length}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end space-x-3 pt-6 border-t mt-6">
          <button
            onClick={onClose}
            className="btn-secondary"
          >
            Fechar
          </button>
          <button
            onClick={handleEdit}
            className="btn-primary flex items-center"
          >
            <Edit className="h-4 w-4 mr-2" />
            Editar Avaliação
          </button>
        </div>
      </div>
    </div>
  )
}
