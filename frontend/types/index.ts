// Enums para tipos específicos
export enum UserRole {
  ADMIN = 'ROLE_ADMIN',
  PROFESSOR = 'ROLE_PROFESSOR',
  ALUNO = 'ROLE_ALUNO'
}

export enum StatusAplicacao {
  PENDENTE = 0,
  INICIADO = 1,
  EM_ANDAMENTO = 2,
  CONCLUIDO = 3
}

export enum StatusQuestao {
  PENDENTE = 0,
  APROVADO = 1,
  CANCELADO = 2
}

export enum StatusAvaliacao {
  PENDENTE = 0,
  APROVADO = 1,
  CANCELADO = 2
}

export enum TipoCorrecao {
  IA = 'I',
  MANUAL = 'M'
}

// Interfaces principais baseadas no MER

export interface Usuario {
  id: number;
  data_cadastro: Date;
  cpf: string;
  nome: string;
  email: string;
  senha: string;
  roles: UserRole[];
  status: boolean;
}

export interface TipoAvaliacao {
  id: number;
  data_cadastro: Date;
  descricao: string;
  status: boolean;
}

export interface TipoAlternativa {
  id: number;
  data_cadastro: Date;
  descricao: string;
  status: boolean;
}

export interface NivelDificuldade {
  id: number;
  data_cadastro: Date;
  descricao: string;
  status: boolean;
}

export interface Disciplina {
  id: number;
  descricao: string;
  id_disciplina_externo: string;
  status: boolean;
}

export interface Serie {
  id: number;
  descricao: string;
  id_serie_externo: string;
  status: boolean;
}

export interface QuestaoContexto {
  id: number;
  data_cadastro: Date;
  contexto: string;
  gerador_ia: boolean;
  arquivo_imagem?: string;
}

export interface Questao {
  id: number;
  data_cadastro: Date;
  questao_contexto_id?: number;
  pergunta: string;
  gerador_ia: boolean;
  status_questao_id: number;
  disciplina_id?: number;
  pontuacao?: number;
  arquivo_imagem?: string;
  tipo_alternativa_id: number;
  resposta_correta?: string;
  nivel_dificuldade_id?: number;
  ciclo?: string;
  fase?: string;
  tema?: string;
  habilidades?: string;
  // Relacionamentos
  contexto?: QuestaoContexto;
  disciplina?: Disciplina;
  tipo_alternativa?: TipoAlternativa;
  nivel_dificuldade?: NivelDificuldade;
  alternativas?: QuestaoAlternativa[];
}

export interface QuestaoAlternativa {
  id: number;
  data_cadastro: Date;
  questao_id: number;
  alternativa: string; // A, B, C, D, E
  conteudo: string;
  arquivo_imagem?: string;
  correta: boolean;
}

export interface Avaliacao {
  id: number;
  data_cadastro: Date;
  tipo_avaliacao_id: number;
  instrucao?: string;
  responsavel_id: number;
  status_avaliacao_id: number;
  // Relacionamentos
  tipo_avaliacao?: TipoAvaliacao;
  responsavel?: Usuario;
  questoes?: Questao[];
}

export interface AvaliacaoQuestao {
  id: number;
  data_cadastro: Date;
  avaliacao_id: number;
  questao_id: number;
}

export interface ParticipanteAvaliacao {
  id: number;
  data_cadastro: Date;
  avaliacao_id: number;
  usuario_id: number;
  ano?: string;
  escola?: string;
  turma?: string;
  disponivel: boolean;
  data_inicio_avaliacao?: Date;
  data_inicio?: Date;
  hora_inicio?: string;
  data_fim?: Date;
  hora_fim?: string;
  status_aplicacao_id: number;
  avaliado: boolean;
  // Relacionamentos
  avaliacao?: Avaliacao;
  usuario?: Usuario;
}

export interface AvaliacaoResposta {
  id: number;
  data_cadastro: Date;
  usuario_id: number;
  questao_id: number;
  resposta?: string;
  questao_alternativa_id?: number;
  correta?: boolean;
  corrigido_por?: TipoCorrecao;
  observacoes?: string;
  pontuacao?: number;
  // Relacionamentos
  usuario?: Usuario;
  questao?: Questao;
  alternativa_selecionada?: QuestaoAlternativa;
}

export interface ProblemaQuestao {
  id: number;
  data_cadastro: Date;
  descricao: string;
  questao_id: number;
  questao?: Questao;
}

export interface AvaliacaoParametro {
  id: number;
  avaliacao_id: number;
  data_aplicacao?: Date;
  usuario_id?: number;
  status_aplicacao_id?: number;
  status: boolean;
  // Relacionamentos
  avaliacao?: Avaliacao;
  usuario?: Usuario;
}

// Tipos para formulários e DTOs
export interface CreateUsuarioDTO {
  cpf: string;
  nome: string;
  email: string;
  senha: string;
  roles: UserRole[];
}

export interface LoginDTO {
  email: string;
  senha: string;
}

export interface CreateQuestaoDTO {
  questao_contexto_id?: number;
  pergunta: string;
  disciplina_id?: number;
  pontuacao?: number;
  arquivo_imagem?: string;
  tipo_alternativa_id: number;
  resposta_correta?: string;
  nivel_dificuldade_id?: number;
  ciclo?: string;
  fase?: string;
  tema?: string;
  habilidades?: string;
  alternativas?: Omit<QuestaoAlternativa, 'id' | 'data_cadastro' | 'questao_id'>[];
}

export interface CreateAvaliacaoDTO {
  tipo_avaliacao_id: number;
  instrucao?: string;
  questoes_ids: number[];
}

// Tipos para relatórios e estatísticas
export interface RelatorioDesempenho {
  participante: Usuario;
  avaliacao: Avaliacao;
  total_questoes: number;
  questoes_corretas: number;
  percentual_acerto: number;
  tempo_total?: number;
  status: StatusAplicacao;
}

export interface EstatisticasQuestao {
  questao: Questao;
  total_respostas: number;
  respostas_corretas: number;
  percentual_acerto: number;
  tempo_medio_resposta?: number;
}
