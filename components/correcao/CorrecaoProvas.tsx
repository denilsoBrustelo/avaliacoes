'use client'

import { useState, useEffect } from 'react'
import { RespostaApiService, ParticipanteApiService } from '@/lib/api'
import { CheckCircle, XCircle, Clock, User, FileText, Edit, Save, Bot } from 'lucide-react'

export default function CorrecaoProvas() {
  const [respostasPendentes, setRespostasPendentes] = useState<any[]>([])
  const [participantesSelecionados, setParticipantesSelecionados] = useState<any[]>([])
  const [respostaSelecionada, setRespostaSelecionada] = useState<any | null>(null)
  const [correcaoAtual, setCorrecaoAtual] = useState({
    correta: false,
    pontuacao: 0,
    observacoes: ''
  })
  const [loading, setLoading] = useState(true)
  const [salvando, setSalvando] = useState(false)
  const [viewMode, setViewMode] = useState<'pendentes' | 'por-participante'>('pendentes')

  useEffect(() => {
    loadRespostasPendentes()
  }, [])

  const loadRespostasPendentes = async () => {
    try {
      setLoading(true)
      const respostas = await RespostaApiService.getPendingCorrection()
      setRespostasPendentes(respostas)
    } catch (error) {
      console.error('Erro ao carregar respostas pendentes:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadParticipantes = async () => {
    try {
      setLoading(true)
      // Buscar participantes com provas concluídas
      const participantes = await ParticipanteApiService.getByStudent(1) // Ajustar para buscar todos
      setParticipantesSelecionados(participantes.filter(p => p.statusAplicacao === 3)) // Concluídos
    } catch (error) {
      console.error('Erro ao carregar participantes:', error)
    } finally {
      setLoading(false)
    }
  }

  const selecionarResposta = (resposta: any) => {
    setRespostaSelecionada(resposta)
    setCorrecaoAtual({
      correta: resposta.correta || false,
      pontuacao: resposta.pontuacao || 0,
      observacoes: resposta.observacoes || ''
    })
  }

  const salvarCorrecao = async () => {
    if (!respostaSelecionada) return

    try {
      setSalvando(true)
      await RespostaApiService.correctManually(respostaSelecionada.id, correcaoAtual)
      
      // Atualizar lista de pendentes
      setRespostasPendentes(prev => prev.filter(r => r.id !== respostaSelecionada.id))
      setRespostaSelecionada(null)
    } catch (error) {
      console.error('Erro ao salvar correção:', error)
    } finally {
      setSalvando(false)
    }
  }

  const corrigirAutomaticamente = async (respostaId: number) => {
    try {
      await RespostaApiService.correctAutomatically(respostaId)
      setRespostasPendentes(prev => prev.filter(r => r.id !== respostaId))
    } catch (error) {
      console.error('Erro na correção automática:', error)
    }
  }

  const corrigirTodasAutomaticamente = async () => {
    try {
      await RespostaApiService.correctAllAutomatically()
      loadRespostasPendentes()
    } catch (error) {
      console.error('Erro na correção automática em lote:', error)
    }
  }

  const getStatusIcon = (correta: boolean | null) => {
    if (correta === null) return <Clock className="h-4 w-4 text-orange-500" />
    return correta ? <CheckCircle className="h-4 w-4 text-green-500" /> : <XCircle className="h-4 w-4 text-red-500" />
  }

  const getTipoQuestao = (resposta: any) => {
    return resposta.questao?.tipoAlternativa?.descricao || 'Não informado'
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
          <h2 className="text-2xl font-bold text-gray-900">Correção de Provas</h2>
          <p className="text-gray-600">Corrija respostas dissertativas e revise avaliações</p>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={() => setViewMode('pendentes')}
            className={`px-4 py-2 rounded-lg ${viewMode === 'pendentes' ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            Respostas Pendentes
          </button>
          <button
            onClick={() => {
              setViewMode('por-participante')
              loadParticipantes()
            }}
            className={`px-4 py-2 rounded-lg ${viewMode === 'por-participante' ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            Por Participante
          </button>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="card">
          <div className="card-content">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-orange-500" />
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">{respostasPendentes.length}</div>
                <div className="text-sm text-gray-500">Pendentes de Correção</div>
              </div>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="card-content">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Bot className="h-8 w-8 text-blue-500" />
                <div className="ml-4">
                  <div className="text-sm text-gray-500">Correção Automática</div>
                </div>
              </div>
              <button
                onClick={corrigirTodasAutomaticamente}
                className="btn-primary flex items-center text-sm"
              >
                <Bot className="h-4 w-4 mr-1" />
                Corrigir Todas
              </button>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="card-content">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-green-500" />
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">
                  {participantesSelecionados.filter(p => p.avaliado).length}
                </div>
                <div className="text-sm text-gray-500">Avaliações Concluídas</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lista de respostas */}
        <div className="lg:col-span-1">
          <div className="card">
            <div className="card-header">
              <h3 className="text-md font-medium">
                {viewMode === 'pendentes' 
                  ? `Respostas Pendentes (${respostasPendentes.length})`
                  : `Participantes (${participantesSelecionados.length})`
                }
              </h3>
            </div>
            <div className="card-content p-0">
              <div className="max-h-96 overflow-y-auto">
                {viewMode === 'pendentes' ? (
                  <div className="divide-y divide-gray-200">
                    {respostasPendentes.map((resposta) => (
                      <div
                        key={resposta.id}
                        onClick={() => selecionarResposta(resposta)}
                        className={`p-4 hover:bg-gray-50 cursor-pointer ${
                          respostaSelecionada?.id === resposta.id ? 'bg-primary-50 border-r-2 border-primary-500' : ''
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900">
                              {resposta.usuario?.nome || 'Usuário'}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                              {resposta.questao?.pergunta?.substring(0, 60)}...
                            </p>
                            <div className="flex items-center mt-1">
                              <span className="text-xs text-gray-500">
                                {getTipoQuestao(resposta)}
                              </span>
                              {getTipoQuestao(resposta) === 'Dissertativa' && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    corrigirAutomaticamente(resposta.id)
                                  }}
                                  className="ml-2 text-xs text-blue-600 hover:text-blue-800"
                                  title="Correção automática"
                                >
                                  <Bot className="h-3 w-3" />
                                </button>
                              )}
                            </div>
                          </div>
                          {getStatusIcon(resposta.correta)}
                        </div>
                      </div>
                    ))}
                    
                    {respostasPendentes.length === 0 && (
                      <div className="p-8 text-center">
                        <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
                        <p className="mt-2 text-sm text-gray-500">
                          Nenhuma resposta pendente de correção
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="divide-y divide-gray-200">
                    {participantesSelecionados.map((participante) => (
                      <div
                        key={participante.id}
                        className="p-4 hover:bg-gray-50"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">
                              {participante.usuario?.nome}
                            </p>
                            <p className="text-xs text-gray-500">
                              {participante.avaliacao?.tipoAvaliacao?.descricao}
                            </p>
                            <p className="text-xs text-gray-500">
                              {participante.escola} - {participante.turma}
                            </p>
                          </div>
                          {participante.avaliado ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <Clock className="h-4 w-4 text-orange-500" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Área de correção */}
        <div className="lg:col-span-2">
          {respostaSelecionada ? (
            <div className="space-y-6">
              {/* Questão */}
              <div className="card">
                <div className="card-header">
                  <h3 className="text-md font-medium">Questão</h3>
                </div>
                <div className="card-content">
                  <p className="text-gray-900 leading-relaxed">
                    {respostaSelecionada.questao?.pergunta}
                  </p>
                  
                  {respostaSelecionada.questao?.arquivoImagem && (
                    <img 
                      src={respostaSelecionada.questao.arquivoImagem} 
                      alt="Imagem da questão"
                      className="mt-4 max-w-full h-auto rounded-lg border"
                    />
                  )}

                  <div className="mt-4 flex items-center space-x-4 text-sm text-gray-500">
                    <span>Tipo: {getTipoQuestao(respostaSelecionada)}</span>
                    {respostaSelecionada.questao?.pontuacao && (
                      <span>Pontuação máxima: {respostaSelecionada.questao.pontuacao} pts</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Resposta do aluno */}
              <div className="card">
                <div className="card-header">
                  <h3 className="text-md font-medium">
                    Resposta de {respostaSelecionada.usuario?.nome}
                  </h3>
                </div>
                <div className="card-content">
                  {respostaSelecionada.resposta ? (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-gray-900 whitespace-pre-wrap">
                        {respostaSelecionada.resposta}
                      </p>
                    </div>
                  ) : respostaSelecionada.questaoAlternativa ? (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-gray-900">
                        <strong>Alternativa {respostaSelecionada.questaoAlternativa.alternativa}:</strong> {respostaSelecionada.questaoAlternativa.conteudo}
                      </p>
                      {respostaSelecionada.questaoAlternativa.correta ? (
                        <p className="text-green-600 mt-2 font-medium">✓ Resposta correta</p>
                      ) : (
                        <p className="text-red-600 mt-2 font-medium">✗ Resposta incorreta</p>
                      )}
                    </div>
                  ) : (
                    <p className="text-gray-500 italic">Nenhuma resposta fornecida</p>
                  )}
                </div>
              </div>

              {/* Área de correção */}
              <div className="card">
                <div className="card-header">
                  <h3 className="text-md font-medium">Correção</h3>
                </div>
                <div className="card-content space-y-4">
                  {/* Status da resposta */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status da Resposta
                    </label>
                    <div className="flex space-x-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          checked={correcaoAtual.correta === true}
                          onChange={() => setCorrecaoAtual(prev => ({ ...prev, correta: true }))}
                          className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                        />
                        <span className="ml-2 text-sm text-gray-700">Correta</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          checked={correcaoAtual.correta === false}
                          onChange={() => setCorrecaoAtual(prev => ({ ...prev, correta: false }))}
                          className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300"
                        />
                        <span className="ml-2 text-sm text-gray-700">Incorreta</span>
                      </label>
                    </div>
                  </div>

                  {/* Pontuação */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pontuação
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max={respostaSelecionada.questao?.pontuacao || 10}
                      value={correcaoAtual.pontuacao}
                      onChange={(e) => setCorrecaoAtual(prev => ({ 
                        ...prev, 
                        pontuacao: parseFloat(e.target.value) || 0 
                      }))}
                      className="input-field"
                    />
                  </div>

                  {/* Observações */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Observações / Feedback
                    </label>
                    <textarea
                      rows={4}
                      value={correcaoAtual.observacoes}
                      onChange={(e) => setCorrecaoAtual(prev => ({ 
                        ...prev, 
                        observacoes: e.target.value 
                      }))}
                      placeholder="Adicione comentários sobre a resposta do aluno..."
                      className="input-field"
                    />
                  </div>

                  {/* Botões de ação */}
                  <div className="flex justify-end space-x-3 pt-4 border-t">
                    <button
                      onClick={() => setRespostaSelecionada(null)}
                      className="btn-secondary"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={salvarCorrecao}
                      disabled={salvando}
                      className="btn-primary flex items-center"
                    >
                      {salvando ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Salvando...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Salvar Correção
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="card">
              <div className="card-content">
                <div className="text-center py-12">
                  <Edit className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-lg font-medium text-gray-900">
                    Selecione uma resposta para corrigir
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Clique em uma resposta na lista ao lado para começar a correção.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
