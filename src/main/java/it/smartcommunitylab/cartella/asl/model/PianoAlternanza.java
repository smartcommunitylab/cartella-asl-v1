package it.smartcommunitylab.cartella.asl.model;

import java.util.Collections;
import java.util.List;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Index;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.OneToMany;
import javax.persistence.OrderColumn;
import javax.persistence.Table;
import javax.persistence.Transient;

import org.apache.commons.lang3.builder.ReflectionToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;

import com.google.common.collect.Lists;

@Entity
@Table(name = "piano_alternanza",
indexes = {
		@Index(name = "istitutoId_idx", columnList = "istitutoId", unique = false),
		@Index(name = "corsoDiStudioId_idx", columnList = "corsoDiStudioId", unique = false)
	}
) 
public class PianoAlternanza {

	@Id
	@GeneratedValue (strategy = GenerationType.IDENTITY)
	private Long id;	
	
	private String titolo;
	
	private long inizioValidita;
	private long fineValidita;
	
	private String corsoDiStudio;
	private String istituto;
	
	private String istitutoId;
	private String corsoDiStudioId;	
	
	private String annoScolasticoAttivazione; // 2017/2018
	private String annoScolasticoDisattivazione;
	
	private boolean attivo;
	
	@Column(columnDefinition="VARCHAR(1024)")
	private String note;
	
//	@OneToOne(fetch = FetchType.EAGER, cascade = { CascadeType.ALL})	
//	private PianoDiStudio pianoDiStudio;

	@OneToMany(fetch = FetchType.EAGER, cascade = { CascadeType.REMOVE, CascadeType.DETACH}, orphanRemoval = true)		
	@JoinColumn(name = "piano_alternanza_id", nullable = true)
	@OrderColumn(name="anno_alternanza_order")
	private List<AnnoAlternanza> anniAlternanza = Lists.newArrayList();
	
	@ManyToMany(fetch = FetchType.EAGER, cascade = { CascadeType.DETACH, CascadeType.MERGE, CascadeType.REMOVE})
	@JoinTable(name = "piano_alternanza_competenze")
	@OrderColumn(name="competenze_order")
	private List<Competenza> competenze = Lists.newArrayList();		
	
//	@ElementCollection(targetClass=Long.class, fetch = FetchType.EAGER)
//	private Set<Long> anniAlternanzaId = Lists.newArrayList();
	
	@Transient
	private boolean inUso;
	
	@Transient
	private int stato = -1;	
	
	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getTitolo() {
		return titolo;
	}

	public void setTitolo(String nome) {
		this.titolo = nome;
	}

	public long getInizioValidita() {
		return inizioValidita;
	}

	public void setInizioValidita(long inizioValidita) {
		this.inizioValidita = inizioValidita;
	}

	public long getFineValidita() {
		return fineValidita;
	}

	public void setFineValidita(long fineValidita) {
		this.fineValidita = fineValidita;
	}

//	@JsonIgnore
//	public PianoDiStudio getPianoDiStudio() {
//		return pianoDiStudio;
//	}
//
//	public void setPianoDiStudio(PianoDiStudio pianoDiStudio) {
//		this.pianoDiStudio = pianoDiStudio;
//	}
	
	public List<AnnoAlternanza> getAnniAlternanza() {
		return anniAlternanza;
	}

	public void setAnniAlternanza(List<AnnoAlternanza> anniAlternanza) {
		this.anniAlternanza = anniAlternanza;
	}


	public List<Competenza> getCompetenze() {
		return competenze;
	}

	public void setCompetenze(List<Competenza> competenze) {
		this.competenze = competenze;
		if (competenze != null) {
			Collections.sort(competenze);
		}
	}

	public void setCompetenzeFromSet(Set<Competenza> competenza) {
		this.competenze = Lists.newArrayList(competenza);
		Collections.sort(competenze);
	}		
	
	public String getCorsoDiStudio() {
		return corsoDiStudio;
	}

	public void setCorsoDiStudio(String corsoDiStudio) {
		this.corsoDiStudio = corsoDiStudio;
	}

	public String getIstituto() {
		return istituto;
	}

	public void setIstituto(String istituto) {
		this.istituto = istituto;
	}
	
	public String getIstitutoId() {
		return istitutoId;
	}

	public void setIstitutoId(String istitutoId) {
		this.istitutoId = istitutoId;
	}



	public String getCorsoDiStudioId() {
		return corsoDiStudioId;
	}

	public void setCorsoDiStudioId(String corsoDiStudioId) {
		this.corsoDiStudioId = corsoDiStudioId;
	}

	public String getAnnoScolasticoAttivazione() {
		return annoScolasticoAttivazione;
	}

	public void setAnnoScolasticoAttivazione(String annoScolasticoAttivazione) {
		this.annoScolasticoAttivazione = annoScolasticoAttivazione;
	}

	public String getAnnoScolasticoDisattivazione() {
		return annoScolasticoDisattivazione;
	}

	public void setAnnoScolasticoDisattivazione(String annoScolasticoDisattivazione) {
		this.annoScolasticoDisattivazione = annoScolasticoDisattivazione;
	}

	public boolean isAttivo() {
		return attivo;
	}

	public void setAttivo(boolean attivo) {
		this.attivo = attivo;
	}

	public String getNote() {
		return note;
	}

	public void setNote(String note) {
		this.note = note;
	}

	public boolean isInUso() {
		return inUso;
	}

	public void setInUso(boolean inUso) {
		this.inUso = inUso;
	}

	public int getStato() {
		return stato;
	}

	public void setStato(int stato) {
		this.stato = stato;
	}

	@Override
	public String toString() {
		return ReflectionToStringBuilder.toString(this, ToStringStyle.SHORT_PREFIX_STYLE);
	}


	
}
