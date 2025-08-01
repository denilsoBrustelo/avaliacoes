package com.sistema.avaliacoes.repository;

import com.sistema.avaliacoes.model.entity.Usuario;
import com.sistema.avaliacoes.model.enums.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    Optional<Usuario> findByEmail(String email);
    
    Optional<Usuario> findByCpf(String cpf);
    
    boolean existsByEmail(String email);
    
    boolean existsByCpf(String cpf);
    
    List<Usuario> findByStatusTrue();
    
    @Query("SELECT u FROM Usuario u JOIN u.roles r WHERE r = :role AND u.status = true")
    List<Usuario> findByRoleAndStatusTrue(@Param("role") UserRole role);
    
    @Query("SELECT u FROM Usuario u WHERE " +
           "(LOWER(u.nome) LIKE LOWER(CONCAT('%', :termo, '%')) OR " +
           "LOWER(u.email) LIKE LOWER(CONCAT('%', :termo, '%')) OR " +
           "u.cpf LIKE CONCAT('%', :termo, '%')) AND " +
           "u.status = true")
    List<Usuario> buscarPorTermo(@Param("termo") String termo);
    
    @Query("SELECT COUNT(u) FROM Usuario u JOIN u.roles r WHERE r = :role AND u.status = true")
    long countByRoleAndStatusTrue(@Param("role") UserRole role);
}
