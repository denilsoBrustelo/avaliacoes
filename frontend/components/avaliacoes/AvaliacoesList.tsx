'use client'

import { useState, useEffect } from 'react'
import { AvaliacaoApiService, apiClient } from '@/lib/api'
import { Plus, Edit, Eye, Search, Filter, FileText, Users, CheckCircle, XCircle, Clock } from 'lucide-react'
import ErrorFallback from '../error/ErrorFallback'

interface AvaliacoesListProps {
  onEdit?: (avaliacao: any) => void
  onView?: (avaliacao: any) => void
  onNew?: () => void
}

export default function AvaliacoesList({ onEdit, onView, onNew }: AvaliacoesListProps) {
  const [avaliacoes, setAvaliacoes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('ALL')
  const [statistics, setStatistics] = useState<any>(null)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Try to load data directly - let the API calls handle the errors
      const [avaliacoesData, statsData] = await Promise.all([
        AvaliacaoApiService.getAll(),
        AvaliacaoApiService.getStatistics()
      ])

      setAvaliacoes(avaliacoesData)
      setStatistics(statsData)
    } catch (error) {
      console.warn('Backend não acessível. Usando dados de fallback.')
      setError(new Error('Backend não está acessível. Verifique se o servidor está rodando na porta 8080.'))
      // Set fallback empty data
      setAvaliacoes([])
      setStatistics({
        totalAvaliacoes: 0,
        avaliacoesAprovadas: 0,
        avaliacoesPendentes: 0,
        avaliacoesCanceladas: 0
      })
    } finally {
      setLoading(false)
    }
  }

  const filteredAvaliacoes = avaliacoes.filter(avaliacao => {
    const matchesSearch = avaliacao.instrucao?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         avaliacao.tipoAvaliacao?.descricao?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = filterStatus === 'ALL' || 
                         (filterStatus === 'PENDENTE' && avaliacao.statusAvaliacao === 0) ||
                         (filterStatus === 'APROVADO' && avaliacao.statusAvaliacao === 1) ||
                         (filterStatus === 'CANCELADO' && avaliacao.statusAvaliacao === 2)
    
    return matchesSearch && matchesStatus
  })

  const getStatusIcon = (status: number) => {
    switch (status) {
      case 1:
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 2:
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <Clock className="h-4 w-4 text-orange-500" />
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

  const truncateText = (text: string, maxLength: number = 100) => {
    if (!text) return '-'
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + '...'
  }

  const handleAprovar = async (id: number) => {
    try {
      await AvaliacaoApiService.approve(id)
      loadData()
    } catch (error) {
      console.error('Erro ao aprovar avaliação:', error)
    }
  }

  const handleCancelar = async (id: number) => {
    try {
      await AvaliacaoApiService.cancel(id)
      loadData()
    } catch (error) {
      console.error('Erro ao cancelar avaliação:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <ErrorFallback
        error={error}
        onRetry={loadData}
        title="Erro ao carregar avaliações"
        message="Não foi possível conectar ao backend."
      />
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Avaliações</h2>
          <p className="text-gray-600">Gerencie todas as avaliações do sistema</p>
        </div>
        <button
          onClick={onNew}
          className="btn-primary flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nova Avaliação
        </button>
      </div>

      {/* Statistics */}
      {statistics && (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-4">
          <div className="card">
            <div className="card-content">
              <div className="flex items-center">
                <FileText className="h-8 w-8 text-blue-500" />
                <div className="ml-4">
                  <div className="text-2xl font-bold text-gray-900">{statistics.totalAvaliacoes}</div>
                  <div className="text-sm text-gray-500">Total</div>
                </div>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="card-content">
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-green-500" />
                <div className="ml-4">
                  <div className="text-2xl font-bold text-gray-900">{statistics.avaliacoesAprovadas}</div>
                  <div className="text-sm text-gray-500">Aprovadas</div>
                </div>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="card-content">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-orange-500" />
                <div className="ml-4">
                  <div className="text-2xl font-bold text-gray-900">{statistics.avaliacoesPendentes}</div>
                  <div className="text-sm text-gray-500">Pendentes</div>
                </div>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="card-content">
              <div className="flex items-center">
                <XCircle className="h-8 w-8 text-red-500" />
                <div className="ml-4">
                  <div className="text-2xl font-bold text-gray-900">{statistics.avaliacoesCanceladas}</div>
                  <div className="text-sm text-gray-500">Canceladas</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar avaliações..."
            className="input-field pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <select
          className="input-field"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="ALL">Todos os status</option>
          <option value="PENDENTE">Pendente</option>
          <option value="APROVADO">Aprovado</option>
          <option value="CANCELADO">Cancelado</option>
        </select>
      </div>

      {/* Evaluations List */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Avaliação
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Responsável
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Criação
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAvaliacoes.map((avaliacao) => (
                <tr key={avaliacao.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="max-w-md">
                      <div className="text-sm font-medium text-gray-900 mb-1">
                        {avaliacao.tipoAvaliacao?.descricao || 'Sem tipo'}
                      </div>
                      <div className="text-xs text-gray-500">
                        {truncateText(avaliacao.instrucao)}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {avaliacao.tipoAvaliacao?.descricao || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {avaliacao.responsavel?.nome || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getStatusIcon(avaliacao.statusAvaliacao)}
                      <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(avaliacao.statusAvaliacao)}`}>
                        {getStatusLabel(avaliacao.statusAvaliacao)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(avaliacao.dataCadastro).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => onView?.(avaliacao)}
                        className="text-gray-600 hover:text-gray-900 p-1"
                        title="Visualizar"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onEdit?.(avaliacao)}
                        className="text-primary-600 hover:text-primary-900 p-1"
                        title="Editar"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      {avaliacao.statusAvaliacao === 0 && (
                        <button
                          onClick={() => handleAprovar(avaliacao.id)}
                          className="text-green-600 hover:text-green-900 p-1"
                          title="Aprovar"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </button>
                      )}
                      {avaliacao.statusAvaliacao !== 2 && (
                        <button
                          onClick={() => handleCancelar(avaliacao.id)}
                          className="text-red-600 hover:text-red-900 p-1"
                          title="Cancelar"
                        >
                          <XCircle className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredAvaliacoes.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">Nenhuma avaliação encontrada</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
