# 🚀 Guia Rápido - Sistema de Avaliações

## ⚡ Início Rápido (5 minutos)

### 1. Executar Localmente
```bash
# Clonar o repositório
git clone <repository-url>
cd sistema-avaliacoes

# Executar com script automático
./start.sh start

# Ou manualmente:
# Terminal 1 - Backend
cd backend && ./mvnw spring-boot:run

# Terminal 2 - Frontend  
cd frontend && npm install && npm run dev
```

### 2. Acessar a Aplicação
- 🌐 **Frontend:** http://localhost:3000
- 🔧 **Backend API:** http://localhost:8080
- 📚 **Swagger:** http://localhost:8080/swagger-ui.html
- 🗄️ **H2 Console:** http://localhost:8080/h2-console

### 3. Login Inicial
| Perfil | Email | Senha |
|--------|-------|-------|
| 👨‍💼 Admin | admin@sistema.com | admin123 |
| 👩‍🏫 Professor | professor@sistema.com | prof123 |
| 👨‍🎓 Aluno | aluno@sistema.com | aluno123 |

## 🐳 Executar com Docker

```bash
# Subir todos os serviços
docker-compose up -d

# Verificar status
docker-compose ps

# Ver logs
docker-compose logs -f

# Parar serviços
docker-compose down
```

## 📁 Estrutura Reorganizada

```
sistema-avaliacoes/
├── 📱 frontend/           # Next.js App
│   ├── components/        # Componentes React
│   ├── app/              # Pages e layouts
│   ├── lib/              # API client
│   └── Dockerfile        # Container frontend
├── ⚙️  backend/           # Spring Boot API
│   ├── src/              # Código Java
│   ├── pom.xml           # Dependências
│   └── Dockerfile        # Container backend
├── 🐳 docker-compose.yml # Orquestração
├── 🚀 start.sh           # Script de inicialização
└── 📚 README.md          # Documentação
```

## 🛠️ Scripts Disponíveis

### Script Principal
```bash
./start.sh start         # Iniciar tudo
./start.sh stop          # Parar tudo
./start.sh status        # Ver status
./start.sh logs          # Acompanhar logs
./start.sh docker        # Executar com Docker
```

### Frontend
```bash
cd frontend
npm run dev              # Desenvolvimento
npm run build            # Build produção
npm run lint             # Verificar código
npm run type-check       # Verificar tipos
```

### Backend
```bash
cd backend
./mvnw spring-boot:run   # Executar app
./mvnw test              # Executar testes
./mvnw clean package     # Gerar JAR
```

## 🎯 Funcionalidades por Perfil

### 👨‍💼 Administrador
- ✅ Gestão de usuários
- ✅ Configuração do sistema  
- ✅ Aprovação de conteúdo
- ✅ Relatórios executivos

### 👩‍🏫 Professor
- ✅ Criação de questões
- ✅ Montagem de avaliações
- ✅ Correção de provas
- ✅ Acompanhamento de turmas

### 👨‍🎓 Aluno
- ✅ Visualização de provas
- ✅ Aplicação online
- ✅ Resultados e histórico

## 🔧 Desenvolvimento

### Hot Reload
- ✅ Frontend: Automático com Next.js
- ✅ Backend: Spring Boot DevTools

### Debug
```bash
# Backend com debug
cd backend
./mvnw spring-boot:run -Dspring-boot.run.jvmArguments="-Xdebug -Xrunjdwp:transport=dt_socket,server=y,suspend=n,address=5005"

# Frontend com debug
cd frontend  
npm run dev -- --debug
```

### Banco de Dados
```bash
# H2 Console (desenvolvimento)
URL: http://localhost:8080/h2-console
JDBC URL: jdbc:h2:mem:testdb
User: sa
Password: password

# MySQL (produção)
docker run -d -p 3306:3306 \
  -e MYSQL_ROOT_PASSWORD=rootpass \
  -e MYSQL_DATABASE=sistema_avaliacoes \
  mysql:8.0
```

## 🧪 Testes

```bash
# Backend - Testes unitários
cd backend && ./mvnw test

# Frontend - Linting e tipos
cd frontend && npm run lint && npm run type-check

# Testes de integração (futuro)
cd backend && ./mvnw test -Dtest=*IntegrationTest
```

## 🚨 Troubleshooting

### ❌ Porta 8080 ocupada
```bash
# Verificar processo
lsof -i :8080

# Matar processo
kill -9 <PID>

# Ou usar porta diferente
cd backend
./mvnw spring-boot:run -Dserver.port=8081
```

### ❌ CORS Error
- ✅ Verificar se backend está rodando
- ✅ Confirmar URL da API no frontend (.env.local)
- ✅ Verificar CorsConfig.java

### ❌ JWT Token Inválido
- ✅ Verificar se JWT_SECRET é igual nos dois projetos
- ✅ Fazer logout e login novamente
- ✅ Verificar expiração do token (24h padrão)

### ❌ Dependências do Frontend
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### ❌ Build do Backend Falha
```bash
cd backend
./mvnw clean
./mvnw compile
./mvnw package -DskipTests
```

## 📞 Suporte

- 🐛 **Issues:** [GitHub Issues](../../issues)
- 📧 **Email:** suporte@sistema-avaliacoes.com
- 📖 **Docs:** Ver README.md em cada projeto
- 🔍 **API Docs:** http://localhost:8080/swagger-ui.html

## 🎉 Próximos Passos

1. 📱 **Personalizar:** Alterar cores, logos e textos
2. 🗄️ **Banco:** Configurar MySQL em produção
3. 🔒 **Segurança:** Configurar HTTPS e certificados
4. 📊 **Monitoramento:** Adicionar logs e métricas
5. 🚀 **Deploy:** Configurar CI/CD pipeline

---

**Sistema pronto para usar! 🎯**

*Para documentação detalhada, consulte os READMEs específicos em `frontend/` e `backend/`.*
