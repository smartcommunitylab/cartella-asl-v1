package it.smartcommunitylab.cartella.asl.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import it.smartcommunitylab.cartella.asl.model.Presenze;

@Repository
public interface PresenzeRepository extends JpaRepository<Presenze, Long> {
	
	@Query("SELECT pci0 FROM Presenze pci0 WHERE pci0.id = (SELECT es0.id FROM EsperienzaSvolta es0 WHERE es0.id = (SELECT aa0.id FROM AttivitaAlternanza aa0 WHERE aa0.id = (:aaId)))")
	public List<Presenze> findAttivitaAlternanzaCalendario(@Param("aaId") Long aaId);		
	

}
