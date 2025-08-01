package com.sistema.avaliacoes.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public class QuestaoAlternativaDTO {

    private Long id;
    
    @NotBlank(message = "Alternativa é obrigatória")
    @Pattern(regexp = "[A-E]", message = "Alternativa deve ser A, B, C, D ou E")
    private String alternativa;
    
    @NotBlank(message = "Conteúdo é obrigatório")
    private String conteudo;
    
    private String arquivoImagem;
    private Boolean correta = false;

    // Constructors
    public QuestaoAlternativaDTO() {}

    public QuestaoAlternativaDTO(String alternativa, String conteudo, Boolean correta) {
        this.alternativa = alternativa;
        this.conteudo = conteudo;
        this.correta = correta;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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
}
