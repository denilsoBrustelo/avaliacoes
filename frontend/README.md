# Sistema de Avaliações

Sistema completo de gestão de avaliações educacionais desenvolvido com Spring Boot (backend) e Next.js (frontend).

## 🚀 Funcionalidades

### Backend (Spring Boot)
- **Autenticação JWT** com controle de acesso baseado em roles
- **Gestão de Usuários** (Admin, Professor, Aluno)
- **Banco de Questões** com diferentes tipos e níveis de dificuldade
- **Criação de Avaliações** com seleção de questões
- **Sistema de Aplicação** de provas online
- **Correção Automática e Manual** de respostas
- **Relatórios e Estatísticas** detalhados
- **Upload de Arquivos** e imagens
- **API RESTful** completa com documentação Swagger

### Frontend (Next.js)
- **Interface Responsiva** com Tailwind CSS
- **Dashboard Administrativo** para gestão completa
- **Portal do Professor** para criação e correção
- **Portal do Aluno** para aplicação de provas
- **Sistema de Relatórios** com gráficos e estatísticas
- **Upload de Imagens** para questões
- **Autenticação Integrada** com JWT

## 🛠️ Tecnologias

### Backend
- **Java 17+**
- **Spring Boot 3.2.1**
- **Spring Security** com JWT
- **Spring Data JPA**
- **H2 Database** (desenvolvimento)
- **MySQL** (produção)
- **Maven**
- **Swagger/OpenAPI**

### Frontend
- **Next.js 14**
- **TypeScript**
- **Tailwind CSS**
- **React Context API**
- **Axios**
- **Lucide Icons**

## 📋 Pré-requisitos

- **Java 17** ou superior
- **Node.js 18** ou superior
- **npm** ou **yarn**
- **Maven** (incluído no projeto)

## 🚀 Como Executar

### 1. Backend (Spring Boot)

```bash
# Navegar para o diretório do backend
cd backend

# Executar com Maven
./mvnw spring-boot:run

# Ou compilar e executar
./mvnw clean package
java -jar target/sistema-avaliacoes-0.0.1-SNAPSHOT.jar
```

O backend estará disponível em: `http://localhost:8080`

**Swagger UI:** `http://localhost:8080/swagger-ui.html`
**H2 Console:** `http://localhost:8080/h2-console`

### 2. Frontend (Next.js)

```bash
# Instalar dependências
npm install

# Executar em modo de desenvolvimento
npm run dev
```

O frontend estará disponível em: `http://localhost:3000`

## 🔧 Configuração

### Backend (`application.yml`)

```yaml
spring:
  application:
    name: sistema-avaliacoes
  
  datasource:
    url: jdbc:h2:mem:testdb
    driver-class-name: org.h2.Driver
    username: sa
    password: password
  
  h2:
    console:
      enabled: true
      path: /h2-console
  
  jpa:
    hibernate:
      ddl-auto: create-drop
    show-sql: true
    database-platform: org.hibernate.dialect.H2Dialect

jwt:
  secret: sistema-avaliacoes-secret-key-2024
  expiration: 86400000
```

### Frontend (`.env.local`)

```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
NEXT_PUBLIC_USE_MOCK=false
JWT_SECRET=sistema-avaliacoes-secret-key-2024
NEXT_PUBLIC_MAX_FILE_SIZE=5242880
NEXT_PUBLIC_ALLOWED_FORMATS=jpg,jpeg,png,gif,pdf,doc,docx
```

## 👥 Usuários Padrão

O sistema inicializa com os seguintes usuários:

### Administrador
- **Email:** admin@sistema.com
- **Senha:** admin123
- **Perfil:** ADMIN

### Professor
- **Email:** professor@sistema.com
- **Senha:** prof123
- **Perfil:** PROFESSOR

### Aluno
- **Email:** aluno@sistema.com
- **Senha:** aluno123
- **Perfil:** ALUNO

## 📁 Estrutura do Projeto

```
sistema-avaliacoes/
├── backend/                     # Spring Boot backend
│   ��── src/main/java/com/sistema/avaliacoes/
│   │   ├── config/             # Configurações
│   │   ├── controller/         # Controllers REST
│   │   ├── dto/               # Data Transfer Objects
│   │   ├── model/             # Entidades JPA
│   │   ├── repository/        # Repositórios
│   │   ├── security/          # Configuração de segurança
│   │   └── service/           # Serviços de negócio
│   └── src/main/resources/
│       └── application.yml     # Configurações do Spring
├── components/                 # Componentes React
│   ├── admin/                 # Componentes administrativos
│   ├── aluno/                 # Portal do aluno
│   ├── auth/                  # Autenticação
│   ├── avaliacoes/            # Gestão de avaliações
│   ├── correcao/              # Sistema de correção
│   ├── dashboard/             # Dashboard
│   ├── layout/                # Layout e navegação
│   ├── questoes/              # Banco de questões
│   └── relatorios/            # Relatórios
├── contexts/                   # Context API
├── lib/                       # Utilitários e API client
├── types/                     # Definições TypeScript
└── app/                       # Next.js App Router
```

## 🔒 Segurança

- **Autenticação JWT** com expiração configurável
- **Autorização baseada em roles** (ADMIN, PROFESSOR, ALUNO)
- **CORS configurado** para integração frontend-backend
- **Validação de entrada** em todos os endpoints
- **Proteção contra CSRF**

## 📊 Banco de Dados

### Entidades Principais
- **Usuario** - Gestão de usuários e perfis
- **Questao** - Banco de questões com alternativas
- **Avaliacao** - Avaliações e provas
- **ParticipanteAvaliacao** - Participação dos alunos
- **AvaliacaoResposta** - Respostas e correções
- **Disciplina** - Disciplinas acadêmicas
- **Serie** - Séries/anos escolares

## 🔄 Fluxo de Trabalho

1. **Admin** cria usuários e configura o sistema
2. **Professor** cria questões e avaliações
3. **Admin** aprova questões e avaliações
4. **Professor** adiciona alunos às avaliações
5. **Aluno** realiza as provas disponíveis
6. **Sistema** corrige automaticamente (múltipla escolha)
7. **Professor** corrige manualmente (dissertativas)
8. **Relatórios** são gerados automaticamente

## 📈 API Endpoints

### Autenticação
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Registro
- `GET /api/auth/me` - Perfil do usuário

### Usuários
- `GET /api/usuarios` - Listar usuários
- `POST /api/usuarios` - Criar usuário
- `PUT /api/usuarios/{id}` - Atualizar usuário
- `DELETE /api/usuarios/{id}` - Excluir usuário

### Questões
- `GET /api/questoes` - Listar questões
- `POST /api/questoes` - Criar questão
- `PATCH /api/questoes/{id}/aprovar` - Aprovar questão

### Avaliações
- `GET /api/avaliacoes` - Listar avaliações
- `POST /api/avaliacoes` - Criar avaliação
- `POST /api/avaliacoes/{id}/questoes` - Adicionar questões

### Participantes
- `GET /api/participantes/aluno/disponiveis` - Provas disponíveis
- `POST /api/participantes/{id}/iniciar` - Iniciar prova
- `POST /api/participantes/{id}/finalizar` - Finalizar prova

## 📝 Desenvolvimento

### Comandos Úteis

```bash
# Backend - Executar testes
cd backend && ./mvnw test

# Frontend - Build de produção
npm run build

# Frontend - Linting
npm run lint

# Backend - Gerar documentação
cd backend && ./mvnw javadoc:javadoc
```

## 🐛 Troubleshooting

### Problemas Comuns

1. **Erro de CORS:** Verificar configuração em `CorsConfig.java`
2. **JWT inválido:** Verificar se o secret está correto em ambos os projetos
3. **Porta ocupada:** Alterar porta do backend em `application.yml`
4. **Erro de conexão:** Verificar se o backend está executando na porta 8080

## 📚 Documentação

- **API REST:** `http://localhost:8080/swagger-ui.html`
- **Database Schema:** `http://localhost:8080/h2-console`

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🎯 Próximas Funcionalidades

- [ ] Integração com LMS externos
- [ ] Exportação de relatórios em PDF
- [ ] Sistema de notificações
- [ ] Backup automático
- [ ] Análise de performance com gráficos avançados
- [ ] Suporte a múltiplos idiomas
- [ ] Mobile app com React Native

---

Desenvolvido com ❤️ usando Spring Boot e Next.js
