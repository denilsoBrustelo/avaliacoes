package com.sistema.avaliacoes.service;

import com.sistema.avaliacoes.model.entity.Questao;
import com.sistema.avaliacoes.model.entity.QuestaoAlternativa;
import com.sistema.avaliacoes.model.enums.StatusEnum;
import com.sistema.avaliacoes.repository.QuestaoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;

@Service
@Transactional
public class QuestaoService {

    @Autowired
    private QuestaoRepository questaoRepository;

    public Questao criar(Questao questao) {
        // Validar questão de múltipla escolha
        if (questao.isMultiplaEscolha()) {
            validarAlternativasMultiplaEscolha(questao.getAlternativas());
        }

        // Validar questão dissertativa
        if (questao.isDissertativa() && 
            (questao.getRespostaCorreta() == null || questao.getRespostaCorreta().trim().isEmpty())) {
            throw new IllegalArgumentException("Resposta correta é obrigatória para questões dissertativas");
        }

        return questaoRepository.save(questao);
    }

    public Questao atualizar(Long id, Questao questaoAtualizada) {
        Questao questaoExistente = buscarPorId(id);

        // Atualizar campos básicos
        questaoExistente.setPergunta(questaoAtualizada.getPergunta());
        questaoExistente.setDisciplina(questaoAtualizada.getDisciplina());
        questaoExistente.setPontuacao(questaoAtualizada.getPontuacao());
        questaoExistente.setTipoAlternativa(questaoAtualizada.getTipoAlternativa());
        questaoExistente.setRespostaCorreta(questaoAtualizada.getRespostaCorreta());
        questaoExistente.setNivelDificuldade(questaoAtualizada.getNivelDificuldade());
        questaoExistente.setCiclo(questaoAtualizada.getCiclo());
        questaoExistente.setFase(questaoAtualizada.getFase());
        questaoExistente.setTema(questaoAtualizada.getTema());
        questaoExistente.setHabilidades(questaoAtualizada.getHabilidades());

        // Validar novamente se necessário
        if (questaoExistente.isMultiplaEscolha()) {
            validarAlternativasMultiplaEscolha(questaoAtualizada.getAlternativas());
        }

        return questaoRepository.save(questaoExistente);
    }

    public void excluir(Long id) {
        Questao questao = buscarPorId(id);
        questao.setStatus(false);
        questaoRepository.save(questao);
    }

    @Transactional(readOnly = true)
    public Questao buscarPorId(Long id) {
        return questaoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Questão não encontrada"));
    }

    @Transactional(readOnly = true)
    public List<Questao> listarTodas() {
        return questaoRepository.findByStatusTrueOrderByDataCadastroDesc();
    }

    @Transactional(readOnly = true)
    public List<Questao> listarPorStatus(StatusEnum.StatusQuestao status) {
        return questaoRepository.findByStatusQuestaoAndStatusTrue(status);
    }

    @Transactional(readOnly = true)
    public List<Questao> listarPorDisciplina(Long disciplinaId) {
        return questaoRepository.findByDisciplinaIdAndStatusTrue(disciplinaId);
    }

    @Transactional(readOnly = true)
    public List<Questao> listarPorNivelDificuldade(Long nivelId) {
        return questaoRepository.findByNivelDificuldadeIdAndStatusTrue(nivelId);
    }

    @Transactional(readOnly = true)
    public List<Questao> buscarPorTermo(String termo) {
        return questaoRepository.buscarPorTermo(termo);
    }

    @Transactional(readOnly = true)
    public Page<Questao> listarComFiltros(Long disciplinaId, StatusEnum.StatusQuestao status, 
                                          Long nivelDificuldadeId, Pageable pageable) {
        return questaoRepository.findWithFilters(disciplinaId, status, nivelDificuldadeId, pageable);
    }

    public Questao aprovar(Long id) {
        Questao questao = buscarPorId(id);
        questao.setStatusQuestao(StatusEnum.StatusQuestao.APROVADO);
        return questaoRepository.save(questao);
    }

    public Questao cancelar(Long id) {
        Questao questao = buscarPorId(id);
        questao.setStatusQuestao(StatusEnum.StatusQuestao.CANCELADO);
        return questaoRepository.save(questao);
    }

    public Questao alterarStatus(Long id, StatusEnum.StatusQuestao novoStatus) {
        Questao questao = buscarPorId(id);
        questao.setStatusQuestao(novoStatus);
        return questaoRepository.save(questao);
    }

    @Transactional(readOnly = true)
    public long contarPorStatus(StatusEnum.StatusQuestao status) {
        return questaoRepository.countByStatusQuestaoAndStatusTrue(status);
    }

    @Transactional(readOnly = true)
    public long contarPorDisciplina(Long disciplinaId) {
        return questaoRepository.countByDisciplinaIdAndStatusTrue(disciplinaId);
    }

    private void validarAlternativasMultiplaEscolha(Set<QuestaoAlternativa> alternativas) {
        if (alternativas == null || alternativas.size() < 2) {
            throw new IllegalArgumentException("Questões de múltipla escolha devem ter pelo menos 2 alternativas");
        }

        long alternativasCorretas = alternativas.stream()
                .mapToLong(alt -> alt.getCorreta() ? 1 : 0)
                .sum();

        if (alternativasCorretas != 1) {
            throw new IllegalArgumentException("Deve haver exatamente uma alternativa correta");
        }
    }

    public List<Questao> listarAprovadas() {
        return listarPorStatus(StatusEnum.StatusQuestao.APROVADO);
    }

    public List<Questao> listarPendentes() {
        return listarPorStatus(StatusEnum.StatusQuestao.PENDENTE);
    }
}
