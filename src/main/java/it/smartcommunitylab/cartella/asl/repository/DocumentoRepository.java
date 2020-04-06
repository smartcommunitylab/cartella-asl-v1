package it.smartcommunitylab.cartella.asl.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import it.smartcommunitylab.cartella.asl.model.Documento;

@Repository
public interface DocumentoRepository extends JpaRepository<Documento, String> {

	@Modifying
	@Query("update Documento d0 set nome=:#{#d.nome} where id = :#{#d.id}")
	public void update(@Param("d") Documento d);
	
	@Query("SELECT doc FROM Documento doc WHERE doc.id =:#{#docId}")
	public Documento findDocumentoById(@Param("docId") String docId);

	@Query("SELECT es.studente.id FROM EsperienzaSvolta es JOIN es.documenti doc WHERE doc.id =:#{#docId}")
	public String findDocumentoStudenteId(@Param("docId") String docId);	
	
//	@Query("DELETE FROM Documento doc WHERE doc.id =:#{#docId}")
//	public Documento deleteDocumentoById(@Param("docId") String docId);
	
}
