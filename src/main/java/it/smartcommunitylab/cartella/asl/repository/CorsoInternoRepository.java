package it.smartcommunitylab.cartella.asl.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import it.smartcommunitylab.cartella.asl.model.CorsoInterno;

@Repository
public interface CorsoInternoRepository extends JpaRepository<CorsoInterno, Long> {

//	@Modifying
//	@Query("update OppCorso oc0 set corso=:#{#ci.corso}, corsoId=:#{#ci.corsoId}, annoScolastico=:#{#ci.annoScolastico}, dataInizio=:#{#ci.dataInizio}, dataFine=:#{#ci.dataFine}, oraInizio=:#{#ci.oraInizio}, oraFine=:#{#ci.oraFine}, referenteFormazione=:#{#ci.referenteFormazione}, formatore=:#{#ci.formatore}, coordinatore=:#{#ci.coordinatore}, tipologia=:#{#ci.tipologia}, titolo=:#{#ci.titolo}, descrizione=:#{#ci.descrizione}, ore=:#{#ci.ore}, latitude = :#{#ci.coordinate.latitude}, longitude = :#{#ci.coordinate.longitude} where id = :#{#ci.id}")
//	public void update(@Param("ci") CorsoInterno ci);

}
