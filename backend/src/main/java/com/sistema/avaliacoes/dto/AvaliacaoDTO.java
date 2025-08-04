package com.sistema.avaliacoes.dto;

import com.sistema.avaliacoes.model.enums.StatusEnum;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;
import java.util.List;

public class AvaliacaoDTO {
    
    private Long id;
    
    @NotNull(message = "Tipo de avaliação é obrigatório")
    private Long tipoAvaliacaoId;
    private String tipoAvaliacaoDescricao;
    
    private String instrucao;
    
    @NotNull(message = "Responsável é obrigatório")
    private Long responsavelId;
    private String responsavelNome;
    
    private StatusEnum.StatusAvaliacao statusAvaliacao;
    private LocalDateTime dataCadastro;
    private LocalDateTime dataAtualizacao;
    private Boolean status;
    
    // Lista de IDs das questões selecionadas
    private List<Long> questoesIds;
    
    // Constructors
    public AvaliacaoDTO() {}
    
    public AvaliacaoDTO(Long tipoAvaliacaoId, String instrucao, Long responsavelId) {
        this.tipoAvaliacaoId = tipoAvaliacaoId;
        this.instrucao = instrucao;
        this.responsavelId = responsavelId;
        this.statusAvaliacao = StatusEnum.StatusAvaliacao.PENDENTE;
        this.status = true;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public Long getTipoAvaliacaoId() {
        return tipoAvaliacaoId;
    }
    
    public void setTipoAvaliacaoId(Long tipoAvaliacaoId) {
        this.tipoAvaliacaoId = tipoAvaliacaoId;
    }
    
    public String getTipoAvaliacaoDescricao() {
        return tipoAvaliacaoDescricao;
    }
    
    public void setTipoAvaliacaoDescricao(String tipoAvaliacaoDescricao) {
        this.tipoAvaliacaoDescricao = tipoAvaliacaoDescricao;
    }
    
    public String getInstrucao() {
        return instrucao;
    }
    
    public void setInstrucao(String instrucao) {
        this.instrucao = instrucao;
    }
    
    public Long getResponsavelId() {
        return responsavelId;
    }
    
    public void setResponsavelId(Long responsavelId) {
        this.responsavelId = responsavelId;
    }
    
    public String getResponsavelNome() {
        return responsavelNome;
    }
    
    public void setResponsavelNome(String responsavelNome) {
        this.responsavelNome = responsavelNome;
    }
    
    public StatusEnum.StatusAvaliacao getStatusAvaliacao() {
        return statusAvaliacao;
    }
    
    public void setStatusAvaliacao(StatusEnum.StatusAvaliacao statusAvaliacao) {
        this.statusAvaliacao = statusAvaliacao;
    }
    
    public LocalDateTime getDataCadastro() {
        return dataCadastro;
    }
    
    public void setDataCadastro(LocalDateTime dataCadastro) {
        this.dataCadastro = dataCadastro;
    }
    
    public LocalDateTime getDataAtualizacao() {
        return dataAtualizacao;
    }
    
    public void setDataAtualizacao(LocalDateTime dataAtualizacao) {
        this.dataAtualizacao = dataAtualizacao;
    }
    
    public Boolean getStatus() {
        return status;
    }
    
    public void setStatus(Boolean status) {
        this.status = status;
    }
    
    public List<Long> getQuestoesIds() {
        return questoesIds;
    }
    
    public void setQuestoesIds(List<Long> questoesIds) {
        this.questoesIds = questoesIds;
    }
}
