# Multi-stage build para otimizar o tamanho da imagem
FROM node:18-alpine AS base

# Instalar dependências apenas quando necessário
FROM base AS deps
# Verificar documentação https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Instalar dependências baseado no package manager preferido
COPY package.json package-lock.json* ./
RUN npm ci

# Rebuild o código fonte apenas quando necessário
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Desabilitar telemetria durante o build
ENV NEXT_TELEMETRY_DISABLED 1

# Build da aplicação
RUN npm run build

# Imagem de produção, copiar todos os arquivos e executar next
FROM base AS runner
WORKDIR /app

# Metadados da imagem
LABEL maintainer="sistema-avaliacoes@example.com"
LABEL version="1.0"
LABEL description="Frontend do Sistema de Avaliações - Next.js"

# Desabilitar telemetria durante o runtime
ENV NEXT_TELEMETRY_DISABLED 1
ENV NODE_ENV production

# Criar usuário não-root para segurança
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copiar arquivos necessários
COPY --from=builder /app/public ./public

# Utilizar Automatic Static Optimization
# https://nextjs.org/docs/advanced-features/automatic-static-optimization
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Mudar para usuário não-root
USER nextjs

# Expor porta da aplicação
EXPOSE 3000

# Variáveis de ambiente
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
    CMD curl -f http://localhost:3000/api/health || exit 1

# Comando para executar a aplicação
CMD ["node", "server.js"]
