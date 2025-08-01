package com.sistema.avaliacoes.model.entity;

import com.sistema.avaliacoes.model.base.BaseEntity;
import com.sistema.avaliacoes.model.enums.StatusEnum;
import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

@Entity
@Table(name = "avaliacoes_respostas")
public class AvaliacaoResposta extends BaseEntity {

    @NotNull(message = "Usuário é obrigatório")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @NotNull(message = "Questão é obrigatória")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "questao_id", nullable = false)
    private Questao questao;

    @Column(name = "resposta", columnDefinition = "TEXT")
    private String resposta;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "questao_alternativa_id")
    private QuestaoAlternativa questaoAlternativa;

    @Column(name = "correta")
    private Boolean correta;

    @Enumerated(EnumType.STRING)
    @Column(name = "corrigido_por", length = 1)
    private StatusEnum.TipoCorrecao corrigidoPor;

    @Column(name = "observacoes", columnDefinition = "TEXT")
    private String observacoes;

    @DecimalMin(value = "0.0", message = "Pontuação deve ser maior ou igual a 0")
    @DecimalMax(value = "100.0", message = "Pontuação deve ser menor ou igual a 100")
    @Column(name = "pontuacao", precision = 5, scale = 2)
    private BigDecimal pontuacao;

    // Constructors
    public AvaliacaoResposta() {}

    public AvaliacaoResposta(Usuario usuario, Questao questao) {
        this.usuario = usuario;
        this.questao = questao;
    }

    // Getters and Setters
    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

    public Questao getQuestao() {
        return questao;
    }

    public void setQuestao(Questao questao) {
        this.questao = questao;
    }

    public String getResposta() {
        return resposta;
    }

    public void setResposta(String resposta) {
        this.resposta = resposta;
    }

    public QuestaoAlternativa getQuestaoAlternativa() {
        return questaoAlternativa;
    }

    public void setQuestaoAlternativa(QuestaoAlternativa questaoAlternativa) {
        this.questaoAlternativa = questaoAlternativa;
    }

    public Boolean getCorreta() {
        return correta;
    }

    public void setCorreta(Boolean correta) {
        this.correta = correta;
    }

    public StatusEnum.TipoCorrecao getCorrigidoPor() {
        return corrigidoPor;
    }

    public void setCorrigidoPor(StatusEnum.TipoCorrecao corrigidoPor) {
        this.corrigidoPor = corrigidoPor;
    }

    public String getObservacoes() {
        return observacoes;
    }

    public void setObservacoes(String observacoes) {
        this.observacoes = observacoes;
    }

    public BigDecimal getPontuacao() {
        return pontuacao;
    }

    public void setPontuacao(BigDecimal pontuacao) {
        this.pontuacao = pontuacao;
    }

    // Helper methods
    public boolean isCorrigida() {
        return correta != null;
    }

    public boolean isCorrigidaPorIA() {
        return StatusEnum.TipoCorrecao.IA.equals(this.corrigidoPor);
    }
}
