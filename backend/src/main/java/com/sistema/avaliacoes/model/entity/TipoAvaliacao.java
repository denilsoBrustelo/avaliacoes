package com.sistema.avaliacoes.model.entity;

import com.sistema.avaliacoes.model.base.BaseEntity;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.Set;

@Entity
@Table(name = "tipos_avaliacoes")
public class TipoAvaliacao extends BaseEntity {

    @NotBlank(message = "Descrição é obrigatória")
    @Size(max = 50, message = "Descrição não pode ter mais que 50 caracteres")
    @Column(name = "descricao", nullable = false, length = 50)
    private String descricao;

    // Relacionamentos
    @OneToMany(mappedBy = "tipoAvaliacao", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<Avaliacao> avaliacoes;

    // Constructors
    public TipoAvaliacao() {}

    public TipoAvaliacao(String descricao) {
        this.descricao = descricao;
    }

    // Getters and Setters
    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public Set<Avaliacao> getAvaliacoes() {
        return avaliacoes;
    }

    public void setAvaliacoes(Set<Avaliacao> avaliacoes) {
        this.avaliacoes = avaliacoes;
    }
}
