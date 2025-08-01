package com.sistema.avaliacoes.model.entity;

import com.sistema.avaliacoes.model.base.BaseEntity;
import com.sistema.avaliacoes.model.enums.StatusEnum;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name = "participantes_avaliacoes")
public class ParticipanteAvaliacao extends BaseEntity {

    @NotNull(message = "Avaliação é obrigatória")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "avaliacao_id", nullable = false)
    private Avaliacao avaliacao;

    @NotNull(message = "Usuário é obrigatório")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @Size(max = 10, message = "Ano não pode ter mais que 10 caracteres")
    @Column(name = "ano", length = 10)
    private String ano;

    @Size(max = 100, message = "Escola não pode ter mais que 100 caracteres")
    @Column(name = "escola", length = 100)
    private String escola;

    @Size(max = 50, message = "Turma não pode ter mais que 50 caracteres")
    @Column(name = "turma", length = 50)
    private String turma;

    @Column(name = "disponivel", nullable = false)
    private Boolean disponivel = false;

    @Column(name = "data_inicio_avaliacao")
    private LocalDateTime dataInicioAvaliacao;

    @Column(name = "data_inicio")
    private LocalDateTime dataInicio;

    @Column(name = "hora_inicio")
    private LocalTime horaInicio;

    @Column(name = "data_fim")
    private LocalDateTime dataFim;

    @Column(name = "hora_fim")
    private LocalTime horaFim;

    @NotNull(message = "Status da aplicação é obrigatório")
    @Enumerated(EnumType.ORDINAL)
    @Column(name = "status_aplicacao_id", nullable = false)
    private StatusEnum.StatusAplicacao statusAplicacao = StatusEnum.StatusAplicacao.PENDENTE;

    @Column(name = "avaliado", nullable = false)
    private Boolean avaliado = false;

    // Constructors
    public ParticipanteAvaliacao() {}

    public ParticipanteAvaliacao(Avaliacao avaliacao, Usuario usuario) {
        this.avaliacao = avaliacao;
        this.usuario = usuario;
    }

    // Getters and Setters
    public Avaliacao getAvaliacao() {
        return avaliacao;
    }

    public void setAvaliacao(Avaliacao avaliacao) {
        this.avaliacao = avaliacao;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

    public String getAno() {
        return ano;
    }

    public void setAno(String ano) {
        this.ano = ano;
    }

    public String getEscola() {
        return escola;
    }

    public void setEscola(String escola) {
        this.escola = escola;
    }

    public String getTurma() {
        return turma;
    }

    public void setTurma(String turma) {
        this.turma = turma;
    }

    public Boolean getDisponivel() {
        return disponivel;
    }

    public void setDisponivel(Boolean disponivel) {
        this.disponivel = disponivel;
    }

    public LocalDateTime getDataInicioAvaliacao() {
        return dataInicioAvaliacao;
    }

    public void setDataInicioAvaliacao(LocalDateTime dataInicioAvaliacao) {
        this.dataInicioAvaliacao = dataInicioAvaliacao;
    }

    public LocalDateTime getDataInicio() {
        return dataInicio;
    }

    public void setDataInicio(LocalDateTime dataInicio) {
        this.dataInicio = dataInicio;
    }

    public LocalTime getHoraInicio() {
        return horaInicio;
    }

    public void setHoraInicio(LocalTime horaInicio) {
        this.horaInicio = horaInicio;
    }

    public LocalDateTime getDataFim() {
        return dataFim;
    }

    public void setDataFim(LocalDateTime dataFim) {
        this.dataFim = dataFim;
    }

    public LocalTime getHoraFim() {
        return horaFim;
    }

    public void setHoraFim(LocalTime horaFim) {
        this.horaFim = horaFim;
    }

    public StatusEnum.StatusAplicacao getStatusAplicacao() {
        return statusAplicacao;
    }

    public void setStatusAplicacao(StatusEnum.StatusAplicacao statusAplicacao) {
        this.statusAplicacao = statusAplicacao;
    }

    public Boolean getAvaliado() {
        return avaliado;
    }

    public void setAvaliado(Boolean avaliado) {
        this.avaliado = avaliado;
    }

    // Helper methods
    public boolean isConcluida() {
        return StatusEnum.StatusAplicacao.CONCLUIDO.equals(this.statusAplicacao);
    }

    public boolean isEmAndamento() {
        return StatusEnum.StatusAplicacao.EM_ANDAMENTO.equals(this.statusAplicacao);
    }
}
