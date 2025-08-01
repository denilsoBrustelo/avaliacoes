# Multi-stage build para otimizar o tamanho da imagem
FROM maven:3.9.6-eclipse-temurin-17 AS build

# Definir diretório de trabalho
WORKDIR /app

# Copiar arquivos de configuração do Maven
COPY pom.xml .
COPY src ./src

# Executar build do Maven
RUN mvn clean package -DskipTests

# Segunda fase - imagem de runtime
FROM eclipse-temurin:17-jre-alpine

# Metadados da imagem
LABEL maintainer="sistema-avaliacoes@example.com"
LABEL version="1.0"
LABEL description="Backend do Sistema de Avaliações - Spring Boot"

# Instalar curl para health checks
RUN apk add --no-cache curl

# Criar usuário não-root para segurança
RUN addgroup -g 1001 -S appgroup && \
    adduser -u 1001 -S appuser -G appgroup

# Criar diretórios necessários
RUN mkdir -p /app/uploads/images /app/uploads/documents /app/logs
RUN chown -R appuser:appgroup /app

# Definir diretório de trabalho
WORKDIR /app

# Copiar JAR da fase de build
COPY --from=build /app/target/sistema-avaliacoes-*.jar app.jar

# Alterar propriedade do arquivo
RUN chown appuser:appgroup app.jar

# Mudar para usuário não-root
USER appuser

# Expor porta da aplicação
EXPOSE 8080

# Variáveis de ambiente padrão
ENV SPRING_PROFILES_ACTIVE=docker
ENV JAVA_OPTS="-Xms512m -Xmx1024m -XX:+UseG1GC"

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD curl -f http://localhost:8080/actuator/health || exit 1

# Comando para executar a aplicação
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
