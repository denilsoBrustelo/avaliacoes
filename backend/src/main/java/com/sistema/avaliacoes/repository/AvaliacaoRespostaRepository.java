package com.sistema.avaliacoes.repository;

import com.sistema.avaliacoes.model.entity.AvaliacaoResposta;
import com.sistema.avaliacoes.model.enums.StatusEnum;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AvaliacaoRespostaRepository extends JpaRepository<AvaliacaoResposta, Long> {
    
    List<AvaliacaoResposta> findByUsuarioIdAndStatusTrue(Long usuarioId);
    
    List<AvaliacaoResposta> findByQuestaoIdAndStatusTrue(Long questaoId);
    
    Optional<AvaliacaoResposta> findByUsuarioIdAndQuestaoIdAndStatusTrue(Long usuarioId, Long questaoId);
    
    List<AvaliacaoResposta> findByCorrigidoPorAndStatusTrue(StatusEnum.TipoCorrecao tipoCorrecao);
    
    List<AvaliacaoResposta> findByCorretaIsNullAndStatusTrue();
    
    @Query("SELECT r FROM AvaliacaoResposta r JOIN r.questao q JOIN q.avaliacaoQuestoes aq " +
           "WHERE aq.avaliacao.id = :avaliacaoId AND r.usuario.id = :usuarioId AND r.status = true")
    List<AvaliacaoResposta> findRespostasPorAvaliacaoEUsuario(
        @Param("avaliacaoId") Long avaliacaoId, 
        @Param("usuarioId") Long usuarioId);
    
    @Query("SELECT COUNT(r) FROM AvaliacaoResposta r " +
           "WHERE r.usuario.id = :usuarioId AND r.correta = true AND r.status = true")
    long countRespostasCorretasPorUsuario(@Param("usuarioId") Long usuarioId);
    
    @Query("SELECT COUNT(r) FROM AvaliacaoResposta r " +
           "WHERE r.questao.id = :questaoId AND r.correta = true AND r.status = true")
    long countRespostasCorretasPorQuestao(@Param("questaoId") Long questaoId);
    
    @Query("SELECT AVG(r.pontuacao) FROM AvaliacaoResposta r " +
           "WHERE r.usuario.id = :usuarioId AND r.pontuacao IS NOT NULL AND r.status = true")
    Double calcularMediaPorUsuario(@Param("usuarioId") Long usuarioId);
    
    @Query("SELECT r FROM AvaliacaoResposta r " +
           "WHERE r.correta IS NULL AND r.status = true " +
           "ORDER BY r.dataCadastro ASC")
    List<AvaliacaoResposta> findRespostasPendentesCorrecao();
}
