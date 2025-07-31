'use client'

import { useState, useEffect } from 'react'
import { TipoAvaliacao, TipoAlternativa, NivelDificuldade, Disciplina } from '@/types'
import { ConfiguracaoService } from '@/lib/services'
import { Plus, Edit, Trash2, Settings } from 'lucide-react'

export default function ConfigPage() {
  const [tiposAvaliacoes, setTiposAvaliacoes] = useState<TipoAvaliacao[]>([])
  const [tiposAlternativas, setTiposAlternativas] = useState<TipoAlternativa[]>([])
  const [niveisD ificuldades, setNiveisDificuldades] = useState<NivelDificuldade[]>([])
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('tipos-avaliacoes')

  useEffect(() => {
    loadConfiguracoes()
  }, [])

  const loadConfiguracoes = async () => {
    try {
      setLoading(true)
      const [tipos, alternativas, niveis, disc] = await Promise.all([
        ConfiguracaoService.getTiposAvaliacoes(),
        ConfiguracaoService.getTiposAlternativas(),
        ConfiguracaoService.getNiveisDificuldades(),
        ConfiguracaoService.getDisciplinas()
      ])
      
      setTiposAvaliacoes(tipos)
      setTiposAlternativas(alternativas)
      setNiveisDificuldades(niveis)
      setDisciplinas(disc)
    } catch (error) {
      console.error('Erro ao carregar configurações:', error)
    } finally {
      setLoading(false)
    }
  }

  const tabs = [
    { id: 'tipos-avaliacoes', label: 'Tipos de Avaliação', count: tiposAvaliacoes.length },
    { id: 'tipos-alternativas', label: 'Tipos de Alternativas', count: tiposAlternativas.length },
    { id: 'niveis-dificuldades', label: 'Níveis de Dificuldade', count: niveisD ificuldades.length },
    { id: 'disciplinas', label: 'Disciplinas', count: disciplinas.length }
  ]

  const renderTable = (data: any[], type: string) => {
    return (
      <div className="card">
        <div className="card-header flex justify-between items-center">
          <h3 className="text-lg font-medium">
            {tabs.find(t => t.id === activeTab)?.label}
          </h3>
          <button className="btn-primary flex items-center">
            <Plus className="h-4 w-4 mr-2" />
            Adicionar
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Descrição
                </th>
                {type === 'disciplinas' && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID Externo
                  </th>
                )}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.descricao}
                  </td>
                  {type === 'disciplinas' && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.id_disciplina_externo}
                    </td>
                  )}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        item.status
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {item.status ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        className="text-primary-600 hover:text-primary-900 p-1"
                        title="Editar"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        className="text-red-600 hover:text-red-900 p-1"
                        title="Excluir"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {data.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">Nenhum registro encontrado</p>
            </div>
          )}
        </div>
      </div>
    )
  }

  const getCurrentData = () => {
    switch (activeTab) {
      case 'tipos-avaliacoes':
        return tiposAvaliacoes
      case 'tipos-alternativas':
        return tiposAlternativas
      case 'niveis-dificuldades':
        return niveisD ificuldades
      case 'disciplinas':
        return disciplinas
      default:
        return []
    }
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
        <div className="flex items-center mb-4">
          <Settings className="h-6 w-6 text-primary-600 mr-3" />
          <h2 className="text-2xl font-bold text-gray-900">Configurações</h2>
        </div>
        <p className="text-gray-600">
          Gerencie os tipos, categorias e parâmetros do sistema
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
              <span className="ml-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-primary-600 bg-primary-100 rounded-full">
                {tab.count}
              </span>
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      {renderTable(getCurrentData(), activeTab)}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {tabs.map((tab) => (
          <div key={tab.id} className="card">
            <div className="card-content">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-600">
                  {tab.count}
                </div>
                <div className="text-sm text-gray-500">{tab.label}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}