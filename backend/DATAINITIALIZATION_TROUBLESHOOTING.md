# DataInitializer - Diagnóstico e Soluções

## Problemas Comuns e Soluções

### 1. **Erro de Dependência Circular**
**Problema**: Dependência circular entre SecurityConfig, UsuarioService e PasswordEncoder
**Solução**: ✅ JÁ RESOLVIDO - PasswordConfig separado existe

### 2. **Erro de JPA Auditing**
**Problema**: @CreatedDate não funciona porque JPA Auditing não está ativado
**Solução**: ✅ JÁ CONFIGURADO - @EnableJpaAuditing está presente na classe principal

### 3. **Problemas de Repository não encontrado**
**Problema**: Repositories não são encontrados durante a inicialização
**Solução**: Adicionar @EnableJpaRepositories explicitamente

### 4. **Erro de Validação de Entidades**
**Problema**: Dados inválidos nas entidades durante a criação
**Soluções**: 
- CPF com formato inválido
- Email duplicado  
- Senhas muito curtas
- Descrições muito longas

### 5. **Problemas de Transação**
**Problema**: DataInitializer não está em uma transação
**Solução**: Adicionar @Transactional

## Fixes Recomendados

### Fix 1: Melhorar SistemaAvaliacoesApplication.java
```java
@SpringBootApplication
@EnableJpaAuditing
@EnableJpaRepositories(basePackages = "com.sistema.avaliacoes.repository")
public class SistemaAvaliacoesApplication {
    public static void main(String[] args) {
        SpringApplication.run(SistemaAvaliacoesApplication.class, args);
    }
}
```

### Fix 2: Melhorar DataInitializer com tratamento de erro
```java
@Component
@Transactional
public class DataInitializer implements CommandLineRunner {
    
    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);
    
    @Override
    public void run(String... args) throws Exception {
        try {
            logger.info("Iniciando inicialização de dados...");
            
            initializeTiposAvaliacoes();
            logger.info("Tipos de avaliação inicializados");
            
            initializeTiposAlternativas();
            logger.info("Tipos de alternativa inicializados");
            
            initializeUsuarios();
            logger.info("Usuários inicializados");
            
            initializeDisciplinas();
            logger.info("Disciplinas inicializadas");
            
            initializeNiveisDificuldade();
            logger.info("Níveis de dificuldade inicializados");
            
            initializeSeries();
            logger.info("Séries inicializadas");
            
            initializeQuestoesSample();
            logger.info("Questões sample inicializadas");
            
            logger.info("Inicialização de dados concluída com sucesso!");
            
        } catch (Exception e) {
            logger.error("Erro durante inicialização de dados: {}", e.getMessage(), e);
            throw e;
        }
    }
}
```

### Fix 3: Validação de Dados mais Robusta
```java
private void initializeUsuarios() {
    if (usuarioRepository.count() == 0) {
        try {
            // Administrador
            Usuario admin = new Usuario();
            admin.setCpf("12345678901");
            admin.setNome("Administrador Sistema");
            admin.setEmail("admin@sistema.com");
            admin.setSenha(passwordEncoder.encode("admin123"));
            admin.setRoles(Set.of(UserRole.ROLE_ADMIN));
            admin.setStatus(true);
            usuarioRepository.save(admin);
            logger.debug("Usuário admin criado");

            // Professor
            Usuario professor = new Usuario();
            professor.setCpf("98765432109");
            professor.setNome("Professor João Silva");
            professor.setEmail("professor@sistema.com");
            professor.setSenha(passwordEncoder.encode("prof123"));
            professor.setRoles(Set.of(UserRole.ROLE_PROFESSOR));
            professor.setStatus(true);
            usuarioRepository.save(professor);
            logger.debug("Usuário professor criado");

            // Aluno
            Usuario aluno = new Usuario();
            aluno.setCpf("11122233344");
            aluno.setNome("Aluno Maria Santos");
            aluno.setEmail("aluno@sistema.com");
            aluno.setSenha(passwordEncoder.encode("aluno123"));
            aluno.setRoles(Set.of(UserRole.ROLE_ALUNO));
            aluno.setStatus(true);
            usuarioRepository.save(aluno);
            logger.debug("Usuário aluno criado");
            
        } catch (DataIntegrityViolationException e) {
            logger.warn("Dados já existem, pulando criação de usuários");
        } catch (Exception e) {
            logger.error("Erro ao criar usuários: {}", e.getMessage(), e);
            throw e;
        }
    }
}
```

## Como Aplicar os Fixes

1. Verificar logs de erro específicos do backend
2. Aplicar Fix 1 na classe principal
3. Aplicar Fix 2 no DataInitializer  
4. Testar inicialização
5. Se persistir, aplicar Fix 3 para melhor tratamento de erro

## Verificação
Para verificar se funcionou:
```bash
cd backend
mvn spring-boot:run
```

Deve aparecer nos logs:
```
INFO - Iniciando inicialização de dados...
INFO - Tipos de avaliação inicializados
INFO - Usuários inicializados
...
INFO - Inicialização de dados concluída com sucesso!
```
