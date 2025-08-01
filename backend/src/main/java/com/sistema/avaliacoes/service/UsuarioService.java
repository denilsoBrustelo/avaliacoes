package com.sistema.avaliacoes.service;

import com.sistema.avaliacoes.model.entity.Usuario;
import com.sistema.avaliacoes.model.enums.UserRole;
import com.sistema.avaliacoes.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class UsuarioService implements UserDetailsService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado: " + email));

        return org.springframework.security.core.userdetails.User.builder()
                .username(usuario.getEmail())
                .password(usuario.getSenha())
                .authorities(usuario.getRoles().stream()
                        .map(role -> "ROLE_" + role.name().replace("ROLE_", ""))
                        .toArray(String[]::new))
                .accountExpired(false)
                .accountLocked(!usuario.getStatus())
                .credentialsExpired(false)
                .disabled(!usuario.getStatus())
                .build();
    }

    public Usuario criar(Usuario usuario) {
        // Validar se email já existe
        if (usuarioRepository.existsByEmail(usuario.getEmail())) {
            throw new IllegalArgumentException("Email já cadastrado");
        }

        // Validar se CPF já existe
        if (usuarioRepository.existsByCpf(usuario.getCpf())) {
            throw new IllegalArgumentException("CPF já cadastrado");
        }

        // Criptografar senha
        usuario.setSenha(passwordEncoder.encode(usuario.getSenha()));
        
        return usuarioRepository.save(usuario);
    }

    public Usuario atualizar(Long id, Usuario usuarioAtualizado) {
        Usuario usuarioExistente = buscarPorId(id);

        // Verificar se email mudou e se já existe
        if (!usuarioExistente.getEmail().equals(usuarioAtualizado.getEmail()) &&
            usuarioRepository.existsByEmail(usuarioAtualizado.getEmail())) {
            throw new IllegalArgumentException("Email já cadastrado");
        }

        // Verificar se CPF mudou e se já existe
        if (!usuarioExistente.getCpf().equals(usuarioAtualizado.getCpf()) &&
            usuarioRepository.existsByCpf(usuarioAtualizado.getCpf())) {
            throw new IllegalArgumentException("CPF já cadastrado");
        }

        // Atualizar campos
        usuarioExistente.setNome(usuarioAtualizado.getNome());
        usuarioExistente.setEmail(usuarioAtualizado.getEmail());
        usuarioExistente.setCpf(usuarioAtualizado.getCpf());
        usuarioExistente.setRoles(usuarioAtualizado.getRoles());

        // Atualizar senha apenas se fornecida
        if (usuarioAtualizado.getSenha() != null && !usuarioAtualizado.getSenha().trim().isEmpty()) {
            usuarioExistente.setSenha(passwordEncoder.encode(usuarioAtualizado.getSenha()));
        }

        return usuarioRepository.save(usuarioExistente);
    }

    public void excluir(Long id) {
        Usuario usuario = buscarPorId(id);
        usuario.setStatus(false);
        usuarioRepository.save(usuario);
    }

    @Transactional(readOnly = true)
    public Usuario buscarPorId(Long id) {
        return usuarioRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado"));
    }

    @Transactional(readOnly = true)
    public Optional<Usuario> buscarPorEmail(String email) {
        return usuarioRepository.findByEmail(email);
    }

    @Transactional(readOnly = true)
    public List<Usuario> listarTodos() {
        return usuarioRepository.findByStatusTrue();
    }

    @Transactional(readOnly = true)
    public List<Usuario> listarPorRole(UserRole role) {
        return usuarioRepository.findByRoleAndStatusTrue(role);
    }

    @Transactional(readOnly = true)
    public List<Usuario> buscarPorTermo(String termo) {
        return usuarioRepository.buscarPorTermo(termo);
    }

    @Transactional(readOnly = true)
    public long contarPorRole(UserRole role) {
        return usuarioRepository.countByRoleAndStatusTrue(role);
    }

    public Usuario alterarSenha(Long id, String senhaAtual, String novaSenha) {
        Usuario usuario = buscarPorId(id);

        if (!passwordEncoder.matches(senhaAtual, usuario.getSenha())) {
            throw new IllegalArgumentException("Senha atual incorreta");
        }

        usuario.setSenha(passwordEncoder.encode(novaSenha));
        return usuarioRepository.save(usuario);
    }

    public Usuario ativarDesativar(Long id) {
        Usuario usuario = buscarPorId(id);
        usuario.setStatus(!usuario.getStatus());
        return usuarioRepository.save(usuario);
    }

    @Transactional(readOnly = true)
    public UsuarioStatistics getStatistics() {
        long totalUsuarios = usuarioRepository.count();
        long totalAdmins = contarPorRole(UserRole.ROLE_ADMIN);
        long totalProfessores = contarPorRole(UserRole.ROLE_PROFESSOR);
        long totalAlunos = contarPorRole(UserRole.ROLE_ALUNO);

        return new UsuarioStatistics(totalUsuarios, totalAdmins, totalProfessores, totalAlunos);
    }

    public static class UsuarioStatistics {
        private long totalUsuarios;
        private long totalAdmins;
        private long totalProfessores;
        private long totalAlunos;

        public UsuarioStatistics(long totalUsuarios, long totalAdmins, long totalProfessores, long totalAlunos) {
            this.totalUsuarios = totalUsuarios;
            this.totalAdmins = totalAdmins;
            this.totalProfessores = totalProfessores;
            this.totalAlunos = totalAlunos;
        }

        // Getters
        public long getTotalUsuarios() { return totalUsuarios; }
        public long getTotalAdmins() { return totalAdmins; }
        public long getTotalProfessores() { return totalProfessores; }
        public long getTotalAlunos() { return totalAlunos; }
    }
}
