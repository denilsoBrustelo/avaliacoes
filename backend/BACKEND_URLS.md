# 🚀 Sistema de Avaliações - URLs do Backend

## 📋 Problema Identificado

O backend está configurado com **context-path: /api**, então todas as URLs precisam incluir `/api` no início.

## 🔗 URLs Corretas

### 📚 **Documentação API (Swagger)**
- ✅ **URL Correta**: http://localhost:8080/api/swagger-ui.html
- ❌ **URL Incorreta**: http://localhost:8080/swagger-ui.html

### 🗄️ **Console H2 Database**
- ✅ **URL**: http://localhost:8080/api/h2-console
- **Credenciais**:
  - JDBC URL: `jdbc:h2:mem:avaliacoes_db`
  - Username: `sa`
  - Password: `password`

### 🔧 **Health Check**
- ✅ **URL**: http://localhost:8080/api/health

### 🔐 **Autenticação**
- ✅ **Login**: POST http://localhost:8080/api/auth/login
- ✅ **Me**: GET http://localhost:8080/api/auth/me

### 📊 **APIs Principais**

#### 👥 **Usuários** (Requer: ADMIN)
- GET http://localhost:8080/api/usuarios
- POST http://localhost:8080/api/usuarios

#### ❓ **Questões** (Requer: ADMIN/PROFESSOR)
- GET http://localhost:8080/api/questoes
- GET http://localhost:8080/api/questoes/aprovadas (Público)
- POST http://localhost:8080/api/questoes

#### 📝 **Avaliações** (Requer: ADMIN/PROFESSOR)
- GET http://localhost:8080/api/avaliacoes
- POST http://localhost:8080/api/avaliacoes

#### ⚙️ **Configurações** (Requer: ADMIN/PROFESSOR)
- GET http://localhost:8080/api/configuracoes/tipos-avaliacoes (Público)
- GET http://localhost:8080/api/configuracoes/disciplinas

## 🧪 **Teste Rápido**

Para testar se o backend está funcionando:

```bash
# Teste básico de conectividade
curl http://localhost:8080/api/health

# Teste da documentação Swagger
curl http://localhost:8080/api/v3/api-docs

# Teste de login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@sistema.com","senha":"admin123"}'
```

## 🔧 **Como Alterar Context Path (Opcional)**

Se quiser remover o `/api` do início das URLs, edite `application.yml`:

```yaml
server:
  port: 8080
  # servlet:
  #   context-path: /api  # Comentar ou remover esta linha
```

**Depois da alteração, as URLs seriam:**
- Swagger: http://localhost:8080/swagger-ui.html
- H2 Console: http://localhost:8080/h2-console
- APIs: http://localhost:8080/usuarios, etc.

## 📝 **Usuários Padrão**

O sistema já cria estes usuários automaticamente:

| Email | Senha | Role |
|-------|-------|------|
| admin@sistema.com | admin123 | ADMIN |
| professor@sistema.com | prof123 | PROFESSOR |
| aluno@sistema.com | aluno123 | ALUNO |

## ✅ **Verificação**

✅ Backend rodando: http://localhost:8080  
✅ Swagger: http://localhost:8080/api/swagger-ui.html  
✅ H2 Console: http://localhost:8080/api/h2-console  
✅ API Docs: http://localhost:8080/api/v3/api-docs  
