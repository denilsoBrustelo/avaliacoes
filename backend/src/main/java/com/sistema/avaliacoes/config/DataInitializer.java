package com.sistema.avaliacoes.config;

import com.sistema.avaliacoes.model.entity.*;
import com.sistema.avaliacoes.model.enums.UserRole;
import com.sistema.avaliacoes.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Set;

@Component
@Transactional
public class DataInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private TipoAvaliacaoRepository tipoAvaliacaoRepository;

    @Autowired
    private TipoAlternativaRepository tipoAlternativaRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private QuestaoRepository questaoRepository;

    @Autowired
    private DisciplinaRepository disciplinaRepository;

    @Autowired
    private NivelDificuldadeRepository nivelDificuldadeRepository;

    @Autowired
    private SerieRepository serieRepository;

    @Override
    public void run(String... args) throws Exception {
        try {
            logger.info("🚀 Iniciando inicialização de dados do sistema...");

            initializeTiposAvaliacoes();
            logger.info("✅ Tipos de avaliação inicializados");

            initializeTiposAlternativas();
            logger.info("✅ Tipos de alternativa inicializados");

            initializeUsuarios();
            logger.info("✅ Usuários inicializados");

            initializeDisciplinas();
            logger.info("✅ Disciplinas inicializadas");

            initializeNiveisDificuldade();
            logger.info("✅ Níveis de dificuldade inicializados");

            initializeSeries();
            logger.info("✅ Séries inicializadas");

            initializeQuestoesSample();
            logger.info("✅ Questões sample inicializadas");

            logger.info("🎉 Inicialização de dados concluída com sucesso!");

        } catch (Exception e) {
            logger.error("❌ Erro durante inicialização de dados: {}", e.getMessage(), e);
            throw e;
        }
    }

    private void initializeTiposAvaliacoes() {
        if (tipoAvaliacaoRepository.count() == 0) {
            try {
                logger.debug("Criando tipos de avaliação padrão...");

                tipoAvaliacaoRepository.save(new TipoAvaliacao("Diagnóstica"));
                tipoAvaliacaoRepository.save(new TipoAvaliacao("Processual"));
                tipoAvaliacaoRepository.save(new TipoAvaliacao("Final de Ciclo"));
                tipoAvaliacaoRepository.save(new TipoAvaliacao("Certificadora"));

                logger.debug("📝 Tipos de avaliação criados com sucesso");

            } catch (DataIntegrityViolationException e) {
                logger.warn("⚠️ Tipos de avaliação já existem, pulando criação");
            } catch (Exception e) {
                logger.error("❌ Erro ao criar tipos de avaliação: {}", e.getMessage(), e);
                throw e;
            }
        } else {
            logger.debug("Tipos de avaliação já existem no sistema, pulando inicialização");
        }
    }

    private void initializeTiposAlternativas() {
        if (tipoAlternativaRepository.count() == 0) {
            try {
                logger.debug("Criando tipos de alternativa padrão...");

                tipoAlternativaRepository.save(new TipoAlternativa("Dissertativa"));
                tipoAlternativaRepository.save(new TipoAlternativa("Múltipla Escolha"));
                tipoAlternativaRepository.save(new TipoAlternativa("Texto de Referência"));
                tipoAlternativaRepository.save(new TipoAlternativa("Imagem de Referência"));
                tipoAlternativaRepository.save(new TipoAlternativa("Imagem nas Alternativas"));

                logger.debug("📋 Tipos de alternativa criados com sucesso");

            } catch (DataIntegrityViolationException e) {
                logger.warn("⚠️ Tipos de alternativa já existem, pulando criação");
            } catch (Exception e) {
                logger.error("❌ Erro ao criar tipos de alternativa: {}", e.getMessage(), e);
                throw e;
            }
        } else {
            logger.debug("Tipos de alternativa já existem no sistema, pulando inicialização");
        }
    }

    private void initializeUsuarios() {
        if (usuarioRepository.count() == 0) {
            try {
                logger.debug("Criando usuários padrão do sistema...");

                // Administrador
                Usuario admin = new Usuario();
                admin.setCpf("12345678901");
                admin.setNome("Administrador Sistema");
                admin.setEmail("admin@sistema.com");
                admin.setSenha(passwordEncoder.encode("admin123"));
                admin.setRoles(Set.of(UserRole.ROLE_ADMIN));
                admin.setStatus(true);
                usuarioRepository.save(admin);
                logger.debug("👤 Usuário admin criado com sucesso");

                // Professor
                Usuario professor = new Usuario();
                professor.setCpf("98765432109");
                professor.setNome("Professor João Silva");
                professor.setEmail("professor@sistema.com");
                professor.setSenha(passwordEncoder.encode("prof123"));
                professor.setRoles(Set.of(UserRole.ROLE_PROFESSOR));
                professor.setStatus(true);
                usuarioRepository.save(professor);
                logger.debug("👨‍🏫 Usuário professor criado com sucesso");

                // Aluno
                Usuario aluno = new Usuario();
                aluno.setCpf("11122233344");
                aluno.setNome("Aluno Maria Santos");
                aluno.setEmail("aluno@sistema.com");
                aluno.setSenha(passwordEncoder.encode("aluno123"));
                aluno.setRoles(Set.of(UserRole.ROLE_ALUNO));
                aluno.setStatus(true);
                usuarioRepository.save(aluno);
                logger.debug("👩‍🎓 Usuário aluno criado com sucesso");

            } catch (DataIntegrityViolationException e) {
                logger.warn("⚠️ Dados de usuários já existem, pulando criação");
            } catch (Exception e) {
                logger.error("❌ Erro ao criar usuários padrão: {}", e.getMessage(), e);
                throw e;
            }
        } else {
            logger.debug("Usuários já existem no sistema, pulando inicialização");
        }
    }

    private void initializeDisciplinas() {
        if (disciplinaRepository.count() == 0) {
            try {
                logger.debug("Criando disciplinas padrão...");

                disciplinaRepository.save(new Disciplina("Matemática", "MAT"));
                disciplinaRepository.save(new Disciplina("Português", "POR"));
                disciplinaRepository.save(new Disciplina("História", "HIS"));
                disciplinaRepository.save(new Disciplina("Geografia", "GEO"));
                disciplinaRepository.save(new Disciplina("Ciências", "CIE"));
                disciplinaRepository.save(new Disciplina("Inglês", "ING"));

                logger.debug("📚 Disciplinas criadas com sucesso");

            } catch (DataIntegrityViolationException e) {
                logger.warn("⚠️ Disciplinas já existem, pulando criação");
            } catch (Exception e) {
                logger.error("❌ Erro ao criar disciplinas: {}", e.getMessage(), e);
                throw e;
            }
        } else {
            logger.debug("Disciplinas já existem no sistema, pulando inicialização");
        }
    }

    private void initializeNiveisDificuldade() {
        if (nivelDificuldadeRepository.count() == 0) {
            try {
                logger.debug("Criando níveis de dificuldade padrão...");

                nivelDificuldadeRepository.save(new NivelDificuldade("Fácil"));
                nivelDificuldadeRepository.save(new NivelDificuldade("Médio"));
                nivelDificuldadeRepository.save(new NivelDificuldade("Difícil"));

                logger.debug("⭐ Níveis de dificuldade criados com sucesso");

            } catch (DataIntegrityViolationException e) {
                logger.warn("⚠️ Níveis de dificuldade já existem, pulando criação");
            } catch (Exception e) {
                logger.error("❌ Erro ao criar níveis de dificuldade: {}", e.getMessage(), e);
                throw e;
            }
        } else {
            logger.debug("Níveis de dificuldade já existem no sistema, pulando inicialização");
        }
    }

    private void initializeSeries() {
        if (serieRepository.count() == 0) {
            try {
                logger.debug("Criando séries padrão...");

                serieRepository.save(new Serie("1º Ano", "1ANO"));
                serieRepository.save(new Serie("2º Ano", "2ANO"));
                serieRepository.save(new Serie("3º Ano", "3ANO"));
                serieRepository.save(new Serie("4º Ano", "4ANO"));
                serieRepository.save(new Serie("5º Ano", "5ANO"));
                serieRepository.save(new Serie("6º Ano", "6ANO"));
                serieRepository.save(new Serie("7º Ano", "7ANO"));
                serieRepository.save(new Serie("8º Ano", "8ANO"));
                serieRepository.save(new Serie("9º Ano", "9ANO"));

                logger.debug("🎓 Séries criadas com sucesso");

            } catch (DataIntegrityViolationException e) {
                logger.warn("⚠️ Séries já existem, pulando criação");
            } catch (Exception e) {
                logger.error("❌ Erro ao criar séries: {}", e.getMessage(), e);
                throw e;
            }
        } else {
            logger.debug("Séries já existem no sistema, pulando inicialização");
        }
    }

    private void initializeQuestoesSample() {
        if (questaoRepository.count() == 0) {
            // Buscar dados básicos
            Disciplina matematica = disciplinaRepository.findByDescricao("Matemática").orElse(null);
            Disciplina portugues = disciplinaRepository.findByDescricao("Português").orElse(null);
            NivelDificuldade facil = nivelDificuldadeRepository.findByDescricao("Fácil").orElse(null);
            NivelDificuldade medio = nivelDificuldadeRepository.findByDescricao("Médio").orElse(null);
            Serie quinta = serieRepository.findByDescricao("5º Ano").orElse(null);
            TipoAlternativa multiplaEscolha = tipoAlternativaRepository.findByDescricao("Múltipla Escolha").orElse(null);
            Usuario professor = usuarioRepository.findByEmail("professor@sistema.com").orElse(null);

            if (matematica != null && facil != null && quinta != null && multiplaEscolha != null && professor != null) {
                // Questão de Matemática 1
                Questao questao1 = new Questao();
                questao1.setPergunta("Qual é o resultado de 5 + 3?");
                questao1.setTema("Adição");
                questao1.setDisciplina(matematica);
                questao1.setNivelDificuldade(facil);
                questao1.setSerie(quinta);
                questao1.setTipoAlternativa(multiplaEscolha);
                questao1.setResponsavel(professor);
                questao1.setPontuacao(BigDecimal.valueOf(1.0));
                questao1.setAprovada(true);
                questaoRepository.save(questao1);

                // Questão de Matemática 2
                Questao questao2 = new Questao();
                questao2.setPergunta("Se João tem 15 maçãs e deu 6 para Maria, quantas maçãs João tem agora?");
                questao2.setTema("Subtração");
                questao2.setDisciplina(matematica);
                questao2.setNivelDificuldade(facil);
                questao2.setSerie(quinta);
                questao2.setTipoAlternativa(multiplaEscolha);
                questao2.setResponsavel(professor);
                questao2.setPontuacao(BigDecimal.valueOf(1.0));
                questao2.setAprovada(true);
                questaoRepository.save(questao2);
            }

            if (portugues != null && medio != null && quinta != null && multiplaEscolha != null && professor != null) {
                // Questão de Português
                Questao questao3 = new Questao();
                questao3.setPergunta("Qual é o sinônimo da palavra 'feliz'?");
                questao3.setTema("Sinônimos");
                questao3.setDisciplina(portugues);
                questao3.setNivelDificuldade(medio);
                questao3.setSerie(quinta);
                questao3.setTipoAlternativa(multiplaEscolha);
                questao3.setResponsavel(professor);
                questao3.setPontuacao(BigDecimal.valueOf(1.5));
                questao3.setAprovada(true);
                questaoRepository.save(questao3);
            }
        }
    }
}
