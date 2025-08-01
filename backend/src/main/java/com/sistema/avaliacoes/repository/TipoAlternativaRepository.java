package com.sistema.avaliacoes.repository;

import com.sistema.avaliacoes.model.entity.TipoAlternativa;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TipoAlternativaRepository extends JpaRepository<TipoAlternativa, Long> {
    
    List<TipoAlternativa> findByStatusTrueOrderByDescricao();
    
    boolean existsByDescricaoAndStatusTrue(String descricao);
}
