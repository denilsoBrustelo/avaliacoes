package com.sistema.avaliacoes.repository;

import com.sistema.avaliacoes.model.entity.Questao;
import com.sistema.avaliacoes.model.enums.StatusEnum;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuestaoRepository extends JpaRepository<Questao, Long> {
    
    List<Questao> findByStatusTrueOrderByDataCadastroDesc();
    
    List<Questao> findByStatusQuestaoAndStatusTrue(StatusEnum.StatusQuestao statusQuestao);
    
    List<Questao> findByDisciplinaIdAndStatusTrue(Long disciplinaId);
    
    List<Questao> findByNivelDificuldadeIdAndStatusTrue(Long nivelDificuldadeId);
    
    @Query("SELECT q FROM Questao q WHERE " +
           "(LOWER(q.pergunta) LIKE LOWER(CONCAT('%', :termo, '%')) OR " +
           "LOWER(q.tema) LIKE LOWER(CONCAT('%', :termo, '%')) OR " +
           "LOWER(q.habilidades) LIKE LOWER(CONCAT('%', :termo, '%'))) AND " +
           "q.status = true")
    List<Questao> buscarPorTermo(@Param("termo") String termo);
    
    @Query("SELECT q FROM Questao q WHERE " +
           "(:disciplinaId IS NULL OR q.disciplina.id = :disciplinaId) AND " +
           "(:statusQuestao IS NULL OR q.statusQuestao = :statusQuestao) AND " +
           "(:nivelDificuldadeId IS NULL OR q.nivelDificuldade.id = :nivelDificuldadeId) AND " +
           "q.status = true")
    Page<Questao> findWithFilters(
        @Param("disciplinaId") Long disciplinaId,
        @Param("statusQuestao") StatusEnum.StatusQuestao statusQuestao,
        @Param("nivelDificuldadeId") Long nivelDificuldadeId,
        Pageable pageable
    );
    
    long countByStatusQuestaoAndStatusTrue(StatusEnum.StatusQuestao statusQuestao);
    
    long countByDisciplinaIdAndStatusTrue(Long disciplinaId);

    long countByStatusTrue();
}
