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
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.persistence.OrderColumn;
import javax.persistence.Table;

import org.apache.commons.lang3.builder.ReflectionToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import com.google.common.collect.Lists;
import com.google.common.collect.Sets;

@Entity
@Table(name = "esperienza_svolta")
@JsonInclude(Include.NON_NULL)
public class EsperienzaSvolta {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	private String nome;

	private int stato;

	@Column(columnDefinition = "TEXT")
	private String noteStudente;
	@Column(columnDefinition = "TEXT")
	private String noteAzienda;

	private boolean terminata;

	private boolean completata;

	@ManyToOne(optional = true, cascade = { CascadeType.ALL })
	@JoinColumn(name = "attivita_alternanza_id", nullable = true, updatable = true)
	private AttivitaAlternanza attivitaAlternanza;

	@ManyToOne(optional = true, cascade = { CascadeType.DETACH, CascadeType.MERGE, CascadeType.PERSIST })
	@JoinColumn(name = "studente_id", nullable = true, updatable = true)
	private Studente studente;

	@ManyToMany(fetch = FetchType.EAGER, cascade = { CascadeType.DETACH, CascadeType.MERGE, CascadeType.REMOVE })
	@JoinTable(name = "esperienza_svolta_competenze")
	@OrderColumn(name = "competenze_order")
	private List<Competenza> competenze = Lists.newArrayList();

	@OneToMany()
	// @Fetch(value = FetchMode.SUBSELECT)
	@JoinColumn(name = "esperienza_svolta_id", nullable = true)
	private Set<Documento> documenti = Sets.newHashSet();

	@OneToOne(cascade = { CascadeType.ALL })
	private Presenze presenze = new Presenze();

	@OneToOne(cascade = { CascadeType.ALL }, orphanRemoval = true)
	private SchedaValutazione schedaValutazioneStudente;

	@OneToOne(cascade = { CascadeType.ALL }, orphanRemoval = true)
	private SchedaValutazione schedaValutazioneAzienda;

	@OneToOne(cascade = { CascadeType.ALL })
	private ReportValutazione reportValutazione;

	private String teachingUnitId;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getNome() {
		return nome;
	}

	public void setNome(String nome) {
		this.nome = nome;
	}

	public int getStato() {
		return stato;
	}

	public void setStato(int stato) {
		this.stato = stato;
	}

	public String getNoteStudente() {
		return noteStudente;
	}

	public void setNoteStudente(String note) {
		this.noteStudente = note;
	}

	public String getNoteAzienda() {
		return noteAzienda;
	}

	public void setNoteAzienda(String noteAzienda) {
		this.noteAzienda = noteAzienda;
	}

	public AttivitaAlternanza getAttivitaAlternanza() {
		return attivitaAlternanza;
	}

	public void setAttivitaAlternanza(AttivitaAlternanza attivitaAlternanza) {
		this.attivitaAlternanza = attivitaAlternanza;
	}

	public Studente getStudente() {
		return studente;
	}

	public void setStudente(Studente studente) {
		this.studente = studente;
	}

	public Set<Documento> getDocumenti() {
		return documenti;
	}

	public void setDocumenti(Set<Documento> documenti) {
		this.documenti = documenti;
	}

	public Presenze getPresenze() {
		return presenze;
	}

	public void setPresenze(Presenze presenzeCorsoInterno) {
		this.presenze = presenzeCorsoInterno;
	}

	public SchedaValutazione getSchedaValutazioneStudente() {
		return schedaValutazioneStudente;
	}

	public void setSchedaValutazioneStudente(SchedaValutazione schedaValutazioneStudente) {
		this.schedaValutazioneStudente = schedaValutazioneStudente;
	}

	public SchedaValutazione getSchedaValutazioneAzienda() {
		return schedaValutazioneAzienda;
	}

	public void setSchedaValutazioneAzienda(SchedaValutazione schedaValutazioneAzienda) {
		this.schedaValutazioneAzienda = schedaValutazioneAzienda;
	}

	public ReportValutazione getReportValutazione() {
		return reportValutazione;
	}

	public void setReportValutazione(ReportValutazione reportValutazione) {
		this.reportValutazione = reportValutazione;
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

	public boolean isTerminata() {
		return terminata;
	}

	public void setTerminata(boolean terminata) {
		this.terminata = terminata;
	}

	public boolean isCompletata() {
		return completata;
	}

	public void setCompletata(boolean completata) {
		this.completata = completata;
	}

	public String getTeachingUnitId() {
		return teachingUnitId;
	}

	public void setTeachingUnitId(String teachingUnitId) {
		this.teachingUnitId = teachingUnitId;
	}

	@Override
	public String toString() {
		return ReflectionToStringBuilder.toString(this, ToStringStyle.SHORT_PREFIX_STYLE);
	}

}
