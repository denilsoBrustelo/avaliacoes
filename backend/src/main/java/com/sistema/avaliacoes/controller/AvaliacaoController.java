package com.sistema.avaliacoes.controller;

import com.sistema.avaliacoes.model.entity.Avaliacao;
import com.sistema.avaliacoes.model.entity.Questao;
import com.sistema.avaliacoes.model.enums.StatusEnum;
import com.sistema.avaliacoes.service.AvaliacaoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/avaliacoes")
@Tag(name = "Avaliações", description = "Operações relacionadas às avaliações")
@CrossOrigin(origins = "http://localhost:3000")
public class AvaliacaoController {

    @Autowired
    private AvaliacaoService avaliacaoService;

    @GetMapping
    @Operation(summary = "Listar todas as avaliações")
    @PreAuthorize("hasRole('ADMIN') or hasRole('PROFESSOR')")
    public ResponseEntity<List<Avaliacao>> listarTodas() {
        return ResponseEntity.ok(avaliacaoService.listarTodas());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar avaliação por ID")
    @PreAuthorize("hasRole('ADMIN') or hasRole('PROFESSOR')")
    public ResponseEntity<Avaliacao> buscarPorId(@PathVariable Long id) {
        Avaliacao avaliacao = avaliacaoService.buscarPorId(id);
        return ResponseEntity.ok(avaliacao);
    }

    @PostMapping
    @Operation(summary = "Criar nova avaliação")
    @PreAuthorize("hasRole('ADMIN') or hasRole('PROFESSOR')")
    public ResponseEntity<Avaliacao> criar(@Valid @RequestBody CreateAvaliacaoRequest request) {
        try {
            Avaliacao avaliacao = avaliacaoService.criar(request.getAvaliacao(), request.getQuestoesIds());
            return ResponseEntity.status(HttpStatus.CREATED).body(avaliacao);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    @Operation(summary = "Atualizar avaliação")
    @PreAuthorize("hasRole('ADMIN') or hasRole('PROFESSOR')")
    public ResponseEntity<Avaliacao> atualizar(@PathVariable Long id, @Valid @RequestBody Avaliacao avaliacao) {
        try {
            Avaliacao atualizada = avaliacaoService.atualizar(id, avaliacao);
            return ResponseEntity.ok(atualizada);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Excluir avaliação")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        avaliacaoService.excluir(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/professor/{professorId}")
    @Operation(summary = "Listar avaliaç��es por professor")
    @PreAuthorize("hasRole('ADMIN') or (#professorId == authentication.principal.id and hasRole('PROFESSOR'))")
    public ResponseEntity<List<Avaliacao>> listarPorProfessor(@PathVariable Long professorId) {
        return ResponseEntity.ok(avaliacaoService.listarPorProfessor(professorId));
    }

    @GetMapping("/minhas")
    @Operation(summary = "Listar minhas avaliações")
    @PreAuthorize("hasRole('PROFESSOR')")
    public ResponseEntity<List<Avaliacao>> listarMinhasAvaliacoes(Authentication authentication) {
        // Extrair ID do usuário autenticado
        Long professorId = extractUserIdFromAuthentication(authentication);
        return ResponseEntity.ok(avaliacaoService.listarPorProfessor(professorId));
    }

    @GetMapping("/status/{status}")
    @Operation(summary = "Listar avaliações por status")
    @PreAuthorize("hasRole('ADMIN') or hasRole('PROFESSOR')")
    public ResponseEntity<List<Avaliacao>> listarPorStatus(@PathVariable StatusEnum.StatusAvaliacao status) {
        return ResponseEntity.ok(avaliacaoService.listarPorStatus(status));
    }

    @GetMapping("/tipo/{tipoId}")
    @Operation(summary = "Listar avaliações por tipo")
    @PreAuthorize("hasRole('ADMIN') or hasRole('PROFESSOR')")
    public ResponseEntity<List<Avaliacao>> listarPorTipo(@PathVariable Long tipoId) {
        return ResponseEntity.ok(avaliacaoService.listarPorTipoAvaliacao(tipoId));
    }

    @PatchMapping("/{id}/aprovar")
    @Operation(summary = "Aprovar avaliação")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Avaliacao> aprovar(@PathVariable Long id) {
        Avaliacao avaliacao = avaliacaoService.aprovar(id);
        return ResponseEntity.ok(avaliacao);
    }

    @PatchMapping("/{id}/cancelar")
    @Operation(summary = "Cancelar avaliação")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Avaliacao> cancelar(@PathVariable Long id) {
        Avaliacao avaliacao = avaliacaoService.cancelar(id);
        return ResponseEntity.ok(avaliacao);
    }

    @PatchMapping("/{id}/status")
    @Operation(summary = "Alterar status da avaliação")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Avaliacao> alterarStatus(@PathVariable Long id, 
                                                   @RequestParam StatusEnum.StatusAvaliacao novoStatus) {
        Avaliacao avaliacao = avaliacaoService.alterarStatus(id, novoStatus);
        return ResponseEntity.ok(avaliacao);
    }

    // GESTÃO DE QUESTÕES DA AVALIAÇÃO
    @PostMapping("/{id}/questoes")
    @Operation(summary = "Adicionar questões à avaliação")
    @PreAuthorize("hasRole('ADMIN') or hasRole('PROFESSOR')")
    public ResponseEntity<Void> adicionarQuestoes(@PathVariable Long id, 
                                                  @RequestBody List<Long> questoesIds) {
        try {
            avaliacaoService.adicionarQuestoes(id, questoesIds);
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{avaliacaoId}/questoes/{questaoId}")
    @Operation(summary = "Remover questão da avaliação")
    @PreAuthorize("hasRole('ADMIN') or hasRole('PROFESSOR')")
    public ResponseEntity<Void> removerQuestao(@PathVariable Long avaliacaoId, 
                                               @PathVariable Long questaoId) {
        try {
            avaliacaoService.removerQuestao(avaliacaoId, questaoId);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/{id}/questoes")
    @Operation(summary = "Listar questões da avaliação")
    @PreAuthorize("hasRole('ADMIN') or hasRole('PROFESSOR')")
    public ResponseEntity<List<Questao>> listarQuestoes(@PathVariable Long id) {
        return ResponseEntity.ok(avaliacaoService.listarQuestoesAvaliacao(id));
    }

    // ESTATÍSTICAS
    @GetMapping("/estatisticas")
    @Operation(summary = "Estatísticas de avaliações")
    @PreAuthorize("hasRole('ADMIN') or hasRole('PROFESSOR')")
    public ResponseEntity<AvaliacaoService.AvaliacaoStatistics> obterEstatisticas() {
        return ResponseEntity.ok(avaliacaoService.getStatistics());
    }

    @GetMapping("/aprovadas")
    @Operation(summary = "Listar avaliações aprovadas")
    @PreAuthorize("hasRole('ADMIN') or hasRole('PROFESSOR')")
    public ResponseEntity<List<Avaliacao>> listarAprovadas() {
        return ResponseEntity.ok(avaliacaoService.listarAprovadas());
    }

    @GetMapping("/pendentes")
    @Operation(summary = "Listar avaliações pendentes")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Avaliacao>> listarPendentes() {
        return ResponseEntity.ok(avaliacaoService.listarPendentes());
    }

    // Classe auxiliar para criação de avaliação
    public static class CreateAvaliacaoRequest {
        private Avaliacao avaliacao;
        private List<Long> questoesIds;

        // Getters and Setters
        public Avaliacao getAvaliacao() {
            return avaliacao;
        }

        public void setAvaliacao(Avaliacao avaliacao) {
            this.avaliacao = avaliacao;
        }

        public List<Long> getQuestoesIds() {
            return questoesIds;
        }

        public void setQuestoesIds(List<Long> questoesIds) {
            this.questoesIds = questoesIds;
        }
    }

    private Long extractUserIdFromAuthentication(Authentication authentication) {
        // Implementar extração do ID do usuário do JWT
        // Por enquanto, retorna 1 como fallback
        return 1L;
    }
}
