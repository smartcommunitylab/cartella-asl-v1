package it.smartcommunitylab.cartella.asl.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import it.smartcommunitylab.cartella.asl.model.Competenza;

@Repository
public interface CompetenzaRepository extends JpaRepository<Competenza, Long>, PagingAndSortingRepository<Competenza, Long> {

//	@Modifying
//	@Query("update Competenza c0 set titolo=:#{#c.titolo},idCompetenza=:#{#c.idCompetenza},idProfilo=:#{#c.idProfilo},descrizione=:#{#c.descrizione},livelloEQF=:#{#c.livelloEQF},conoscenze=:#{#c.conoscenze},abilita=:#{#c.abilita} where id = :#{#c.id}")
//	public void update(@Param("c") Competenza c);		

	public Page<Competenza> findCompetenzaByOwnerId(String ownerId, Pageable pageRequest);

	@Query("SELECT c.ownerId FROM Competenza c WHERE c.id = (:id)")
	public String findCompetenzaOwnerId(@Param("id") Long id);
	
	@Query("SELECT DISTINCT c.source,c.ownerId,c.ownerName FROM Competenza c WHERE c.ownerId IS NOT NULL")
	public List<Object[]> findCompetenzeOwners();	
	
}
