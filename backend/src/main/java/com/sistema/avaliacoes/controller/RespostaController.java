package com.sistema.avaliacoes.controller;

import com.sistema.avaliacoes.model.entity.AvaliacaoResposta;
import com.sistema.avaliacoes.service.AvaliacaoRespostaService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/respostas")
@Tag(name = "Respostas", description = "Gestão de respostas e correção")
@CrossOrigin(origins = "http://localhost:3000")
public class RespostaController {

    @Autowired
    private AvaliacaoRespostaService respostaService;

    @PostMapping
    @Operation(summary = "Salvar resposta do aluno")
    @PreAuthorize("hasRole('ALUNO')")
    public ResponseEntity<AvaliacaoResposta> salvarResposta(
            @Valid @RequestBody SalvarRespostaRequest request,
            Authentication authentication) {
        try {
            Long usuarioId = extractUserIdFromAuthentication(authentication);
            AvaliacaoResposta resposta = respostaService.salvarResposta(
                usuarioId,
                request.getQuestaoId(),
                request.getRespostaTexto(),
                request.getAlternativaId()
            );
            return ResponseEntity.status(HttpStatus.CREATED).body(resposta);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar resposta por ID")
    @PreAuthorize("hasRole('ADMIN') or hasRole('PROFESSOR')")
    public ResponseEntity<AvaliacaoResposta> buscarPorId(@PathVariable Long id) {
        AvaliacaoResposta resposta = respostaService.buscarPorId(id);
        return ResponseEntity.ok(resposta);
    }

    @GetMapping("/usuario/{usuarioId}")
    @Operation(summary = "Listar respostas por usuário")
    @PreAuthorize("hasRole('ADMIN') or hasRole('PROFESSOR') or (#usuarioId == authentication.principal.id and hasRole('ALUNO'))")
    public ResponseEntity<List<AvaliacaoResposta>> listarPorUsuario(@PathVariable Long usuarioId) {
        return ResponseEntity.ok(respostaService.listarPorUsuario(usuarioId));
    }

    @GetMapping("/questao/{questaoId}")
    @Operation(summary = "Listar respostas por questão")
    @PreAuthorize("hasRole('ADMIN') or hasRole('PROFESSOR')")
    public ResponseEntity<List<AvaliacaoResposta>> listarPorQuestao(@PathVariable Long questaoId) {
        return ResponseEntity.ok(respostaService.listarPorQuestao(questaoId));
    }

    @GetMapping("/avaliacao/{avaliacaoId}/usuario/{usuarioId}")
    @Operation(summary = "Listar respostas por avaliação e usuário")
    @PreAuthorize("hasRole('ADMIN') or hasRole('PROFESSOR') or (#usuarioId == authentication.principal.id and hasRole('ALUNO'))")
    public ResponseEntity<List<AvaliacaoResposta>> listarPorAvaliacaoEUsuario(
            @PathVariable Long avaliacaoId,
            @PathVariable Long usuarioId) {
        return ResponseEntity.ok(respostaService.listarRespostasPorAvaliacaoEUsuario(avaliacaoId, usuarioId));
    }

    @GetMapping("/minhas-respostas")
    @Operation(summary = "Listar minhas respostas")
    @PreAuthorize("hasRole('ALUNO')")
    public ResponseEntity<List<AvaliacaoResposta>> listarMinhasRespostas(Authentication authentication) {
        Long usuarioId = extractUserIdFromAuthentication(authentication);
        return ResponseEntity.ok(respostaService.listarPorUsuario(usuarioId));
    }

    @GetMapping("/resposta")
    @Operation(summary = "Buscar resposta específica")
    @PreAuthorize("hasRole('ADMIN') or hasRole('PROFESSOR') or hasRole('ALUNO')")
    public ResponseEntity<AvaliacaoResposta> buscarResposta(
            @RequestParam Long usuarioId,
            @RequestParam Long questaoId) {
        Optional<AvaliacaoResposta> resposta = respostaService.buscarResposta(usuarioId, questaoId);
        return resposta.map(ResponseEntity::ok)
                      .orElse(ResponseEntity.notFound().build());
    }

    // CORREÇÃO MANUAL
    @PatchMapping("/{id}/corrigir")
    @Operation(summary = "Corrigir resposta manualmente")
    @PreAuthorize("hasRole('ADMIN') or hasRole('PROFESSOR')")
    public ResponseEntity<AvaliacaoResposta> corrigirResposta(
            @PathVariable Long id,
            @Valid @RequestBody CorrigirRespostaRequest request) {
        try {
            AvaliacaoResposta resposta = respostaService.corrigirResposta(
                id,
                request.getCorreta(),
                request.getPontuacao(),
                request.getObservacoes()
            );
            return ResponseEntity.ok(resposta);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PatchMapping("/{id}/corrigir-automaticamente")
    @Operation(summary = "Corrigir resposta automaticamente")
    @PreAuthorize("hasRole('ADMIN') or hasRole('PROFESSOR')")
    public ResponseEntity<AvaliacaoResposta> corrigirAutomaticamente(@PathVariable Long id) {
        try {
            AvaliacaoResposta resposta = respostaService.corrigirAutomaticamente(id);
            return ResponseEntity.ok(resposta);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/corrigir-automaticamente")
    @Operation(summary = "Corrigir todas as respostas automaticamente")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> corrigirTodasAutomaticamente() {
        respostaService.corrigirRespostasAutomaticamente();
        return ResponseEntity.ok().build();
    }

    // LISTAGENS PARA CORREÇÃO
    @GetMapping("/pendentes-correcao")
    @Operation(summary = "Listar respostas pendentes de correção")
    @PreAuthorize("hasRole('ADMIN') or hasRole('PROFESSOR')")
    public ResponseEntity<List<AvaliacaoResposta>> listarPendentesCorrecao() {
        return ResponseEntity.ok(respostaService.listarRespostasPendentesCorrecao());
    }

    @GetMapping("/nao-corrigidas")
    @Operation(summary = "Listar respostas não corrigidas")
    @PreAuthorize("hasRole('ADMIN') or hasRole('PROFESSOR')")
    public ResponseEntity<List<AvaliacaoResposta>> listarNaoCorrigidas() {
        return ResponseEntity.ok(respostaService.listarRespostasNaoCorrigidas());
    }

    // ESTATÍSTICAS
    @GetMapping("/estatisticas/usuario/{usuarioId}")
    @Operation(summary = "Estatísticas de respostas do usuário")
    @PreAuthorize("hasRole('ADMIN') or hasRole('PROFESSOR') or (#usuarioId == authentication.principal.id and hasRole('ALUNO'))")
    public ResponseEntity<Object> obterEstatisticasUsuario(@PathVariable Long usuarioId) {
        return ResponseEntity.ok(respostaService.calcularEstatisticasUsuario(usuarioId));
    }

    @GetMapping("/estatisticas/questao/{questaoId}")
    @Operation(summary = "Estatísticas de respostas da questão")
    @PreAuthorize("hasRole('ADMIN') or hasRole('PROFESSOR')")
    public ResponseEntity<Object> obterEstatisticasQuestao(@PathVariable Long questaoId) {
        return ResponseEntity.ok(new Object() {
            public final long totalRespostas = respostaService.listarPorQuestao(questaoId).size();
            public final long respostasCorretas = respostaService.contarRespostasCorretasPorQuestao(questaoId);
            public final double percentualAcerto = totalRespostas > 0 ? 
                (double) respostasCorretas / totalRespostas * 100 : 0;
        });
    }

    @GetMapping("/estatisticas/minhas")
    @Operation(summary = "Minhas estatísticas")
    @PreAuthorize("hasRole('ALUNO')")
    public ResponseEntity<Object> obterMinhasEstatisticas(Authentication authentication) {
        Long usuarioId = extractUserIdFromAuthentication(authentication);
        return ResponseEntity.ok(respostaService.calcularEstatisticasUsuario(usuarioId));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Excluir resposta")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> excluirResposta(@PathVariable Long id) {
        respostaService.excluirResposta(id);
        return ResponseEntity.noContent().build();
    }

    // Classes auxiliares
    public static class SalvarRespostaRequest {
        private Long questaoId;
        private String respostaTexto;
        private Long alternativaId;

        // Getters and Setters
        public Long getQuestaoId() {
            return questaoId;
        }

        public void setQuestaoId(Long questaoId) {
            this.questaoId = questaoId;
        }

        public String getRespostaTexto() {
            return respostaTexto;
        }

        public void setRespostaTexto(String respostaTexto) {
            this.respostaTexto = respostaTexto;
        }

        public Long getAlternativaId() {
            return alternativaId;
        }

        public void setAlternativaId(Long alternativaId) {
            this.alternativaId = alternativaId;
        }
    }

    public static class CorrigirRespostaRequest {
        private Boolean correta;
        private BigDecimal pontuacao;
        private String observacoes;

        // Getters and Setters
        public Boolean getCorreta() {
            return correta;
        }

        public void setCorreta(Boolean correta) {
            this.correta = correta;
        }

        public BigDecimal getPontuacao() {
            return pontuacao;
        }

        public void setPontuacao(BigDecimal pontuacao) {
            this.pontuacao = pontuacao;
        }

        public String getObservacoes() {
            return observacoes;
        }

        public void setObservacoes(String observacoes) {
            this.observacoes = observacoes;
        }
    }

    private Long extractUserIdFromAuthentication(Authentication authentication) {
        // Implementar extração do ID do usuário do JWT
        // Por enquanto, retorna 1 como fallback
        return 1L;
    }
}
