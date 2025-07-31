'use client'

import { useState, useEffect } from 'react'
import { Questao, StatusQuestao } from '@/types'
import { QuestaoService, ConfiguracaoService } from '@/lib/services'
import { Plus, Edit, Eye, Search, Filter, FileText, Tag, CheckCircle, XCircle, Clock } from 'lucide-react'

interface QuestoesListProps {
  onEdit?: (questao: Questao) => void
  onView?: (questao: Questao) => void
  onNew?: () => void
}

export default function QuestoesList({ onEdit, onView, onNew }: QuestoesListProps) {
  const [questoes, setQuestoes] = useState<Questao[]>([])
  const [disciplinas, setDisciplinas] = useState<any[]>([])
  const [niveisDificuldades, setNiveisDificuldades] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterDisciplina, setFilterDisciplina] = useState<number | 'ALL'>('ALL')
  const [filterStatus, setFilterStatus] = useState<StatusQuestao | 'ALL'>('ALL')
  const [filterNivel, setFilterNivel] = useState<number | 'ALL'>('ALL')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [questoesData, disciplinasData, niveisData] = await Promise.all([
        QuestaoService.getAll(),
        ConfiguracaoService.getDisciplinas(),
        ConfiguracaoService.getNiveisDificuldades()
      ])
      
      setQuestoes(questoesData)
      setDisciplinas(disciplinasData)
      setNiveisDificuldades(niveisData)
    } catch (error) {
      console.error('Erro ao carregar questões:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredQuestoes = questoes.filter(questao => {
    const matchesSearch = questao.pergunta.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         questao.tema?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         questao.habilidades?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesDisciplina = filterDisciplina === 'ALL' || questao.disciplina_id === filterDisciplina
    const matchesStatus = filterStatus === 'ALL' || questao.status_questao_id === filterStatus
    const matchesNivel = filterNivel === 'ALL' || questao.nivel_dificuldade_id === filterNivel
    
    return matchesSearch && matchesDisciplina && matchesStatus && matchesNivel
  })

  const getStatusIcon = (status: number) => {
    switch (status) {
      case StatusQuestao.APROVADO:
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case StatusQuestao.CANCELADO:
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <Clock className="h-4 w-4 text-orange-500" />
    }
  }

  const getStatusLabel = (status: number) => {
    switch (status) {
      case StatusQuestao.APROVADO:
        return 'Aprovado'
      case StatusQuestao.CANCELADO:
        return 'Cancelado'
      default:
        return 'Pendente'
    }
  }

  const getStatusColor = (status: number) => {
    switch (status) {
      case StatusQuestao.APROVADO:
        return 'bg-green-100 text-green-800'
      case StatusQuestao.CANCELADO:
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-orange-100 text-orange-800'
    }
  }

  const getDisciplinaName = (id?: number) => {
    if (!id) return '-'
    const disciplina = disciplinas.find(d => d.id === id)
    return disciplina?.descricao || '-'
  }

  const getNivelName = (id?: number) => {
    if (!id) return '-'
    const nivel = niveisDificuldades.find(n => n.id === id)
    return nivel?.descricao || '-'
  }

  const truncateText = (text: string, maxLength: number = 100) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + '...'
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
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Banco de Questões</h2>
          <p className="text-gray-600">Gerencie todas as questões do sistema</p>
        </div>
        <button
          onClick={onNew}
          className="btn-primary flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nova Questão
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-4">
        <div className="card">
          <div className="card-content">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">{questoes.length}</div>
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
                <div className="text-2xl font-bold text-gray-900">
                  {questoes.filter(q => q.status_questao_id === StatusQuestao.APROVADO).length}
                </div>
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
                <div className="text-2xl font-bold text-gray-900">
                  {questoes.filter(q => q.status_questao_id === StatusQuestao.PENDENTE).length}
                </div>
                <div className="text-sm text-gray-500">Pendentes</div>
              </div>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="card-content">
            <div className="flex items-center">
              <Tag className="h-8 w-8 text-purple-500" />
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">{disciplinas.length}</div>
                <div className="text-sm text-gray-500">Disciplinas</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar questões..."
            className="input-field pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <select
          className="input-field"
          value={filterDisciplina}
          onChange={(e) => setFilterDisciplina(e.target.value === 'ALL' ? 'ALL' : parseInt(e.target.value))}
        >
          <option value="ALL">Todas as disciplinas</option>
          {disciplinas.map((disciplina) => (
            <option key={disciplina.id} value={disciplina.id}>
              {disciplina.descricao}
            </option>
          ))}
        </select>

        <select
          className="input-field"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value === 'ALL' ? 'ALL' : parseInt(e.target.value) as StatusQuestao)}
        >
          <option value="ALL">Todos os status</option>
          <option value={StatusQuestao.PENDENTE}>Pendente</option>
          <option value={StatusQuestao.APROVADO}>Aprovado</option>
          <option value={StatusQuestao.CANCELADO}>Cancelado</option>
        </select>

        <select
          className="input-field"
          value={filterNivel}
          onChange={(e) => setFilterNivel(e.target.value === 'ALL' ? 'ALL' : parseInt(e.target.value))}
        >
          <option value="ALL">Todos os níveis</option>
          {niveisDificuldades.map((nivel) => (
            <option key={nivel.id} value={nivel.id}>
              {nivel.descricao}
            </option>
          ))}
        </select>
      </div>

      {/* Questions List */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Questão
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Disciplina
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nível
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pontuação
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
              {filteredQuestoes.map((questao) => (
                <tr key={questao.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="max-w-md">
                      <div className="text-sm font-medium text-gray-900 mb-1">
                        {truncateText(questao.pergunta)}
                      </div>
                      {questao.tema && (
                        <div className="flex items-center text-xs text-gray-500">
                          <Tag className="h-3 w-3 mr-1" />
                          {questao.tema}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {getDisciplinaName(questao.disciplina_id)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {getNivelName(questao.nivel_dificuldade_id)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {questao.pontuacao ? `${questao.pontuacao} pts` : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getStatusIcon(questao.status_questao_id)}
                      <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(questao.status_questao_id)}`}>
                        {getStatusLabel(questao.status_questao_id)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(questao.data_cadastro).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => onView?.(questao)}
                        className="text-gray-600 hover:text-gray-900 p-1"
                        title="Visualizar"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onEdit?.(questao)}
                        className="text-primary-600 hover:text-primary-900 p-1"
                        title="Editar"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredQuestoes.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">Nenhuma questão encontrada</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
