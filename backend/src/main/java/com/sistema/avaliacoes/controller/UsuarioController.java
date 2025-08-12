package com.sistema.avaliacoes.controller;

import com.sistema.avaliacoes.dto.UsuarioDTO;
import com.sistema.avaliacoes.model.entity.Usuario;
import com.sistema.avaliacoes.model.enums.UserRole;
import com.sistema.avaliacoes.service.UsuarioService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/usuarios")
@Tag(name = "Usuários", description = "Operações relacionadas aos usuários do sistema")
@SecurityRequirement(name = "Bearer Authentication")
@CrossOrigin(origins = "http://localhost:3000")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    @GetMapping
    @Operation(summary = "Listar todos os usuários", description = "Retorna a lista de todos os usuários ativos")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UsuarioDTO>> listarTodos() {
        List<Usuario> usuarios = usuarioService.listarTodos();
        List<UsuarioDTO> usuariosDTO = usuarios.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(usuariosDTO);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar usuário por ID", description = "Retorna um usuário específico pelo ID")
    @PreAuthorize("hasRole('ADMIN') or #id == authentication.principal.id")
    public ResponseEntity<UsuarioDTO> buscarPorId(@PathVariable Long id) {
        Usuario usuario = usuarioService.buscarPorId(id);
        return ResponseEntity.ok(convertToDTO(usuario));
    }

    @PostMapping
    @Operation(summary = "Criar novo usuário", description = "Cria um novo usuário no sistema")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UsuarioDTO> criar(@Valid @RequestBody UsuarioDTO usuarioDTO) {
        try {
            Usuario usuario = convertToEntity(usuarioDTO);
            Usuario usuarioCriado = usuarioService.criar(usuario);
            return ResponseEntity.status(HttpStatus.CREATED).body(convertToDTO(usuarioCriado));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    @Operation(summary = "Atualizar usuário", description = "Atualiza um usuário existente")
    @PreAuthorize("hasRole('ADMIN') or #id == authentication.principal.id")
    public ResponseEntity<UsuarioDTO> atualizar(@PathVariable Long id, @Valid @RequestBody UsuarioDTO usuarioDTO) {
        try {
            Usuario usuario = convertToEntity(usuarioDTO);
            Usuario usuarioAtualizado = usuarioService.atualizar(id, usuario);
            return ResponseEntity.ok(convertToDTO(usuarioAtualizado));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Excluir usuário", description = "Exclui um usuário (soft delete)")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        usuarioService.excluir(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/buscar")
    @Operation(summary = "Buscar usuários", description = "Busca usuários por termo (nome, email ou CPF)")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UsuarioDTO>> buscarPorTermo(
            @Parameter(description = "Termo de busca") @RequestParam String termo) {
        List<Usuario> usuarios = usuarioService.buscarPorTermo(termo);
        List<UsuarioDTO> usuariosDTO = usuarios.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(usuariosDTO);
    }

    @GetMapping("/role/{role}")
    @Operation(summary = "Listar usuários por perfil", description = "Retorna usuários de um perfil específico")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UsuarioDTO>> listarPorRole(@PathVariable UserRole role) {
        List<Usuario> usuarios = usuarioService.listarPorRole(role);
        List<UsuarioDTO> usuariosDTO = usuarios.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(usuariosDTO);
    }

    @PatchMapping("/{id}/status")
    @Operation(summary = "Ativar/Desativar usuário", description = "Alterna o status ativo/inativo do usuário")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UsuarioDTO> alterarStatus(@PathVariable Long id) {
        Usuario usuario = usuarioService.ativarDesativar(id);
        return ResponseEntity.ok(convertToDTO(usuario));
    }

    @PatchMapping("/{id}/senha")
    @Operation(summary = "Alterar senha", description = "Altera a senha do usuário")
    @PreAuthorize("hasRole('ADMIN') or #id == authentication.principal.id")
    public ResponseEntity<Void> alterarSenha(
            @PathVariable Long id,
            @RequestParam String senhaAtual,
            @RequestParam String novaSenha) {
        try {
            usuarioService.alterarSenha(id, senhaAtual, novaSenha);
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/estatisticas")
    @Operation(summary = "Estatísticas de usuários", description = "Retorna estatísticas sobre os usuários")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UsuarioService.UsuarioStatistics> obterEstatisticas() {
        return ResponseEntity.ok(usuarioService.getStatistics());
    }

    // Métodos de conversão
    private UsuarioDTO convertToDTO(Usuario usuario) {
        UsuarioDTO dto = new UsuarioDTO();
        dto.setId(usuario.getId());
        dto.setDataCadastro(usuario.getDataCadastro());
        dto.setCpf(usuario.getCpf());
        dto.setNome(usuario.getNome());
        dto.setEmail(usuario.getEmail());
        dto.setRoles(usuario.getRoles());
        dto.setStatus(usuario.getStatus());
        // Não incluir senha no DTO de resposta
        return dto;
    }

    private Usuario convertToEntity(UsuarioDTO dto) {
        Usuario usuario = new Usuario();
        usuario.setId(dto.getId());
        usuario.setCpf(dto.getCpf());
        usuario.setNome(dto.getNome());
        usuario.setEmail(dto.getEmail());
        usuario.setSenha(dto.getSenha());
        usuario.setRoles(dto.getRoles());
        usuario.setStatus(dto.getStatus());
        return usuario;
    }
}
