package com.sistema.avaliacoes.controller;

import com.sistema.avaliacoes.model.entity.ParticipanteAvaliacao;
import com.sistema.avaliacoes.model.enums.StatusEnum;
import com.sistema.avaliacoes.service.ParticipanteAvaliacaoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/participantes")
@Tag(name = "Participantes", description = "Gestão de participantes e aplicações de avaliações")
@CrossOrigin(origins = "http://localhost:3000")
public class ParticipanteAvaliacaoController {

    @Autowired
    private ParticipanteAvaliacaoService participanteService;

    @GetMapping("/avaliacao/{avaliacaoId}")
    @Operation(summary = "Listar participantes de uma avaliação")
    @PreAuthorize("hasRole('ADMIN') or hasRole('PROFESSOR')")
    public ResponseEntity<List<ParticipanteAvaliacao>> listarParticipantes(@PathVariable Long avaliacaoId) {
        return ResponseEntity.ok(participanteService.listarParticipantesPorAvaliacao(avaliacaoId));
    }

    @PostMapping("/avaliacao/{avaliacaoId}/alunos")
    @Operation(summary = "Adicionar participantes à avaliação")
    @PreAuthorize("hasRole('ADMIN') or hasRole('PROFESSOR')")
    public ResponseEntity<Void> adicionarParticipantes(
            @PathVariable Long avaliacaoId,
            @RequestBody List<Long> alunosIds) {
        try {
            participanteService.adicionarParticipantes(avaliacaoId, alunosIds);
            return ResponseEntity.status(HttpStatus.CREATED).build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{participanteId}")
    @Operation(summary = "Remover participante da avaliação")
    @PreAuthorize("hasRole('ADMIN') or hasRole('PROFESSOR')")
    public ResponseEntity<Void> removerParticipante(@PathVariable Long participanteId) {
        try {
            participanteService.removerParticipante(participanteId);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PatchMapping("/avaliacao/{avaliacaoId}/liberar")
    @Operation(summary = "Liberar avaliação para os participantes")
    @PreAuthorize("hasRole('ADMIN') or hasRole('PROFESSOR')")
    public ResponseEntity<Void> liberarAvaliacao(@PathVariable Long avaliacaoId) {
        try {
            participanteService.liberarAvaliacao(avaliacaoId);
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/aluno/disponiveis")
    @Operation(summary = "Listar avaliações disponíveis para o aluno")
    @PreAuthorize("hasRole('ALUNO')")
    public ResponseEntity<List<ParticipanteAvaliacao>> listarAvaliacoesDisponiveis(Authentication authentication) {
        Long alunoId = extractUserIdFromAuthentication(authentication);
        return ResponseEntity.ok(participanteService.listarAvaliacoesDisponiveis(alunoId));
    }

    @GetMapping("/aluno/concluidas")
    @Operation(summary = "Listar avaliações concluídas pelo aluno")
    @PreAuthorize("hasRole('ALUNO')")
    public ResponseEntity<List<ParticipanteAvaliacao>> listarAvaliacoesConcluidas(Authentication authentication) {
        Long alunoId = extractUserIdFromAuthentication(authentication);
        return ResponseEntity.ok(participanteService.listarAvaliacoesConcluidas(alunoId));
    }

    @PostMapping("/{participanteId}/iniciar")
    @Operation(summary = "Iniciar aplicação da avaliação")
    @PreAuthorize("hasRole('ALUNO')")
    public ResponseEntity<ParticipanteAvaliacao> iniciarAvaliacao(
            @PathVariable Long participanteId,
            Authentication authentication) {
        try {
            Long alunoId = extractUserIdFromAuthentication(authentication);
            ParticipanteAvaliacao participante = participanteService.iniciarAvaliacao(participanteId, alunoId);
            return ResponseEntity.ok(participante);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/{participanteId}/finalizar")
    @Operation(summary = "Finalizar aplicação da avaliação")
    @PreAuthorize("hasRole('ALUNO')")
    public ResponseEntity<ParticipanteAvaliacao> finalizarAvaliacao(
            @PathVariable Long participanteId,
            Authentication authentication) {
        try {
            Long alunoId = extractUserIdFromAuthentication(authentication);
            ParticipanteAvaliacao participante = participanteService.finalizarAvaliacao(participanteId, alunoId);
            return ResponseEntity.ok(participante);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/{participanteId}/status")
    @Operation(summary = "Obter status da participação")
    @PreAuthorize("hasRole('ALUNO') or hasRole('PROFESSOR') or hasRole('ADMIN')")
    public ResponseEntity<ParticipanteAvaliacao> obterStatus(@PathVariable Long participanteId) {
        try {
            ParticipanteAvaliacao participante = participanteService.buscarPorId(participanteId);
            return ResponseEntity.ok(participante);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/avaliacao/{avaliacaoId}/estatisticas")
    @Operation(summary = "Estatísticas de participação da avaliação")
    @PreAuthorize("hasRole('ADMIN') or hasRole('PROFESSOR')")
    public ResponseEntity<ParticipantesStatistics> obterEstatisticasParticipacao(@PathVariable Long avaliacaoId) {
        ParticipantesStatistics stats = participanteService.obterEstatisticasParticipacao(avaliacaoId);
        return ResponseEntity.ok(stats);
    }

    @PatchMapping("/{participanteId}/status")
    @Operation(summary = "Alterar status do participante")
    @PreAuthorize("hasRole('ADMIN') or hasRole('PROFESSOR')")
    public ResponseEntity<ParticipanteAvaliacao> alterarStatus(
            @PathVariable Long participanteId,
            @RequestParam StatusEnum.StatusParticipacao novoStatus) {
        try {
            ParticipanteAvaliacao participante = participanteService.alterarStatus(participanteId, novoStatus);
            return ResponseEntity.ok(participante);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Classe para estatísticas de participação
    public static class ParticipantesStatistics {
        private long totalParticipantes;
        private long participantesInscritos;
        private long participantesIniciados;
        private long participantesConcluidos;
        private long participantesPendentes;

        public ParticipantesStatistics(long totalParticipantes, long participantesInscritos, 
                                     long participantesIniciados, long participantesConcluidos, 
                                     long participantesPendentes) {
            this.totalParticipantes = totalParticipantes;
            this.participantesInscritos = participantesInscritos;
            this.participantesIniciados = participantesIniciados;
            this.participantesConcluidos = participantesConcluidos;
            this.participantesPendentes = participantesPendentes;
        }

        // Getters
        public long getTotalParticipantes() { return totalParticipantes; }
        public long getParticipantesInscritos() { return participantesInscritos; }
        public long getParticipantesIniciados() { return participantesIniciados; }
        public long getParticipantesConcluidos() { return participantesConcluidos; }
        public long getParticipantesPendentes() { return participantesPendentes; }
    }

    private Long extractUserIdFromAuthentication(Authentication authentication) {
        // Implementar extração do ID do usuário do JWT
        // Por enquanto, retorna 1 como fallback
        return 1L;
    }
}
