package it.smartcommunitylab.cartella.asl.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import org.apache.commons.lang3.builder.ReflectionToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;

@Entity
//@Indexed
//@AnalyzerDef(name = "customanalyzer",
//tokenizer = @TokenizerDef(factory = StandardTokenizerFactory.class),
//filters = {
//  @TokenFilterDef(factory = LowerCaseFilterFactory.class),
//  @TokenFilterDef(factory = WordDelimiterFilterFactory.class),
//  @TokenFilterDef(factory = SnowballPorterFilterFactory.class, params = {
//    @Parameter(name = "language", value = "Italian")
//  })
//})
@Table(name = "competenza")
public class Competenza implements Comparable<Competenza> {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	private String idCompetenza;
	private String idProfilo;

//	@Column(columnDefinition = "TEXT")
//	@Field
//	@Analyzer(definition = "customanalyzer")	
	@Column(columnDefinition="VARCHAR(1024)")
	private String titolo;
	
//	@Column(columnDefinition = "TEXT")
//	@Field
//	@Analyzer(definition = "customanalyzer")
	@Column(columnDefinition="VARCHAR(1024)")
	private String profilo;

//	@Column(length = 2048)
//	@Field(index = Index.YES, store = Store.YES)
//	@FieldBridge(impl = BuiltinArrayBridge.class)
//	@Analyzer(definition = "customanalyzer")	
	@Column(columnDefinition="BLOB")
	private String[] conoscenze;
	
//	@Column(length = 2048) 
//	@Field(index = Index.YES, store = Store.YES)
//	@FieldBridge(impl = BuiltinArrayBridge.class)
//	@Analyzer(definition = "customanalyzer")	
	@Column(columnDefinition="BLOB")
	private String[] abilita;

	private int livelloEQF;
	
	private String source;
	private String ownerId;
	private String ownerName;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getIdCompetenza() {
		return idCompetenza;
	}

	public void setIdCompetenza(String idCompetenza) {
		this.idCompetenza = idCompetenza;
	}

	public String getIdProfilo() {
		return idProfilo;
	}

	public void setIdProfilo(String idProfilo) {
		this.idProfilo = idProfilo;
	}

	public String getTitolo() {
		return titolo;
	}

	public void setTitolo(String titolo) {
		this.titolo = titolo;
	}

	public String getProfilo() {
		return profilo;
	}

	public void setProfilo(String descrizione) {
		this.profilo = descrizione;
	}

	public String[] getConoscenze() {
		return conoscenze;
	}

	public void setConoscenze(String[] conoscenze) {
		this.conoscenze = conoscenze;
	}

	public String[] getAbilita() {
		return abilita;
	}

	public void setAbilita(String[] abilita) {
		this.abilita = abilita;
	}

	public int getLivelloEQF() {
		return livelloEQF;
	}

	public void setLivelloEQF(int livelloEQF) {
		this.livelloEQF = livelloEQF;
	}

	public String getSource() {
		return source;
	}

	public void setSource(String source) {
		this.source = source;
	}

	public String getOwnerId() {
		return ownerId;
	}

	public void setOwnerId(String ownerId) {
		this.ownerId = ownerId;
	}

	public String getOwnerName() {
		return ownerName;
	}

	public void setOwnerName(String ownerName) {
		this.ownerName = ownerName;
	}

	@Override
	public String toString() {
		return ReflectionToStringBuilder.toString(this, ToStringStyle.SHORT_PREFIX_STYLE);
	}

	@Override
	public int compareTo(Competenza o) {
		return Long.compare(id, o.id);
	}

//	@Override
//	public int hashCode() {
//		final int prime = 31;
//		int result = 1;
//		result = prime * result + ((abilita == null) ? 0 : abilita.hashCode());
//		result = prime * result + ((conoscenze == null) ? 0 : conoscenze.hashCode());
//		result = prime * result + ((descrizione == null) ? 0 : descrizione.hashCode());
//		result = prime * result + ((id == null) ? 0 : id.hashCode());
//		result = prime * result + ((idCompetenza == null) ? 0 : idCompetenza.hashCode());
//		result = prime * result + ((idProfilo == null) ? 0 : idProfilo.hashCode());
//		result = prime * result + livelloEQF;
//		result = prime * result + ((titolo == null) ? 0 : titolo.hashCode());
//		return result;
//	}
//
//	@Override
//	public boolean equals(Object obj) {
//		if (this == obj)
//			return true;
//		if (obj == null)
//			return false;
//		if (getClass() != obj.getClass())
//			return false;
//		Competenza other = (Competenza) obj;
//		if (abilita == null) {
//			if (other.abilita != null)
//				return false;
//		} else if (!abilita.equals(other.abilita))
//			return false;
//		if (conoscenze == null) {
//			if (other.conoscenze != null)
//				return false;
//		} else if (!conoscenze.equals(other.conoscenze))
//			return false;
//		if (descrizione == null) {
//			if (other.descrizione != null)
//				return false;
//		} else if (!descrizione.equals(other.descrizione))
//			return false;
//		if (id == null) {
//			if (other.id != null)
//				return false;
//		} else if (!id.equals(other.id))
//			return false;
//		if (idCompetenza == null) {
//			if (other.idCompetenza != null)
//				return false;
//		} else if (!idCompetenza.equals(other.idCompetenza))
//			return false;
//		if (idProfilo == null) {
//			if (other.idProfilo != null)
//				return false;
//		} else if (!idProfilo.equals(other.idProfilo))
//			return false;
//		if (livelloEQF != other.livelloEQF)
//			return false;
//		if (titolo == null) {
//			if (other.titolo != null)
//				return false;
//		} else if (!titolo.equals(other.titolo))
//			return false;
//		return true;
//	}

	

}
