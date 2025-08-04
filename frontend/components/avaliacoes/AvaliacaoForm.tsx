'use client'

import { useState, useEffect } from 'react'
import { AvaliacaoApiService, ConfiguracaoApiService, QuestaoApiService, apiClient } from '@/lib/api'
import { X, Save, Plus, Trash2, Search, FileText, XCircle } from 'lucide-react'

interface AvaliacaoFormProps {
  avaliacao?: any | null
  isOpen: boolean
  onClose: () => void
  onSave: () => void
}

export default function AvaliacaoForm({ avaliacao, isOpen, onClose, onSave }: AvaliacaoFormProps) {
  const [formData, setFormData] = useState({
    tipoAvaliacaoId: '',
    instrucao: ''
  })

  const [tiposAvaliacoes, setTiposAvaliacoes] = useState<any[]>([])
  const [questoesDisponiveis, setQuestoesDisponiveis] = useState<any[]>([])
  const [questoesSelecionadas, setQuestoesSelecionadas] = useState<any[]>([])
  const [searchQuestoes, setSearchQuestoes] = useState('')
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (isOpen) {
      // Load fallback data immediately - no backend connection
      setTiposAvaliacoes([
        { id: 1, descricao: 'Diagnóstica' },
        { id: 2, descricao: 'Processual' },
        { id: 3, descricao: 'Final de Ciclo' },
        { id: 4, descricao: 'Certificadora' }
      ])
      setQuestoesDisponiveis([
        {
          id: 1,
          pergunta: 'Qual é o resultado de 5 + 3?',
          tema: 'Adição',
          disciplina: { descricao: 'Matemática' },
          nivelDificuldade: { descricao: 'Fácil' },
          pontuacao: 1.0
        },
        {
          id: 2,
          pergunta: 'Se João tem 15 maçãs e deu 6 para Maria, quantas maçãs João tem agora?',
          tema: 'Subtração',
          disciplina: { descricao: 'Matemática' },
          nivelDificuldade: { descricao: 'Fácil' },
          pontuacao: 1.0
        },
        {
          id: 3,
          pergunta: 'Qual é o sinônimo da palavra "feliz"?',
          tema: 'Sinônimos',
          disciplina: { descricao: 'Português' },
          nivelDificuldade: { descricao: 'Médio' },
          pontuacao: 1.5
        }
      ])
    }
  }, [isOpen])

  // Load data from backend (manual action)
  const connectToBackend = async () => {
    await loadConfiguracoes()
  }

  useEffect(() => {
    if (avaliacao) {
      setFormData({
        tipoAvaliacaoId: avaliacao.tipoAvaliacao?.id?.toString() || '',
        instrucao: avaliacao.instrucao || ''
      })
      loadQuestoesAvaliacao()
    } else {
      setFormData({
        tipoAvaliacaoId: '',
        instrucao: ''
      })
      setQuestoesSelecionadas([])
    }
    setErrors({})
  }, [avaliacao, isOpen])

  const loadConfiguracoes = async () => {
    try {
      console.log('Carregando configurações...')

      const [tipos, questoes] = await Promise.all([
        ConfiguracaoApiService.getTiposAvaliacoes(),
        QuestaoApiService.getApproved()
      ])

      console.log('Dados carregados com sucesso:', { tipos: tipos.length, questoes: questoes.length })

      setTiposAvaliacoes(tipos)
      setQuestoesDisponiveis(questoes)
    } catch (error) {
      console.warn('Backend não acessível. Usando dados de fallback.')
      // Set fallback data
      setTiposAvaliacoes([
        { id: 1, descricao: 'Diagnóstica' },
        { id: 2, descricao: 'Processual' },
        { id: 3, descricao: 'Final de Ciclo' },
        { id: 4, descricao: 'Certificadora' }
      ])
      setQuestoesDisponiveis([
        {
          id: 1,
          pergunta: 'Qual é o resultado de 5 + 3?',
          tema: 'Adição',
          disciplina: { descricao: 'Matemática' },
          nivelDificuldade: { descricao: 'Fácil' },
          pontuacao: 1.0
        },
        {
          id: 2,
          pergunta: 'Se João tem 15 maçãs e deu 6 para Maria, quantas maçãs João tem agora?',
          tema: 'Subtração',
          disciplina: { descricao: 'Matemática' },
          nivelDificuldade: { descricao: 'Fácil' },
          pontuacao: 1.0
        },
        {
          id: 3,
          pergunta: 'Qual é o sinônimo da palavra "feliz"?',
          tema: 'Sinônimos',
          disciplina: { descricao: 'Português' },
          nivelDificuldade: { descricao: 'Médio' },
          pontuacao: 1.5
        }
      ])
    }
  }

  const loadQuestoesAvaliacao = async () => {
    if (avaliacao?.id) {
      try {
        const questoes = await AvaliacaoApiService.getQuestions(avaliacao.id)
        setQuestoesSelecionadas(questoes)
      } catch (error) {
        console.error('Erro ao carregar questões da avaliação:', error)
      }
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.tipoAvaliacaoId) {
      newErrors.tipoAvaliacaoId = 'Tipo de avaliação é obrigatório'
    }

    if (questoesSelecionadas.length === 0) {
      newErrors.questoes = 'Selecione pelo menos uma questão'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    // In offline mode, just show success message
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      alert('Modo Offline: Avaliação simulada criada com sucesso!\n\nPara salvar no backend, conecte-se ao servidor.')
      onClose()
    }, 1000)
  }

  const adicionarQuestao = (questao: any) => {
    if (!questoesSelecionadas.find(q => q.id === questao.id)) {
      setQuestoesSelecionadas([...questoesSelecionadas, questao])
    }
  }

  const removerQuestao = (questaoId: number) => {
    setQuestoesSelecionadas(questoesSelecionadas.filter(q => q.id !== questaoId))
  }

  const filteredQuestoes = questoesDisponiveis.filter(questao => {
    const matchesSearch = questao.pergunta.toLowerCase().includes(searchQuestoes.toLowerCase()) ||
                         questao.tema?.toLowerCase().includes(searchQuestoes.toLowerCase())
    
    const notSelected = !questoesSelecionadas.find(q => q.id === questao.id)
    
    return matchesSearch && notSelected
  })

  const getDisciplinaName = (questao: any) => {
    return questao.disciplina?.descricao || questao.disciplinaNome || 'Sem disciplina'
  }

  const getNivelName = (questao: any) => {
    return questao.nivelDificuldade?.descricao || questao.nivelDificuldadeNome || 'Sem nível'
  }

  const truncateText = (text: string, maxLength: number = 80) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + '...'
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-10 mx-auto p-5 border w-full max-w-6xl shadow-lg rounded-md bg-white">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <FileText className="h-6 w-6 text-primary-600 mr-3" />
            <h3 className="text-lg font-medium text-gray-900">
              {avaliacao ? 'Editar Avaliação' : 'Nova Avaliação'}
            </h3>
            <button
              type="button"
              onClick={loadConfiguracoes}
              className="ml-4 text-xs bg-blue-500 text-white px-2 py-1 rounded"
            >
              Conectar Backend
            </button>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Offline Mode Indicator */}
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center space-x-2 text-sm text-yellow-800">
            <XCircle className="h-4 w-4" />
            <span>Modo Offline - Dados de exemplo carregados</span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Dados básicos */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de Avaliação *
              </label>
              <select
                className={`input-field ${errors.tipoAvaliacaoId ? 'border-red-500' : ''}`}
                value={formData.tipoAvaliacaoId}
                onChange={(e) => setFormData(prev => ({ ...prev, tipoAvaliacaoId: e.target.value }))}
              >
                <option value="">Selecione um tipo</option>
                {tiposAvaliacoes.map((tipo) => (
                  <option key={tipo.id} value={tipo.id}>
                    {tipo.descricao}
                  </option>
                ))}
              </select>
              {errors.tipoAvaliacaoId && <p className="text-red-500 text-sm mt-1">{errors.tipoAvaliacaoId}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Questões Selecionadas
              </label>
              <div className="text-sm text-gray-600 bg-gray-100 px-3 py-2 rounded-lg">
                {questoesSelecionadas.length} questão(ões) selecionada(s)
              </div>
            </div>
          </div>

          {/* Instruções */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Instruções da Avaliação
            </label>
            <textarea
              rows={4}
              className="input-field"
              value={formData.instrucao}
              onChange={(e) => setFormData(prev => ({ ...prev, instrucao: e.target.value }))}
              placeholder="Digite as instruções que os alunos verão antes de come��ar a avaliação"
            />
          </div>

          {/* Questões Selecionadas */}
          {questoesSelecionadas.length > 0 && (
            <div>
              <h4 className="text-md font-medium text-gray-900 mb-3">
                Questões Selecionadas ({questoesSelecionadas.length})
              </h4>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {questoesSelecionadas.map((questao, index) => (
                  <div key={questao.id} className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg bg-gray-50">
                    <div className="text-sm font-medium text-primary-600 mt-1">
                      {index + 1}.
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        {truncateText(questao.pergunta)}
                      </p>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className="text-xs text-gray-500">
                          {getDisciplinaName(questao)}
                        </span>
                        <span className="text-xs text-gray-500">
                          {getNivelName(questao)}
                        </span>
                        {questao.pontuacao && (
                          <span className="text-xs text-gray-500">
                            {questao.pontuacao} pts
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removerQuestao(questao.id)}
                      className="text-red-600 hover:text-red-800 p-1"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
              {errors.questoes && <p className="text-red-500 text-sm mt-1">{errors.questoes}</p>}
            </div>
          )}

          {/* Seleção de Questões */}
          <div>
            <h4 className="text-md font-medium text-gray-900 mb-3">
              Adicionar Questões
            </h4>
            
            {/* Busca de questões */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar questões..."
                className="input-field pl-10"
                value={searchQuestoes}
                onChange={(e) => setSearchQuestoes(e.target.value)}
              />
            </div>

            {/* Lista de questões disponíveis */}
            <div className="space-y-2 max-h-64 overflow-y-auto border border-gray-200 rounded-lg">
              {filteredQuestoes.slice(0, 20).map((questao) => (
                <div key={questao.id} className="flex items-start space-x-3 p-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      {truncateText(questao.pergunta)}
                    </p>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className="text-xs text-gray-500">
                        {getDisciplinaName(questao)}
                      </span>
                      <span className="text-xs text-gray-500">
                        {getNivelName(questao)}
                      </span>
                      {questao.pontuacao && (
                        <span className="text-xs text-gray-500">
                          {questao.pontuacao} pts
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => adicionarQuestao(questao)}
                    className="text-primary-600 hover:text-primary-800 p-1"
                    title="Adicionar questão"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              ))}
              
              {filteredQuestoes.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500">Nenhuma questão disponível encontrada</p>
                </div>
              )}
            </div>
          </div>

          {/* Submit Error */}
          {errors.submit && (
            <div className="text-red-500 text-sm text-center">{errors.submit}</div>
          )}

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn-primary flex items-center"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Salvar
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
