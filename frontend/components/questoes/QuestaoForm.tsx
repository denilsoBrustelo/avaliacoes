'use client'

import { useState, useEffect } from 'react'
import { Questao, TipoAlternativa, NivelDificuldade, Disciplina, CreateQuestaoDTO, QuestaoAlternativa } from '@/types'
import { QuestaoService, ConfiguracaoService } from '@/lib/services'
import { X, Save, Plus, Trash2, FileText } from 'lucide-react'

interface QuestaoFormProps {
  questao?: Questao | null
  isOpen: boolean
  onClose: () => void
  onSave: () => void
}

export default function QuestaoForm({ questao, isOpen, onClose, onSave }: QuestaoFormProps) {
  const [formData, setFormData] = useState<CreateQuestaoDTO>({
    pergunta: '',
    disciplina_id: undefined,
    pontuacao: undefined,
    tipo_alternativa_id: 1,
    nivel_dificuldade_id: undefined,
    tema: '',
    habilidades: '',
    ciclo: '',
    fase: '',
    resposta_correta: '',
    alternativas: []
  })

  const [tiposAlternativas, setTiposAlternativas] = useState<TipoAlternativa[]>([])
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([])
  const [niveisDificuldades, setNiveisDificuldades] = useState<NivelDificuldade[]>([])
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (isOpen) {
      loadConfiguracoes()
    }
  }, [isOpen])

  useEffect(() => {
    if (questao) {
      setFormData({
        pergunta: questao.pergunta,
        disciplina_id: questao.disciplina_id,
        pontuacao: questao.pontuacao,
        tipo_alternativa_id: questao.tipo_alternativa_id,
        nivel_dificuldade_id: questao.nivel_dificuldade_id,
        tema: questao.tema || '',
        habilidades: questao.habilidades || '',
        ciclo: questao.ciclo || '',
        fase: questao.fase || '',
        resposta_correta: questao.resposta_correta || '',
        alternativas: questao.alternativas || []
      })
    } else {
      setFormData({
        pergunta: '',
        disciplina_id: undefined,
        pontuacao: undefined,
        tipo_alternativa_id: 1,
        nivel_dificuldade_id: undefined,
        tema: '',
        habilidades: '',
        ciclo: '',
        fase: '',
        resposta_correta: '',
        alternativas: []
      })
    }
    setErrors({})
  }, [questao, isOpen])

  const loadConfiguracoes = async () => {
    try {
      const [tipos, discipl, niveis] = await Promise.all([
        ConfiguracaoService.getTiposAlternativas(),
        ConfiguracaoService.getDisciplinas(),
        ConfiguracaoService.getNiveisDificuldades()
      ])
      
      setTiposAlternativas(tipos)
      setDisciplinas(discipl)
      setNiveisDificuldades(niveis)
    } catch (error) {
      console.error('Erro ao carregar configurações:', error)
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.pergunta.trim()) {
      newErrors.pergunta = 'Pergunta é obrigatória'
    }

    if (!formData.tipo_alternativa_id) {
      newErrors.tipo_alternativa_id = 'Tipo de alternativa é obrigatório'
    }

    // Para questões dissertativas, verificar resposta correta
    if (formData.tipo_alternativa_id === 1 && !formData.resposta_correta?.trim()) {
      newErrors.resposta_correta = 'Resposta correta é obrigatória para questões dissertativas'
    }

    // Para questões de múltipla escolha, verificar alternativas
    if (formData.tipo_alternativa_id === 2) {
      if (!formData.alternativas || formData.alternativas.length < 2) {
        newErrors.alternativas = 'Questões de múltipla escolha devem ter pelo menos 2 alternativas'
      } else {
        const corretas = formData.alternativas.filter(alt => alt.correta)
        if (corretas.length !== 1) {
          newErrors.alternativas = 'Deve haver exatamente uma alternativa correta'
        }
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    try {
      setLoading(true)
      
      if (questao) {
        // Atualizar questão existente - converter CreateQuestaoDTO para Partial<Questao>
        const updateData: Partial<Questao> = {
          pergunta: formData.pergunta,
          pontuacao: formData.pontuacao,
          arquivo_imagem: formData.arquivo_imagem,
          resposta_correta: formData.resposta_correta,
          ciclo: formData.ciclo,
          fase: formData.fase,
          tema: formData.tema,
          habilidades: formData.habilidades,
          alternativas: formData.alternativas?.map(alt => ({
            ...alt,
            id: 0, // Será atribuído pelo backend
            data_cadastro: new Date(),
            questao_id: questao.id
          }))
        }
        await QuestaoService.update(questao.id, updateData)
      } else {
        // Criar nova questão
        await QuestaoService.create(formData)
      }
      
      onSave()
      onClose()
    } catch (error) {
      console.error('Erro ao salvar questão:', error)
      setErrors({ submit: 'Erro ao salvar questão. Tente novamente.' })
    } finally {
      setLoading(false)
    }
  }

  const addAlternativa = () => {
    const letras = ['A', 'B', 'C', 'D', 'E']
    const proximaLetra = letras[formData.alternativas?.length || 0]
    
    if (proximaLetra) {
      setFormData(prev => ({
        ...prev,
        alternativas: [
          ...(prev.alternativas || []),
          {
            alternativa: proximaLetra,
            conteudo: '',
            correta: false
          }
        ]
      }))
    }
  }

  const removeAlternativa = (index: number) => {
    setFormData(prev => ({
      ...prev,
      alternativas: prev.alternativas?.filter((_, i) => i !== index) || []
    }))
  }

  const updateAlternativa = (index: number, field: keyof QuestaoAlternativa, value: any) => {
    setFormData(prev => ({
      ...prev,
      alternativas: prev.alternativas?.map((alt, i) => 
        i === index ? { ...alt, [field]: value } : alt
      ) || []
    }))
  }

  const setAlternativaCorreta = (index: number) => {
    setFormData(prev => ({
      ...prev,
      alternativas: prev.alternativas?.map((alt, i) => ({
        ...alt,
        correta: i === index
      })) || []
    }))
  }

  const isTipoMultiplaEscolha = formData.tipo_alternativa_id === 2
  const isTipoDissertativa = formData.tipo_alternativa_id === 1

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-10 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-md bg-white">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <FileText className="h-6 w-6 text-primary-600 mr-3" />
            <h3 className="text-lg font-medium text-gray-900">
              {questao ? 'Editar Questão' : 'Nova Questão'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Pergunta */}
          <div>
            <label htmlFor="pergunta" className="block text-sm font-medium text-gray-700 mb-1">
              Pergunta *
            </label>
            <textarea
              id="pergunta"
              rows={4}
              className={`input-field ${errors.pergunta ? 'border-red-500' : ''}`}
              value={formData.pergunta}
              onChange={(e) => setFormData(prev => ({ ...prev, pergunta: e.target.value }))}
              placeholder="Digite o enunciado da questão"
            />
            {errors.pergunta && <p className="text-red-500 text-sm mt-1">{errors.pergunta}</p>}
          </div>

          {/* Grid de informações básicas */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Disciplina
              </label>
              <select
                className="input-field"
                value={formData.disciplina_id || ''}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  disciplina_id: e.target.value ? parseInt(e.target.value) : undefined 
                }))}
              >
                <option value="">Selecione uma disciplina</option>
                {disciplinas.map((disciplina) => (
                  <option key={disciplina.id} value={disciplina.id}>
                    {disciplina.descricao}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de Alternativa *
              </label>
              <select
                className={`input-field ${errors.tipo_alternativa_id ? 'border-red-500' : ''}`}
                value={formData.tipo_alternativa_id}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  tipo_alternativa_id: parseInt(e.target.value) 
                }))}
              >
                {tiposAlternativas.map((tipo) => (
                  <option key={tipo.id} value={tipo.id}>
                    {tipo.descricao}
                  </option>
                ))}
              </select>
              {errors.tipo_alternativa_id && <p className="text-red-500 text-sm mt-1">{errors.tipo_alternativa_id}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nível de Dificuldade
              </label>
              <select
                className="input-field"
                value={formData.nivel_dificuldade_id || ''}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  nivel_dificuldade_id: e.target.value ? parseInt(e.target.value) : undefined 
                }))}
              >
                <option value="">Selecione um nível</option>
                {niveisDificuldades.map((nivel) => (
                  <option key={nivel.id} value={nivel.id}>
                    {nivel.descricao}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Grid de informações adicionais */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pontuação
              </label>
              <input
                type="number"
                step="0.1"
                className="input-field"
                value={formData.pontuacao || ''}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  pontuacao: e.target.value ? parseFloat(e.target.value) : undefined 
                }))}
                placeholder="0.0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ciclo
              </label>
              <input
                type="text"
                className="input-field"
                value={formData.ciclo}
                onChange={(e) => setFormData(prev => ({ ...prev, ciclo: e.target.value }))}
                placeholder="Ex: Ensino Fundamental II"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fase
              </label>
              <input
                type="text"
                className="input-field"
                value={formData.fase}
                onChange={(e) => setFormData(prev => ({ ...prev, fase: e.target.value }))}
                placeholder="Ex: 6º ao 9º ano"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tema
              </label>
              <input
                type="text"
                className="input-field"
                value={formData.tema}
                onChange={(e) => setFormData(prev => ({ ...prev, tema: e.target.value }))}
                placeholder="Ex: Álgebra"
              />
            </div>
          </div>

          {/* Habilidades */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Habilidades Avaliadas
            </label>
            <textarea
              rows={2}
              className="input-field"
              value={formData.habilidades}
              onChange={(e) => setFormData(prev => ({ ...prev, habilidades: e.target.value }))}
              placeholder="Descreva as habilidades que esta questão avalia"
            />
          </div>

          {/* Resposta Correta (apenas para dissertativas) */}
          {isTipoDissertativa && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Resposta Correta *
              </label>
              <textarea
                rows={3}
                className={`input-field ${errors.resposta_correta ? 'border-red-500' : ''}`}
                value={formData.resposta_correta}
                onChange={(e) => setFormData(prev => ({ ...prev, resposta_correta: e.target.value }))}
                placeholder="Digite a resposta esperada para esta questão dissertativa"
              />
              {errors.resposta_correta && <p className="text-red-500 text-sm mt-1">{errors.resposta_correta}</p>}
            </div>
          )}

          {/* Alternativas (apenas para múltipla escolha) */}
          {isTipoMultiplaEscolha && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-medium text-gray-700">
                  Alternativas *
                </label>
                <button
                  type="button"
                  onClick={addAlternativa}
                  className="btn-secondary flex items-center text-sm"
                  disabled={(formData.alternativas?.length || 0) >= 5}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Adicionar
                </button>
              </div>

              <div className="space-y-3">
                {formData.alternativas?.map((alternativa, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        name="alternativa_correta"
                        checked={alternativa.correta}
                        onChange={() => setAlternativaCorreta(index)}
                        className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300"
                      />
                      <span className="ml-2 text-sm font-medium text-gray-700">
                        {alternativa.alternativa}
                      </span>
                    </div>
                    <div className="flex-1">
                      <textarea
                        rows={2}
                        className="input-field"
                        value={alternativa.conteudo}
                        onChange={(e) => updateAlternativa(index, 'conteudo', e.target.value)}
                        placeholder="Digite o conteúdo da alternativa"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeAlternativa(index)}
                      className="text-red-600 hover:text-red-800 p-1"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>

              {errors.alternativas && <p className="text-red-500 text-sm mt-1">{errors.alternativas}</p>}
            </div>
          )}

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
