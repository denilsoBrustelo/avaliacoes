package com.sistema.avaliacoes.model.entity;

import com.sistema.avaliacoes.model.base.BaseEntity;
import com.sistema.avaliacoes.model.enums.StatusEnum;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;

import java.util.Set;

@Entity
@Table(name = "avaliacoes")
public class Avaliacao extends BaseEntity {

    @NotNull(message = "Tipo de avaliação é obrigatório")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tipo_avaliacao_id", nullable = false)
    private TipoAvaliacao tipoAvaliacao;

    @Column(name = "instrucao", columnDefinition = "TEXT")
    private String instrucao;

    @NotNull(message = "Responsável é obrigatório")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "responsavel_id", nullable = false)
    private Usuario responsavel;

    @NotNull(message = "Status da avaliação é obrigatório")
    @Enumerated(EnumType.ORDINAL)
    @Column(name = "status_avaliacao_id", nullable = false)
    private StatusEnum.StatusAvaliacao statusAvaliacao = StatusEnum.StatusAvaliacao.PENDENTE;

    // Relacionamentos
    @OneToMany(mappedBy = "avaliacao", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<AvaliacaoQuestao> avaliacaoQuestoes;

    @OneToMany(mappedBy = "avaliacao", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<ParticipanteAvaliacao> participantes;

    @OneToMany(mappedBy = "avaliacao", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<AvaliacaoParametro> parametros;

    // Constructors
    public Avaliacao() {}

    public Avaliacao(TipoAvaliacao tipoAvaliacao, Usuario responsavel) {
        this.tipoAvaliacao = tipoAvaliacao;
        this.responsavel = responsavel;
    }

    // Getters and Setters
    public TipoAvaliacao getTipoAvaliacao() {
        return tipoAvaliacao;
    }

    public void setTipoAvaliacao(TipoAvaliacao tipoAvaliacao) {
        this.tipoAvaliacao = tipoAvaliacao;
    }

    public String getInstrucao() {
        return instrucao;
    }

    public void setInstrucao(String instrucao) {
        this.instrucao = instrucao;
    }

    public Usuario getResponsavel() {
        return responsavel;
    }

    public void setResponsavel(Usuario responsavel) {
        this.responsavel = responsavel;
    }

    public StatusEnum.StatusAvaliacao getStatusAvaliacao() {
        return statusAvaliacao;
    }

    public void setStatusAvaliacao(StatusEnum.StatusAvaliacao statusAvaliacao) {
        this.statusAvaliacao = statusAvaliacao;
    }

    public Set<AvaliacaoQuestao> getAvaliacaoQuestoes() {
        return avaliacaoQuestoes;
    }

    public void setAvaliacaoQuestoes(Set<AvaliacaoQuestao> avaliacaoQuestoes) {
        this.avaliacaoQuestoes = avaliacaoQuestoes;
    }

    public Set<ParticipanteAvaliacao> getParticipantes() {
        return participantes;
    }

    public void setParticipantes(Set<ParticipanteAvaliacao> participantes) {
        this.participantes = participantes;
    }

    public Set<AvaliacaoParametro> getParametros() {
        return parametros;
    }

    public void setParametros(Set<AvaliacaoParametro> parametros) {
        this.parametros = parametros;
    }

    // Helper methods
    public boolean isAprovada() {
        return StatusEnum.StatusAvaliacao.APROVADO.equals(this.statusAvaliacao);
    }
}
