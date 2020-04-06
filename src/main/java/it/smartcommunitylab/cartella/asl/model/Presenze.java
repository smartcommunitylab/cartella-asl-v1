package it.smartcommunitylab.cartella.asl.model;

import java.util.SortedSet;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToMany;
import javax.persistence.OrderBy;
import javax.persistence.Table;
import javax.persistence.Transient;

import org.apache.commons.lang3.builder.ReflectionToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;

import com.google.common.collect.Sets;

@Entity
@Table(name = "presenze")
public class Presenze {

	@Id
	@GeneratedValue (strategy = GenerationType.IDENTITY)
	private Long id;

	@Transient
	private String studenteId;
	
	@Transient
	private String classe;
	
	@Transient
	private String nome;
	
	@Transient
	private Long esperienzaSvoltaId;
	
	@Transient
	private int oreSvolte;
	
	@Transient
	private boolean completato;
	
	@OneToMany(fetch = FetchType.EAGER, cascade = { CascadeType.ALL}, orphanRemoval = true)		
	@JoinColumn(name = "presenze_id", nullable = true)
	@OrderBy("data ASC")
	private SortedSet<PresenzaGiornaliera> giornate = Sets.newTreeSet();
	
	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getStudenteId() {
		return studenteId;
	}

	public void setStudenteId(String studenteId) {
		this.studenteId = studenteId;
	}

	public String getClasse() {
		return classe;
	}

	public void setClasse(String classe) {
		this.classe = classe;
	}

	public String getNome() {
		return nome;
	}

	public void setNome(String nome) {
		this.nome = nome;
	}

	public Long getEsperienzaSvoltaId() {
		return esperienzaSvoltaId;
	}

	public void setEsperienzaSvoltaId(Long esperienzaSvoltaId) {
		this.esperienzaSvoltaId = esperienzaSvoltaId;
	}

	public SortedSet<PresenzaGiornaliera> getGiornate() {
		return giornate;
	}

	public void setGiornate(SortedSet<PresenzaGiornaliera> giornate) {
		this.giornate = giornate;
	}

	public int getOreSvolte() {
		return oreSvolte;
	}

	public void setOreSvolte(int oreSvolte) {
		this.oreSvolte = oreSvolte;
	}
	
	public void computeOreSvolte() {
		oreSvolte = 0;
		for (PresenzaGiornaliera pg: giornate) {
			if (pg.getVerificata() != null && pg.getVerificata() == true) {
				oreSvolte += pg.getOreSvolte();
			}
		}
	}
	
	public boolean isCompletato() {
		return completato;
	}

	public void setCompletato(boolean completato) {
		this.completato = completato;
	}

	@Override
	public String toString() {
		return ReflectionToStringBuilder.toString(this, ToStringStyle.SHORT_PREFIX_STYLE);
	}		
	
	
}
