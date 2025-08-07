'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { AvaliacaoApiService, RespostaApiService, ParticipanteApiService, apiClient } from '@/lib/api'
import { Clock, AlertCircle, CheckCircle, ChevronLeft, ChevronRight, Flag, Send } from 'lucide-react'

interface AplicacaoProvaProps {
  participanteId: number
}

export default function AplicacaoProva({ participanteId }: AplicacaoProvaProps) {
  const { user } = useAuth()
  const router = useRouter()
  const [participante, setParticipante] = useState<any>(null)
  const [questoes, setQuestoes] = useState<any[]>([])
  const [questaoAtual, setQuestaoAtual] = useState(0)
  const [respostas, setRespostas] = useState<Record<number, any>>({})
  const [tempoRestante, setTempoRestante] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [salvandoResposta, setSalvandoResposta] = useState(false)
  const [showConfirmacao, setShowConfirmacao] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isOfflineMode, setIsOfflineMode] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (user) {
      loadProvaData()
    }
  }, [participanteId, user])

  useEffect(() => {
    // Timer de tempo restante (opcional - pode ser configurado)
    if (tempoRestante !== null && tempoRestante > 0) {
      intervalRef.current = setInterval(() => {
        setTempoRestante(prev => {
          if (prev !== null && prev <= 1) {
            finalizarProvaAutomaticamente()
            return 0
          }
          return prev !== null ? prev - 1 : null
        })
      }, 1000)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [tempoRestante])

  const loadProvaData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Test backend connection first
      const isConnected = await apiClient.testConnection()

      if (!isConnected) {
        setIsOfflineMode(true)
        // Load demo data for offline mode
        const demoParticipante = {
          id: participanteId,
          avaliacao: {
            id: 1,
            instrucao: 'Avaliação de Matemática - Modo Demo',
            tipoAvaliacao: { descricao: 'Diagnóstica' }
          },
          usuario: { id: user?.id || 1, nome: user?.nome || 'Aluno Demo' },
          dataInicio: new Date().toISOString(),
          prazoLimite: new Date(Date.now() + 60 * 60 * 1000).toISOString() // 1 hora
        }

        const demoQuestoes = [
          {
            id: 1,
            pergunta: 'Qual é o resultado de 5 + 3?',
            tipoAlternativa: { descricao: 'Múltipla Escolha' },
            alternativas: [
              { id: 1, descricao: '6', correta: false },
              { id: 2, descricao: '7', correta: false },
              { id: 3, descricao: '8', correta: true },
              { id: 4, descricao: '9', correta: false }
            ],
            pontuacao: 1.0
          },
          {
            id: 2,
            pergunta: 'Se João tem 15 maçãs e deu 6 para Maria, quantas maçãs João tem agora?',
            tipoAlternativa: { descricao: 'Múltipla Escolha' },
            alternativas: [
              { id: 5, descricao: '8', correta: false },
              { id: 6, descricao: '9', correta: true },
              { id: 7, descricao: '10', correta: false },
              { id: 8, descricao: '11', correta: false }
            ],
            pontuacao: 1.0
          }
        ]

        setParticipante(demoParticipante)
        setQuestoes(demoQuestoes)
        setTempoRestante(3600) // 1 hora em segundos
        setRespostas({})
        setLoading(false)
        return
      }

      // Backend is available - load real data
      const participanteData = await ParticipanteApiService.getById(participanteId)
      setParticipante(participanteData)

      if (participanteData.avaliacao?.id) {
        const questoesData = await AvaliacaoApiService.getQuestions(participanteData.avaliacao.id)
        setQuestoes(questoesData)

        // Carregar respostas já salvas
        const respostasData = await RespostaApiService.getByEvaluationAndUser(
          participanteData.avaliacao.id,
          participanteData.usuario.id
        )

        const respostasMap: Record<number, any> = {}
        respostasData.forEach((resposta: any) => {
          respostasMap[resposta.questao.id] = resposta
        })
        setRespostas(respostasMap)

        // Calcular tempo restante se necessário
        if (participanteData.prazoLimite) {
          const agora = new Date().getTime()
          const prazo = new Date(participanteData.prazoLimite).getTime()
          const tempoRestanteSeg = Math.max(0, Math.floor((prazo - agora) / 1000))
          setTempoRestante(tempoRestanteSeg)
        }
      }
    } catch (error) {
      console.error('Erro ao carregar dados da prova:', error)
    } finally {
      setLoading(false)
    }
  }

  const salvarResposta = async (questaoId: number, respostaTexto?: string, alternativaId?: number) => {
    try {
      setSalvandoResposta(true)
      await RespostaApiService.saveAnswer({
        questaoId,
        respostaTexto,
        alternativaId
      })
      
      // Atualizar resposta local
      const novaResposta = {
        questao: { id: questaoId },
        resposta: respostaTexto,
        questaoAlternativa: alternativaId ? { id: alternativaId } : null
      }
      
      setRespostas(prev => ({
        ...prev,
        [questaoId]: novaResposta
      }))
    } catch (error) {
      console.error('Erro ao salvar resposta:', error)
    } finally {
      setSalvandoResposta(false)
    }
  }

  const handleRespostaDissertativa = (questaoId: number, valor: string) => {
    // Auto-save com debounce
    const timeoutId = setTimeout(() => {
      salvarResposta(questaoId, valor)
    }, 1000)

    return () => clearTimeout(timeoutId)
  }

  const handleRespostaMultiplaEscolha = (questaoId: number, alternativaId: number) => {
    salvarResposta(questaoId, undefined, alternativaId)
  }

  const proximaQuestao = () => {
    if (questaoAtual < questoes.length - 1) {
      setQuestaoAtual(questaoAtual + 1)
    }
  }

  const questaoAnterior = () => {
    if (questaoAtual > 0) {
      setQuestaoAtual(questaoAtual - 1)
    }
  }

  const irParaQuestao = (index: number) => {
    setQuestaoAtual(index)
  }

  const finalizarProva = async () => {
    try {
      await ParticipanteApiService.finishExam(participanteId)
      // Redirecionar para página de sucesso
      window.location.href = '/minhas-provas?finalizada=true'
    } catch (error) {
      console.error('Erro ao finalizar prova:', error)
    }
  }

  const finalizarProvaAutomaticamente = async () => {
    try {
      await ParticipanteApiService.finishExam(participanteId)
      alert('Tempo esgotado! A prova foi finalizada automaticamente.')
      window.location.href = '/minhas-provas'
    } catch (error) {
      console.error('Erro ao finalizar prova automaticamente:', error)
    }
  }

  const formatarTempo = (segundos: number) => {
    const horas = Math.floor(segundos / 3600)
    const minutos = Math.floor((segundos % 3600) / 60)
    const segs = segundos % 60
    
    if (horas > 0) {
      return `${horas.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}:${segs.toString().padStart(2, '0')}`
    }
    return `${minutos.toString().padStart(2, '0')}:${segs.toString().padStart(2, '0')}`
  }

  const getQuestaoStatus = (questaoId: number) => {
    const resposta = respostas[questaoId]
    if (!resposta) return 'not-answered'
    
    if (resposta.resposta || resposta.questaoAlternativa) {
      return 'answered'
    }
    
    return 'not-answered'
  }

  const contarRespostasCompletas = () => {
    return questoes.filter(q => getQuestaoStatus(q.id) === 'answered').length
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!participante || !questoes.length) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
          <h2 className="mt-2 text-lg font-medium text-gray-900">Erro ao carregar prova</h2>
          <p className="text-gray-500">Tente novamente ou entre em contato com o suporte.</p>
        </div>
      </div>
    )
  }

  const questaoAtiva = questoes[questaoAtual]
  const respostaAtual = respostas[questaoAtiva.id]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header fixo */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div>
              <h1 className="text-lg font-medium text-gray-900">
                {participante.avaliacao?.tipoAvaliacao?.descricao}
              </h1>
              <p className="text-sm text-gray-500">
                Questão {questaoAtual + 1} de {questoes.length}
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              {tempoRestante !== null && (
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="h-4 w-4 mr-1" />
                  <span className={`font-mono ${tempoRestante < 300 ? 'text-red-600' : ''}`}>
                    {formatarTempo(tempoRestante)}
                  </span>
                </div>
              )}
              
              <div className="text-sm text-gray-600">
                Respondidas: {contarRespostasCompletas()}/{questoes.length}
              </div>
              
              <button
                onClick={() => setShowConfirmacao(true)}
                className="btn-primary flex items-center"
              >
                <Send className="h-4 w-4 mr-2" />
                Finalizar
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Navegação de questões */}
          <div className="lg:col-span-1">
            <div className="card sticky top-24">
              <div className="card-header">
                <h3 className="text-md font-medium">Navegação</h3>
              </div>
              <div className="card-content">
                <div className="grid grid-cols-5 gap-2">
                  {questoes.map((questao, index) => {
                    const status = getQuestaoStatus(questao.id)
                    const isAtual = index === questaoAtual
                    
                    return (
                      <button
                        key={questao.id}
                        onClick={() => irParaQuestao(index)}
                        className={`
                          w-8 h-8 rounded text-xs font-medium transition-colors
                          ${isAtual 
                            ? 'bg-primary-600 text-white' 
                            : status === 'answered'
                              ? 'bg-green-100 text-green-800 hover:bg-green-200'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }
                        `}
                      >
                        {index + 1}
                      </button>
                    )
                  })}
                </div>
                
                <div className="mt-4 space-y-2 text-xs">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-primary-600 rounded mr-2"></div>
                    <span>Atual</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-100 border border-green-300 rounded mr-2"></div>
                    <span>Respondida</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-gray-100 border border-gray-300 rounded mr-2"></div>
                    <span>Não respondida</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Questão atual */}
          <div className="lg:col-span-3">
            <div className="card">
              <div className="card-content">
                {/* Contexto da questão (se houver) */}
                {questaoAtiva.questaoContexto && (
                  <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">Contexto:</h4>
                    <p className="text-blue-800 leading-relaxed">
                      {questaoAtiva.questaoContexto.contexto}
                    </p>
                  </div>
                )}

                {/* Pergunta */}
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    {questaoAtual + 1}. {questaoAtiva.pergunta}
                  </h3>
                  
                  {questaoAtiva.arquivoImagem && (
                    <div className="mb-4">
                      <img 
                        src={questaoAtiva.arquivoImagem} 
                        alt="Imagem da questão"
                        className="max-w-full h-auto rounded-lg border border-gray-300"
                      />
                    </div>
                  )}
                </div>

                {/* Área de resposta */}
                <div className="mb-6">
                  {questaoAtiva.tipoAlternativa?.descricao === 'Dissertativa' ? (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Sua resposta:
                      </label>
                      <textarea
                        rows={6}
                        className="input-field"
                        placeholder="Digite sua resposta aqui..."
                        defaultValue={respostaAtual?.resposta || ''}
                        onChange={(e) => {
                          const cleanup = handleRespostaDissertativa(questaoAtiva.id, e.target.value)
                          return cleanup
                        }}
                      />
                      {salvandoResposta && (
                        <p className="text-xs text-blue-600 mt-1">Salvando...</p>
                      )}
                    </div>
                  ) : (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Selecione uma alternativa:
                      </label>
                      <div className="space-y-3">
                        {questaoAtiva.alternativas?.map((alternativa: any) => (
                          <div key={alternativa.id} className="flex items-start">
                            <input
                              type="radio"
                              id={`alt-${alternativa.id}`}
                              name={`questao-${questaoAtiva.id}`}
                              checked={respostaAtual?.questaoAlternativa?.id === alternativa.id}
                              onChange={() => handleRespostaMultiplaEscolha(questaoAtiva.id, alternativa.id)}
                              className="mt-1 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                            />
                            <label 
                              htmlFor={`alt-${alternativa.id}`}
                              className="ml-3 flex-1 cursor-pointer"
                            >
                              <span className="text-sm font-medium text-gray-900 mr-2">
                                {alternativa.alternativa})
                              </span>
                              <span className="text-sm text-gray-700">
                                {alternativa.conteudo}
                              </span>
                              {alternativa.arquivoImagem && (
                                <img 
                                  src={alternativa.arquivoImagem} 
                                  alt={`Alternativa ${alternativa.alternativa}`}
                                  className="mt-2 max-w-xs h-auto rounded border border-gray-300"
                                />
                              )}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Status da resposta */}
                <div className="mb-6">
                  <div className="flex items-center">
                    {getQuestaoStatus(questaoAtiva.id) === 'answered' ? (
                      <div className="flex items-center text-green-600">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        <span className="text-sm">Questão respondida</span>
                      </div>
                    ) : (
                      <div className="flex items-center text-orange-600">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        <span className="text-sm">Questão não respondida</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Navegaç��o entre questões */}
            <div className="flex justify-between items-center mt-6">
              <button
                onClick={questaoAnterior}
                disabled={questaoAtual === 0}
                className="btn-secondary flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Anterior
              </button>

              <div className="flex items-center space-x-2">
                <Flag className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600">
                  Questão {questaoAtual + 1} de {questoes.length}
                </span>
              </div>

              <button
                onClick={proximaQuestao}
                disabled={questaoAtual === questoes.length - 1}
                className="btn-secondary flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Próxima
                <ChevronRight className="h-4 w-4 ml-1" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de confirmação */}
      {showConfirmacao && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <AlertCircle className="mx-auto h-12 w-12 text-orange-500" />
              <h3 className="text-lg font-medium text-gray-900 mt-4">
                Finalizar Prova
              </h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  Você respondeu {contarRespostasCompletas()} de {questoes.length} questões.
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Tem certeza que deseja finalizar a prova? Esta ação não pode ser desfeita.
                </p>
              </div>
              <div className="flex justify-center space-x-3 mt-4">
                <button
                  onClick={() => setShowConfirmacao(false)}
                  className="btn-secondary"
                >
                  Cancelar
                </button>
                <button
                  onClick={finalizarProva}
                  className="btn-primary"
                >
                  Finalizar Prova
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
