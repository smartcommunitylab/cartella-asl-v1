package it.smartcommunitylab.cartella.asl.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import it.smartcommunitylab.cartella.asl.model.Azienda;
import it.smartcommunitylab.cartella.asl.model.Opportunita;

@Repository
public interface OpportunitaRepository extends JpaRepository<Opportunita, Long> {

//	@Modifying
//	@Query("update Opportunita o0 set titolo=:#{#o.titolo},descrizione=:#{#o.descrizione},tipologia=:#{#o.tipologia},dataInizio=:#{#o.dataInizio},dataFine=:#{#o.dataFine},ore=:#{#o.ore},postiDisponibili=:#{#o.postiDisponibili},prerequisiti=:#{#o.prerequisiti},referente=:#{#o.referente} where id = :#{#o.id}")
//	public void update(@Param("o") Opportunita o);			
	
    @Query("SELECT o0.azienda.id FROM Opportunita o0 WHERE o0.id = (:id)")
    public String findOpportunitaAziendaId(@Param("id") Long id);	
    
    public List<Opportunita> findOpportunitaByAzienda(Azienda azienda);
	
}
