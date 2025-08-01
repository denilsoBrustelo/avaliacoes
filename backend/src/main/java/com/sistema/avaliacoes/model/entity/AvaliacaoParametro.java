package com.sistema.avaliacoes.model.entity;

import com.sistema.avaliacoes.model.enums.StatusEnum;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

@Entity
@Table(name = "avaliacoes_parametros")
public class AvaliacaoParametro {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "Avaliação é obrigatória")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "avaliacao_id", nullable = false)
    private Avaliacao avaliacao;

    @Column(name = "data_aplicacao")
    private LocalDateTime dataAplicacao;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;

    @Enumerated(EnumType.ORDINAL)
    @Column(name = "status_aplicacao_id")
    private StatusEnum.StatusAplicacao statusAplicacao;

    @Column(name = "status", nullable = false)
    private Boolean status = true;

    // Constructors
    public AvaliacaoParametro() {}

    public AvaliacaoParametro(Avaliacao avaliacao) {
        this.avaliacao = avaliacao;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Avaliacao getAvaliacao() {
        return avaliacao;
    }

    public void setAvaliacao(Avaliacao avaliacao) {
        this.avaliacao = avaliacao;
    }

    public LocalDateTime getDataAplicacao() {
        return dataAplicacao;
    }

    public void setDataAplicacao(LocalDateTime dataAplicacao) {
        this.dataAplicacao = dataAplicacao;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

    public StatusEnum.StatusAplicacao getStatusAplicacao() {
        return statusAplicacao;
    }

    public void setStatusAplicacao(StatusEnum.StatusAplicacao statusAplicacao) {
        this.statusAplicacao = statusAplicacao;
    }

    public Boolean getStatus() {
        return status;
    }

    public void setStatus(Boolean status) {
        this.status = status;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof AvaliacaoParametro)) return false;
        AvaliacaoParametro that = (AvaliacaoParametro) o;
        return id != null && id.equals(that.getId());
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }
}
