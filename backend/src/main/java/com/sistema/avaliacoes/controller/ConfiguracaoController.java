package com.sistema.avaliacoes.controller;

import com.sistema.avaliacoes.model.entity.*;
import com.sistema.avaliacoes.service.ConfiguracaoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/configuracoes")
@Tag(name = "Configurações", description = "Operações de configuração do sistema")
@CrossOrigin(origins = "http://localhost:3000")
public class ConfiguracaoController {

    @Autowired
    private ConfiguracaoService configuracaoService;

    // TIPOS DE AVALIAÇÃO
    @GetMapping("/tipos-avaliacoes")
    @Operation(summary = "Listar tipos de avaliação")
    @PreAuthorize("hasRole('ADMIN') or hasRole('PROFESSOR')")
    public ResponseEntity<List<TipoAvaliacao>> listarTiposAvaliacoes() {
        return ResponseEntity.ok(configuracaoService.listarTiposAvaliacoes());
    }

    @PostMapping("/tipos-avaliacoes")
    @Operation(summary = "Criar tipo de avaliação")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<TipoAvaliacao> criarTipoAvaliacao(@Valid @RequestBody TipoAvaliacao tipoAvaliacao) {
        try {
            TipoAvaliacao criado = configuracaoService.criarTipoAvaliacao(tipoAvaliacao);
            return ResponseEntity.status(HttpStatus.CREATED).body(criado);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/tipos-avaliacoes/{id}")
    @Operation(summary = "Atualizar tipo de avaliação")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<TipoAvaliacao> atualizarTipoAvaliacao(@PathVariable Long id, 
                                                               @Valid @RequestBody TipoAvaliacao tipoAvaliacao) {
        try {
            TipoAvaliacao atualizado = configuracaoService.atualizarTipoAvaliacao(id, tipoAvaliacao);
            return ResponseEntity.ok(atualizado);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/tipos-avaliacoes/{id}")
    @Operation(summary = "Excluir tipo de avaliação")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> excluirTipoAvaliacao(@PathVariable Long id) {
        configuracaoService.excluirTipoAvaliacao(id);
        return ResponseEntity.noContent().build();
    }

    // TIPOS DE ALTERNATIVAS
    @GetMapping("/tipos-alternativas")
    @Operation(summary = "Listar tipos de alternativas")
    @PreAuthorize("hasRole('ADMIN') or hasRole('PROFESSOR')")
    public ResponseEntity<List<TipoAlternativa>> listarTiposAlternativas() {
        return ResponseEntity.ok(configuracaoService.listarTiposAlternativas());
    }

    @PostMapping("/tipos-alternativas")
    @Operation(summary = "Criar tipo de alternativa")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<TipoAlternativa> criarTipoAlternativa(@Valid @RequestBody TipoAlternativa tipoAlternativa) {
        try {
            TipoAlternativa criado = configuracaoService.criarTipoAlternativa(tipoAlternativa);
            return ResponseEntity.status(HttpStatus.CREATED).body(criado);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // NÍVEIS DE DIFICULDADE
    @GetMapping("/niveis-dificuldades")
    @Operation(summary = "Listar níveis de dificuldade")
    @PreAuthorize("hasRole('ADMIN') or hasRole('PROFESSOR')")
    public ResponseEntity<List<NivelDificuldade>> listarNiveisDificuldades() {
        return ResponseEntity.ok(configuracaoService.listarNiveisDificuldades());
    }

    @PostMapping("/niveis-dificuldades")
    @Operation(summary = "Criar nível de dificuldade")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<NivelDificuldade> criarNivelDificuldade(@Valid @RequestBody NivelDificuldade nivelDificuldade) {
        try {
            NivelDificuldade criado = configuracaoService.criarNivelDificuldade(nivelDificuldade);
            return ResponseEntity.status(HttpStatus.CREATED).body(criado);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // DISCIPLINAS
    @GetMapping("/disciplinas")
    @Operation(summary = "Listar disciplinas")
    @PreAuthorize("hasRole('ADMIN') or hasRole('PROFESSOR')")
    public ResponseEntity<List<Disciplina>> listarDisciplinas() {
        return ResponseEntity.ok(configuracaoService.listarDisciplinas());
    }

    @PostMapping("/disciplinas")
    @Operation(summary = "Criar disciplina")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Disciplina> criarDisciplina(@Valid @RequestBody Disciplina disciplina) {
        try {
            Disciplina criada = configuracaoService.criarDisciplina(disciplina);
            return ResponseEntity.status(HttpStatus.CREATED).body(criada);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/disciplinas/{id}")
    @Operation(summary = "Atualizar disciplina")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Disciplina> atualizarDisciplina(@PathVariable Long id, 
                                                         @Valid @RequestBody Disciplina disciplina) {
        try {
            Disciplina atualizada = configuracaoService.atualizarDisciplina(id, disciplina);
            return ResponseEntity.ok(atualizada);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/disciplinas/{id}")
    @Operation(summary = "Excluir disciplina")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> excluirDisciplina(@PathVariable Long id) {
        configuracaoService.excluirDisciplina(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/disciplinas/buscar")
    @Operation(summary = "Buscar disciplinas")
    @PreAuthorize("hasRole('ADMIN') or hasRole('PROFESSOR')")
    public ResponseEntity<List<Disciplina>> buscarDisciplinas(@RequestParam String termo) {
        return ResponseEntity.ok(configuracaoService.buscarDisciplinasPorTermo(termo));
    }

    // SÉRIES
    @GetMapping("/series")
    @Operation(summary = "Listar séries")
    @PreAuthorize("hasRole('ADMIN') or hasRole('PROFESSOR')")
    public ResponseEntity<List<Serie>> listarSeries() {
        return ResponseEntity.ok(configuracaoService.listarSeries());
    }

    @PostMapping("/series")
    @Operation(summary = "Criar série")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Serie> criarSerie(@Valid @RequestBody Serie serie) {
        try {
            Serie criada = configuracaoService.criarSerie(serie);
            return ResponseEntity.status(HttpStatus.CREATED).body(criada);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/series/{id}")
    @Operation(summary = "Atualizar série")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Serie> atualizarSerie(@PathVariable Long id, @Valid @RequestBody Serie serie) {
        try {
            Serie atualizada = configuracaoService.atualizarSerie(id, serie);
            return ResponseEntity.ok(atualizada);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/series/{id}")
    @Operation(summary = "Excluir série")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> excluirSerie(@PathVariable Long id) {
        configuracaoService.excluirSerie(id);
        return ResponseEntity.noContent().build();
    }
}
