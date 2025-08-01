package com.sistema.avaliacoes.repository;

import com.sistema.avaliacoes.model.entity.ParticipanteAvaliacao;
import com.sistema.avaliacoes.model.enums.StatusEnum;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ParticipanteAvaliacaoRepository extends JpaRepository<ParticipanteAvaliacao, Long> {
    
    List<ParticipanteAvaliacao> findByUsuarioIdAndStatusTrue(Long usuarioId);
    
    List<ParticipanteAvaliacao> findByAvaliacaoIdAndStatusTrue(Long avaliacaoId);
    
    Optional<ParticipanteAvaliacao> findByAvaliacaoIdAndUsuarioIdAndStatusTrue(Long avaliacaoId, Long usuarioId);
    
    List<ParticipanteAvaliacao> findByStatusAplicacaoAndStatusTrue(StatusEnum.StatusAplicacao statusAplicacao);
    
    List<ParticipanteAvaliacao> findByDisponivelTrueAndStatusTrue();
    
    @Query("SELECT p FROM ParticipanteAvaliacao p WHERE " +
           "p.usuario.id = :usuarioId AND " +
           "p.disponivel = true AND " +
           "p.statusAplicacao = :status AND " +
           "p.status = true")
    List<ParticipanteAvaliacao> findProvasDisponiveisParaAluno(
        @Param("usuarioId") Long usuarioId, 
        @Param("status") StatusEnum.StatusAplicacao status);
    
    @Query("SELECT p FROM ParticipanteAvaliacao p WHERE " +
           "p.dataInicioAvaliacao BETWEEN :inicio AND :fim AND " +
           "p.status = true")
    List<ParticipanteAvaliacao> findByPeriodoAplicacao(
        @Param("inicio") LocalDateTime inicio, 
        @Param("fim") LocalDateTime fim);
    
    @Query("SELECT COUNT(p) FROM ParticipanteAvaliacao p WHERE " +
           "p.avaliacao.id = :avaliacaoId AND " +
           "p.statusAplicacao = :status AND " +
           "p.status = true")
    long countByAvaliacaoAndStatus(
        @Param("avaliacaoId") Long avaliacaoId, 
        @Param("status") StatusEnum.StatusAplicacao status);
    
    @Query("SELECT COUNT(p) FROM ParticipanteAvaliacao p WHERE " +
           "p.usuario.id = :usuarioId AND " +
           "p.avaliado = true AND " +
           "p.status = true")
    long countAvaliacoesConcluidasPorAluno(@Param("usuarioId") Long usuarioId);
}
