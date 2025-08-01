package com.sistema.avaliacoes.model.entity;

import com.sistema.avaliacoes.model.base.BaseEntity;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;

@Entity
@Table(name = "avaliacoes_questoes")
public class AvaliacaoQuestao extends BaseEntity {

    @NotNull(message = "Avaliação é obrigatória")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "avaliacao_id", nullable = false)
    private Avaliacao avaliacao;

    @NotNull(message = "Questão é obrigatória")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "questao_id", nullable = false)
    private Questao questao;

    // Constructors
    public AvaliacaoQuestao() {}

    public AvaliacaoQuestao(Avaliacao avaliacao, Questao questao) {
        this.avaliacao = avaliacao;
        this.questao = questao;
    }

    // Getters and Setters
    public Avaliacao getAvaliacao() {
        return avaliacao;
    }

    public void setAvaliacao(Avaliacao avaliacao) {
        this.avaliacao = avaliacao;
    }

    public Questao getQuestao() {
        return questao;
    }

    public void setQuestao(Questao questao) {
        this.questao = questao;
    }
}
