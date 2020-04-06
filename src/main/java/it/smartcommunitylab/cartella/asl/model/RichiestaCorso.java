package it.smartcommunitylab.cartella.asl.model;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import org.apache.commons.lang3.builder.ReflectionToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;

@Entity
@Table(name = "richiesta_corso")
public class RichiestaCorso {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	private String titolo;
	private String descrizione;
	private String tipo;
	private String periodoIndicativo;
	private String richiedente;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getTitolo() {
		return titolo;
	}

	public void setTitolo(String titolo) {
		this.titolo = titolo;
	}

	public String getDescrizione() {
		return descrizione;
	}

	public void setDescrizione(String descrizione) {
		this.descrizione = descrizione;
	}

	public String getTipo() {
		return tipo;
	}

	public void setTipo(String tipo) {
		this.tipo = tipo;
	}

	public String getPeriodoIndicativo() {
		return periodoIndicativo;
	}

	public void setPeriodoIndicativo(String periodoIndicativo) {
		this.periodoIndicativo = periodoIndicativo;
	}

	public String getRichiedente() {
		return richiedente;
	}

	public void setRichiedente(String richiedente) {
		this.richiedente = richiedente;
	}

	@Override
	public String toString() {
		return ReflectionToStringBuilder.toString(this, ToStringStyle.SHORT_PREFIX_STYLE);
	}

}
