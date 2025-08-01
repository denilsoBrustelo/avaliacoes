package com.sistema.avaliacoes.model.enums;

public enum UserRole {
    ROLE_ADMIN("Administrador"),
    ROLE_PROFESSOR("Professor"),
    ROLE_ALUNO("Aluno");

    private final String descricao;

    UserRole(String descricao) {
        this.descricao = descricao;
    }

    public String getDescricao() {
        return descricao;
    }
}
