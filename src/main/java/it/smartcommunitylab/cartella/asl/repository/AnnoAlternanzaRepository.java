package it.smartcommunitylab.cartella.asl.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import it.smartcommunitylab.cartella.asl.model.AnnoAlternanza;
import it.smartcommunitylab.cartella.asl.model.TipologiaAttivita;

@Repository
public interface AnnoAlternanzaRepository extends JpaRepository<AnnoAlternanza, Long> {
	
	@Modifying
	@Query("update AnnoAlternanza aa0 set oreTotali=:#{#aa.oreTotali} where id = :#{#aa.id}")
	public void update(@Param("aa") AnnoAlternanza aa);		
	
	public AnnoAlternanza findAnnoAlternanzaByTipologieAttivita(TipologiaAttivita ta);

	@Query("SELECT pa0.istitutoId FROM PianoAlternanza pa0 JOIN pa0.anniAlternanza aa0 WHERE aa0.id = (:id)")
    public String findAnnoAlternanzaIstitutoId(@Param("id") Long id);

	
}
