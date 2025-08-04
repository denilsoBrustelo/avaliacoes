package com.sistema.avaliacoes.config;

import com.sistema.avaliacoes.model.entity.*;
import com.sistema.avaliacoes.model.enums.UserRole;
import com.sistema.avaliacoes.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.Set;

@Component
public class DataInitializer implements CommandLineRunner {

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
        initializeTiposAvaliacoes();
        initializeTiposAlternativas();
        initializeUsuarios();
        initializeDisciplinas();
        initializeNiveisDificuldade();
        initializeSeries();
        initializeQuestoesSample();
    }

    private void initializeTiposAvaliacoes() {
        if (tipoAvaliacaoRepository.count() == 0) {
            tipoAvaliacaoRepository.save(new TipoAvaliacao("Diagnóstica"));
            tipoAvaliacaoRepository.save(new TipoAvaliacao("Processual"));
            tipoAvaliacaoRepository.save(new TipoAvaliacao("Final de Ciclo"));
            tipoAvaliacaoRepository.save(new TipoAvaliacao("Certificadora"));
        }
    }

    private void initializeTiposAlternativas() {
        if (tipoAlternativaRepository.count() == 0) {
            tipoAlternativaRepository.save(new TipoAlternativa("Dissertativa"));
            tipoAlternativaRepository.save(new TipoAlternativa("Múltipla Escolha"));
            tipoAlternativaRepository.save(new TipoAlternativa("Texto de Referência"));
            tipoAlternativaRepository.save(new TipoAlternativa("Imagem de Referência"));
            tipoAlternativaRepository.save(new TipoAlternativa("Imagem nas Alternativas"));
        }
    }

    private void initializeUsuarios() {
        if (usuarioRepository.count() == 0) {
            // Administrador
            Usuario admin = new Usuario();
            admin.setCpf("12345678901");
            admin.setNome("Administrador Sistema");
            admin.setEmail("admin@sistema.com");
            admin.setSenha(passwordEncoder.encode("admin123"));
            admin.setRoles(Set.of(UserRole.ROLE_ADMIN));
            usuarioRepository.save(admin);

            // Professor
            Usuario professor = new Usuario();
            professor.setCpf("98765432109");
            professor.setNome("Professor João Silva");
            professor.setEmail("professor@sistema.com");
            professor.setSenha(passwordEncoder.encode("prof123"));
            professor.setRoles(Set.of(UserRole.ROLE_PROFESSOR));
            usuarioRepository.save(professor);

            // Aluno
            Usuario aluno = new Usuario();
            aluno.setCpf("11122233344");
            aluno.setNome("Aluno Maria Santos");
            aluno.setEmail("aluno@sistema.com");
            aluno.setSenha(passwordEncoder.encode("aluno123"));
            aluno.setRoles(Set.of(UserRole.ROLE_ALUNO));
            usuarioRepository.save(aluno);
        }
    }
}
