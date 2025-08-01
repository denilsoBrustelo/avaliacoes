# Backend - Sistema de Avaliações

API REST robusta desenvolvida com Spring Boot 3 para o sistema de avaliações educacionais.

## 🚀 Tecnologias

- **Java 17** - Linguagem principal
- **Spring Boot 3.2.1** - Framework principal
- **Spring Security** - Autenticação e autorização
- **Spring Data JPA** - Persistência de dados
- **JWT** - Tokens de autenticação
- **H2 Database** - Banco em desenvolvimento
- **MySQL** - Banco em produção
- **Maven** - Gerenciamento de dependências
- **OpenAPI/Swagger** - Documentação da API

## 📦 Execução

```bash
# Executar aplicação
./mvnw spring-boot:run

# Executar testes
./mvnw test

# Gerar build
./mvnw clean package

# Executar JAR
java -jar target/sistema-avaliacoes-0.0.1-SNAPSHOT.jar
```

## 🌐 URLs

- **API REST:** http://localhost:8080/api
- **Swagger UI:** http://localhost:8080/swagger-ui.html
- **H2 Console:** http://localhost:8080/h2-console

## 📁 Estrutura

```
backend/
├── src/main/java/com/sistema/avaliacoes/
│   ├── config/                 # Configurações
│   │   ├── CorsConfig.java    # Configuração CORS
│   │   ├── DataInitializer.java # Dados iniciais
│   │   └── SecurityConfig.java  # Segurança
│   ├── controller/            # Controllers REST
│   │   ├── AuthController.java        # Autenticação
│   │   ├── UsuarioController.java     # Gestão de usuários
│   │   ├── QuestaoController.java     # Banco de questões
│   │   ├── AvaliacaoController.java   # Avaliações
│   │   ├── ParticipanteController.java # Participantes
│   │   ├── RespostaController.java    # Respostas
│   │   ├── ConfiguracaoController.java # Configurações
│   │   ├── UploadController.java      # Upload de arquivos
│   │   └── FileController.java        # Servir arquivos
│   ├── dto/                   # Data Transfer Objects
│   │   ├── UsuarioDTO.java    # DTO de usuários
│   │   ├── QuestaoDTO.java    # DTO de questões
│   │   └── QuestaoAlternativaDTO.java # DTO alternativas
│   ├── model/                 # Modelo de dados
│   │   ├── base/              # Classes base
│   │   │   └── BaseEntity.java    # Entidade base
│   │   ├── entity/            # Entidades JPA
│   │   │   ├── Usuario.java           # Usuários
│   │   │   ├── Questao.java           # Questões
│   │   │   ├── QuestaoAlternativa.java # Alternativas
│   │   │   ├── Avaliacao.java         # Avaliações
│   │   │   ├── AvaliacaoQuestao.java  # Relação avaliação-questão
│   │   │   ├── ParticipanteAvaliacao.java # Participantes
│   │   │   ├── AvaliacaoResposta.java # Respostas
│   │   │   ├── Disciplina.java        # Disciplinas
│   │   │   ├── Serie.java             # Séries
│   │   │   ├── TipoAvaliacao.java     # Tipos de avaliação
│   │   │   ├── TipoAlternativa.java   # Tipos de alternativa
│   │   │   └── NivelDificuldade.java  # Níveis de dificuldade
│   │   └── enums/             # Enumerações
│   │       ├── UserRole.java      # Perfis de usuário
│   │       └── StatusEnum.java    # Status diversos
│   ├── repository/            # Repositórios JPA
│   │   ├── UsuarioRepository.java           # CRUD usuários
│   │   ├── QuestaoRepository.java           # CRUD questões
│   │   ├── AvaliacaoRepository.java         # CRUD avaliações
│   │   ├── ParticipanteAvaliacaoRepository.java # CRUD participantes
│   │   ├── AvaliacaoRespostaRepository.java # CRUD respostas
│   │   ├── DisciplinaRepository.java        # CRUD disciplinas
│   │   ├── SerieRepository.java             # CRUD séries
│   │   ├── TipoAvaliacaoRepository.java     # CRUD tipos avaliação
│   │   ├── TipoAlternativaRepository.java   # CRUD tipos alternativa
│   │   └── NivelDificuldadeRepository.java  # CRUD níveis
│   ├── security/              # Segurança
│   │   ├── JwtUtil.java           # Utilitários JWT
│   │   └── JwtAuthenticationFilter.java # Filtro JWT
│   ├── service/               # Serviços de negócio
│   │   ├── UsuarioService.java            # Lógica de usuários
│   │   ├── QuestaoService.java            # Lógica de questões
│   │   ├── AvaliacaoService.java          # Lógica de avaliações
│   │   ├── ParticipanteAvaliacaoService.java # Lógica participantes
│   │   ├── AvaliacaoRespostaService.java  # Lógica de respostas
│   │   └── ConfiguracaoService.java       # Lógica configurações
│   └── SistemaAvaliacoesApplication.java # Classe principal
├── src/main/resources/
│   └── application.yml        # Configurações Spring
└── pom.xml                   # Dependências Maven
```

## ⚙️ Configuração

### Banco de Dados H2 (Desenvolvimento)
```yaml
spring:
  datasource:
    url: jdbc:h2:mem:testdb
    driver-class-name: org.h2.Driver
    username: sa
    password: password
  h2:
    console:
      enabled: true
      path: /h2-console
```

### Banco de Dados MySQL (Produção)
```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/sistema_avaliacoes
    username: ${DB_USERNAME:root}
    password: ${DB_PASSWORD:password}
    driver-class-name: com.mysql.cj.jdbc.Driver
  jpa:
    hibernate:
      ddl-auto: update
    database-platform: org.hibernate.dialect.MySQL8Dialect
```

### JWT Configuration
```yaml
jwt:
  secret: sistema-avaliacoes-secret-key-2024
  expiration: 86400000  # 24 horas
```

## 🔐 Segurança

### Perfis de Usuário
- **ADMIN** - Acesso completo ao sistema
- **PROFESSOR** - Criação e gestão de conteúdo
- **ALUNO** - Aplicação de provas

### Endpoints Protegidos
```java
// Apenas admins
@PreAuthorize("hasRole('ADMIN')")

// Professores e admins
@PreAuthorize("hasRole('ADMIN') or hasRole('PROFESSOR')")

// Próprio usuário ou admin
@PreAuthorize("hasRole('ADMIN') or #id == authentication.principal.id")
```

### CORS Configuration
```java
@Configuration
public class CorsConfig {
    // Permitir localhost:3000 (frontend)
    // Métodos: GET, POST, PUT, DELETE, PATCH, OPTIONS
    // Headers: authorization, content-type, etc.
}
```

## 📚 API Endpoints

### Autenticação
```http
POST /api/auth/login          # Login
POST /api/auth/register       # Registro (admin)
GET  /api/auth/me            # Perfil atual
POST /api/auth/logout        # Logout
```

### Usuários
```http
GET    /api/usuarios                    # Listar todos
GET    /api/usuarios/{id}              # Buscar por ID
POST   /api/usuarios                   # Criar usuário
PUT    /api/usuarios/{id}              # Atualizar
DELETE /api/usuarios/{id}              # Excluir (soft delete)
GET    /api/usuarios/buscar?termo=     # Buscar por termo
GET    /api/usuarios/role/{role}       # Listar por perfil
PATCH  /api/usuarios/{id}/status       # Ativar/desativar
GET    /api/usuarios/estatisticas      # Estatísticas
```

### Questões
```http
GET    /api/questoes                        # Listar todas
GET    /api/questoes/paginado              # Lista paginada
GET    /api/questoes/{id}                  # Buscar por ID
POST   /api/questoes                       # Criar questão
PUT    /api/questoes/{id}                  # Atualizar
DELETE /api/questoes/{id}                  # Excluir
GET    /api/questoes/buscar?termo=         # Buscar por termo
GET    /api/questoes/disciplina/{id}       # Por disciplina
GET    /api/questoes/status/{status}       # Por status
PATCH  /api/questoes/{id}/aprovar          # Aprovar questão
PATCH  /api/questoes/{id}/cancelar         # Cancelar questão
GET    /api/questoes/aprovadas             # Listar aprovadas
GET    /api/questoes/estatisticas          # Estatísticas
```

### Avaliações
```http
GET    /api/avaliacoes                     # Listar todas
GET    /api/avaliacoes/{id}               # Buscar por ID
POST   /api/avaliacoes                    # Criar avaliação
PUT    /api/avaliacoes/{id}               # Atualizar
DELETE /api/avaliacoes/{id}               # Excluir
GET    /api/avaliacoes/minhas             # Minhas avaliações
GET    /api/avaliacoes/status/{status}    # Por status
PATCH  /api/avaliacoes/{id}/aprovar       # Aprovar
POST   /api/avaliacoes/{id}/questoes      # Adicionar questões
DELETE /api/avaliacoes/{id}/questoes/{qid} # Remover questão
GET    /api/avaliacoes/{id}/questoes      # Listar questões
GET    /api/avaliacoes/estatisticas       # Estatísticas
```

### Participantes
```http
GET    /api/participantes/avaliacao/{id}           # Participantes da avaliação
POST   /api/participantes/avaliacao/{id}/alunos   # Adicionar participantes
DELETE /api/participantes/{id}                    # Remover participante
PATCH  /api/participantes/avaliacao/{id}/liberar  # Liberar avaliação
GET    /api/participantes/aluno/disponiveis       # Provas disponíveis
GET    /api/participantes/aluno/concluidas        # Provas concluídas
POST   /api/participantes/{id}/iniciar            # Iniciar prova
POST   /api/participantes/{id}/finalizar          # Finalizar prova
GET    /api/participantes/{id}/status             # Status participação
GET    /api/participantes/avaliacao/{id}/estatisticas # Estatísticas
```

### Respostas
```http
POST   /api/respostas                            # Salvar resposta
GET    /api/respostas/avaliacao/{id}            # Respostas da avaliação
POST   /api/respostas/avaliacao/{id}/corrigir-automatico # Correção automática
POST   /api/respostas/{id}/corrigir-manual      # Correção manual
GET    /api/respostas/avaliacao/{id}/estatisticas # Estatísticas correção
```

### Upload de Arquivos
```http
POST   /api/upload/image          # Upload de imagem
POST   /api/upload/document       # Upload de documento
DELETE /api/upload/file?filename= # Excluir arquivo
GET    /api/upload/info/{filename} # Info do arquivo
```

### Servir Arquivos
```http
GET    /api/files/{filename}         # Baixar arquivo
GET    /api/files/image/{filename}   # Exibir imagem
GET    /api/files/document/{filename} # Baixar documento
```

### Configurações
```http
GET    /api/configuracoes/tipos-avaliacoes      # Tipos de avaliação
POST   /api/configuracoes/tipos-avaliacoes      # Criar tipo
GET    /api/configuracoes/tipos-alternativas    # Tipos de alternativa
GET    /api/configuracoes/niveis-dificuldades   # Níveis de dificuldade
GET    /api/configuracoes/disciplinas           # Disciplinas
POST   /api/configuracoes/disciplinas           # Criar disciplina
GET    /api/configuracoes/series                # Séries
```

## 🗄️ Modelo de Dados

### Entidades Principais

#### Usuario
```java
@Entity
public class Usuario extends BaseEntity {
    private String nome;
    private String email;
    private String cpf;
    private String senha;
    private Set<UserRole> roles;
    private Boolean status;
}
```

#### Questao
```java
@Entity
public class Questao extends BaseEntity {
    private String pergunta;
    private Boolean geradorIa;
    private StatusQuestao statusQuestao;
    private Disciplina disciplina;
    private Double pontuacao;
    private String arquivoImagem;
    private TipoAlternativa tipoAlternativa;
    private String respostaCorreta;
    private NivelDificuldade nivelDificuldade;
    private Set<QuestaoAlternativa> alternativas;
}
```

#### Avaliacao
```java
@Entity
public class Avaliacao extends BaseEntity {
    private TipoAvaliacao tipoAvaliacao;
    private String instrucao;
    private StatusAvaliacao statusAvaliacao;
    private Usuario responsavel;
    private Set<AvaliacaoQuestao> avaliacaoQuestoes;
}
```

### Relacionamentos
- **Usuario** 1:N **Questao** (criador)
- **Usuario** 1:N **Avaliacao** (responsável)  
- **Questao** 1:N **QuestaoAlternativa**
- **Avaliacao** N:M **Questao** (via AvaliacaoQuestao)
- **Usuario** N:M **Avaliacao** (via ParticipanteAvaliacao)

## 🧪 Testes

```bash
# Executar todos os testes
./mvnw test

# Executar testes específicos
./mvnw test -Dtest=UsuarioServiceTest

# Relatório de cobertura
./mvnw jacoco:report
```

### Estrutura de Testes
```
src/test/java/
├── controller/     # Testes de controller
├── service/        # Testes de serviço
├── repository/     # Testes de repositório
└── integration/    # Testes de integração
```

## 📦 Build e Deploy

### Build Local
```bash
# Gerar JAR
./mvnw clean package

# Executar JAR
java -jar target/sistema-avaliacoes-0.0.1-SNAPSHOT.jar
```

### Docker
```dockerfile
FROM openjdk:17-jdk-slim
COPY target/sistema-avaliacoes-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app.jar"]
```

### Deploy em Produção
```bash
# Build
./mvnw clean package -Pprod

# Variáveis de ambiente
export DB_URL=jdbc:mysql://localhost:3306/sistema_avaliacoes
export DB_USERNAME=sistema_user
export DB_PASSWORD=secure_password
export JWT_SECRET=super-secret-key-production

# Executar
java -jar target/sistema-avaliacoes-0.0.1-SNAPSHOT.jar
```

## 📊 Monitoramento

### Health Check
```http
GET /actuator/health     # Status da aplicação
GET /actuator/info       # Informações da aplicação
GET /actuator/metrics    # Métricas de performance
```

### Logs
```yaml
logging:
  level:
    com.sistema.avaliacoes: DEBUG
    org.springframework.security: DEBUG
  pattern:
    console: "%d{yyyy-MM-dd HH:mm:ss} - %msg%n"
```

## 🔧 Desenvolvimento

### Profile de Desenvolvimento
```yaml
spring:
  profiles:
    active: dev
  devtools:
    restart:
      enabled: true
```

### Debug
```bash
# Executar com debug
./mvnw spring-boot:run -Dspring-boot.run.jvmArguments="-Xdebug -Xrunjdwp:transport=dt_socket,server=y,suspend=n,address=5005"
```

## 🐛 Troubleshooting

### Problemas Comuns

1. **Erro de CORS**
   ```
   Verificar CorsConfig.java
   Confirmar origem http://localhost:3000
   ```

2. **JWT Token Inválido**
   ```
   Verificar JWT_SECRET
   Confirmar expiração do token
   ```

3. **Erro de Conexão DB**
   ```
   Verificar URL do banco
   Confirmar credenciais
   Verificar se o banco está rodando
   ```

4. **Porta 8080 Ocupada**
   ```yaml
   server:
     port: 8081
   ```

## 📚 Dependências Principais

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-security</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-jpa</artifactId>
</dependency>
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-api</artifactId>
</dependency>
<dependency>
    <groupId>org.springdoc</groupId>
    <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
</dependency>
```

## 🎯 Próximas Funcionalidades

- [ ] Cache com Redis
- [ ] Observabilidade com Micrometer
- [ ] Testes de integração completos
- [ ] Pipeline CI/CD
- [ ] Documentação automática
- [ ] Backup automatizado
- [ ] Auditoria de ações

---

**API robusta, segura e escalável! 🚀**
