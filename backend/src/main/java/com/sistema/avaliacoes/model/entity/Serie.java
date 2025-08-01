package com.sistema.avaliacoes.model.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "series")
public class Serie {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Descrição é obrigatória")
    @Size(max = 100, message = "Descrição não pode ter mais que 100 caracteres")
    @Column(name = "descricao", nullable = false, length = 100)
    private String descricao;

    @NotBlank(message = "ID externo é obrigatório")
    @Size(max = 50, message = "ID externo não pode ter mais que 50 caracteres")
    @Column(name = "id_serie_externo", nullable = false, unique = true, length = 50)
    private String idSerieExterno;

    @Column(name = "status", nullable = false)
    private Boolean status = true;

    // Constructors
    public Serie() {}

    public Serie(String descricao, String idSerieExterno) {
        this.descricao = descricao;
        this.idSerieExterno = idSerieExterno;
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

    public String getIdSerieExterno() {
        return idSerieExterno;
    }

    public void setIdSerieExterno(String idSerieExterno) {
        this.idSerieExterno = idSerieExterno;
    }

    public Boolean getStatus() {
        return status;
    }

    public void setStatus(Boolean status) {
        this.status = status;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Serie)) return false;
        Serie that = (Serie) o;
        return id != null && id.equals(that.getId());
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }
}
