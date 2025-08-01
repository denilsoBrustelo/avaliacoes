# 🐳 Correção do Problema Docker - Frontend

## ❌ Problema Identificado
O erro `"public": not found` ocorreu porque:
- O diretório `public` não existia no projeto frontend
- O Dockerfile estava tentando copiar este diretório obrigatoriamente
- Configuração `output: 'standalone'` estava causando complexidade desnecessária

## ✅ Correções Aplicadas

### 1. Criado diretório `public` necessário
```bash
mkdir -p frontend/public
```

### 2. Adicionados arquivos básicos ao `public`
- `robots.txt` - Para SEO
- `manifest.json` - Para PWA

### 3. Dockerfile Simplificado
Criado `Dockerfile.simple` mais robusto:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN mkdir -p public
ENV NEXT_TELEMETRY_DISABLED 1
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### 4. Docker Compose Atualizado
```yaml
frontend:
  build:
    context: ./frontend
    dockerfile: Dockerfile.simple
```

### 5. Next.js Config Simplificado
Removida configuração `output: 'standalone'` que estava causando complexidade.

## 🚀 Como Testar

### Opção 1: Docker Compose (Recomendado)
```bash
docker-compose build frontend
docker-compose up frontend
```

### Opção 2: Docker Manual
```bash
cd frontend
docker build -f Dockerfile.simple -t sistema-avaliacoes-frontend .
docker run -p 3000:3000 sistema-avaliacoes-frontend
```

## 🔧 Troubleshooting

### Se ainda houver erro:
1. **Limpar cache do Docker:**
   ```bash
   docker system prune -f
   docker-compose build --no-cache frontend
   ```

2. **Verificar estrutura:**
   ```bash
   ls -la frontend/public/
   ```

3. **Build local primeiro:**
   ```bash
   cd frontend
   npm run build
   ```

## 📁 Estrutura Esperada
```
frontend/
├── public/
│   ├── robots.txt
│   └── manifest.json
├── Dockerfile.simple
├── package.json
└── ...outros arquivos
```

## ✅ Status
- ✅ Diretório `public` criado
- ✅ Dockerfile simplificado  
- ✅ Docker Compose atualizado
- ✅ Next.js config otimizado
- 🚀 **Pronto para deploy!**
