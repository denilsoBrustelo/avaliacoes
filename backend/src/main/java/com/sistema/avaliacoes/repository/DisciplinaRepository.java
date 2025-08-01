package com.sistema.avaliacoes.repository;

import com.sistema.avaliacoes.model.entity.Disciplina;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DisciplinaRepository extends JpaRepository<Disciplina, Long> {
    
    List<Disciplina> findByStatusTrueOrderByDescricao();
    
    Optional<Disciplina> findByIdDisciplinaExterno(String idDisciplinaExterno);
    
    boolean existsByDescricaoAndStatusTrue(String descricao);
    
    boolean existsByIdDisciplinaExterno(String idDisciplinaExterno);
    
    @Query("SELECT d FROM Disciplina d WHERE " +
           "LOWER(d.descricao) LIKE LOWER(CONCAT('%', :termo, '%')) AND " +
           "d.status = true")
    List<Disciplina> buscarPorTermo(@Param("termo") String termo);
}
