package com.sistema.avaliacoes.model.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.Set;

@Entity
@Table(name = "disciplinas")
public class Disciplina {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Descrição é obrigatória")
    @Size(max = 100, message = "Descrição não pode ter mais que 100 caracteres")
    @Column(name = "descricao", nullable = false, length = 100)
    private String descricao;

    @NotBlank(message = "ID externo é obrigatório")
    @Size(max = 50, message = "ID externo não pode ter mais que 50 caracteres")
    @Column(name = "id_disciplina_externo", nullable = false, unique = true, length = 50)
    private String idDisciplinaExterno;

    @Column(name = "status", nullable = false)
    private Boolean status = true;

    // Relacionamentos
    @OneToMany(mappedBy = "disciplina", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<Questao> questoes;

    // Constructors
    public Disciplina() {}

    public Disciplina(String descricao, String idDisciplinaExterno) {
        this.descricao = descricao;
        this.idDisciplinaExterno = idDisciplinaExterno;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public String getIdDisciplinaExterno() {
        return idDisciplinaExterno;
    }

    public void setIdDisciplinaExterno(String idDisciplinaExterno) {
        this.idDisciplinaExterno = idDisciplinaExterno;
    }

    public Boolean getStatus() {
        return status;
    }

    public void setStatus(Boolean status) {
        this.status = status;
    }

    public Set<Questao> getQuestoes() {
        return questoes;
    }

    public void setQuestoes(Set<Questao> questoes) {
        this.questoes = questoes;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Disciplina)) return false;
        Disciplina that = (Disciplina) o;
        return id != null && id.equals(that.getId());
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }
}
