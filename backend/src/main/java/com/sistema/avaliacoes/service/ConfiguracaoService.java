package com.sistema.avaliacoes.service;

import com.sistema.avaliacoes.model.entity.*;
import com.sistema.avaliacoes.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class ConfiguracaoService {

    @Autowired
    private TipoAvaliacaoRepository tipoAvaliacaoRepository;

    @Autowired
    private TipoAlternativaRepository tipoAlternativaRepository;

    @Autowired
    private NivelDificuldadeRepository nivelDificuldadeRepository;

    @Autowired
    private DisciplinaRepository disciplinaRepository;

    @Autowired
    private SerieRepository serieRepository;

    // Tipos de Avaliação
    public TipoAvaliacao criarTipoAvaliacao(TipoAvaliacao tipoAvaliacao) {
        if (tipoAvaliacaoRepository.existsByDescricaoAndStatusTrue(tipoAvaliacao.getDescricao())) {
            throw new IllegalArgumentException("Tipo de avaliação já existe");
        }
        return tipoAvaliacaoRepository.save(tipoAvaliacao);
    }

    public TipoAvaliacao atualizarTipoAvaliacao(Long id, TipoAvaliacao tipoAtualizacao) {
        TipoAvaliacao tipoExistente = buscarTipoAvaliacaoPorId(id);
        
        if (!tipoExistente.getDescricao().equals(tipoAtualizacao.getDescricao()) &&
            tipoAvaliacaoRepository.existsByDescricaoAndStatusTrue(tipoAtualizacao.getDescricao())) {
            throw new IllegalArgumentException("Tipo de avaliação já existe");
        }
        
        tipoExistente.setDescricao(tipoAtualizacao.getDescricao());
        return tipoAvaliacaoRepository.save(tipoExistente);
    }

    @Transactional(readOnly = true)
    public TipoAvaliacao buscarTipoAvaliacaoPorId(Long id) {
        return tipoAvaliacaoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Tipo de avaliação não encontrado"));
    }

    @Transactional(readOnly = true)
    public List<TipoAvaliacao> listarTiposAvaliacoes() {
        return tipoAvaliacaoRepository.findByStatusTrueOrderByDescricao();
    }

    public void excluirTipoAvaliacao(Long id) {
        TipoAvaliacao tipo = buscarTipoAvaliacaoPorId(id);
        tipo.setStatus(false);
        tipoAvaliacaoRepository.save(tipo);
    }

    // Tipos de Alternativa
    public TipoAlternativa criarTipoAlternativa(TipoAlternativa tipoAlternativa) {
        if (tipoAlternativaRepository.existsByDescricaoAndStatusTrue(tipoAlternativa.getDescricao())) {
            throw new IllegalArgumentException("Tipo de alternativa já existe");
        }
        return tipoAlternativaRepository.save(tipoAlternativa);
    }

    @Transactional(readOnly = true)
    public TipoAlternativa buscarTipoAlternativaPorId(Long id) {
        return tipoAlternativaRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Tipo de alternativa não encontrado"));
    }

    @Transactional(readOnly = true)
    public List<TipoAlternativa> listarTiposAlternativas() {
        return tipoAlternativaRepository.findByStatusTrueOrderByDescricao();
    }

    // Níveis de Dificuldade
    public NivelDificuldade criarNivelDificuldade(NivelDificuldade nivelDificuldade) {
        if (nivelDificuldadeRepository.existsByDescricaoAndStatusTrue(nivelDificuldade.getDescricao())) {
            throw new IllegalArgumentException("Nível de dificuldade já existe");
        }
        return nivelDificuldadeRepository.save(nivelDificuldade);
    }

    @Transactional(readOnly = true)
    public NivelDificuldade buscarNivelDificuldadePorId(Long id) {
        return nivelDificuldadeRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Nível de dificuldade não encontrado"));
    }

    @Transactional(readOnly = true)
    public List<NivelDificuldade> listarNiveisDificuldades() {
        return nivelDificuldadeRepository.findByStatusTrueOrderByDescricao();
    }

    // Disciplinas
    public Disciplina criarDisciplina(Disciplina disciplina) {
        if (disciplinaRepository.existsByDescricaoAndStatusTrue(disciplina.getDescricao())) {
            throw new IllegalArgumentException("Disciplina já existe");
        }
        if (disciplinaRepository.existsByIdDisciplinaExterno(disciplina.getIdDisciplinaExterno())) {
            throw new IllegalArgumentException("ID externo já existe");
        }
        return disciplinaRepository.save(disciplina);
    }

    public Disciplina atualizarDisciplina(Long id, Disciplina disciplinaAtualizada) {
        Disciplina disciplinaExistente = buscarDisciplinaPorId(id);
        
        if (!disciplinaExistente.getDescricao().equals(disciplinaAtualizada.getDescricao()) &&
            disciplinaRepository.existsByDescricaoAndStatusTrue(disciplinaAtualizada.getDescricao())) {
            throw new IllegalArgumentException("Disciplina já existe");
        }
        
        disciplinaExistente.setDescricao(disciplinaAtualizada.getDescricao());
        disciplinaExistente.setIdDisciplinaExterno(disciplinaAtualizada.getIdDisciplinaExterno());
        return disciplinaRepository.save(disciplinaExistente);
    }

    @Transactional(readOnly = true)
    public Disciplina buscarDisciplinaPorId(Long id) {
        return disciplinaRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Disciplina não encontrada"));
    }

    @Transactional(readOnly = true)
    public List<Disciplina> listarDisciplinas() {
        return disciplinaRepository.findByStatusTrueOrderByDescricao();
    }

    @Transactional(readOnly = true)
    public List<Disciplina> buscarDisciplinasPorTermo(String termo) {
        return disciplinaRepository.buscarPorTermo(termo);
    }

    // Séries
    public Serie criarSerie(Serie serie) {
        if (serieRepository.existsByDescricaoAndStatusTrue(serie.getDescricao())) {
            throw new IllegalArgumentException("Série já existe");
        }
        if (serieRepository.existsByIdSerieExterno(serie.getIdSerieExterno())) {
            throw new IllegalArgumentException("ID externo já existe");
        }
        return serieRepository.save(serie);
    }

    public Serie atualizarSerie(Long id, Serie serieAtualizada) {
        Serie serieExistente = buscarSeriePorId(id);
        
        if (!serieExistente.getDescricao().equals(serieAtualizada.getDescricao()) &&
            serieRepository.existsByDescricaoAndStatusTrue(serieAtualizada.getDescricao())) {
            throw new IllegalArgumentException("Série já existe");
        }
        
        serieExistente.setDescricao(serieAtualizada.getDescricao());
        serieExistente.setIdSerieExterno(serieAtualizada.getIdSerieExterno());
        return serieRepository.save(serieExistente);
    }

    @Transactional(readOnly = true)
    public Serie buscarSeriePorId(Long id) {
        return serieRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Série não encontrada"));
    }

    @Transactional(readOnly = true)
    public List<Serie> listarSeries() {
        return serieRepository.findByStatusTrueOrderByDescricao();
    }

    public void excluirDisciplina(Long id) {
        Disciplina disciplina = buscarDisciplinaPorId(id);
        disciplina.setStatus(false);
        disciplinaRepository.save(disciplina);
    }

    public void excluirSerie(Long id) {
        Serie serie = buscarSeriePorId(id);
        serie.setStatus(false);
        serieRepository.save(serie);
    }
}
