package com.sistema.avaliacoes.controller;

import com.sistema.avaliacoes.model.entity.ParticipanteAvaliacao;
import com.sistema.avaliacoes.model.enums.StatusEnum;
import com.sistema.avaliacoes.service.ParticipanteAvaliacaoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/participantes")
@Tag(name = "Participantes", description = "Gestão de participantes de avaliações")
@CrossOrigin(origins = "http://localhost:3000")
public class ParticipanteController {

    @Autowired
    private ParticipanteAvaliacaoService participanteService;

    @PostMapping
    @Operation(summary = "Adicionar participante à avaliação")
    @PreAuthorize("hasRole('ADMIN') or hasRole('PROFESSOR')")
    public ResponseEntity<ParticipanteAvaliacao> adicionarParticipante(
            @Valid @RequestBody AdicionarParticipanteRequest request) {
        try {
            ParticipanteAvaliacao participante = participanteService.adicionarParticipante(
                request.getAvaliacaoId(), 
                request.getUsuarioId(),
                request.getAno(),
                request.getEscola(),
                request.getTurma()
            );
            return ResponseEntity.status(HttpStatus.CREATED).body(participante);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/multiplos")
    @Operation(summary = "Adicionar múltiplos participantes")
    @PreAuthorize("hasRole('ADMIN') or hasRole('PROFESSOR')")
    public ResponseEntity<List<ParticipanteAvaliacao>> adicionarMultiplosParticipantes(
            @Valid @RequestBody AdicionarMultiplosRequest request) {
        try {
            List<ParticipanteAvaliacao> participantes = participanteService.adicionarMultiplosParticipantes(
                request.getAvaliacaoId(),
                request.getUsuariosIds(),
                request.getAno(),
                request.getEscola(),
                request.getTurma()
            );
            return ResponseEntity.status(HttpStatus.CREATED).body(participantes);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar participante por ID")
    @PreAuthorize("hasRole('ADMIN') or hasRole('PROFESSOR')")
    public ResponseEntity<ParticipanteAvaliacao> buscarPorId(@PathVariable Long id) {
        ParticipanteAvaliacao participante = participanteService.buscarPorId(id);
        return ResponseEntity.ok(participante);
    }

    @GetMapping("/avaliacao/{avaliacaoId}")
    @Operation(summary = "Listar participantes por avaliação")
    @PreAuthorize("hasRole('ADMIN') or hasRole('PROFESSOR')")
    public ResponseEntity<List<ParticipanteAvaliacao>> listarPorAvaliacao(@PathVariable Long avaliacaoId) {
        return ResponseEntity.ok(participanteService.listarPorAvaliacao(avaliacaoId));
    }

    @GetMapping("/aluno/{alunoId}")
    @Operation(summary = "Listar participações do aluno")
    @PreAuthorize("hasRole('ADMIN') or hasRole('PROFESSOR') or (#alunoId == authentication.principal.id and hasRole('ALUNO'))")
    public ResponseEntity<List<ParticipanteAvaliacao>> listarPorAluno(@PathVariable Long alunoId) {
        return ResponseEntity.ok(participanteService.listarPorAluno(alunoId));
    }

    @GetMapping("/minhas-provas")
    @Operation(summary = "Listar minhas participações")
    @PreAuthorize("hasRole('ALUNO')")
    public ResponseEntity<List<ParticipanteAvaliacao>> listarMinhasParticipacoes(Authentication authentication) {
        Long alunoId = extractUserIdFromAuthentication(authentication);
        return ResponseEntity.ok(participanteService.listarPorAluno(alunoId));
    }

    @GetMapping("/provas-disponiveis")
    @Operation(summary = "Listar provas disponíveis para o aluno")
    @PreAuthorize("hasRole('ALUNO')")
    public ResponseEntity<List<ParticipanteAvaliacao>> listarProvasDisponiveis(Authentication authentication) {
        Long alunoId = extractUserIdFromAuthentication(authentication);
        return ResponseEntity.ok(participanteService.listarProvasDisponiveis(alunoId));
    }

    @GetMapping("/provas-em-andamento")
    @Operation(summary = "Listar provas em andamento do aluno")
    @PreAuthorize("hasRole('ALUNO')")
    public ResponseEntity<List<ParticipanteAvaliacao>> listarProvasEmAndamento(Authentication authentication) {
        Long alunoId = extractUserIdFromAuthentication(authentication);
        return ResponseEntity.ok(participanteService.listarProvasEmAndamento(alunoId));
    }

    @GetMapping("/provas-concluidas")
    @Operation(summary = "Listar provas concluídas do aluno")
    @PreAuthorize("hasRole('ALUNO')")
    public ResponseEntity<List<ParticipanteAvaliacao>> listarProvasConcluidas(Authentication authentication) {
        Long alunoId = extractUserIdFromAuthentication(authentication);
        return ResponseEntity.ok(participanteService.listarProvasConcluidas(alunoId));
    }

    @GetMapping("/status/{status}")
    @Operation(summary = "Listar participantes por status")
    @PreAuthorize("hasRole('ADMIN') or hasRole('PROFESSOR')")
    public ResponseEntity<List<ParticipanteAvaliacao>> listarPorStatus(@PathVariable StatusEnum.StatusAplicacao status) {
        return ResponseEntity.ok(participanteService.listarPorStatus(status));
    }

    @PatchMapping("/{id}/liberar")
    @Operation(summary = "Liberar avaliação para aluno")
    @PreAuthorize("hasRole('ADMIN') or hasRole('PROFESSOR')")
    public ResponseEntity<ParticipanteAvaliacao> liberarParaAluno(
            @PathVariable Long id,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dataInicio) {
        try {
            ParticipanteAvaliacao participante = participanteService.liberarParaAluno(id, dataInicio);
            return ResponseEntity.ok(participante);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PatchMapping("/{id}/iniciar")
    @Operation(summary = "Iniciar avaliação")
    @PreAuthorize("hasRole('ALUNO')")
    public ResponseEntity<ParticipanteAvaliacao> iniciarAvaliacao(@PathVariable Long id) {
        try {
            ParticipanteAvaliacao participante = participanteService.iniciarAvaliacao(id);
            return ResponseEntity.ok(participante);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PatchMapping("/{id}/finalizar")
    @Operation(summary = "Finalizar avaliação")
    @PreAuthorize("hasRole('ALUNO')")
    public ResponseEntity<ParticipanteAvaliacao> finalizarAvaliacao(@PathVariable Long id) {
        try {
            ParticipanteAvaliacao participante = participanteService.finalizarAvaliacao(id);
            return ResponseEntity.ok(participante);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PatchMapping("/{id}/marcar-avaliado")
    @Operation(summary = "Marcar como avaliado")
    @PreAuthorize("hasRole('ADMIN') or hasRole('PROFESSOR')")
    public ResponseEntity<ParticipanteAvaliacao> marcarComoAvaliado(@PathVariable Long id) {
        try {
            ParticipanteAvaliacao participante = participanteService.marcarComoAvaliado(id);
            return ResponseEntity.ok(participante);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    @Operation(summary = "Atualizar informações do participante")
    @PreAuthorize("hasRole('ADMIN') or hasRole('PROFESSOR')")
    public ResponseEntity<ParticipanteAvaliacao> atualizarInformacoes(
            @PathVariable Long id,
            @RequestBody AtualizarParticipanteRequest request) {
        try {
            ParticipanteAvaliacao participante = participanteService.atualizarInformacoes(
                id, request.getAno(), request.getEscola(), request.getTurma());
            return ResponseEntity.ok(participante);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Remover participante")
    @PreAuthorize("hasRole('ADMIN') or hasRole('PROFESSOR')")
    public ResponseEntity<Void> removerParticipante(@PathVariable Long id) {
        try {
            participanteService.removerParticipante(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/participacao")
    @Operation(summary = "Verificar participação específica")
    @PreAuthorize("hasRole('ADMIN') or hasRole('PROFESSOR')")
    public ResponseEntity<ParticipanteAvaliacao> verificarParticipacao(
            @RequestParam Long avaliacaoId,
            @RequestParam Long usuarioId) {
        Optional<ParticipanteAvaliacao> participacao = participanteService.buscarParticipacao(avaliacaoId, usuarioId);
        return participacao.map(ResponseEntity::ok)
                          .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/estatisticas/avaliacao/{avaliacaoId}")
    @Operation(summary = "Estatísticas de participação por avaliação")
    @PreAuthorize("hasRole('ADMIN') or hasRole('PROFESSOR')")
    public ResponseEntity<Object> obterEstatisticasAvaliacao(@PathVariable Long avaliacaoId) {
        return ResponseEntity.ok(new Object() {
            public final long totalParticipantes = participanteService.listarPorAvaliacao(avaliacaoId).size();
            public final long pendentes = participanteService.contarParticipantesPorAvaliacaoEStatus(
                avaliacaoId, StatusEnum.StatusAplicacao.PENDENTE);
            public final long emAndamento = participanteService.contarParticipantesPorAvaliacaoEStatus(
                avaliacaoId, StatusEnum.StatusAplicacao.EM_ANDAMENTO);
            public final long concluidos = participanteService.contarParticipantesPorAvaliacaoEStatus(
                avaliacaoId, StatusEnum.StatusAplicacao.CONCLUIDO);
        });
    }

    @GetMapping("/estatisticas/aluno/{alunoId}")
    @Operation(summary = "Estatísticas do aluno")
    @PreAuthorize("hasRole('ADMIN') or hasRole('PROFESSOR') or (#alunoId == authentication.principal.id and hasRole('ALUNO'))")
    public ResponseEntity<Object> obterEstatisticasAluno(@PathVariable Long alunoId) {
        return ResponseEntity.ok(new Object() {
            public final long totalParticipacoes = participanteService.listarPorAluno(alunoId).size();
            public final long avaliacoesConcluidas = participanteService.contarAvaliacoesConcluidasPorAluno(alunoId);
            public final long provasDisponiveis = participanteService.listarProvasDisponiveis(alunoId).size();
        });
    }

    // Classes auxiliares
    public static class AdicionarParticipanteRequest {
        private Long avaliacaoId;
        private Long usuarioId;
        private String ano;
        private String escola;
        private String turma;

        // Getters and Setters
        public Long getAvaliacaoId() { return avaliacaoId; }
        public void setAvaliacaoId(Long avaliacaoId) { this.avaliacaoId = avaliacaoId; }
        public Long getUsuarioId() { return usuarioId; }
        public void setUsuarioId(Long usuarioId) { this.usuarioId = usuarioId; }
        public String getAno() { return ano; }
        public void setAno(String ano) { this.ano = ano; }
        public String getEscola() { return escola; }
        public void setEscola(String escola) { this.escola = escola; }
        public String getTurma() { return turma; }
        public void setTurma(String turma) { this.turma = turma; }
    }

    public static class AdicionarMultiplosRequest {
        private Long avaliacaoId;
        private List<Long> usuariosIds;
        private String ano;
        private String escola;
        private String turma;

        // Getters and Setters
        public Long getAvaliacaoId() { return avaliacaoId; }
        public void setAvaliacaoId(Long avaliacaoId) { this.avaliacaoId = avaliacaoId; }
        public List<Long> getUsuariosIds() { return usuariosIds; }
        public void setUsuariosIds(List<Long> usuariosIds) { this.usuariosIds = usuariosIds; }
        public String getAno() { return ano; }
        public void setAno(String ano) { this.ano = ano; }
        public String getEscola() { return escola; }
        public void setEscola(String escola) { this.escola = escola; }
        public String getTurma() { return turma; }
        public void setTurma(String turma) { this.turma = turma; }
    }

    public static class AtualizarParticipanteRequest {
        private String ano;
        private String escola;
        private String turma;

        // Getters and Setters
        public String getAno() { return ano; }
        public void setAno(String ano) { this.ano = ano; }
        public String getEscola() { return escola; }
        public void setEscola(String escola) { this.escola = escola; }
        public String getTurma() { return turma; }
        public void setTurma(String turma) { this.turma = turma; }
    }

    private Long extractUserIdFromAuthentication(Authentication authentication) {
        // Implementar extração do ID do usuário do JWT
        // Por enquanto, retorna 1 como fallback
        return 1L;
    }
}
