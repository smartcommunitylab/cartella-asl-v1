package it.smartcommunitylab.cartella.asl.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import it.smartcommunitylab.cartella.asl.model.AnnoAlternanza;
import it.smartcommunitylab.cartella.asl.model.PianoAlternanza;

@Repository
public interface PianoAlternanzaRepository extends JpaRepository<PianoAlternanza, Long> {

//	@Query("SELECT p FROM Person p JOIN FETCH p.roles WHERE p.id = (:id)")
//	@Query("SELECT pa0 FROM PianoAlternanza pa0 JOIN FETCH pa0.anniAlternanza WHERE id = :#{#pa.id}")
//    public PianoAlternanza findWithAnnoAlternanza(@Param("id") Long id);
	
	@Modifying
	@Query("update PianoAlternanza pa0 set titolo=:#{#pa.titolo},inizioValidita=:#{#pa.inizioValidita},fineValidita=:#{#pa.fineValidita},corsoDiStudio=:#{#pa.corsoDiStudio},istituto=:#{#pa.istituto},corsoDiStudioId=:#{#pa.corsoDiStudioId},istitutoId=:#{#pa.istitutoId},attivo=:#{#pa.attivo},annoScolasticoAttivazione=:#{#pa.annoScolasticoAttivazione},annoScolasticoDisattivazione=:#{#pa.annoScolasticoDisattivazione},note=:#{#pa.note} where id = :#{#pa.id}")
	public void update(@Param("pa") PianoAlternanza pa);		

	@Modifying
	@Query("update PianoAlternanza pa0 set attivo=(:stato) where id = (:id)")
	public void updateStato(@Param("id") long id, @Param("stato") boolean stato);	
	
//	@Query("SELECT DISTINCT pa0 FROM PianoAlternanza pa0 INNER JOIN pa0.anniAlternanza aa0 WHERE pa0.corsoStudio = (:corsoStudio) AND pa0.istituto = (:istituto)")
	public Page<PianoAlternanza> findPianoAlternanzaByCorsoDiStudioIdAndIstitutoId(String corsoDiStudioId, String istitutoId, Pageable pageRequest);
	public Page<PianoAlternanza> findPianoAlternanzaByIstitutoId(String istitutoId, Pageable pageRequest);
	
	public List<PianoAlternanza> findPianoAlternanzaByCorsoDiStudioIdAndIstitutoId(String corsoDiStudioId, String istitutoId);
	public List<PianoAlternanza> findPianoAlternanzaByCorsoDiStudioIdAndIstitutoIdAndAttivo(String corsoDiStudioId, String istitutoId, boolean attivo);
	public List<PianoAlternanza> findPianoAlternanzaByIstitutoId(String istituto);

	
	public PianoAlternanza findPianoAlternanzaByAnniAlternanza(AnnoAlternanza aa);
	
    @Query("SELECT pa0.istitutoId FROM PianoAlternanza pa0 WHERE pa0.id = (:id)")
    public String findPianoAlternanzaIstitutoId(@Param("id") Long id);    
	
	
}
