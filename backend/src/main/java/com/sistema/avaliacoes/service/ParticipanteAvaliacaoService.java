package com.sistema.avaliacoes.service;

import com.sistema.avaliacoes.model.entity.Avaliacao;
import com.sistema.avaliacoes.model.entity.ParticipanteAvaliacao;
import com.sistema.avaliacoes.model.entity.Usuario;
import com.sistema.avaliacoes.model.enums.StatusEnum;
import com.sistema.avaliacoes.repository.ParticipanteAvaliacaoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class ParticipanteAvaliacaoService {

    @Autowired
    private ParticipanteAvaliacaoRepository participanteRepository;

    @Autowired
    private AvaliacaoService avaliacaoService;

    @Autowired
    private UsuarioService usuarioService;

    public ParticipanteAvaliacao adicionarParticipante(Long avaliacaoId, Long usuarioId, 
                                                      String ano, String escola, String turma) {
        Avaliacao avaliacao = avaliacaoService.buscarPorId(avaliacaoId);
        Usuario usuario = usuarioService.buscarPorId(usuarioId);

        // Verificar se já existe participação
        Optional<ParticipanteAvaliacao> existente = participanteRepository
                .findByAvaliacaoIdAndUsuarioIdAndStatusTrue(avaliacaoId, usuarioId);
        
        if (existente.isPresent()) {
            throw new IllegalArgumentException("Usuário já é participante desta avaliação");
        }

        ParticipanteAvaliacao participante = new ParticipanteAvaliacao();
        participante.setAvaliacao(avaliacao);
        participante.setUsuario(usuario);
        participante.setAno(ano);
        participante.setEscola(escola);
        participante.setTurma(turma);
        participante.setDisponivel(false);
        participante.setStatusAplicacao(StatusEnum.StatusAplicacao.PENDENTE);
        participante.setAvaliado(false);

        return participanteRepository.save(participante);
    }

    public ParticipanteAvaliacao liberarParaAluno(Long participanteId, LocalDateTime dataInicio) {
        ParticipanteAvaliacao participante = buscarPorId(participanteId);
        participante.setDisponivel(true);
        participante.setDataInicioAvaliacao(dataInicio);
        return participanteRepository.save(participante);
    }

    public ParticipanteAvaliacao iniciarAvaliacao(Long participanteId) {
        ParticipanteAvaliacao participante = buscarPorId(participanteId);
        
        if (!participante.getDisponivel()) {
            throw new IllegalArgumentException("Avaliação não disponível para este usuário");
        }
        
        if (participante.getStatusAplicacao() != StatusEnum.StatusAplicacao.PENDENTE) {
            throw new IllegalArgumentException("Avaliação já foi iniciada ou concluída");
        }

        participante.setStatusAplicacao(StatusEnum.StatusAplicacao.INICIADO);
        participante.setDataInicio(LocalDateTime.now());
        participante.setHoraInicio(LocalTime.now());
        
        return participanteRepository.save(participante);
    }

    public ParticipanteAvaliacao finalizarAvaliacao(Long participanteId) {
        ParticipanteAvaliacao participante = buscarPorId(participanteId);
        
        if (participante.getStatusAplicacao() != StatusEnum.StatusAplicacao.INICIADO &&
            participante.getStatusAplicacao() != StatusEnum.StatusAplicacao.EM_ANDAMENTO) {
            throw new IllegalArgumentException("Avaliação não está em andamento");
        }

        participante.setStatusAplicacao(StatusEnum.StatusAplicacao.CONCLUIDO);
        participante.setDataFim(LocalDateTime.now());
        participante.setHoraFim(LocalTime.now());
        
        return participanteRepository.save(participante);
    }

    public ParticipanteAvaliacao marcarComoAvaliado(Long participanteId) {
        ParticipanteAvaliacao participante = buscarPorId(participanteId);
        
        if (participante.getStatusAplicacao() != StatusEnum.StatusAplicacao.CONCLUIDO) {
            throw new IllegalArgumentException("Avaliação deve estar concluída para ser marcada como avaliada");
        }

        participante.setAvaliado(true);
        return participanteRepository.save(participante);
    }

    @Transactional(readOnly = true)
    public ParticipanteAvaliacao buscarPorId(Long id) {
        return participanteRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Participante não encontrado"));
    }

    @Transactional(readOnly = true)
    public List<ParticipanteAvaliacao> listarPorAluno(Long usuarioId) {
        return participanteRepository.findByUsuarioIdAndStatusTrue(usuarioId);
    }

    @Transactional(readOnly = true)
    public List<ParticipanteAvaliacao> listarPorAvaliacao(Long avaliacaoId) {
        return participanteRepository.findByAvaliacaoIdAndStatusTrue(avaliacaoId);
    }

    @Transactional(readOnly = true)
    public List<ParticipanteAvaliacao> listarProvasDisponiveis(Long alunoId) {
        return participanteRepository.findProvasDisponiveisParaAluno(
            alunoId, StatusEnum.StatusAplicacao.PENDENTE);
    }

    @Transactional(readOnly = true)
    public List<ParticipanteAvaliacao> listarProvasEmAndamento(Long alunoId) {
        return participanteRepository.findProvasDisponiveisParaAluno(
            alunoId, StatusEnum.StatusAplicacao.EM_ANDAMENTO);
    }

    @Transactional(readOnly = true)
    public List<ParticipanteAvaliacao> listarProvasConcluidas(Long alunoId) {
        return participanteRepository.findProvasDisponiveisParaAluno(
            alunoId, StatusEnum.StatusAplicacao.CONCLUIDO);
    }

    @Transactional(readOnly = true)
    public List<ParticipanteAvaliacao> listarPorStatus(StatusEnum.StatusAplicacao status) {
        return participanteRepository.findByStatusAplicacaoAndStatusTrue(status);
    }

    @Transactional(readOnly = true)
    public Optional<ParticipanteAvaliacao> buscarParticipacao(Long avaliacaoId, Long usuarioId) {
        return participanteRepository.findByAvaliacaoIdAndUsuarioIdAndStatusTrue(avaliacaoId, usuarioId);
    }

    @Transactional(readOnly = true)
    public long contarParticipantesPorAvaliacaoEStatus(Long avaliacaoId, StatusEnum.StatusAplicacao status) {
        return participanteRepository.countByAvaliacaoAndStatus(avaliacaoId, status);
    }

    @Transactional(readOnly = true)
    public long contarAvaliacoesConcluidasPorAluno(Long alunoId) {
        return participanteRepository.countAvaliacoesConcluidasPorAluno(alunoId);
    }

    public void removerParticipante(Long participanteId) {
        ParticipanteAvaliacao participante = buscarPorId(participanteId);
        
        if (participante.getStatusAplicacao() == StatusEnum.StatusAplicacao.CONCLUIDO) {
            throw new IllegalArgumentException("Não é possível remover participante de avaliação já concluída");
        }

        participante.setStatus(false);
        participanteRepository.save(participante);
    }

    public ParticipanteAvaliacao atualizarInformacoes(Long participanteId, String ano, String escola, String turma) {
        ParticipanteAvaliacao participante = buscarPorId(participanteId);
        participante.setAno(ano);
        participante.setEscola(escola);
        participante.setTurma(turma);
        return participanteRepository.save(participante);
    }

    public List<ParticipanteAvaliacao> adicionarMultiplosParticipantes(Long avaliacaoId, 
                                                                      List<Long> usuariosIds, 
                                                                      String ano, String escola, String turma) {
        return usuariosIds.stream()
                .map(usuarioId -> adicionarParticipante(avaliacaoId, usuarioId, ano, escola, turma))
                .toList();
    }
}
