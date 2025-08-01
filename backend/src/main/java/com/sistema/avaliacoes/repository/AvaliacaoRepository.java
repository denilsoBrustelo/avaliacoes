package com.sistema.avaliacoes.repository;

import com.sistema.avaliacoes.model.entity.Avaliacao;
import com.sistema.avaliacoes.model.enums.StatusEnum;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AvaliacaoRepository extends JpaRepository<Avaliacao, Long> {
    
    List<Avaliacao> findByStatusTrueOrderByDataCadastroDesc();
    
    List<Avaliacao> findByResponsavelIdAndStatusTrue(Long responsavelId);
    
    List<Avaliacao> findByStatusAvaliacaoAndStatusTrue(StatusEnum.StatusAvaliacao statusAvaliacao);
    
    List<Avaliacao> findByTipoAvaliacaoIdAndStatusTrue(Long tipoAvaliacaoId);
    
    @Query("SELECT COUNT(a) FROM Avaliacao a WHERE a.responsavel.id = :professorId AND a.status = true")
    long countByProfessorAndStatusTrue(@Param("professorId") Long professorId);
    
    long countByStatusAvaliacaoAndStatusTrue(StatusEnum.StatusAvaliacao statusAvaliacao);
}
