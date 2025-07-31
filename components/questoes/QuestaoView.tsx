'use client'

import { useState, useEffect } from 'react'
import { Questao, StatusQuestao } from '@/types'
import { ConfiguracaoService } from '@/lib/services'
import { X, Edit, CheckCircle, XCircle, Clock, FileText, Tag, Calendar, User } from 'lucide-react'

interface QuestaoViewProps {
  questao: Questao | null
  isOpen: boolean
  onClose: () => void
  onEdit: (questao: Questao) => void
}

export default function QuestaoView({ questao, isOpen, onClose, onEdit }: QuestaoViewProps) {
  const [disciplinas, setDisciplinas] = useState<any[]>([])
  const [niveisDificuldades, setNiveisDificuldades] = useState<any[]>([])
  const [tiposAlternativas, setTiposAlternativas] = useState<any[]>([])

  useEffect(() => {
    if (isOpen) {
      loadConfiguracoes()
    }
  }, [isOpen])

  const loadConfiguracoes = async () => {
    try {
      const [discipl, niveis, tipos] = await Promise.all([
        ConfiguracaoService.getDisciplinas(),
        ConfiguracaoService.getNiveisDificuldades(),
        ConfiguracaoService.getTiposAlternativas()
      ])
      
      setDisciplinas(discipl)
      setNiveisDificuldades(niveis)
      setTiposAlternativas(tipos)
    } catch (error) {
      console.error('Erro ao carregar configurações:', error)
    }
  }

  const getStatusIcon = (status: number) => {
    switch (status) {
      case StatusQuestao.APROVADO:
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case StatusQuestao.CANCELADO:
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return <Clock className="h-5 w-5 text-orange-500" />
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
    if (!id) return 'Não informado'
    const disciplina = disciplinas.find(d => d.id === id)
    return disciplina?.descricao || 'Não informado'
  }

  const getNivelName = (id?: number) => {
    if (!id) return 'Não informado'
    const nivel = niveisDificuldades.find(n => n.id === id)
    return nivel?.descricao || 'Não informado'
  }

  const getTipoAlternativaName = (id: number) => {
    const tipo = tiposAlternativas.find(t => t.id === id)
    return tipo?.descricao || 'Não informado'
  }

  const handleEdit = () => {
    if (questao) {
      onEdit(questao)
      onClose()
    }
  }

  if (!isOpen || !questao) return null

  const isMultiplaEscolha = questao.tipo_alternativa_id === 2
  const isDissertativa = questao.tipo_alternativa_id === 1

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-10 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-md bg-white">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <FileText className="h-6 w-6 text-primary-600 mr-3" />
            <div>
              <h3 className="text-lg font-medium text-gray-900">Visualizar Questão</h3>
              <p className="text-sm text-gray-500">ID: {questao.id}</p>
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
            {getStatusIcon(questao.status_questao_id)}
            <span className={`ml-2 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(questao.status_questao_id)}`}>
              {getStatusLabel(questao.status_questao_id)}
            </span>
          </div>
        </div>

        <div className="space-y-6">
          {/* Pergunta */}
          <div className="card">
            <div className="card-header">
              <h4 className="text-lg font-medium">Enunciado</h4>
            </div>
            <div className="card-content">
              <p className="text-gray-900 leading-relaxed whitespace-pre-wrap">
                {questao.pergunta}
              </p>
            </div>
          </div>

          {/* Informações básicas */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div className="card">
              <div className="card-header">
                <h4 className="text-md font-medium">Informações Gerais</h4>
              </div>
              <div className="card-content space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-500">Disciplina:</span>
                  <span className="text-sm text-gray-900">{getDisciplinaName(questao.disciplina_id)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-500">Tipo:</span>
                  <span className="text-sm text-gray-900">{getTipoAlternativaName(questao.tipo_alternativa_id)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-500">Nível:</span>
                  <span className="text-sm text-gray-900">{getNivelName(questao.nivel_dificuldade_id)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-500">Pontuação:</span>
                  <span className="text-sm text-gray-900">
                    {questao.pontuacao ? `${questao.pontuacao} pts` : 'Não informado'}
                  </span>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <h4 className="text-md font-medium">Classificação</h4>
              </div>
              <div className="card-content space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-500">Ciclo:</span>
                  <span className="text-sm text-gray-900">{questao.ciclo || 'Não informado'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-500">Fase:</span>
                  <span className="text-sm text-gray-900">{questao.fase || 'Não informado'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-500">Tema:</span>
                  <span className="text-sm text-gray-900">{questao.tema || 'Não informado'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-500">Origem:</span>
                  <span className="text-sm text-gray-900">
                    {questao.gerador_ia ? 'Gerada por IA' : 'Criada manualmente'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Habilidades */}
          {questao.habilidades && (
            <div className="card">
              <div className="card-header">
                <h4 className="text-md font-medium">Habilidades Avaliadas</h4>
              </div>
              <div className="card-content">
                <p className="text-gray-900 leading-relaxed">
                  {questao.habilidades}
                </p>
              </div>
            </div>
          )}

          {/* Resposta correta (para dissertativas) */}
          {isDissertativa && questao.resposta_correta && (
            <div className="card">
              <div className="card-header">
                <h4 className="text-md font-medium">Resposta Esperada</h4>
              </div>
              <div className="card-content">
                <p className="text-gray-900 leading-relaxed whitespace-pre-wrap">
                  {questao.resposta_correta}
                </p>
              </div>
            </div>
          )}

          {/* Alternativas (para múltipla escolha) */}
          {isMultiplaEscolha && questao.alternativas && questao.alternativas.length > 0 && (
            <div className="card">
              <div className="card-header">
                <h4 className="text-md font-medium">Alternativas</h4>
              </div>
              <div className="card-content">
                <div className="space-y-3">
                  {questao.alternativas.map((alternativa, index) => (
                    <div 
                      key={alternativa.id} 
                      className={`p-3 rounded-lg border-2 ${
                        alternativa.correta 
                          ? 'border-green-200 bg-green-50' 
                          : 'border-gray-200 bg-gray-50'
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium ${
                          alternativa.correta 
                            ? 'bg-green-500 text-white' 
                            : 'bg-gray-300 text-gray-700'
                        }`}>
                          {alternativa.alternativa}
                        </div>
                        <div className="flex-1">
                          <p className="text-gray-900 leading-relaxed">
                            {alternativa.conteudo}
                          </p>
                          {alternativa.correta && (
                            <div className="mt-2 flex items-center text-green-600">
                              <CheckCircle className="h-4 w-4 mr-1" />
                              <span className="text-xs font-medium">Resposta Correta</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Metadados */}
          <div className="card">
            <div className="card-header">
              <h4 className="text-md font-medium">Informações do Sistema</h4>
            </div>
            <div className="card-content">
              <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>Criado em: {new Date(questao.data_cadastro).toLocaleDateString('pt-BR')}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <FileText className="h-4 w-4 mr-2" />
                  <span>ID da questão: {questao.id}</span>
                </div>
                {questao.questao_contexto_id && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Tag className="h-4 w-4 mr-2" />
                    <span>Contexto ID: {questao.questao_contexto_id}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

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
            Editar Questão
          </button>
        </div>
      </div>
    </div>
  )
}
