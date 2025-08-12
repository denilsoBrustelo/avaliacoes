package com.sistema.avaliacoes.controller;

import com.sistema.avaliacoes.dto.QuestaoDTO;
import com.sistema.avaliacoes.dto.QuestaoAlternativaDTO;
import com.sistema.avaliacoes.model.entity.Questao;
import com.sistema.avaliacoes.model.entity.QuestaoAlternativa;
import com.sistema.avaliacoes.model.enums.StatusEnum;
import com.sistema.avaliacoes.service.QuestaoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/questoes")
@Tag(name = "Questões", description = "Operações relacionadas às questões do sistema")
@CrossOrigin(origins = "http://localhost:3000")
public class QuestaoController {

    @Autowired
    private QuestaoService questaoService;

    @GetMapping
    @Operation(summary = "Listar todas as questões", description = "Retorna a lista de todas as questões ativas")
    @PreAuthorize("hasRole('ADMIN') or hasRole('PROFESSOR')")
    public ResponseEntity<List<QuestaoDTO>> listarTodas() {
        List<Questao> questoes = questaoService.listarTodas();
        List<QuestaoDTO> questoesDTO = questoes.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(questoesDTO);
    }

    @GetMapping("/paginado")
    @Operation(summary = "Listar questões com paginação", description = "Retorna questões com filtros e paginação")
    @PreAuthorize("hasRole('ADMIN') or hasRole('PROFESSOR')")
    public ResponseEntity<Page<QuestaoDTO>> listarPaginado(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "dataCadastro") String sort,
            @RequestParam(defaultValue = "desc") String direction,
            @RequestParam(required = false) Long disciplinaId,
            @RequestParam(required = false) StatusEnum.StatusQuestao status,
            @RequestParam(required = false) Long nivelDificuldadeId) {

        Sort.Direction sortDirection = "desc".equalsIgnoreCase(direction) ? 
            Sort.Direction.DESC : Sort.Direction.ASC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortDirection, sort));

        Page<Questao> questoes = questaoService.listarComFiltros(
            disciplinaId, status, nivelDificuldadeId, pageable);
        
        Page<QuestaoDTO> questoesDTO = questoes.map(this::convertToDTO);
        return ResponseEntity.ok(questoesDTO);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar questão por ID", description = "Retorna uma questão específica pelo ID")
    @PreAuthorize("hasRole('ADMIN') or hasRole('PROFESSOR')")
    public ResponseEntity<QuestaoDTO> buscarPorId(@PathVariable Long id) {
        Questao questao = questaoService.buscarPorId(id);
        return ResponseEntity.ok(convertToDTO(questao));
    }

    @PostMapping
    @Operation(summary = "Criar nova questão", description = "Cria uma nova questão no sistema")
    @PreAuthorize("hasRole('ADMIN') or hasRole('PROFESSOR')")
    public ResponseEntity<QuestaoDTO> criar(@Valid @RequestBody QuestaoDTO questaoDTO) {
        try {
            Questao questao = convertToEntity(questaoDTO);
            Questao questaoCriada = questaoService.criar(questao);
            return ResponseEntity.status(HttpStatus.CREATED).body(convertToDTO(questaoCriada));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    @Operation(summary = "Atualizar questão", description = "Atualiza uma questão existente")
    @PreAuthorize("hasRole('ADMIN') or hasRole('PROFESSOR')")
    public ResponseEntity<QuestaoDTO> atualizar(@PathVariable Long id, @Valid @RequestBody QuestaoDTO questaoDTO) {
        try {
            Questao questao = convertToEntity(questaoDTO);
            Questao questaoAtualizada = questaoService.atualizar(id, questao);
            return ResponseEntity.ok(convertToDTO(questaoAtualizada));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Excluir questão", description = "Exclui uma questão (soft delete)")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        questaoService.excluir(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/buscar")
    @Operation(summary = "Buscar questões", description = "Busca questões por termo (pergunta, tema ou habilidades)")
    @PreAuthorize("hasRole('ADMIN') or hasRole('PROFESSOR')")
    public ResponseEntity<List<QuestaoDTO>> buscarPorTermo(
            @Parameter(description = "Termo de busca") @RequestParam String termo) {
        List<Questao> questoes = questaoService.buscarPorTermo(termo);
        List<QuestaoDTO> questoesDTO = questoes.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(questoesDTO);
    }

    @GetMapping("/disciplina/{disciplinaId}")
    @Operation(summary = "Listar questões por disciplina", description = "Retorna questões de uma disciplina específica")
    @PreAuthorize("hasRole('ADMIN') or hasRole('PROFESSOR')")
    public ResponseEntity<List<QuestaoDTO>> listarPorDisciplina(@PathVariable Long disciplinaId) {
        List<Questao> questoes = questaoService.listarPorDisciplina(disciplinaId);
        List<QuestaoDTO> questoesDTO = questoes.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(questoesDTO);
    }

    @GetMapping("/status/{status}")
    @Operation(summary = "Listar questões por status", description = "Retorna questões de um status específico")
    @PreAuthorize("hasRole('ADMIN') or hasRole('PROFESSOR')")
    public ResponseEntity<List<QuestaoDTO>> listarPorStatus(@PathVariable StatusEnum.StatusQuestao status) {
        List<Questao> questoes = questaoService.listarPorStatus(status);
        List<QuestaoDTO> questoesDTO = questoes.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(questoesDTO);
    }

    @PatchMapping("/{id}/aprovar")
    @Operation(summary = "Aprovar questão", description = "Aprova uma questão pendente")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<QuestaoDTO> aprovar(@PathVariable Long id) {
        Questao questao = questaoService.aprovar(id);
        return ResponseEntity.ok(convertToDTO(questao));
    }

    @PatchMapping("/{id}/cancelar")
    @Operation(summary = "Cancelar questão", description = "Cancela uma questão")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<QuestaoDTO> cancelar(@PathVariable Long id) {
        Questao questao = questaoService.cancelar(id);
        return ResponseEntity.ok(convertToDTO(questao));
    }

    @PatchMapping("/{id}/status")
    @Operation(summary = "Alterar status da questão", description = "Altera o status de uma questão")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<QuestaoDTO> alterarStatus(
            @PathVariable Long id,
            @RequestParam StatusEnum.StatusQuestao novoStatus) {
        Questao questao = questaoService.alterarStatus(id, novoStatus);
        return ResponseEntity.ok(convertToDTO(questao));
    }

    @GetMapping("/estatisticas")
    @Operation(summary = "Estatísticas de questões", description = "Retorna estatísticas sobre as questões")
    @PreAuthorize("hasRole('ADMIN') or hasRole('PROFESSOR')")
    public ResponseEntity<QuestaoService.QuestaoStatistics> obterEstatisticas() {
        return ResponseEntity.ok(questaoService.getStatistics());
    }

    @GetMapping("/aprovadas")
    @Operation(summary = "Listar questões aprovadas", description = "Retorna apenas questões aprovadas")
    @PreAuthorize("hasRole('ADMIN') or hasRole('PROFESSOR')")
    public ResponseEntity<List<QuestaoDTO>> listarAprovadas() {
        List<Questao> questoes = questaoService.listarAprovadas();
        List<QuestaoDTO> questoesDTO = questoes.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(questoesDTO);
    }

    // Métodos de conversão
    private QuestaoDTO convertToDTO(Questao questao) {
        QuestaoDTO dto = new QuestaoDTO();
        dto.setId(questao.getId());
        dto.setDataCadastro(questao.getDataCadastro());
        dto.setQuestaoContextoId(questao.getQuestaoContexto() != null ? questao.getQuestaoContexto().getId() : null);
        dto.setPergunta(questao.getPergunta());
        dto.setGeradorIa(questao.getGeradorIa());
        dto.setStatusQuestao(questao.getStatusQuestao());
        dto.setDisciplinaId(questao.getDisciplina() != null ? questao.getDisciplina().getId() : null);
        dto.setDisciplinaNome(questao.getDisciplina() != null ? questao.getDisciplina().getDescricao() : null);
        dto.setPontuacao(questao.getPontuacao());
        dto.setArquivoImagem(questao.getArquivoImagem());
        dto.setTipoAlternativaId(questao.getTipoAlternativa().getId());
        dto.setTipoAlternativaNome(questao.getTipoAlternativa().getDescricao());
        dto.setRespostaCorreta(questao.getRespostaCorreta());
        dto.setNivelDificuldadeId(questao.getNivelDificuldade() != null ? questao.getNivelDificuldade().getId() : null);
        dto.setNivelDificuldadeNome(questao.getNivelDificuldade() != null ? questao.getNivelDificuldade().getDescricao() : null);
        dto.setCiclo(questao.getCiclo());
        dto.setFase(questao.getFase());
        dto.setTema(questao.getTema());
        dto.setHabilidades(questao.getHabilidades());
        dto.setStatus(questao.getStatus());

        // Converter alternativas
        if (questao.getAlternativas() != null) {
            List<QuestaoAlternativaDTO> alternativasDTO = questao.getAlternativas().stream()
                    .map(this::convertAlternativaToDTO)
                    .collect(Collectors.toList());
            dto.setAlternativas(alternativasDTO);
        }

        return dto;
    }

    private Questao convertToEntity(QuestaoDTO dto) {
        Questao questao = new Questao();
        // Configurar campos básicos
        questao.setPergunta(dto.getPergunta());
        questao.setGeradorIa(dto.getGeradorIa());
        questao.setPontuacao(dto.getPontuacao());
        questao.setArquivoImagem(dto.getArquivoImagem());
        questao.setRespostaCorreta(dto.getRespostaCorreta());
        questao.setCiclo(dto.getCiclo());
        questao.setFase(dto.getFase());
        questao.setTema(dto.getTema());
        questao.setHabilidades(dto.getHabilidades());

        // Converter alternativas
        if (dto.getAlternativas() != null) {
            Set<QuestaoAlternativa> alternativas = dto.getAlternativas().stream()
                    .map(altDTO -> convertAlternativaToEntity(altDTO, questao))
                    .collect(Collectors.toSet());
            questao.setAlternativas(alternativas);
        }

        return questao;
    }

    private QuestaoAlternativaDTO convertAlternativaToDTO(QuestaoAlternativa alternativa) {
        QuestaoAlternativaDTO dto = new QuestaoAlternativaDTO();
        dto.setId(alternativa.getId());
        dto.setAlternativa(alternativa.getAlternativa());
        dto.setConteudo(alternativa.getConteudo());
        dto.setArquivoImagem(alternativa.getArquivoImagem());
        dto.setCorreta(alternativa.getCorreta());
        return dto;
    }

    private QuestaoAlternativa convertAlternativaToEntity(QuestaoAlternativaDTO dto, Questao questao) {
        QuestaoAlternativa alternativa = new QuestaoAlternativa();
        alternativa.setQuestao(questao);
        alternativa.setAlternativa(dto.getAlternativa());
        alternativa.setConteudo(dto.getConteudo());
        alternativa.setArquivoImagem(dto.getArquivoImagem());
        alternativa.setCorreta(dto.getCorreta());
        return alternativa;
    }
}
