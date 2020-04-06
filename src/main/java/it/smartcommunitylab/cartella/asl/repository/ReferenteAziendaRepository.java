package it.smartcommunitylab.cartella.asl.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import it.smartcommunitylab.cartella.asl.model.ReferenteAzienda;

@Repository
public interface ReferenteAziendaRepository extends JpaRepository<ReferenteAzienda, Long> {

	@Modifying
	@Query("update ReferenteAlternanza ra0 set nome=:#{#ra.nome} where id = :#{#ra.id}")
	public void update(@Param("ra") ReferenteAzienda ra);		
	
}
