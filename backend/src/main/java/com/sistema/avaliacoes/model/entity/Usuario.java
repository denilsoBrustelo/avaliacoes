package com.sistema.avaliacoes.model.entity;

import com.sistema.avaliacoes.model.base.BaseEntity;
import com.sistema.avaliacoes.model.enums.UserRole;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.util.Set;

@Entity
@Table(name = "usuario")
public class Usuario extends BaseEntity {

    @NotBlank(message = "CPF é obrigatório")
    @Pattern(regexp = "\\d{11}", message = "CPF deve conter 11 dígitos")
    @Column(name = "cpf", nullable = false, unique = true, length = 11)
    private String cpf;

    @NotBlank(message = "Nome é obrigatório")
    @Size(max = 100, message = "Nome não pode ter mais que 100 caracteres")
    @Column(name = "nome", nullable = false, length = 100)
    private String nome;

    @NotBlank(message = "Email é obrigatório")
    @Email(message = "Email deve ser válido")
    @Size(max = 100, message = "Email não pode ter mais que 100 caracteres")
    @Column(name = "email", nullable = false, unique = true, length = 100)
    private String email;

    @NotBlank(message = "Senha é obrigatória")
    @Size(min = 6, message = "Senha deve ter pelo menos 6 caracteres")
    @Column(name = "senha", nullable = false)
    private String senha;

    @Enumerated(EnumType.STRING)
    @ElementCollection(targetClass = UserRole.class, fetch = FetchType.EAGER)
    @CollectionTable(name = "usuario_roles", joinColumns = @JoinColumn(name = "usuario_id"))
    @Column(name = "role", nullable = false)
    private Set<UserRole> roles;

    // Relacionamentos
    @OneToMany(mappedBy = "responsavel", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<Avaliacao> avaliacoesCriadas;

    @OneToMany(mappedBy = "usuario", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<ParticipanteAvaliacao> participacoes;

    @OneToMany(mappedBy = "usuario", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<AvaliacaoResposta> respostas;

    // Constructors
    public Usuario() {}

    public Usuario(String cpf, String nome, String email, String senha, Set<UserRole> roles) {
        this.cpf = cpf;
        this.nome = nome;
        this.email = email;
        this.senha = senha;
        this.roles = roles;
    }

    // Getters and Setters
    public String getCpf() {
        return cpf;
    }

    public void setCpf(String cpf) {
        this.cpf = cpf;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getSenha() {
        return senha;
    }

    public void setSenha(String senha) {
        this.senha = senha;
    }

    public Set<UserRole> getRoles() {
        return roles;
    }

    public void setRoles(Set<UserRole> roles) {
        this.roles = roles;
    }

    public Set<Avaliacao> getAvaliacoesCriadas() {
        return avaliacoesCriadas;
    }

    public void setAvaliacoesCriadas(Set<Avaliacao> avaliacoesCriadas) {
        this.avaliacoesCriadas = avaliacoesCriadas;
    }

    public Set<ParticipanteAvaliacao> getParticipacoes() {
        return participacoes;
    }

    public void setParticipacoes(Set<ParticipanteAvaliacao> participacoes) {
        this.participacoes = participacoes;
    }

    public Set<AvaliacaoResposta> getRespostas() {
        return respostas;
    }

    public void setRespostas(Set<AvaliacaoResposta> respostas) {
        this.respostas = respostas;
    }

    // Helper methods
    public boolean hasRole(UserRole role) {
        return roles != null && roles.contains(role);
    }

    public boolean isAdmin() {
        return hasRole(UserRole.ROLE_ADMIN);
    }

    public boolean isProfessor() {
        return hasRole(UserRole.ROLE_PROFESSOR);
    }

    public boolean isAluno() {
        return hasRole(UserRole.ROLE_ALUNO);
    }
}
