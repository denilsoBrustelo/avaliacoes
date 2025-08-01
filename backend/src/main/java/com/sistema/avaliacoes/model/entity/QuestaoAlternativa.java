package com.sistema.avaliacoes.model.entity;

import com.sistema.avaliacoes.model.base.BaseEntity;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

import java.util.Set;

@Entity
@Table(name = "questoes_alternativas")
public class QuestaoAlternativa extends BaseEntity {

    @NotNull(message = "Questão é obrigatória")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "questao_id", nullable = false)
    private Questao questao;

    @NotBlank(message = "Alternativa é obrigatória")
    @Pattern(regexp = "[A-E]", message = "Alternativa deve ser A, B, C, D ou E")
    @Column(name = "alternativa", nullable = false, length = 1)
    private String alternativa;

    @NotBlank(message = "Conteúdo é obrigatório")
    @Column(name = "conteudo", nullable = false, columnDefinition = "TEXT")
    private String conteudo;

    @Column(name = "arquivo_imagem")
    private String arquivoImagem;

    @Column(name = "correta", nullable = false)
    private Boolean correta = false;

    // Relacionamentos
    @OneToMany(mappedBy = "questaoAlternativa", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<AvaliacaoResposta> respostas;

    // Constructors
    public QuestaoAlternativa() {}

    public QuestaoAlternativa(Questao questao, String alternativa, String conteudo, Boolean correta) {
        this.questao = questao;
        this.alternativa = alternativa;
        this.conteudo = conteudo;
        this.correta = correta;
    }

    // Getters and Setters
    public Questao getQuestao() {
        return questao;
    }

    public void setQuestao(Questao questao) {
        this.questao = questao;
    }

    public String getAlternativa() {
        return alternativa;
    }

    public void setAlternativa(String alternativa) {
        this.alternativa = alternativa;
    }

    public String getConteudo() {
        return conteudo;
    }

    public void setConteudo(String conteudo) {
        this.conteudo = conteudo;
    }

    public String getArquivoImagem() {
        return arquivoImagem;
    }

    public void setArquivoImagem(String arquivoImagem) {
        this.arquivoImagem = arquivoImagem;
    }

    public Boolean getCorreta() {
        return correta;
    }

    public void setCorreta(Boolean correta) {
        this.correta = correta;
    }

    public Set<AvaliacaoResposta> getRespostas() {
        return respostas;
    }

    public void setRespostas(Set<AvaliacaoResposta> respostas) {
        this.respostas = respostas;
    }
}
