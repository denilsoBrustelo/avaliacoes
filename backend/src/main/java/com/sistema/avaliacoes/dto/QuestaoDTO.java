package com.sistema.avaliacoes.dto;

import com.sistema.avaliacoes.model.enums.StatusEnum;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class QuestaoDTO {

    private Long id;
    private LocalDateTime dataCadastro;
    private Long questaoContextoId;
    
    @NotBlank(message = "Pergunta é obrigatória")
    private String pergunta;
    
    private Boolean geradorIa = false;
    private StatusEnum.StatusQuestao statusQuestao;
    private Long disciplinaId;
    private String disciplinaNome;
    
    @DecimalMin(value = "0.0", message = "Pontuação deve ser maior ou igual a 0")
    @DecimalMax(value = "10.0", message = "Pontuação deve ser menor ou igual a 10")
    private BigDecimal pontuacao;
    
    private String arquivoImagem;
    
    @NotNull(message = "Tipo de alternativa é obrigatório")
    private Long tipoAlternativaId;
    private String tipoAlternativaNome;
    
    private String respostaCorreta;
    private Long nivelDificuldadeId;
    private String nivelDificuldadeNome;
    private String ciclo;
    private String fase;
    private String tema;
    private String habilidades;
    private Boolean status;
    
    private List<QuestaoAlternativaDTO> alternativas;

    // Constructors
    public QuestaoDTO() {}

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDateTime getDataCadastro() {
        return dataCadastro;
    }

    public void setDataCadastro(LocalDateTime dataCadastro) {
        this.dataCadastro = dataCadastro;
    }

    public Long getQuestaoContextoId() {
        return questaoContextoId;
    }

    public void setQuestaoContextoId(Long questaoContextoId) {
        this.questaoContextoId = questaoContextoId;
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

    public Long getDisciplinaId() {
        return disciplinaId;
    }

    public void setDisciplinaId(Long disciplinaId) {
        this.disciplinaId = disciplinaId;
    }

    public String getDisciplinaNome() {
        return disciplinaNome;
    }

    public void setDisciplinaNome(String disciplinaNome) {
        this.disciplinaNome = disciplinaNome;
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

    public Long getTipoAlternativaId() {
        return tipoAlternativaId;
    }

    public void setTipoAlternativaId(Long tipoAlternativaId) {
        this.tipoAlternativaId = tipoAlternativaId;
    }

    public String getTipoAlternativaNome() {
        return tipoAlternativaNome;
    }

    public void setTipoAlternativaNome(String tipoAlternativaNome) {
        this.tipoAlternativaNome = tipoAlternativaNome;
    }

    public String getRespostaCorreta() {
        return respostaCorreta;
    }

    public void setRespostaCorreta(String respostaCorreta) {
        this.respostaCorreta = respostaCorreta;
    }

    public Long getNivelDificuldadeId() {
        return nivelDificuldadeId;
    }

    public void setNivelDificuldadeId(Long nivelDificuldadeId) {
        this.nivelDificuldadeId = nivelDificuldadeId;
    }

    public String getNivelDificuldadeNome() {
        return nivelDificuldadeNome;
    }

    public void setNivelDificuldadeNome(String nivelDificuldadeNome) {
        this.nivelDificuldadeNome = nivelDificuldadeNome;
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

    public Boolean getStatus() {
        return status;
    }

    public void setStatus(Boolean status) {
        this.status = status;
    }

    public List<QuestaoAlternativaDTO> getAlternativas() {
        return alternativas;
    }

    public void setAlternativas(List<QuestaoAlternativaDTO> alternativas) {
        this.alternativas = alternativas;
    }
}
