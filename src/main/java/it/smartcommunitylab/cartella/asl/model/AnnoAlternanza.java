package it.smartcommunitylab.cartella.asl.model;

import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import org.apache.commons.lang3.builder.ReflectionToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;

import com.google.common.collect.Sets;

@Entity
@Table(name = "anno_alternanza")
public class AnnoAlternanza implements Comparable<AnnoAlternanza> {

	@Id
	@GeneratedValue (strategy = GenerationType.IDENTITY)
	private Long id;

	private String nome;
	
	private int annoCorso;
	
	private int oreTotali;
	
//	@OneToMany(fetch = FetchType.EAGER, cascade = { CascadeType.ALL}, orphanRemoval = true)		
//	@JoinColumn(name = "ANNO_ALTERNANZA_ID", nullable = true)
//	@OrderColumn(name="TIPOLOGIA_ATTIVITA_ORDER")
	
//	@ManyToMany(fetch = FetchType.EAGER, cascade = { CascadeType.ALL})
//	@JoinTable(name = "ANNO_ALTERNANZA_TIPOLOGIA_ATTIVITA")
	@OneToMany(fetch = FetchType.EAGER, cascade = { CascadeType.PERSIST, CascadeType.MERGE}, orphanRemoval = true)
//	@Fetch(value = FetchMode.SUBSELECT)
	@JoinColumn(name = "anno_alternanza_tipologia_attivita")	
	private Set<TipologiaAttivita> tipologieAttivita = Sets.newHashSet();
	
//	@OneToMany(fetch = FetchType.EAGER, cascade = { CascadeType.ALL}, orphanRemoval = true)		
//	@JoinColumn(name = "ANNO_ALTERNANZA_ID", nullable = true)
////	@OrderColumn(name="TIPOLOGIA_ATTIVITA_ORDER")
//	private Set<AttivitaAlternanza> attivitaAlternanza = Sets.newHashSet();	
	
	
//	@ManyToMany(fetch = FetchType.EAGER, cascade = { CascadeType.DETACH, CascadeType.MERGE, CascadeType.REMOVE})
//	@JoinTable(name = "ANNO_ALTERNANZA_COMPETENZE")	
//	private Set<Competenza> competenze = Sets.newHashSet();
	
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
	
	public int getAnnoCorso() {
		return annoCorso;
	}

	public void setAnnoCorso(int annoCorso) {
		this.annoCorso = annoCorso;
	}

	public int getOreTotali() {
		return oreTotali;
	}

	public void setOreTotali(int oreTotali) {
		this.oreTotali = oreTotali;
	}

	public Set<TipologiaAttivita> getTipologieAttivita() {
		return tipologieAttivita;
	}

	public void setTipologieAttivita(Set<TipologiaAttivita> tipologiaAttivita) {
		this.tipologieAttivita = tipologiaAttivita;
	}

//	public Set<AttivitaAlternanza> getAttivitaAlternanza() {
//		return attivitaAlternanza;
//	}
//
//	public void setAttivitaAlternanza(Set<AttivitaAlternanza> attivitaAlternanza) {
//		this.attivitaAlternanza = attivitaAlternanza;
//	}

//	public Set<Competenza> getCompetenze() {
//		return competenze;
//	}
//
//	public void setCompetenze(Set<Competenza> competenza) {
//		this.competenze = competenza;
//	}

	@Override
	public String toString() {
		return ReflectionToStringBuilder.toString(this, ToStringStyle.SHORT_PREFIX_STYLE);
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((id == null) ? 0 : id.hashCode());
		result = prime * result + ((nome == null) ? 0 : nome.hashCode());
		result = prime * result + oreTotali;
		result = prime * result + ((tipologieAttivita == null) ? 0 : tipologieAttivita.hashCode());
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
		AnnoAlternanza other = (AnnoAlternanza) obj;
		if (id == null) {
			if (other.id != null)
				return false;
		} else if (!id.equals(other.id))
			return false;
		if (nome == null) {
			if (other.nome != null)
				return false;
		} else if (!nome.equals(other.nome))
			return false;
		if (oreTotali != other.oreTotali)
			return false;
		if (tipologieAttivita == null) {
			if (other.tipologieAttivita != null)
				return false;
		} else if (!tipologieAttivita.equals(other.tipologieAttivita))
			return false;
		return true;
	}

	@Override
	public int compareTo(AnnoAlternanza o) {
		return annoCorso - o.annoCorso;
	}		
	
	
}
