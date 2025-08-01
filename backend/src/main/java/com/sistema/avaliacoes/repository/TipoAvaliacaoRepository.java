package com.sistema.avaliacoes.repository;

import com.sistema.avaliacoes.model.entity.TipoAvaliacao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TipoAvaliacaoRepository extends JpaRepository<TipoAvaliacao, Long> {
    
    List<TipoAvaliacao> findByStatusTrueOrderByDescricao();
    
    boolean existsByDescricaoAndStatusTrue(String descricao);
}
