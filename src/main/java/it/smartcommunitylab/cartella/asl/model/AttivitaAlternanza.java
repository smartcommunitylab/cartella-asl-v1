package it.smartcommunitylab.cartella.asl.model;

import java.util.Collections;
import java.util.List;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.ElementCollection;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Index;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.OrderColumn;
import javax.persistence.Table;
import javax.persistence.Transient;

import org.apache.commons.lang3.builder.ReflectionToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;

import com.google.common.collect.Lists;
import com.google.common.collect.Sets;

@Entity
@Table(name = "attivita_alternanza",
indexes = {
		@Index(name = "istitutoId_idx", columnList = "istitutoId", unique = false),
		@Index(name = "corsoId_idx", columnList = "corsoId", unique = false),
		@Index(name = "annoScolastico_idx", columnList = "annoScolastico", unique = false)
	}
) 
public class AttivitaAlternanza {
	
	public static enum GESTIONE_ECCEZIONE {
		RISOLTO_DA, RISOLVE
	}	

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	private String annoScolastico;

	private String titolo;

//	private String classe;
	private String istituto;
	private String corso;

	private int annoCorso;
	private int tipologia;
	private int ore;

	private boolean interna;
	private boolean individuale;

	private long dataInizio;
	private long dataFine;
	private String oraInizio;
	private String oraFine;
	
	private String istitutoId;
	private String corsoId;

	private boolean completata;
	
	@ElementCollection
	private List<String> tags = Lists.newArrayList();
	
//	@OneToMany(fetch = FetchType.EAGER, orphanRemoval = true)		
//	@JoinColumn(name = "ATTIVITA_ALTERNANZA_ID", nullable = true)
////	@OrderColumn(name="ANNO_ALTERNANZA_ORDER")
//	private Set<AnnoAlternanza> anniAlternanza = Sets.newHashSet();
	
	@ManyToMany(fetch = FetchType.EAGER, cascade = { CascadeType.DETACH, CascadeType.MERGE})
	@JoinTable(name = "attivita_alternanza_competenze")
	@OrderColumn(name="competenze_order")
	private List<Competenza> competenze = Lists.newArrayList();	
	
	@ManyToOne(optional = true, cascade = { CascadeType.ALL})	
	@JoinColumn(name = "referente_alternanza_id", nullable = true)
	private ReferenteAlternanza referenteAlternanza;	
	
	@ManyToOne(optional = true, cascade = { CascadeType.DETACH, CascadeType.MERGE})
	@JoinColumn(name = "opportunita_id", nullable = true, updatable = true, insertable = true)
//	@OrderColumn(name="OPPORTUNITA_ORDER")
	private Opportunita opportunita;
	
//	@OneToOne(fetch = FetchType.EAGER, cascade = { CascadeType.ALL})	
	@ManyToOne(optional = true, cascade = { CascadeType.DETACH, CascadeType.MERGE})
	@JoinColumn(name = "corso_interno_id", nullable = true, updatable = true, insertable = true)	
	private CorsoInterno corsoInterno;	
	
	@Transient
	private Set<Studente> studenti = Sets.newHashSet();		
	
	@ManyToOne(optional = true, cascade = { CascadeType.DETACH, CascadeType.MERGE})
	@JoinColumn(name = "anno_alternanza_id", nullable = true, updatable = true, insertable = true)
//	@OrderColumn(name="OPPORTUNITA_ORDER")
	private AnnoAlternanza annoAlternanza;	
	
	private GESTIONE_ECCEZIONE gestioneEccezione;
	private Long eccezioneAttivitaAlternanzaId;
	private String referenteScuola;
	private String referenteScuolaCF;
	
	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getAnnoScolastico() {
		return annoScolastico;
	}

	public void setAnnoScolastico(String annoScolastico) {
		this.annoScolastico = annoScolastico;
	}

	public String getTitolo() {
		return titolo;
	}

	public void setTitolo(String titolo) {
		this.titolo = titolo;
	}

//	public String getClasse() {
//		return classe;
//	}
//
//	public void setClasse(String classe) {
//		this.classe = classe;
//	}

	public String getIstituto() {
		return istituto;
	}

	public void setIstituto(String istituto) {
		this.istituto = istituto;
	}

	public int getAnnoCorso() {
		return annoCorso;
	}

	public void setAnnoCorso(int annoCorso) {
		this.annoCorso = annoCorso;
	}

	public int getTipologia() {
		return tipologia;
	}

	public void setTipologia(int tipologia) {
		this.tipologia = tipologia;
	}

	public int getOre() {
		return ore;
	}

	public void setOre(int ore) {
		this.ore = ore;
	}

	public boolean isInterna() {
		return interna;
	}

	public void setInterna(boolean interna) {
		this.interna = interna;
	}

	public boolean isIndividuale() {
		return individuale;
	}

	public void setIndividuale(boolean individuale) {
		this.individuale = individuale;
	}

	public long getDataInizio() {
		return dataInizio;
	}

	public void setDataInizio(long dataInizio) {
		this.dataInizio = dataInizio;
	}

	public long getDataFine() {
		return dataFine;
	}

	public void setDataFine(long dataFine) {
		this.dataFine = dataFine;
	}

	public String getOraInizio() {
		return oraInizio;
	}

	public void setOraInizio(String oraInizio) {
		this.oraInizio = oraInizio;
	}

	public String getOraFine() {
		return oraFine;
	}

	public void setOraFine(String oraFine) {
		this.oraFine = oraFine;
	}

	public String getReferenteScuola() {
		return referenteScuola;
	}

	public void setReferenteScuola(String referenteScuola) {
		this.referenteScuola = referenteScuola;
	}
	
	public String getReferenteScuolaCF() {
		return referenteScuolaCF;
	}

	public void setReferenteScuolaCF(String referenteScuolaCF) {
		this.referenteScuolaCF = referenteScuolaCF;
	}

	public List<Competenza> getCompetenze() {
		return competenze;
	}

	public void setCompetenze(List<Competenza> competenza) {
		this.competenze = competenza;
		if (competenze != null) {
			Collections.sort(competenze);
		}
	}

	public void setCompetenzeFromSet(Set<Competenza> competenza) {
		this.competenze = Lists.newArrayList(competenza);
		Collections.sort(competenze);
	}	
	
	public Opportunita getOpportunita() {
		return opportunita;
	}

	public void setOpportunita(Opportunita opportunita) {
		this.opportunita = opportunita;
	}

	public ReferenteAlternanza getReferenteAlternanza() {
		return referenteAlternanza;
	}

	public void setReferenteAlternanza(ReferenteAlternanza referenteAlternanza) {
		this.referenteAlternanza = referenteAlternanza;
	}

	public CorsoInterno getCorsoInterno() {
		return corsoInterno;
	}

	public void setCorsoInterno(CorsoInterno corsoInterno) {
		this.corsoInterno = corsoInterno;
	}

	public Set<Studente> getStudenti() {
		return studenti;
	}

	public void setStudenti(Set<Studente> studenti) {
		this.studenti = studenti;
	}

	public String getIstitutoId() {
		return istitutoId;
	}

	public String getCorso() {
		return corso;
	}

	public void setCorso(String corso) {
		this.corso = corso;
	}

	public void setIstitutoId(String istitutoId) {
		this.istitutoId = istitutoId;
	}

	public String getCorsoId() {
		return corsoId;
	}

	public void setCorsoId(String corsoId) {
		this.corsoId = corsoId;
	}

	public boolean isCompletata() {
		return completata;
	}

	public void setCompletata(boolean completata) {
		this.completata = completata;
	}

	public List<String> getTags() {
		return tags;
	}

	public void setTags(List<String> tags) {
		this.tags = tags;
	}

	public AnnoAlternanza getAnnoAlternanza() {
		return annoAlternanza;
	}

	public void setAnnoAlternanza(AnnoAlternanza annoAlternanza) {
		this.annoAlternanza = annoAlternanza;
	}
	
	public GESTIONE_ECCEZIONE getGestioneEccezione() {
		return gestioneEccezione;
	}

	public void setGestioneEccezione(GESTIONE_ECCEZIONE gestioneEccezione) {
		this.gestioneEccezione = gestioneEccezione;
	}

	public Long getEccezioneAttivitaAlternanzaId() {
		return eccezioneAttivitaAlternanzaId;
	}

	public void setEccezioneAttivitaAlternanzaId(Long eccezioneAttivitaAlternanzaId) {
		this.eccezioneAttivitaAlternanzaId = eccezioneAttivitaAlternanzaId;
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((id == null) ? 0 : id.hashCode());
		return result;
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		AttivitaAlternanza other = (AttivitaAlternanza) obj;
		if (id == null) {
			if (other.id != null)
				return false;
		} else if (!id.equals(other.id))
			return false;
		return true;
	}

	@Override
	public String toString() {
		return ReflectionToStringBuilder.toString(this, ToStringStyle.SHORT_PREFIX_STYLE);
	}
}
