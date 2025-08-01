import {
  Usuario,
  Questao,
  Avaliacao,
  TipoAvaliacao,
  TipoAlternativa,
  NivelDificuldade,
  Disciplina,
  CreateUsuarioDTO,
  CreateQuestaoDTO,
  CreateAvaliacaoDTO,
  UserRole
} from '@/types'

import {
  mockUsuarios,
  mockQuestoes,
  mockAvaliacoes,
  mockTiposAvaliacoes,
  mockTiposAlternativas,
  mockNiveisDificuldades,
  mockDisciplinas,
  mockQuestoesAlternativas
} from './mockData'

// Simular delay de API
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// Serviços de Usuário
export class UsuarioService {
  static async getAll(): Promise<Usuario[]> {
    await delay(500)
    return mockUsuarios.filter(u => u.status)
  }

  static async getById(id: number): Promise<Usuario | null> {
    await delay(300)
    return mockUsuarios.find(u => u.id === id) || null
  }

  static async create(data: CreateUsuarioDTO): Promise<Usuario> {
    await delay(800)
    const newUser: Usuario = {
      id: Math.max(...mockUsuarios.map(u => u.id)) + 1,
      data_cadastro: new Date(),
      status: true,
      ...data
    }
    mockUsuarios.push(newUser)
    return newUser
  }

  static async update(id: number, data: Partial<Usuario>): Promise<Usuario | null> {
    await delay(600)
    const index = mockUsuarios.findIndex(u => u.id === id)
    if (index === -1) return null
    
    mockUsuarios[index] = { ...mockUsuarios[index], ...data }
    return mockUsuarios[index]
  }

  static async delete(id: number): Promise<boolean> {
    await delay(400)
    const index = mockUsuarios.findIndex(u => u.id === id)
    if (index === -1) return false
    
    mockUsuarios[index].status = false
    return true
  }

  static async getByRole(role: UserRole): Promise<Usuario[]> {
    await delay(400)
    return mockUsuarios.filter(u => u.roles.includes(role) && u.status)
  }
}

// Serviços de Questão
export class QuestaoService {
  static async getAll(): Promise<Questao[]> {
    await delay(600)
    return mockQuestoes.map(q => ({
      ...q,
      alternativas: mockQuestoesAlternativas.filter(a => a.questao_id === q.id)
    }))
  }

  static async getById(id: number): Promise<Questao | null> {
    await delay(400)
    const questao = mockQuestoes.find(q => q.id === id)
    if (!questao) return null
    
    return {
      ...questao,
      alternativas: mockQuestoesAlternativas.filter(a => a.questao_id === id)
    }
  }

  static async create(data: CreateQuestaoDTO): Promise<Questao> {
    await delay(1000)
    const newQuestao: Questao = {
      id: Math.max(...mockQuestoes.map(q => q.id)) + 1,
      data_cadastro: new Date(),
      gerador_ia: false,
      status_questao_id: 0, // Pendente
      ...data
    }
    mockQuestoes.push(newQuestao)
    
    // Adicionar alternativas se existirem
    if (data.alternativas) {
      data.alternativas.forEach((alt, index) => {
        mockQuestoesAlternativas.push({
          id: Math.max(...mockQuestoesAlternativas.map(a => a.id)) + 1,
          data_cadastro: new Date(),
          questao_id: newQuestao.id,
          ...alt
        })
      })
    }
    
    return newQuestao
  }

  static async update(id: number, data: Partial<Questao>): Promise<Questao | null> {
    await delay(800)
    const index = mockQuestoes.findIndex(q => q.id === id)
    if (index === -1) return null
    
    mockQuestoes[index] = { ...mockQuestoes[index], ...data }
    return mockQuestoes[index]
  }

  static async getByDisciplina(disciplinaId: number): Promise<Questao[]> {
    await delay(500)
    return mockQuestoes.filter(q => q.disciplina_id === disciplinaId)
  }

  static async getByNivel(nivelId: number): Promise<Questao[]> {
    await delay(500)
    return mockQuestoes.filter(q => q.nivel_dificuldade_id === nivelId)
  }

  static async search(termo: string): Promise<Questao[]> {
    await delay(600)
    return mockQuestoes.filter(q => 
      q.pergunta.toLowerCase().includes(termo.toLowerCase()) ||
      q.tema?.toLowerCase().includes(termo.toLowerCase()) ||
      q.habilidades?.toLowerCase().includes(termo.toLowerCase())
    )
  }
}

// Serviços de Avaliação
export class AvaliacaoService {
  static async getAll(): Promise<Avaliacao[]> {
    await delay(700)
    return mockAvaliacoes
  }

  static async getById(id: number): Promise<Avaliacao | null> {
    await delay(400)
    return mockAvaliacoes.find(a => a.id === id) || null
  }

  static async create(data: CreateAvaliacaoDTO): Promise<Avaliacao> {
    await delay(1200)
    const newAvaliacao: Avaliacao = {
      id: Math.max(...mockAvaliacoes.map(a => a.id)) + 1,
      data_cadastro: new Date(),
      responsavel_id: 1, // Será definido pelo usuário logado
      status_avaliacao_id: 0, // Pendente
      ...data
    }
    mockAvaliacoes.push(newAvaliacao)
    return newAvaliacao
  }

  static async getByProfessor(professorId: number): Promise<Avaliacao[]> {
    await delay(500)
    return mockAvaliacoes.filter(a => a.responsavel_id === professorId)
  }

  static async addQuestoes(avaliacaoId: number, questoesIds: number[]): Promise<boolean> {
    await delay(600)
    // Lógica para adicionar questões à avaliação
    return true
  }

  static async removeQuestao(avaliacaoId: number, questaoId: number): Promise<boolean> {
    await delay(400)
    // Lógica para remover questão da avaliação
    return true
  }
}

// Serviços de Configuração
export class ConfiguracaoService {
  static async getTiposAvaliacoes(): Promise<TipoAvaliacao[]> {
    await delay(300)
    return mockTiposAvaliacoes.filter(t => t.status)
  }

  static async getTiposAlternativas(): Promise<TipoAlternativa[]> {
    await delay(300)
    return mockTiposAlternativas.filter(t => t.status)
  }

  static async getNiveisDificuldades(): Promise<NivelDificuldade[]> {
    await delay(300)
    return mockNiveisDificuldades.filter(n => n.status)
  }

  static async getDisciplinas(): Promise<Disciplina[]> {
    await delay(400)
    return mockDisciplinas.filter(d => d.status)
  }

  static async createTipoAvaliacao(descricao: string): Promise<TipoAvaliacao> {
    await delay(600)
    const newTipo: TipoAvaliacao = {
      id: Math.max(...mockTiposAvaliacoes.map(t => t.id)) + 1,
      data_cadastro: new Date(),
      descricao,
      status: true
    }
    mockTiposAvaliacoes.push(newTipo)
    return newTipo
  }

  static async createDisciplina(descricao: string, idExterno: string): Promise<Disciplina> {
    await delay(700)
    const newDisciplina: Disciplina = {
      id: Math.max(...mockDisciplinas.map(d => d.id)) + 1,
      descricao,
      id_disciplina_externo: idExterno,
      status: true
    }
    mockDisciplinas.push(newDisciplina)
    return newDisciplina
  }
}

// Serviços de Relatórios
export class RelatorioService {
  static async getEstatisticasGerais() {
    await delay(800)
    return {
      totalUsuarios: mockUsuarios.filter(u => u.status).length,
      totalProfessores: mockUsuarios.filter(u => u.roles.includes(UserRole.PROFESSOR) && u.status).length,
      totalAlunos: mockUsuarios.filter(u => u.roles.includes(UserRole.ALUNO) && u.status).length,
      totalQuestoes: mockQuestoes.length,
      totalAvaliacoes: mockAvaliacoes.length,
      questoesPendentes: mockQuestoes.filter(q => q.status_questao_id === 0).length,
      questoesAprovadas: mockQuestoes.filter(q => q.status_questao_id === 1).length
    }
  }

  static async getEstatisticasPorDisciplina() {
    await delay(600)
    return mockDisciplinas.map(d => ({
      disciplina: d.descricao,
      totalQuestoes: mockQuestoes.filter(q => q.disciplina_id === d.id).length,
      questoesPendentes: mockQuestoes.filter(q => q.disciplina_id === d.id && q.status_questao_id === 0).length
    }))
  }

  static async getDesempenhoPorProfessor() {
    await delay(700)
    const professores = mockUsuarios.filter(u => u.roles.includes(UserRole.PROFESSOR))
    return professores.map(p => ({
      professor: p.nome,
      questoesCriadas: mockQuestoes.filter(q => q.status_questao_id === 1).length, // Mock
      avaliacoesCriadas: mockAvaliacoes.filter(a => a.responsavel_id === p.id).length
    }))
  }
}
