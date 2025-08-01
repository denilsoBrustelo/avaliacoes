#!/bin/bash

# Script de inicialização do Sistema de Avaliações
# Este script facilita a execução do projeto em diferentes modos

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para imprimir mensagens coloridas
print_message() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "${BLUE}"
    echo "==============================================="
    echo "    Sistema de Avaliações - Startup Script"
    echo "==============================================="
    echo -e "${NC}"
}

# Verificar dependências
check_dependencies() {
    print_message "Verificando dependências..."
    
    # Verificar Java
    if ! command -v java &> /dev/null; then
        print_error "Java não encontrado. Por favor, instale Java 17 ou superior."
        exit 1
    fi
    
    # Verificar Node.js
    if ! command -v node &> /dev/null; then
        print_error "Node.js não encontrado. Por favor, instale Node.js 18 ou superior."
        exit 1
    fi
    
    # Verificar versões
    JAVA_VERSION=$(java -version 2>&1 | grep -oP 'version "([0-9]+)' | grep -oP '[0-9]+' | head -1)
    NODE_VERSION=$(node -v | grep -oP 'v([0-9]+)' | grep -oP '[0-9]+')
    
    if [ "$JAVA_VERSION" -lt "17" ]; then
        print_error "Java 17 ou superior é necessário. Versão atual: $JAVA_VERSION"
        exit 1
    fi
    
    if [ "$NODE_VERSION" -lt "18" ]; then
        print_error "Node.js 18 ou superior é necessário. Versão atual: $NODE_VERSION"
        exit 1
    fi
    
    print_message "✓ Java $JAVA_VERSION encontrado"
    print_message "✓ Node.js v$(node -v) encontrado"
}

# Instalar dependências do frontend
install_frontend_deps() {
    print_message "Instalando dependências do frontend..."
    cd frontend
    
    if [ ! -d "node_modules" ]; then
        npm install
    else
        print_message "Dependências do frontend já instaladas"
    fi
    
    cd ..
}

# Executar backend
start_backend() {
    print_message "Iniciando backend (Spring Boot)..."
    cd backend
    
    # Verificar se o Maven Wrapper existe
    if [ ! -f "mvnw" ]; then
        print_error "Maven Wrapper não encontrado no diretório backend"
        exit 1
    fi
    
    # Dar permissão de execução ao mvnw
    chmod +x mvnw
    
    # Executar em background
    ./mvnw spring-boot:run > ../backend.log 2>&1 &
    BACKEND_PID=$!
    echo $BACKEND_PID > ../backend.pid
    
    cd ..
    
    print_message "Backend iniciado (PID: $BACKEND_PID)"
    print_message "Logs do backend: backend.log"
    print_message "Aguardando backend inicializar..."
    
    # Aguardar backend ficar disponível
    for i in {1..30}; do
        if curl -s http://localhost:8080/actuator/health &> /dev/null; then
            print_message "✓ Backend disponível em http://localhost:8080"
            break
        fi
        echo -n "."
        sleep 2
    done
    echo ""
}

# Executar frontend
start_frontend() {
    print_message "Iniciando frontend (Next.js)..."
    cd frontend
    
    # Executar em background
    npm run dev > ../frontend.log 2>&1 &
    FRONTEND_PID=$!
    echo $FRONTEND_PID > ../frontend.pid
    
    cd ..
    
    print_message "Frontend iniciado (PID: $FRONTEND_PID)"
    print_message "Logs do frontend: frontend.log"
    print_message "Aguardando frontend inicializar..."
    
    # Aguardar frontend ficar disponível
    for i in {1..20}; do
        if curl -s http://localhost:3000 &> /dev/null; then
            print_message "✓ Frontend disponível em http://localhost:3000"
            break
        fi
        echo -n "."
        sleep 2
    done
    echo ""
}

# Parar serviços
stop_services() {
    print_message "Parando serviços..."
    
    if [ -f "backend.pid" ]; then
        BACKEND_PID=$(cat backend.pid)
        kill $BACKEND_PID 2>/dev/null || true
        rm backend.pid
        print_message "Backend parado"
    fi
    
    if [ -f "frontend.pid" ]; then
        FRONTEND_PID=$(cat frontend.pid)
        kill $FRONTEND_PID 2>/dev/null || true
        rm frontend.pid
        print_message "Frontend parado"
    fi
    
    # Matar processos restantes
    pkill -f "spring-boot:run" 2>/dev/null || true
    pkill -f "next" 2>/dev/null || true
}

# Status dos serviços
status_services() {
    print_message "Status dos serviços:"
    
    if [ -f "backend.pid" ]; then
        BACKEND_PID=$(cat backend.pid)
        if ps -p $BACKEND_PID &> /dev/null; then
            print_message "✓ Backend rodando (PID: $BACKEND_PID)"
        else
            print_warning "Backend PID encontrado mas processo não está rodando"
        fi
    else
        print_warning "Backend não está rodando"
    fi
    
    if [ -f "frontend.pid" ]; then
        FRONTEND_PID=$(cat frontend.pid)
        if ps -p $FRONTEND_PID &> /dev/null; then
            print_message "✓ Frontend rodando (PID: $FRONTEND_PID)"
        else
            print_warning "Frontend PID encontrado mas processo não está rodando"
        fi
    else
        print_warning "Frontend não está rodando"
    fi
}

# Logs em tempo real
follow_logs() {
    print_message "Seguindo logs (Ctrl+C para parar)..."
    
    if [ -f "backend.log" ] && [ -f "frontend.log" ]; then
        tail -f backend.log frontend.log
    elif [ -f "backend.log" ]; then
        tail -f backend.log
    elif [ -f "frontend.log" ]; then
        tail -f frontend.log
    else
        print_warning "Nenhum arquivo de log encontrado"
    fi
}

# Executar com Docker
docker_start() {
    print_message "Iniciando com Docker Compose..."
    
    if ! command -v docker &> /dev/null; then
        print_error "Docker não encontrado. Por favor, instale o Docker."
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose não encontrado. Por favor, instale o Docker Compose."
        exit 1
    fi
    
    docker-compose up -d
    
    print_message "Serviços Docker iniciados:"
    print_message "- Frontend: http://localhost:3000"
    print_message "- Backend: http://localhost:8080"
    print_message "- MySQL: localhost:3306"
}

# Parar Docker
docker_stop() {
    print_message "Parando serviços Docker..."
    docker-compose down
}

# Menu de ajuda
show_help() {
    echo "Sistema de Avaliações - Script de Inicialização"
    echo ""
    echo "Uso: $0 [COMANDO]"
    echo ""
    echo "Comandos disponíveis:"
    echo "  start       Iniciar backend e frontend em modo desenvolvimento"
    echo "  stop        Parar todos os serviços"
    echo "  restart     Reiniciar todos os serviços"
    echo "  status      Mostrar status dos serviços"
    echo "  logs        Seguir logs em tempo real"
    echo "  backend     Iniciar apenas o backend"
    echo "  frontend    Iniciar apenas o frontend"
    echo "  docker      Iniciar com Docker Compose"
    echo "  docker-stop Parar serviços Docker"
    echo "  clean       Limpar logs e arquivos temporários"
    echo "  help        Mostrar esta ajuda"
    echo ""
    echo "URLs padrão:"
    echo "  Frontend:    http://localhost:3000"
    echo "  Backend:     http://localhost:8080"
    echo "  Swagger UI:  http://localhost:8080/swagger-ui.html"
    echo "  H2 Console:  http://localhost:8080/h2-console"
    echo ""
}

# Limpar arquivos temporários
clean_temp() {
    print_message "Limpando arquivos temporários..."
    rm -f *.log *.pid
    print_message "Limpeza concluída"
}

# Função principal
main() {
    case "$1" in
        "start")
            print_header
            check_dependencies
            install_frontend_deps
            start_backend
            start_frontend
            print_message ""
            print_message "🚀 Sistema iniciado com sucesso!"
            print_message "📱 Frontend: http://localhost:3000"
            print_message "🔧 Backend: http://localhost:8080"
            print_message "📚 Swagger: http://localhost:8080/swagger-ui.html"
            print_message ""
            print_message "Use '$0 logs' para acompanhar os logs"
            print_message "Use '$0 stop' para parar os serviços"
            ;;
        "stop")
            stop_services
            ;;
        "restart")
            stop_services
            sleep 2
            main start
            ;;
        "status")
            status_services
            ;;
        "logs")
            follow_logs
            ;;
        "backend")
            print_header
            check_dependencies
            start_backend
            ;;
        "frontend")
            print_header
            check_dependencies
            install_frontend_deps
            start_frontend
            ;;
        "docker")
            docker_start
            ;;
        "docker-stop")
            docker_stop
            ;;
        "clean")
            clean_temp
            ;;
        "help"|"--help"|"-h"|"")
            show_help
            ;;
        *)
            print_error "Comando não reconhecido: $1"
            show_help
            exit 1
            ;;
    esac
}

# Trap para limpar ao sair
trap 'stop_services' EXIT

# Executar função principal
main "$@"
