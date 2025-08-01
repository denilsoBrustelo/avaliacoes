package com.sistema.avaliacoes.model.entity;

import com.sistema.avaliacoes.model.base.BaseEntity;
import com.sistema.avaliacoes.model.enums.StatusEnum;
import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.util.Set;

@Entity
@Table(name = "questoes")
public class Questao extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "questao_contexto_id")
    private QuestaoContexto questaoContexto;

    @NotBlank(message = "Pergunta é obrigatória")
    @Column(name = "pergunta", nullable = false, columnDefinition = "TEXT")
    private String pergunta;

    @Column(name = "gerador_ia", nullable = false)
    private Boolean geradorIa = false;

    @NotNull(message = "Status da questão é obrigatório")
    @Enumerated(EnumType.ORDINAL)
    @Column(name = "status_questao_id", nullable = false)
    private StatusEnum.StatusQuestao statusQuestao = StatusEnum.StatusQuestao.PENDENTE;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "disciplina_id")
    private Disciplina disciplina;

    @DecimalMin(value = "0.0", message = "Pontuação deve ser maior ou igual a 0")
    @DecimalMax(value = "10.0", message = "Pontuação deve ser menor ou igual a 10")
    @Column(name = "pontuacao", precision = 5, scale = 2)
    private BigDecimal pontuacao;

    @Column(name = "arquivo_imagem")
    private String arquivoImagem;

    @NotNull(message = "Tipo de alternativa é obrigatório")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tipo_alternativa_id", nullable = false)
    private TipoAlternativa tipoAlternativa;

    @Column(name = "resposta_correta", columnDefinition = "TEXT")
    private String respostaCorreta;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "nivel_dificuldade_id")
    private NivelDificuldade nivelDificuldade;

    @Column(name = "ciclo", length = 50)
    private String ciclo;

    @Column(name = "fase", length = 50)
    private String fase;

    @Column(name = "tema", length = 100)
    private String tema;

    @Column(name = "habilidades", columnDefinition = "TEXT")
    private String habilidades;

    // Relacionamentos
    @OneToMany(mappedBy = "questao", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<QuestaoAlternativa> alternativas;

    @OneToMany(mappedBy = "questao", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<AvaliacaoQuestao> avaliacaoQuestoes;

    @OneToMany(mappedBy = "questao", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<ProblemaQuestao> problemas;

    @OneToMany(mappedBy = "questao", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<AvaliacaoResposta> respostas;

    // Constructors
    public Questao() {}

    public Questao(String pergunta, TipoAlternativa tipoAlternativa) {
        this.pergunta = pergunta;
        this.tipoAlternativa = tipoAlternativa;
    }

    // Getters and Setters
    public QuestaoContexto getQuestaoContexto() {
        return questaoContexto;
    }

    public void setQuestaoContexto(QuestaoContexto questaoContexto) {
        this.questaoContexto = questaoContexto;
    }

    public String getPergunta() {
        return pergunta;
    }

    public void setPergunta(String pergunta) {
        this.pergunta = pergunta;
    }

    public Boolean getGeradorIa() {
        return geradorIa;
    }

    public void setGeradorIa(Boolean geradorIa) {
        this.geradorIa = geradorIa;
    }

    public StatusEnum.StatusQuestao getStatusQuestao() {
        return statusQuestao;
    }

    public void setStatusQuestao(StatusEnum.StatusQuestao statusQuestao) {
        this.statusQuestao = statusQuestao;
    }

    public Disciplina getDisciplina() {
        return disciplina;
    }

    public void setDisciplina(Disciplina disciplina) {
        this.disciplina = disciplina;
    }

    public BigDecimal getPontuacao() {
        return pontuacao;
    }

    public void setPontuacao(BigDecimal pontuacao) {
        this.pontuacao = pontuacao;
    }

    public String getArquivoImagem() {
        return arquivoImagem;
    }

    public void setArquivoImagem(String arquivoImagem) {
        this.arquivoImagem = arquivoImagem;
    }

    public TipoAlternativa getTipoAlternativa() {
        return tipoAlternativa;
    }

    public void setTipoAlternativa(TipoAlternativa tipoAlternativa) {
        this.tipoAlternativa = tipoAlternativa;
    }

    public String getRespostaCorreta() {
        return respostaCorreta;
    }

    public void setRespostaCorreta(String respostaCorreta) {
        this.respostaCorreta = respostaCorreta;
    }

    public NivelDificuldade getNivelDificuldade() {
        return nivelDificuldade;
    }

    public void setNivelDificuldade(NivelDificuldade nivelDificuldade) {
        this.nivelDificuldade = nivelDificuldade;
    }

    public String getCiclo() {
        return ciclo;
    }

    public void setCiclo(String ciclo) {
        this.ciclo = ciclo;
    }

    public String getFase() {
        return fase;
    }

    public void setFase(String fase) {
        this.fase = fase;
    }

    public String getTema() {
        return tema;
    }

    public void setTema(String tema) {
        this.tema = tema;
    }

    public String getHabilidades() {
        return habilidades;
    }

    public void setHabilidades(String habilidades) {
        this.habilidades = habilidades;
    }

    public Set<QuestaoAlternativa> getAlternativas() {
        return alternativas;
    }

    public void setAlternativas(Set<QuestaoAlternativa> alternativas) {
        this.alternativas = alternativas;
    }

    public Set<AvaliacaoQuestao> getAvaliacaoQuestoes() {
        return avaliacaoQuestoes;
    }

    public void setAvaliacaoQuestoes(Set<AvaliacaoQuestao> avaliacaoQuestoes) {
        this.avaliacaoQuestoes = avaliacaoQuestoes;
    }

    public Set<ProblemaQuestao> getProblemas() {
        return problemas;
    }

    public void setProblemas(Set<ProblemaQuestao> problemas) {
        this.problemas = problemas;
    }

    public Set<AvaliacaoResposta> getRespostas() {
        return respostas;
    }

    public void setRespostas(Set<AvaliacaoResposta> respostas) {
        this.respostas = respostas;
    }

    // Helper methods
    public boolean isAprovada() {
        return StatusEnum.StatusQuestao.APROVADO.equals(this.statusQuestao);
    }

    public boolean isMultiplaEscolha() {
        return tipoAlternativa != null && "Múltipla Escolha".equals(tipoAlternativa.getDescricao());
    }

    public boolean isDissertativa() {
        return tipoAlternativa != null && "Dissertativa".equals(tipoAlternativa.getDescricao());
    }
}
