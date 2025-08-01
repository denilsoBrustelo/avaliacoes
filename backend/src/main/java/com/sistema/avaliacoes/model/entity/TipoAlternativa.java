package com.sistema.avaliacoes.model.entity;

import com.sistema.avaliacoes.model.base.BaseEntity;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.Set;

@Entity
@Table(name = "tipos_alternativas")
public class TipoAlternativa extends BaseEntity {

    @NotBlank(message = "Descrição é obrigatória")
    @Size(max = 50, message = "Descrição não pode ter mais que 50 caracteres")
    @Column(name = "descricao", nullable = false, length = 50)
    private String descricao;

    // Relacionamentos
    @OneToMany(mappedBy = "tipoAlternativa", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<Questao> questoes;

    // Constructors
    public TipoAlternativa() {}

    public TipoAlternativa(String descricao) {
        this.descricao = descricao;
    }

    // Getters and Setters
    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public Set<Questao> getQuestoes() {
        return questoes;
    }

    public void setQuestoes(Set<Questao> questoes) {
        this.questoes = questoes;
    }
}
