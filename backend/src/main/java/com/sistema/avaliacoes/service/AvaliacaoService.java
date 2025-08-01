package com.sistema.avaliacoes.service;

import com.sistema.avaliacoes.model.entity.Avaliacao;
import com.sistema.avaliacoes.model.entity.AvaliacaoQuestao;
import com.sistema.avaliacoes.model.entity.Questao;
import com.sistema.avaliacoes.model.enums.StatusEnum;
import com.sistema.avaliacoes.repository.AvaliacaoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@Transactional
public class AvaliacaoService {

    @Autowired
    private AvaliacaoRepository avaliacaoRepository;

    @Autowired
    private QuestaoService questaoService;

    public Avaliacao criar(Avaliacao avaliacao, List<Long> questoesIds) {
        // Salvar avaliação primeiro
        avaliacao = avaliacaoRepository.save(avaliacao);

        // Adicionar questões se fornecidas
        if (questoesIds != null && !questoesIds.isEmpty()) {
            adicionarQuestoes(avaliacao.getId(), questoesIds);
        }

        return avaliacao;
    }

    public Avaliacao atualizar(Long id, Avaliacao avaliacaoAtualizada) {
        Avaliacao avaliacaoExistente = buscarPorId(id);

        // Atualizar campos
        avaliacaoExistente.setTipoAvaliacao(avaliacaoAtualizada.getTipoAvaliacao());
        avaliacaoExistente.setInstrucao(avaliacaoAtualizada.getInstrucao());
        
        return avaliacaoRepository.save(avaliacaoExistente);
    }

    public void excluir(Long id) {
        Avaliacao avaliacao = buscarPorId(id);
        avaliacao.setStatus(false);
        avaliacaoRepository.save(avaliacao);
    }

    @Transactional(readOnly = true)
    public Avaliacao buscarPorId(Long id) {
        return avaliacaoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Avaliação não encontrada"));
    }

    @Transactional(readOnly = true)
    public List<Avaliacao> listarTodas() {
        return avaliacaoRepository.findByStatusTrueOrderByDataCadastroDesc();
    }

    @Transactional(readOnly = true)
    public List<Avaliacao> listarPorProfessor(Long professorId) {
        return avaliacaoRepository.findByResponsavelIdAndStatusTrue(professorId);
    }

    @Transactional(readOnly = true)
    public List<Avaliacao> listarPorStatus(StatusEnum.StatusAvaliacao status) {
        return avaliacaoRepository.findByStatusAvaliacaoAndStatusTrue(status);
    }

    @Transactional(readOnly = true)
    public List<Avaliacao> listarPorTipoAvaliacao(Long tipoAvaliacaoId) {
        return avaliacaoRepository.findByTipoAvaliacaoIdAndStatusTrue(tipoAvaliacaoId);
    }

    public Avaliacao aprovar(Long id) {
        Avaliacao avaliacao = buscarPorId(id);
        avaliacao.setStatusAvaliacao(StatusEnum.StatusAvaliacao.APROVADO);
        return avaliacaoRepository.save(avaliacao);
    }

    public Avaliacao cancelar(Long id) {
        Avaliacao avaliacao = buscarPorId(id);
        avaliacao.setStatusAvaliacao(StatusEnum.StatusAvaliacao.CANCELADO);
        return avaliacaoRepository.save(avaliacao);
    }

    public Avaliacao alterarStatus(Long id, StatusEnum.StatusAvaliacao novoStatus) {
        Avaliacao avaliacao = buscarPorId(id);
        avaliacao.setStatusAvaliacao(novoStatus);
        return avaliacaoRepository.save(avaliacao);
    }

    public void adicionarQuestoes(Long avaliacaoId, List<Long> questoesIds) {
        Avaliacao avaliacao = buscarPorId(avaliacaoId);

        // Buscar questões aprovadas
        List<Questao> questoes = questoesIds.stream()
                .map(questaoService::buscarPorId)
                .filter(Questao::isAprovada)
                .collect(Collectors.toList());

        if (questoes.size() != questoesIds.size()) {
            throw new IllegalArgumentException("Algumas questões não foram encontradas ou não estão aprovadas");
        }

        // Criar relacionamentos
        Set<AvaliacaoQuestao> avaliacaoQuestoes = questoes.stream()
                .map(questao -> new AvaliacaoQuestao(avaliacao, questao))
                .collect(Collectors.toSet());

        avaliacao.setAvaliacaoQuestoes(avaliacaoQuestoes);
        avaliacaoRepository.save(avaliacao);
    }

    public void removerQuestao(Long avaliacaoId, Long questaoId) {
        Avaliacao avaliacao = buscarPorId(avaliacaoId);
        
        boolean removido = avaliacao.getAvaliacaoQuestoes()
                .removeIf(aq -> aq.getQuestao().getId().equals(questaoId));

        if (!removido) {
            throw new IllegalArgumentException("Questão não encontrada na avaliação");
        }

        avaliacaoRepository.save(avaliacao);
    }

    @Transactional(readOnly = true)
    public long contarPorProfessor(Long professorId) {
        return avaliacaoRepository.countByProfessorAndStatusTrue(professorId);
    }

    @Transactional(readOnly = true)
    public long contarPorStatus(StatusEnum.StatusAvaliacao status) {
        return avaliacaoRepository.countByStatusAvaliacaoAndStatusTrue(status);
    }

    @Transactional(readOnly = true)
    public List<Questao> listarQuestoesAvaliacao(Long avaliacaoId) {
        Avaliacao avaliacao = buscarPorId(avaliacaoId);
        return avaliacao.getAvaliacaoQuestoes().stream()
                .map(AvaliacaoQuestao::getQuestao)
                .collect(Collectors.toList());
    }

    public List<Avaliacao> listarAprovadas() {
        return listarPorStatus(StatusEnum.StatusAvaliacao.APROVADO);
    }

    public List<Avaliacao> listarPendentes() {
        return listarPorStatus(StatusEnum.StatusAvaliacao.PENDENTE);
    }

    @Transactional(readOnly = true)
    public AvaliacaoStatistics getStatistics() {
        long totalAvaliacoes = avaliacaoRepository.countByStatusTrue();
        long avaliacoesPendentes = contarPorStatus(StatusEnum.StatusAvaliacao.PENDENTE);
        long avaliacoesAprovadas = contarPorStatus(StatusEnum.StatusAvaliacao.APROVADO);
        long avaliacoesCanceladas = contarPorStatus(StatusEnum.StatusAvaliacao.CANCELADO);

        return new AvaliacaoStatistics(totalAvaliacoes, avaliacoesPendentes, avaliacoesAprovadas, avaliacoesCanceladas);
    }

    public static class AvaliacaoStatistics {
        private long totalAvaliacoes;
        private long avaliacoesPendentes;
        private long avaliacoesAprovadas;
        private long avaliacoesCanceladas;

        public AvaliacaoStatistics(long totalAvaliacoes, long avaliacoesPendentes, long avaliacoesAprovadas, long avaliacoesCanceladas) {
            this.totalAvaliacoes = totalAvaliacoes;
            this.avaliacoesPendentes = avaliacoesPendentes;
            this.avaliacoesAprovadas = avaliacoesAprovadas;
            this.avaliacoesCanceladas = avaliacoesCanceladas;
        }

        // Getters
        public long getTotalAvaliacoes() { return totalAvaliacoes; }
        public long getAvaliacoesPendentes() { return avaliacoesPendentes; }
        public long getAvaliacoesAprovadas() { return avaliacoesAprovadas; }
        public long getAvaliacoesCanceladas() { return avaliacoesCanceladas; }
    }
}
