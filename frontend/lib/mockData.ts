import { 
  Usuario, 
  UserRole, 
  TipoAvaliacao, 
  TipoAlternativa, 
  NivelDificuldade,
  Disciplina,
  Serie,
  Questao,
  QuestaoAlternativa,
  QuestaoContexto,
  Avaliacao,
  StatusQuestao,
  StatusAvaliacao
} from '@/types'

// Usuários do sistema
export const mockUsuarios: Usuario[] = [
  {
    id: 1,
    data_cadastro: new Date('2023-01-15'),
    cpf: '12345678901',
    nome: 'Administrador Sistema',
    email: 'admin@sistema.com',
    senha: 'admin123',
    roles: [UserRole.ADMIN],
    status: true
  },
  {
    id: 2,
    data_cadastro: new Date('2023-02-20'),
    cpf: '98765432109',
    nome: 'Professor João Silva',
    email: 'professor@sistema.com',
    senha: 'prof123',
    roles: [UserRole.PROFESSOR],
    status: true
  },
  {
    id: 3,
    data_cadastro: new Date('2023-03-10'),
    cpf: '11122233344',
    nome: 'Aluno Maria Santos',
    email: 'aluno@sistema.com',
    senha: 'aluno123',
    roles: [UserRole.ALUNO],
    status: true
  },
  {
    id: 4,
    data_cadastro: new Date('2023-03-15'),
    cpf: '55566677788',
    nome: 'Professora Ana Costa',
    email: 'ana@sistema.com',
    senha: 'ana123',
    roles: [UserRole.PROFESSOR],
    status: true
  },
  {
    id: 5,
    data_cadastro: new Date('2023-04-01'),
    cpf: '99988877766',
    nome: 'Aluno Carlos Lima',
    email: 'carlos@sistema.com',
    senha: 'carlos123',
    roles: [UserRole.ALUNO],
    status: true
  }
]

// Tipos de Avaliação
export const mockTiposAvaliacoes: TipoAvaliacao[] = [
  {
    id: 1,
    data_cadastro: new Date('2023-01-01'),
    descricao: 'Diagnóstica',
    status: true
  },
  {
    id: 2,
    data_cadastro: new Date('2023-01-01'),
    descricao: 'Processual',
    status: true
  },
  {
    id: 3,
    data_cadastro: new Date('2023-01-01'),
    descricao: 'Final de Ciclo',
    status: true
  },
  {
    id: 4,
    data_cadastro: new Date('2023-01-01'),
    descricao: 'Certificadora',
    status: true
  }
]

// Tipos de Alternativas
export const mockTiposAlternativas: TipoAlternativa[] = [
  {
    id: 1,
    data_cadastro: new Date('2023-01-01'),
    descricao: 'Dissertativa',
    status: true
  },
  {
    id: 2,
    data_cadastro: new Date('2023-01-01'),
    descricao: 'Múltipla Escolha',
    status: true
  },
  {
    id: 3,
    data_cadastro: new Date('2023-01-01'),
    descricao: 'Texto de Referência',
    status: true
  },
  {
    id: 4,
    data_cadastro: new Date('2023-01-01'),
    descricao: 'Imagem de Referência',
    status: true
  },
  {
    id: 5,
    data_cadastro: new Date('2023-01-01'),
    descricao: 'Imagem nas Alternativas',
    status: true
  }
]

// Níveis de Dificuldade
export const mockNiveisDificuldades: NivelDificuldade[] = [
  {
    id: 1,
    data_cadastro: new Date('2023-01-01'),
    descricao: 'Fácil',
    status: true
  },
  {
    id: 2,
    data_cadastro: new Date('2023-01-01'),
    descricao: 'Médio',
    status: true
  },
  {
    id: 3,
    data_cadastro: new Date('2023-01-01'),
    descricao: 'Difícil',
    status: true
  }
]

// Disciplinas
export const mockDisciplinas: Disciplina[] = [
  {
    id: 1,
    descricao: 'Matemática',
    id_disciplina_externo: 'MAT001',
    status: true
  },
  {
    id: 2,
    descricao: 'Português',
    id_disciplina_externo: 'POR001',
    status: true
  },
  {
    id: 3,
    descricao: 'História',
    id_disciplina_externo: 'HIS001',
    status: true
  },
  {
    id: 4,
    descricao: 'Geografia',
    id_disciplina_externo: 'GEO001',
    status: true
  },
  {
    id: 5,
    descricao: 'Ciências',
    id_disciplina_externo: 'CIE001',
    status: true
  }
]

// Séries
export const mockSeries: Serie[] = [
  {
    id: 1,
    descricao: '1º Ano - Ensino Fundamental',
    id_serie_externo: '1EF',
    status: true
  },
  {
    id: 2,
    descricao: '2º Ano - Ensino Fundamental',
    id_serie_externo: '2EF',
    status: true
  },
  {
    id: 3,
    descricao: '3º Ano - Ensino Fundamental',
    id_serie_externo: '3EF',
    status: true
  },
  {
    id: 4,
    descricao: '1º Ano - Ensino Médio',
    id_serie_externo: '1EM',
    status: true
  },
  {
    id: 5,
    descricao: '2º Ano - Ensino Médio',
    id_serie_externo: '2EM',
    status: true
  }
]

// Contextos de Questões
export const mockQuestoesContextos: QuestaoContexto[] = [
  {
    id: 1,
    data_cadastro: new Date('2023-05-01'),
    contexto: 'João possui uma horta em sua casa onde cultiva diversos tipos de vegetais. Ele observou que algumas plantas crescem mais rapidamente que outras e decidiu fazer um estudo para entender melhor esse fenômeno.',
    gerador_ia: false
  },
  {
    id: 2,
    data_cadastro: new Date('2023-05-02'),
    contexto: 'Uma escola organizou uma feira de ciências onde os alunos apresentaram diversos experimentos. Durante o evento, foram coletados dados sobre o interesse dos visitantes pelos diferentes projetos.',
    gerador_ia: true
  }
]

// Questões
export const mockQuestoes: Questao[] = [
  {
    id: 1,
    data_cadastro: new Date('2023-05-01'),
    questao_contexto_id: 1,
    pergunta: 'Com base no contexto apresentado, qual seria a melhor forma de João medir o crescimento das plantas?',
    gerador_ia: false,
    status_questao_id: StatusQuestao.APROVADO,
    disciplina_id: 5, // Ciências
    pontuacao: 2.5,
    tipo_alternativa_id: 2, // Múltipla Escolha
    nivel_dificuldade_id: 2, // Médio
    ciclo: 'Ensino Fundamental II',
    fase: '6º ao 9º ano',
    tema: 'Botânica',
    habilidades: 'Observação científica, medição, análise de dados'
  },
  {
    id: 2,
    data_cadastro: new Date('2023-05-02'),
    pergunta: 'Resolva a equação: 2x + 5 = 13',
    gerador_ia: false,
    status_questao_id: StatusQuestao.APROVADO,
    disciplina_id: 1, // Matemática
    pontuacao: 3.0,
    tipo_alternativa_id: 2, // Múltipla Escolha
    nivel_dificuldade_id: 1, // Fácil
    ciclo: 'Ensino Fundamental II',
    fase: '7º ano',
    tema: 'Álgebra',
    habilidades: 'Resolução de equações do 1º grau'
  },
  {
    id: 3,
    data_cadastro: new Date('2023-05-03'),
    pergunta: 'Explique a importância da fotossíntese para o meio ambiente.',
    gerador_ia: true,
    status_questao_id: StatusQuestao.APROVADO,
    disciplina_id: 5, // Ciências
    pontuacao: 4.0,
    tipo_alternativa_id: 1, // Dissertativa
    resposta_correta: 'A fotossíntese é fundamental pois converte CO2 em oxigênio, purifica o ar, produz energia para as plantas e forma a base da cadeia alimentar.',
    nivel_dificuldade_id: 2, // Médio
    ciclo: 'Ensino Fundamental II',
    fase: '8º ano',
    tema: 'Fotossíntese',
    habilidades: 'Compreensão de processos biológicos, análise ambiental'
  }
]

// Alternativas de Questões
export const mockQuestoesAlternativas: QuestaoAlternativa[] = [
  // Alternativas para questão 1
  {
    id: 1,
    data_cadastro: new Date('2023-05-01'),
    questao_id: 1,
    alternativa: 'A',
    conteudo: 'Medir apenas a altura das plantas uma vez por semana',
    correta: false
  },
  {
    id: 2,
    data_cadastro: new Date('2023-05-01'),
    questao_id: 1,
    alternativa: 'B',
    conteudo: 'Medir altura e largura das plantas diariamente, registrando os dados em uma tabela',
    correta: true
  },
  {
    id: 3,
    data_cadastro: new Date('2023-05-01'),
    questao_id: 1,
    alternativa: 'C',
    conteudo: 'Observar as plantas sem fazer nenhum tipo de medição',
    correta: false
  },
  {
    id: 4,
    data_cadastro: new Date('2023-05-01'),
    questao_id: 1,
    alternativa: 'D',
    conteudo: 'Contar apenas o número de folhas das plantas',
    correta: false
  },
  
  // Alternativas para questão 2
  {
    id: 5,
    data_cadastro: new Date('2023-05-02'),
    questao_id: 2,
    alternativa: 'A',
    conteudo: 'x = 4',
    correta: true
  },
  {
    id: 6,
    data_cadastro: new Date('2023-05-02'),
    questao_id: 2,
    alternativa: 'B',
    conteudo: 'x = 6',
    correta: false
  },
  {
    id: 7,
    data_cadastro: new Date('2023-05-02'),
    questao_id: 2,
    alternativa: 'C',
    conteudo: 'x = 8',
    correta: false
  },
  {
    id: 8,
    data_cadastro: new Date('2023-05-02'),
    questao_id: 2,
    alternativa: 'D',
    conteudo: 'x = 9',
    correta: false
  }
]

// Avaliações
export const mockAvaliacoes: Avaliacao[] = [
  {
    id: 1,
    data_cadastro: new Date('2023-06-01'),
    tipo_avaliacao_id: 2, // Processual
    instrucao: 'Esta avaliação tem como objetivo verificar o conhecimento adquirido sobre os temas estudados no bimestre. Leia atentamente cada questão antes de responder.',
    responsavel_id: 2, // Professor João Silva
    status_avaliacao_id: StatusAvaliacao.APROVADO
  },
  {
    id: 2,
    data_cadastro: new Date('2023-06-15'),
    tipo_avaliacao_id: 1, // Diagnóstica
    instrucao: 'Avaliação diagnóstica para identificar o nível de conhecimento dos alunos sobre matemática básica.',
    responsavel_id: 4, // Professora Ana Costa
    status_avaliacao_id: StatusAvaliacao.APROVADO
  }
]

// Status Tables
export const statusAplicacoes = [
  { id: 0, descricao: 'Pendente', status: true },
  { id: 1, descricao: 'Iniciado', status: true },
  { id: 2, descricao: 'Em Andamento', status: true },
  { id: 3, descricao: 'Concluído', status: true }
]

export const statusQuestoes = [
  { id: 0, descricao: 'Pendente', status: true },
  { id: 1, descricao: 'Aprovado', status: true },
  { id: 2, descricao: 'Cancelado', status: true }
]

export const statusAvaliacoes = [
  { id: 0, descricao: 'Pendente', status: true },
  { id: 1, descricao: 'Aprovado', status: true },
  { id: 2, descricao: 'Cancelado', status: true }
]
