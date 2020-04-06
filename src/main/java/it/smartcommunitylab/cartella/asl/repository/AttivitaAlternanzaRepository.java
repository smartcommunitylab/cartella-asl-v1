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
import it.smartcommunitylab.cartella.asl.model.AttivitaAlternanza;
import it.smartcommunitylab.cartella.asl.model.CorsoInterno;
import it.smartcommunitylab.cartella.asl.model.Opportunita;

@Repository
public interface AttivitaAlternanzaRepository extends JpaRepository<AttivitaAlternanza, Long> {

	@Modifying
	@Query("update AttivitaAlternanza aa0 set titolo=:#{#aa.titolo},annoScolastico=:#{#aa.annoScolastico},annoCorso=:#{#aa.annoCorso},interna=:#{#aa.interna},tipologia=:#{#aa.tipologia},individuale=:#{#aa.individuale},ore=:#{#aa.ore},dataInizio=:#{#aa.dataInizio},dataFine=:#{#aa.dataFine},oraInizio=:#{#aa.oraInizio},oraFine=:#{#aa.oraFine},corsoId=:#{#aa.corsoId},istitutoId=:#{#aa.istitutoId} where id = :#{#aa.id}")
	public void update(@Param("aa") AttivitaAlternanza aa);			
	// not updating completata
	
	@Modifying
	@Query("update AttivitaAlternanza aa0 set completata = (:completata) where aa0.id = (:id)")
	public void updateCompletata(@Param("id") long id, @Param("completata") boolean completata);				
	
	public List<AttivitaAlternanza> findAttivitaAlternanzaByOpportunita(Opportunita o);
	
	public List<AttivitaAlternanza> findAttivitaAlternanzaByAnnoAlternanza(AnnoAlternanza aa);
	
	@Query("SELECT aa0 FROM AttivitaAlternanza aa0, AnnoAlternanza a0 WHERE aa0.annoAlternanza = a0 AND a0.id = (:id)")
	public Page<AttivitaAlternanza> findAttivitaAlternanzaByAnnoAlternanzaId(@Param("id") long aaId, Pageable pageRequest);
	
	public List<AttivitaAlternanza> findAttivitaAlternanzaByAnnoScolastico(String annoScolastico);
	public List<AttivitaAlternanza> findAttivitaAlternanzaByAnnoScolasticoAndAnnoCorso(String annoScolastico, Integer annoCorso);
	
	public List<AttivitaAlternanza> findAttivitaAlternanzaByCorsoInterno(CorsoInterno ci);
	
    @Query("SELECT aa0.istitutoId FROM AttivitaAlternanza aa0 WHERE aa0.id = (:id)")
    public String findAttivitaAlternanzaIstitutoId(@Param("id") Long id);
    
    public List<AttivitaAlternanza> findAttivitaAlternanzaByIstitutoIdAndAnnoScolastico(String istitutoId, String annoScolastico);
	
    @Query("SELECT aa0 FROM AttivitaAlternanza aa0 LEFT JOIN aa0.tags tags WHERE aa0.istitutoId = (:istitutoId) AND tags IN (:tags)")
    public Page<AttivitaAlternanza> findAttivitaAlternanzaByIstitutoIdAndTags(@Param("istitutoId") String istitutoId, @Param("tags") List<String> tags, Pageable pageRequest);
    
}
