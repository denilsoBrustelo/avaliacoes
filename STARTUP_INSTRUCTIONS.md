# 🚀 Como Iniciar o Sistema de Avaliações

## ⚡ Início Rápido

### 1. Iniciar o Backend (Spring Boot)

```bash
cd backend
mvn spring-boot:run
```

**Ou com Maven Wrapper:**
```bash
cd backend
./mvnw spring-boot:run
```

### 2. Iniciar o Frontend (Next.js)

O frontend já está rodando automaticamente na porta 3000.

---

## 🔍 Verificar se está funcionando

### Backend (porta 8080):
- **Health Check:** http://localhost:8080/api/health
- **Swagger UI:** http://localhost:8080/api/swagger-ui.html
- **H2 Console:** http://localhost:8080/api/h2-console

### Frontend (porta 3000):
- **Aplicação:** http://localhost:3000

---

## 📋 Pré-requisitos

- **Java 17+** para o backend
- **Maven 3.6+** (ou use o Maven Wrapper incluído)
- **Node.js 18+** para o frontend (já configurado)

---

## 🛠️ Resolução de Problemas

### ❌ Backend não inicia
1. Verifique se o Java 17+ está instalado: `java -version`
2. Verifique se a porta 8080 está livre
3. Execute: `cd backend && mvn clean install`

### ❌ Frontend mostra "Backend desconectado"
1. Certifique-se que o backend está rodando na porta 8080
2. Teste: http://localhost:8080/api/health
3. Clique em "Reconectar" na interface

### ❌ Erro de CORS
- O backend já está configurado para aceitar requisições do localhost:3000

---

## 🎯 Usuários de Teste

Após o backend iniciar, você pode fazer login com:

- **Admin:** admin@sistema.com / admin123
- **Professor:** professor@sistema.com / prof123  
- **Aluno:** aluno@sistema.com / aluno123

---

## 📁 Estrutura do Projeto

```
├── backend/           # Spring Boot API (porta 8080)
├── frontend/          # Next.js aplicação (porta 3000)
├── docker-compose.yml # Configuração Docker
└── start-backend.sh   # Script de inicialização
```

---

## 🐳 Alternativa com Docker

```bash
docker-compose up --build
```

---

## 📚 Documentação da API

Após iniciar o backend, acesse:
http://localhost:8080/api/swagger-ui.html
