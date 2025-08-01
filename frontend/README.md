# Frontend - Sistema de Avaliações

Interface web moderna desenvolvida com Next.js 14 e TypeScript para o sistema de avaliações educacionais.

## 🚀 Tecnologias

- **Next.js 14** - Framework React com App Router
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Framework CSS utilitário
- **React Context API** - Gerenciamento de estado
- **Axios** - Cliente HTTP
- **Lucide Icons** - Ícones modernos

## 📦 Instalação

```bash
# Instalar dependências
npm install

# Executar em desenvolvimento
npm run dev

# Build de produção
npm run build

# Executar produção
npm start
```

## 🌐 URLs

- **Desenvolvimento:** http://localhost:3000
- **API Backend:** http://localhost:8080/api

## 📁 Estrutura

```
frontend/
├── app/                      # Next.js App Router
│   ├── globals.css          # Estilos globais
│   ├── layout.tsx           # Layout principal
│   └── page.tsx             # Página inicial
├── components/              # Componentes React
│   ├── admin/               # Componentes administrativos
│   │   ├── ConfigPage.tsx   # Configurações do sistema
│   │   ├── UserForm.tsx     # Formulário de usuários
│   │   ├── UserList.tsx     # Lista de usuários
│   │   └── UsersPage.tsx    # Página de gestão de usuários
│   ├── aluno/               # Portal do aluno
│   │   ├── AplicacaoProva.tsx # Interface de aplicação
│   │   └── MinhasProvas.tsx   # Provas do aluno
│   ├── auth/                # Autenticação
│   │   └── LoginForm.tsx    # Formulário de login
│   ├── avaliacoes/          # Gestão de avaliações
│   │   ├── AvaliacaoForm.tsx    # Formulário de avaliação
│   │   ├── AvaliacaoView.tsx    # Visualização detalhada
│   │   ├── AvaliacoesList.tsx   # Lista de avaliações
│   │   └── AvaliacoesPage.tsx   # Página principal
│   ├── correcao/            # Sistema de correção
│   │   └── CorrecaoProvas.tsx   # Interface de correção
│   ├── dashboard/           # Dashboard
│   │   ├── Dashboard.tsx        # Dashboard principal
│   │   └── DashboardWithNavigation.tsx # Com navegação
│   ├── layout/              # Layout e navegação
│   │   └── Navbar.tsx       # Barra de navegação
│   ├── questoes/            # Banco de questões
│   │   ├── QuestaoForm.tsx      # Formulário de questão
│   │   ├── QuestaoView.tsx      # Visualização de questão
│   │   ├── QuestoesList.tsx     # Lista de questões
│   │   └── QuestoesPage.tsx     # Página principal
│   └── relatorios/          # Relatórios
│       └── RelatoriosPage.tsx   # Dashboard de relatórios
├── contexts/                # Context API
│   └── AuthContext.tsx      # Contexto de autenticação
├── lib/                     # Utilitários
│   ├── api.ts              # Cliente da API
│   ├── mockData.ts         # Dados de desenvolvimento
│   └── services.ts         # Serviços auxiliares
├── types/                   # Definições TypeScript
│   └── index.ts            # Tipos principais
├── .env.local              # Variáveis de ambiente
├── next.config.js          # Configuração Next.js
├��─ tailwind.config.js      # Configuração Tailwind
└── tsconfig.json           # Configuração TypeScript
```

## 🔧 Configuração

### Variáveis de Ambiente (`.env.local`)

```env
# URL da API backend
NEXT_PUBLIC_API_URL=http://localhost:8080/api

# Usar dados mock (desenvolvimento)
NEXT_PUBLIC_USE_MOCK=false

# Configurações de upload
NEXT_PUBLIC_MAX_FILE_SIZE=5242880
NEXT_PUBLIC_ALLOWED_FORMATS=jpg,jpeg,png,gif,pdf,doc,docx
```

### Tailwind CSS

Configurado com:
- ✅ Cores personalizadas para o tema
- ✅ Componentes utilitários
- ✅ Responsividade completa
- ✅ Dark mode (futuro)

### TypeScript

Configuração estrita com:
- ✅ Verificação rigorosa de tipos
- ✅ Imports absolutos (@/)
- ✅ Path mapping configurado

## 🎨 Componentes Principais

### Autenticação
- **LoginForm** - Formulário de login com validação
- **AuthContext** - Gerenciamento de estado do usuário

### Dashboard
- **Dashboard** - Visão geral com métricas
- **Navbar** - Navegação responsiva com perfis

### Gestão de Questões
- **QuestaoForm** - Criação/edição com upload de imagens
- **QuestoesList** - Lista com filtros e paginação

### Avaliações
- **AvaliacaoForm** - Montagem de provas
- **AplicacaoProva** - Interface do aluno com timer

### Relatórios
- **RelatoriosPage** - Dashboard executivo com gráficos

## 📱 Responsividade

Interface totalmente responsiva:
- 📱 **Mobile First** - Design otimizado para mobile
- 💻 **Desktop** - Layout expandido para telas grandes
- 📊 **Tablet** - Adaptação para tablets

## 🔐 Autenticação

### JWT Integration
```typescript
// Cliente API com JWT automático
const apiClient = new ApiClient('http://localhost:8080/api')

// Login
await AuthApiService.login(email, password)

// Logout
AuthApiService.logout()

// Verificar autenticação
const user = await AuthApiService.me()
```

### Proteção de Rotas
```typescript
// Context de autenticação
const { user, login, logout, loading } = useAuth()

// Componente protegido
if (!user) return <LoginForm />
```

## 🔄 Estado da Aplicação

### Context API
- **AuthContext** - Estado global do usuário
- **Dados locais** - Estado por componente
- **API Cache** - Cache de requisições

### Fluxo de Dados
```
[API] ←→ [Services] ←→ [Context] ←→ [Components]
```

## 🧪 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev              # Servidor de desenvolvimento

# Build
npm run build           # Build de produção
npm run start           # Servidor de produção

# Qualidade
npm run lint            # ESLint
npm run type-check      # Verificação TypeScript

# Utilitários
npm run clean           # Limpar build
npm run analyze         # Analisar bundle
```

## 🎯 Funcionalidades por Perfil

### 👨‍💼 Administrador
- ✅ Gestão completa de usuários
- ✅ Configuração do sistema
- ✅ Aprovação de conteúdo
- ✅ Relatórios executivos

### 👩‍🏫 Professor  
- ✅ Criação de questões com imagens
- ✅ Montagem de avaliações
- ✅ Correção manual e automática
- ✅ Acompanhamento de turmas

### 👨‍🎓 Aluno
- ✅ Visualização de provas
- ✅ Interface de aplicação
- ✅ Timer automático
- ✅ Histórico de resultados

## 🐛 Debug e Desenvolvimento

### Logs
```typescript
// Debug da API
console.log('API Response:', response.data)

// Estado do contexto
console.log('User state:', user)
```

### DevTools
- **React DevTools** - Componentes
- **Redux DevTools** - Estado (futuro)
- **Network Tab** - Requisições API

## 🚀 Deploy

### Vercel (Recomendado)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Build Manual
```bash
npm run build
npm run start
```

## 🔗 Integração com Backend

### API Client
```typescript
// Configuração automática
const API_BASE_URL = 'http://localhost:8080/api'

// Serviços disponíveis
UsuarioApiService.getAll()
QuestaoApiService.create(questao)
AvaliacaoApiService.addQuestions(id, questoes)
```

### Autenticação JWT
- ✅ Token automático nos headers
- ✅ Refresh automático
- ✅ Logout em caso de erro 401

## 📊 Performance

### Otimizações
- ✅ **Lazy Loading** - Componentes sob demanda
- ✅ **Image Optimization** - Next.js Image
- ✅ **Bundle Splitting** - Chunks automáticos
- ✅ **API Caching** - Cache inteligente

### Métricas
- ⚡ **First Paint** < 1s
- ⚡ **Interactive** < 2s
- ⚡ **Bundle Size** < 500kb

## 🤝 Padrões de Código

### Estrutura de Componentes
```typescript
// Componente padrão
export default function ComponentName() {
  // 1. Hooks
  // 2. Estado local
  // 3. Efeitos
  // 4. Handlers
  // 5. Render
}
```

### Naming Conventions
- **Componentes** - PascalCase
- **Arquivos** - kebab-case
- **Props** - camelCase
- **Constants** - UPPER_CASE

## 📚 Recursos Adicionais

- 📖 [Next.js Docs](https://nextjs.org/docs)
- 🎨 [Tailwind CSS](https://tailwindcss.com/docs)
- ⚛️ [React Docs](https://react.dev)
- 📘 [TypeScript Handbook](https://typescriptlang.org/docs)

---

**Frontend moderno, responsivo e pronto para produção! 🚀**
