package com.sistema.avaliacoes.repository;

import com.sistema.avaliacoes.model.entity.NivelDificuldade;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NivelDificuldadeRepository extends JpaRepository<NivelDificuldade, Long> {
    
    List<NivelDificuldade> findByStatusTrueOrderByDescricao();

    Optional<NivelDificuldade> findByDescricao(String descricao);
    
    boolean existsByDescricaoAndStatusTrue(String descricao);
}
