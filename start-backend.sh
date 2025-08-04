#!/bin/bash

echo "🚀 Iniciando o Backend do Sistema de Avaliações..."
echo ""

# Check if we're in the right directory
if [ ! -f "backend/pom.xml" ]; then
    echo "❌ Erro: Execute este script na raiz do projeto (onde existe o diretório 'backend')"
    exit 1
fi

# Check if Java is installed
if ! command -v java &> /dev/null; then
    echo "❌ Erro: Java não encontrado. Instale o Java 17 ou superior."
    exit 1
fi

# Check if Maven is installed
if command -v mvn &> /dev/null; then
    MAVEN_CMD="mvn"
elif [ -f "backend/mvnw" ]; then
    MAVEN_CMD="./backend/mvnw"
else
    echo "❌ Erro: Maven não encontrado. Instale o Maven ou use o Maven Wrapper."
    exit 1
fi

echo "✅ Java encontrado: $(java -version 2>&1 | head -n 1)"
echo "✅ Maven encontrado: $MAVEN_CMD"
echo ""
echo "📦 Compilando e iniciando o backend..."
echo "   URL: http://localhost:8080/api"
echo "   Health: http://localhost:8080/api/health"
echo "   Swagger: http://localhost:8080/api/swagger-ui.html"
echo ""
echo "Pressione Ctrl+C para parar o servidor"
echo ""

# Change to backend directory and start
cd backend

if [ "$MAVEN_CMD" = "mvn" ]; then
    mvn spring-boot:run
else
    ./mvnw spring-boot:run
fi
