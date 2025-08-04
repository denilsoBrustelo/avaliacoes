package com.sistema.avaliacoes.repository;

import com.sistema.avaliacoes.model.entity.Serie;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.Optional;

@Repository
public interface SerieRepository extends JpaRepository<Serie, Long> {
    
    List<Serie> findByStatusTrueOrderByDescricao();
    
    Optional<Serie> findByIdSerieExterno(String idSerieExterno);
    
    boolean existsByDescricaoAndStatusTrue(String descricao);
    
    boolean existsByIdSerieExterno(String idSerieExterno);
}
