package com.sistema.avaliacoes.service;

import com.sistema.avaliacoes.model.entity.AvaliacaoResposta;
import com.sistema.avaliacoes.model.entity.Questao;
import com.sistema.avaliacoes.model.entity.QuestaoAlternativa;
import com.sistema.avaliacoes.model.entity.Usuario;
import com.sistema.avaliacoes.model.enums.StatusEnum;
import com.sistema.avaliacoes.repository.AvaliacaoRespostaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class AvaliacaoRespostaService {

    @Autowired
    private AvaliacaoRespostaRepository respostaRepository;

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private QuestaoService questaoService;

    public AvaliacaoResposta salvarResposta(Long usuarioId, Long questaoId, 
                                          String respostaTexto, Long alternativaId) {
        Usuario usuario = usuarioService.buscarPorId(usuarioId);
        Questao questao = questaoService.buscarPorId(questaoId);

        // Verificar se já existe resposta
        Optional<AvaliacaoResposta> respostaExistente = respostaRepository
                .findByUsuarioIdAndQuestaoIdAndStatusTrue(usuarioId, questaoId);

        AvaliacaoResposta resposta;
        if (respostaExistente.isPresent()) {
            resposta = respostaExistente.get();
        } else {
            resposta = new AvaliacaoResposta();
            resposta.setUsuario(usuario);
            resposta.setQuestao(questao);
        }

        // Definir resposta baseada no tipo da questão
        if (questao.isDissertativa()) {
            resposta.setResposta(respostaTexto);
            resposta.setQuestaoAlternativa(null);
        } else if (questao.isMultiplaEscolha() && alternativaId != null) {
            // Buscar alternativa e verificar se está correta
            QuestaoAlternativa alternativa = questao.getAlternativas().stream()
                    .filter(alt -> alt.getId().equals(alternativaId))
                    .findFirst()
                    .orElseThrow(() -> new IllegalArgumentException("Alternativa não encontrada"));
            
            resposta.setQuestaoAlternativa(alternativa);
            resposta.setResposta(null);
            
            // Correção automática para múltipla escolha
            resposta.setCorreta(alternativa.getCorreta());
            resposta.setCorrigidoPor(StatusEnum.TipoCorrecao.IA);
            resposta.setPontuacao(alternativa.getCorreta() ? 
                questao.getPontuacao() : BigDecimal.ZERO);
        }

        return respostaRepository.save(resposta);
    }

    public AvaliacaoResposta corrigirResposta(Long respostaId, Boolean correta, 
                                            BigDecimal pontuacao, String observacoes) {
        AvaliacaoResposta resposta = buscarPorId(respostaId);
        
        resposta.setCorreta(correta);
        resposta.setPontuacao(pontuacao);
        resposta.setObservacoes(observacoes);
        resposta.setCorrigidoPor(StatusEnum.TipoCorrecao.MANUAL);
        
        return respostaRepository.save(resposta);
    }

    public AvaliacaoResposta corrigirAutomaticamente(Long respostaId) {
        AvaliacaoResposta resposta = buscarPorId(respostaId);
        Questao questao = resposta.getQuestao();

        if (questao.isDissertativa() && questao.getRespostaCorreta() != null) {
            // Correção simples por similaridade de texto (pode ser melhorada com IA)
            String respostaUsuario = resposta.getResposta().toLowerCase().trim();
            String respostaCorreta = questao.getRespostaCorreta().toLowerCase().trim();
            
            boolean correta = calcularSimilaridade(respostaUsuario, respostaCorreta) > 0.7;
            
            resposta.setCorreta(correta);
            resposta.setCorrigidoPor(StatusEnum.TipoCorrecao.IA);
            resposta.setPontuacao(correta ? questao.getPontuacao() : BigDecimal.ZERO);
        }

        return respostaRepository.save(resposta);
    }

    @Transactional(readOnly = true)
    public AvaliacaoResposta buscarPorId(Long id) {
        return respostaRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Resposta não encontrada"));
    }

    @Transactional(readOnly = true)
    public List<AvaliacaoResposta> listarPorUsuario(Long usuarioId) {
        return respostaRepository.findByUsuarioIdAndStatusTrue(usuarioId);
    }

    @Transactional(readOnly = true)
    public List<AvaliacaoResposta> listarPorQuestao(Long questaoId) {
        return respostaRepository.findByQuestaoIdAndStatusTrue(questaoId);
    }

    @Transactional(readOnly = true)
    public List<AvaliacaoResposta> listarRespostasPorAvaliacaoEUsuario(Long avaliacaoId, Long usuarioId) {
        return respostaRepository.findRespostasPorAvaliacaoEUsuario(avaliacaoId, usuarioId);
    }

    @Transactional(readOnly = true)
    public List<AvaliacaoResposta> listarRespostasPendentesCorrecao() {
        return respostaRepository.findRespostasPendentesCorrecao();
    }

    @Transactional(readOnly = true)
    public List<AvaliacaoResposta> listarRespostasNaoCorrigidas() {
        return respostaRepository.findByCorretaIsNullAndStatusTrue();
    }

    @Transactional(readOnly = true)
    public Optional<AvaliacaoResposta> buscarResposta(Long usuarioId, Long questaoId) {
        return respostaRepository.findByUsuarioIdAndQuestaoIdAndStatusTrue(usuarioId, questaoId);
    }

    @Transactional(readOnly = true)
    public long contarRespostasCorretasPorUsuario(Long usuarioId) {
        return respostaRepository.countRespostasCorretasPorUsuario(usuarioId);
    }

    @Transactional(readOnly = true)
    public long contarRespostasCorretasPorQuestao(Long questaoId) {
        return respostaRepository.countRespostasCorretasPorQuestao(questaoId);
    }

    @Transactional(readOnly = true)
    public Double calcularMediaPorUsuario(Long usuarioId) {
        return respostaRepository.calcularMediaPorUsuario(usuarioId);
    }

    public void corrigirRespostasAutomaticamente() {
        List<AvaliacaoResposta> respostasPendentes = listarRespostasNaoCorrigidas();
        
        for (AvaliacaoResposta resposta : respostasPendentes) {
            if (resposta.getQuestao().isMultiplaEscolha() && resposta.getQuestaoAlternativa() != null) {
                // Múltipla escolha - correção automática
                resposta.setCorreta(resposta.getQuestaoAlternativa().getCorreta());
                resposta.setCorrigidoPor(StatusEnum.TipoCorrecao.IA);
                resposta.setPontuacao(resposta.getCorreta() ? 
                    resposta.getQuestao().getPontuacao() : BigDecimal.ZERO);
                respostaRepository.save(resposta);
            }
        }
    }

    private double calcularSimilaridade(String s1, String s2) {
        // Implementação simples de similaridade (pode ser melhorada)
        String[] palavras1 = s1.split("\\s+");
        String[] palavras2 = s2.split("\\s+");
        
        int palavrasComuns = 0;
        for (String palavra1 : palavras1) {
            for (String palavra2 : palavras2) {
                if (palavra1.equals(palavra2)) {
                    palavrasComuns++;
                    break;
                }
            }
        }
        
        return (double) palavrasComuns / Math.max(palavras1.length, palavras2.length);
    }

    public void excluirResposta(Long respostaId) {
        AvaliacaoResposta resposta = buscarPorId(respostaId);
        resposta.setStatus(false);
        respostaRepository.save(resposta);
    }

    // Método para calcular estatísticas de desempenho
    @Transactional(readOnly = true)
    public Object calcularEstatisticasUsuario(Long usuarioId) {
        return new Object() {
            public final long totalRespostas = listarPorUsuario(usuarioId).size();
            public final long respostasCorretas = contarRespostasCorretasPorUsuario(usuarioId);
            public final Double mediaGeral = calcularMediaPorUsuario(usuarioId);
            public final double percentualAcerto = totalRespostas > 0 ? 
                (double) respostasCorretas / totalRespostas * 100 : 0;
        };
    }
}
