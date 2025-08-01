package com.sistema.avaliacoes.controller;

import com.sistema.avaliacoes.dto.UsuarioDTO;
import com.sistema.avaliacoes.model.entity.Usuario;
import com.sistema.avaliacoes.security.JwtUtil;
import com.sistema.avaliacoes.service.UsuarioService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/auth")
@Tag(name = "Autenticação", description = "Operações de autenticação e autorização")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/login")
    @Operation(summary = "Realizar login", description = "Autentica o usuário e retorna um token JWT")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                    loginRequest.getEmail(), 
                    loginRequest.getSenha())
            );

            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            Optional<Usuario> usuarioOpt = usuarioService.buscarPorEmail(userDetails.getUsername());

            if (usuarioOpt.isEmpty()) {
                return ResponseEntity.badRequest().body("Usuário não encontrado");
            }

            Usuario usuario = usuarioOpt.get();

            // Gerar token JWT com informações do usuário
            Map<String, Object> extraClaims = new HashMap<>();
            extraClaims.put("id", usuario.getId());
            extraClaims.put("nome", usuario.getNome());
            extraClaims.put("roles", usuario.getRoles());

            String jwt = jwtUtil.generateTokenWithClaims(userDetails, extraClaims);

            Map<String, Object> response = new HashMap<>();
            response.put("token", jwt);
            response.put("type", "Bearer");
            response.put("usuario", convertToDTO(usuario));

            return ResponseEntity.ok(response);

        } catch (BadCredentialsException e) {
            return ResponseEntity.badRequest().body("Credenciais inválidas");
        }
    }

    @PostMapping("/register")
    @Operation(summary = "Registrar novo usuário", description = "Cria um novo usuário no sistema")
    public ResponseEntity<?> register(@Valid @RequestBody UsuarioDTO usuarioDTO) {
        try {
            Usuario usuario = convertToEntity(usuarioDTO);
            Usuario usuarioCriado = usuarioService.criar(usuario);
            return ResponseEntity.ok(convertToDTO(usuarioCriado));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/refresh")
    @Operation(summary = "Renovar token", description = "Renova um token JWT válido")
    public ResponseEntity<?> refresh(@RequestHeader("Authorization") String authHeader) {
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            
            if (jwtUtil.isTokenValid(token)) {
                String username = jwtUtil.extractUsername(token);
                UserDetails userDetails = usuarioService.loadUserByUsername(username);
                
                Optional<Usuario> usuarioOpt = usuarioService.buscarPorEmail(username);
                if (usuarioOpt.isPresent()) {
                    Usuario usuario = usuarioOpt.get();
                    
                    Map<String, Object> extraClaims = new HashMap<>();
                    extraClaims.put("id", usuario.getId());
                    extraClaims.put("nome", usuario.getNome());
                    extraClaims.put("roles", usuario.getRoles());

                    String newToken = jwtUtil.generateTokenWithClaims(userDetails, extraClaims);
                    
                    Map<String, Object> response = new HashMap<>();
                    response.put("token", newToken);
                    response.put("type", "Bearer");
                    
                    return ResponseEntity.ok(response);
                }
            }
        }
        
        return ResponseEntity.badRequest().body("Token inválido");
    }

    @GetMapping("/me")
    @Operation(summary = "Obter dados do usuário logado", description = "Retorna os dados do usuário autenticado")
    public ResponseEntity<?> getCurrentUser(Authentication authentication) {
        if (authentication != null && authentication.isAuthenticated()) {
            String email = authentication.getName();
            Optional<Usuario> usuarioOpt = usuarioService.buscarPorEmail(email);
            
            if (usuarioOpt.isPresent()) {
                return ResponseEntity.ok(convertToDTO(usuarioOpt.get()));
            }
        }
        
        return ResponseEntity.badRequest().body("Usuário não autenticado");
    }

    // Classes auxiliares
    public static class LoginRequest {
        private String email;
        private String senha;

        // Getters and Setters
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
        usuario.setCpf(dto.getCpf());
        usuario.setNome(dto.getNome());
        usuario.setEmail(dto.getEmail());
        usuario.setSenha(dto.getSenha());
        usuario.setRoles(dto.getRoles());
        return usuario;
    }
}
