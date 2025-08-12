# 🔐 Guia de Autenticação JWT no Swagger

## ✅ Problema Resolvido

Agora o Swagger suporta autenticação JWT Bearer Token! Siga os passos abaixo para testar os endpoints protegidos.

## 🚀 Como Usar a Autenticação no Swagger

### 1. **Acesse o Swagger UI**
```
http://localhost:8080/api/swagger-ui.html
```

### 2. **Realize o Login**
1. Encontre o endpoint **POST /auth/login** na seção "Autenticação"
2. Clique em "Try it out"
3. Use um dos usuários padrão:

```json
{
  "email": "admin@sistema.com",
  "senha": "admin123"
}
```

Ou:
```json
{
  "email": "professor@sistema.com", 
  "senha": "prof123"
}
```

4. Clique em "Execute"
5. **Copie o token** da resposta (campo `token`)

### 3. **Configure a Autenticação no Swagger**
1. No topo da página do Swagger, clique no botão **"Authorize"** 🔒
2. Cole o token JWT no campo **"Value"**
3. **Formato**: `Bearer SEU_TOKEN_AQUI`
   
   Exemplo:
   ```
   Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbkBzaXN0ZW1hLmNvbSIsImlhdCI6MTcwNDEwMDAwMCwiZXhwIjoxNzA0MTg2NDAwfQ.exemplo
   ```
4. Clique em **"Authorize"**
5. Clique em **"Close"**

### 4. **Teste os Endpoints Protegidos**
Agora você pode testar qualquer endpoint protegido:
- ✅ **GET /usuarios** - Listar usuários (requer ADMIN)
- ✅ **GET /questoes** - Listar questões (requer ADMIN/PROFESSOR)
- ✅ **GET /avaliacoes** - Listar avaliações (requer ADMIN/PROFESSOR)
- ✅ **POST /questoes** - Criar questão (requer ADMIN/PROFESSOR)

## 🔍 Como Identificar se Está Autenticado

- **🔒 Endpoints com cadeado**: Requerem autenticação
- **🔓 Endpoints sem cadeado**: Públicos (não requerem autenticação)
- **Status 401**: Token inválido ou expirado
- **Status 403**: Token válido mas sem permissão para o endpoint

## 👥 Usuários de Teste

| Email | Senha | Role | Acesso |
|-------|-------|------|---------|
| admin@sistema.com | admin123 | ADMIN | Todos os endpoints |
| professor@sistema.com | prof123 | PROFESSOR | Questões, Avaliações, Configurações |
| aluno@sistema.com | aluno123 | ALUNO | Endpoints específicos de aluno |

## 🔄 Token Expirado?

Se receber erro 401 (Unauthorized):
1. Faça login novamente para obter um novo token
2. Atualize a autenticação no Swagger com o novo token
3. Tokens expiram em 24 horas por padrão

## 📱 Exemplos de Uso

### Login via cURL
```bash
curl -X POST "http://localhost:8080/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@sistema.com",
    "senha": "admin123"
  }'
```

### Usar Token em Requisição
```bash
curl -X GET "http://localhost:8080/api/usuarios" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

## ✨ Recursos Adicionados

- **🔐 Esquema de Segurança JWT**: Configurado para Bearer Token
- **📝 Documentação Completa**: Informações da API, contato, licença
- **🏷️ Tags de Segurança**: Endpoints protegidos claramente marcados
- **🌐 Servidor Local**: Configurado para http://localhost:8080/api

Agora você pode testar todos os endpoints protegidos diretamente no Swagger! 🎉
