package com.sistema.avaliacoes.model.entity;

import com.sistema.avaliacoes.model.base.BaseEntity;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;

import java.util.Set;

@Entity
@Table(name = "questoes_contextos")
public class QuestaoContexto extends BaseEntity {

    @NotBlank(message = "Contexto é obrigatório")
    @Column(name = "contexto", nullable = false, columnDefinition = "TEXT")
    private String contexto;

    @Column(name = "gerador_ia", nullable = false)
    private Boolean geradorIa = false;

    @Column(name = "arquivo_imagem")
    private String arquivoImagem;

    // Relacionamentos
    @OneToMany(mappedBy = "questaoContexto", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<Questao> questoes;

    // Constructors
    public QuestaoContexto() {}

    public QuestaoContexto(String contexto, Boolean geradorIa) {
        this.contexto = contexto;
        this.geradorIa = geradorIa;
    }

    // Getters and Setters
    public String getContexto() {
        return contexto;
    }

    public void setContexto(String contexto) {
        this.contexto = contexto;
    }

    public Boolean getGeradorIa() {
        return geradorIa;
    }

    public void setGeradorIa(Boolean geradorIa) {
        this.geradorIa = geradorIa;
    }

    public String getArquivoImagem() {
        return arquivoImagem;
    }

    public void setArquivoImagem(String arquivoImagem) {
        this.arquivoImagem = arquivoImagem;
    }

    public Set<Questao> getQuestoes() {
        return questoes;
    }

    public void setQuestoes(Set<Questao> questoes) {
        this.questoes = questoes;
    }
}
