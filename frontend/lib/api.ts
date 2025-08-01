const API_BASE_URL = 'http://localhost:8080/api'

interface ApiResponse<T> {
  data: T
  status: number
  message?: string
}

class ApiClient {
  private baseURL: string
  private token: string | null = null

  constructor(baseURL: string) {
    this.baseURL = baseURL
    
    // Recuperar token do localStorage se existir
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('token')
    }
  }

  setToken(token: string) {
    this.token = token
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token)
    }
  }

  removeToken() {
    this.token = null
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token')
    }
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    }

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`
    }

    return headers
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`HTTP ${response.status}: ${errorText}`)
    }

    const contentType = response.headers.get('content-type')
    if (contentType && contentType.includes('application/json')) {
      return await response.json()
    }

    return {} as T
  }

  async get<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'GET',
      headers: this.getHeaders(),
    })
    return this.handleResponse<T>(response)
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: data ? JSON.stringify(data) : undefined,
    })
    return this.handleResponse<T>(response)
  }

  async postFormData<T>(endpoint: string, formData: FormData): Promise<T> {
    const headers: Record<string, string> = {}
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`
    }
    // Não definir Content-Type para FormData - o browser define automaticamente

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'POST',
      headers,
      body: formData,
    })
    return this.handleResponse<T>(response)
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: data ? JSON.stringify(data) : undefined,
    })
    return this.handleResponse<T>(response)
  }

  async patch<T>(endpoint: string, data?: any): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'PATCH',
      headers: this.getHeaders(),
      body: data ? JSON.stringify(data) : undefined,
    })
    return this.handleResponse<T>(response)
  }

  async delete<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    })
    return this.handleResponse<T>(response)
  }
}

// Instância singleton do cliente API
export const apiClient = new ApiClient(API_BASE_URL)

// Serviços específicos
export class AuthService {
  static async login(email: string, senha: string) {
    const response = await apiClient.post<{
      token: string
      type: string
      usuario: any
    }>('/auth/login', { email, senha })
    
    if (response.token) {
      apiClient.setToken(response.token)
    }
    
    return response
  }

  static async logout() {
    apiClient.removeToken()
  }

  static async getCurrentUser() {
    return await apiClient.get<any>('/auth/me')
  }

  static async refreshToken() {
    return await apiClient.post<{
      token: string
      type: string
    }>('/auth/refresh')
  }
}

export class UsuarioApiService {
  static async getAll() {
    return await apiClient.get<any[]>('/usuarios')
  }

  static async getById(id: number) {
    return await apiClient.get<any>(`/usuarios/${id}`)
  }

  static async create(usuario: any) {
    return await apiClient.post<any>('/usuarios', usuario)
  }

  static async update(id: number, usuario: any) {
    return await apiClient.put<any>(`/usuarios/${id}`, usuario)
  }

  static async delete(id: number) {
    return await apiClient.delete<void>(`/usuarios/${id}`)
  }

  static async search(termo: string) {
    return await apiClient.get<any[]>(`/usuarios/buscar?termo=${encodeURIComponent(termo)}`)
  }

  static async getByRole(role: string) {
    return await apiClient.get<any[]>(`/usuarios/role/${role}`)
  }

  static async getStatistics() {
    return await apiClient.get<any>('/usuarios/estatisticas')
  }

  static async toggleStatus(id: number) {
    return await apiClient.patch<any>(`/usuarios/${id}/status`)
  }

  static async changePassword(id: number, senhaAtual: string, novaSenha: string) {
    return await apiClient.patch<void>(`/usuarios/${id}/senha?senhaAtual=${senhaAtual}&novaSenha=${novaSenha}`)
  }
}

export class QuestaoApiService {
  static async getAll() {
    return await apiClient.get<any[]>('/questoes')
  }

  static async getById(id: number) {
    return await apiClient.get<any>(`/questoes/${id}`)
  }

  static async create(questao: any) {
    return await apiClient.post<any>('/questoes', questao)
  }

  static async update(id: number, questao: any) {
    return await apiClient.put<any>(`/questoes/${id}`, questao)
  }

  static async delete(id: number) {
    return await apiClient.delete<void>(`/questoes/${id}`)
  }

  static async search(termo: string) {
    return await apiClient.get<any[]>(`/questoes/buscar?termo=${encodeURIComponent(termo)}`)
  }

  static async getByDisciplina(disciplinaId: number) {
    return await apiClient.get<any[]>(`/questoes/disciplina/${disciplinaId}`)
  }

  static async getByStatus(status: string) {
    return await apiClient.get<any[]>(`/questoes/status/${status}`)
  }

  static async getApproved() {
    return await apiClient.get<any[]>('/questoes/aprovadas')
  }

  static async approve(id: number) {
    return await apiClient.patch<any>(`/questoes/${id}/aprovar`)
  }

  static async cancel(id: number) {
    return await apiClient.patch<any>(`/questoes/${id}/cancelar`)
  }

  static async getStatistics() {
    return await apiClient.get<any>('/questoes/estatisticas')
  }

  static async getPaginated(page: number = 0, size: number = 10, sort: string = 'dataCadastro', 
                          direction: string = 'desc', filters: any = {}) {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
      sort,
      direction,
      ...Object.fromEntries(Object.entries(filters).filter(([_, v]) => v != null))
    })
    
    return await apiClient.get<any>(`/questoes/paginado?${params}`)
  }
}

export class AvaliacaoApiService {
  static async getAll() {
    return await apiClient.get<any[]>('/avaliacoes')
  }

  static async getById(id: number) {
    return await apiClient.get<any>(`/avaliacoes/${id}`)
  }

  static async create(avaliacao: any, questoesIds: number[]) {
    return await apiClient.post<any>('/avaliacoes', {
      avaliacao,
      questoesIds
    })
  }

  static async update(id: number, avaliacao: any) {
    return await apiClient.put<any>(`/avaliacoes/${id}`, avaliacao)
  }

  static async delete(id: number) {
    return await apiClient.delete<void>(`/avaliacoes/${id}`)
  }

  static async getByProfessor(professorId: number) {
    return await apiClient.get<any[]>(`/avaliacoes/professor/${professorId}`)
  }

  static async getMyEvaluations() {
    return await apiClient.get<any[]>('/avaliacoes/minhas')
  }

  static async getByStatus(status: string) {
    return await apiClient.get<any[]>(`/avaliacoes/status/${status}`)
  }

  static async getByType(tipoId: number) {
    return await apiClient.get<any[]>(`/avaliacoes/tipo/${tipoId}`)
  }

  static async approve(id: number) {
    return await apiClient.patch<any>(`/avaliacoes/${id}/aprovar`)
  }

  static async cancel(id: number) {
    return await apiClient.patch<any>(`/avaliacoes/${id}/cancelar`)
  }

  static async addQuestions(id: number, questoesIds: number[]) {
    return await apiClient.post<void>(`/avaliacoes/${id}/questoes`, questoesIds)
  }

  static async removeQuestion(avaliacaoId: number, questaoId: number) {
    return await apiClient.delete<void>(`/avaliacoes/${avaliacaoId}/questoes/${questaoId}`)
  }

  static async getQuestions(id: number) {
    return await apiClient.get<any[]>(`/avaliacoes/${id}/questoes`)
  }

  static async getStatistics() {
    return await apiClient.get<any>('/avaliacoes/estatisticas')
  }

  static async getApproved() {
    return await apiClient.get<any[]>('/avaliacoes/aprovadas')
  }

  static async getPending() {
    return await apiClient.get<any[]>('/avaliacoes/pendentes')
  }
}

export class ConfiguracaoApiService {
  // Tipos de Avaliação
  static async getTiposAvaliacoes() {
    return await apiClient.get<any[]>('/configuracoes/tipos-avaliacoes')
  }

  static async createTipoAvaliacao(tipo: any) {
    return await apiClient.post<any>('/configuracoes/tipos-avaliacoes', tipo)
  }

  // Tipos de Alternativas
  static async getTiposAlternativas() {
    return await apiClient.get<any[]>('/configuracoes/tipos-alternativas')
  }

  static async createTipoAlternativa(tipo: any) {
    return await apiClient.post<any>('/configuracoes/tipos-alternativas', tipo)
  }

  // Níveis de Dificuldade
  static async getNiveisDificuldades() {
    return await apiClient.get<any[]>('/configuracoes/niveis-dificuldades')
  }

  static async createNivelDificuldade(nivel: any) {
    return await apiClient.post<any>('/configuracoes/niveis-dificuldades', nivel)
  }

  // Disciplinas
  static async getDisciplinas() {
    return await apiClient.get<any[]>('/configuracoes/disciplinas')
  }

  static async createDisciplina(disciplina: any) {
    return await apiClient.post<any>('/configuracoes/disciplinas', disciplina)
  }

  static async updateDisciplina(id: number, disciplina: any) {
    return await apiClient.put<any>(`/configuracoes/disciplinas/${id}`, disciplina)
  }

  static async deleteDisciplina(id: number) {
    return await apiClient.delete<void>(`/configuracoes/disciplinas/${id}`)
  }

  static async searchDisciplinas(termo: string) {
    return await apiClient.get<any[]>(`/configuracoes/disciplinas/buscar?termo=${encodeURIComponent(termo)}`)
  }

  // Séries
  static async getSeries() {
    return await apiClient.get<any[]>('/configuracoes/series')
  }

  static async createSerie(serie: any) {
    return await apiClient.post<any>('/configuracoes/series', serie)
  }

  static async updateSerie(id: number, serie: any) {
    return await apiClient.put<any>(`/configuracoes/series/${id}`, serie)
  }

  static async deleteSerie(id: number) {
    return await apiClient.delete<void>(`/configuracoes/series/${id}`)
  }
}

export class ParticipanteApiService {
  static async addParticipant(data: any) {
    return await apiClient.post<any>('/participantes', data)
  }

  static async addMultipleParticipants(data: any) {
    return await apiClient.post<any>('/participantes/multiplos', data)
  }

  static async getById(id: number) {
    return await apiClient.get<any>(`/participantes/${id}`)
  }

  static async getByEvaluation(avaliacaoId: number) {
    return await apiClient.get<any[]>(`/participantes/avaliacao/${avaliacaoId}`)
  }

  static async getByStudent(alunoId: number) {
    return await apiClient.get<any[]>(`/participantes/aluno/${alunoId}`)
  }

  static async getMyParticipations() {
    return await apiClient.get<any[]>('/participantes/minhas-provas')
  }

  static async getAvailableExams() {
    return await apiClient.get<any[]>('/participantes/provas-disponiveis')
  }

  static async getExamsInProgress() {
    return await apiClient.get<any[]>('/participantes/provas-em-andamento')
  }

  static async getCompletedExams() {
    return await apiClient.get<any[]>('/participantes/provas-concluidas')
  }

  static async releaseForStudent(id: number, dataInicio: string) {
    return await apiClient.patch<any>(`/participantes/${id}/liberar?dataInicio=${dataInicio}`)
  }

  static async startExam(id: number) {
    return await apiClient.patch<any>(`/participantes/${id}/iniciar`)
  }

  static async finishExam(id: number) {
    return await apiClient.patch<any>(`/participantes/${id}/finalizar`)
  }

  static async markAsEvaluated(id: number) {
    return await apiClient.patch<any>(`/participantes/${id}/marcar-avaliado`)
  }

  static async updateInfo(id: number, data: any) {
    return await apiClient.put<any>(`/participantes/${id}`, data)
  }

  static async remove(id: number) {
    return await apiClient.delete<void>(`/participantes/${id}`)
  }

  static async getStatisticsByEvaluation(avaliacaoId: number) {
    return await apiClient.get<any>(`/participantes/estatisticas/avaliacao/${avaliacaoId}`)
  }

  static async getStatisticsByStudent(alunoId: number) {
    return await apiClient.get<any>(`/participantes/estatisticas/aluno/${alunoId}`)
  }
}

export class RespostaApiService {
  static async saveAnswer(data: any) {
    return await apiClient.post<any>('/respostas', data)
  }

  static async getById(id: number) {
    return await apiClient.get<any>(`/respostas/${id}`)
  }

  static async getByUser(usuarioId: number) {
    return await apiClient.get<any[]>(`/respostas/usuario/${usuarioId}`)
  }

  static async getByQuestion(questaoId: number) {
    return await apiClient.get<any[]>(`/respostas/questao/${questaoId}`)
  }

  static async getByEvaluationAndUser(avaliacaoId: number, usuarioId: number) {
    return await apiClient.get<any[]>(`/respostas/avaliacao/${avaliacaoId}/usuario/${usuarioId}`)
  }

  static async getMyAnswers() {
    return await apiClient.get<any[]>('/respostas/minhas-respostas')
  }

  static async getSpecificAnswer(usuarioId: number, questaoId: number) {
    return await apiClient.get<any>(`/respostas/resposta?usuarioId=${usuarioId}&questaoId=${questaoId}`)
  }

  static async correctManually(id: number, data: any) {
    return await apiClient.patch<any>(`/respostas/${id}/corrigir`, data)
  }

  static async correctAutomatically(id: number) {
    return await apiClient.patch<any>(`/respostas/${id}/corrigir-automaticamente`)
  }

  static async correctAllAutomatically() {
    return await apiClient.post<void>('/respostas/corrigir-automaticamente')
  }

  static async getPendingCorrection() {
    return await apiClient.get<any[]>('/respostas/pendentes-correcao')
  }

  static async getUncorrected() {
    return await apiClient.get<any[]>('/respostas/nao-corrigidas')
  }

  static async getUserStatistics(usuarioId: number) {
    return await apiClient.get<any>(`/respostas/estatisticas/usuario/${usuarioId}`)
  }

  static async getQuestionStatistics(questaoId: number) {
    return await apiClient.get<any>(`/respostas/estatisticas/questao/${questaoId}`)
  }

  static async getMyStatistics() {
    return await apiClient.get<any>('/respostas/estatisticas/minhas')
  }

  static async delete(id: number) {
    return await apiClient.delete<void>(`/respostas/${id}`)
  }

  static async getEvaluationStatistics(avaliacaoId: number) {
    return await apiClient.get<any>(`/respostas/estatisticas/avaliacao/${avaliacaoId}`)
  }
}

// Serviço de Upload
export class UploadApiService {
  static async uploadImage(file: File) {
    const formData = new FormData()
    formData.append('file', file)

    return apiClient.postFormData('/upload/image', formData)
  }

  static async uploadDocument(file: File) {
    const formData = new FormData()
    formData.append('file', file)

    return apiClient.postFormData('/upload/document', formData)
  }

  static async deleteFile(filename: string) {
    return apiClient.delete(`/upload/file?filename=${encodeURIComponent(filename)}`)
  }

  static async getFileInfo(filename: string) {
    return apiClient.get(`/upload/info/${filename}`)
  }

  static getFileUrl(filename: string) {
    return `${API_BASE_URL}/files/${filename}`
  }

  static getImageUrl(filename: string) {
    return `${API_BASE_URL}/files/image/${filename}`
  }

  static getDocumentUrl(filename: string) {
    return `${API_BASE_URL}/files/document/${filename}`
  }
}
