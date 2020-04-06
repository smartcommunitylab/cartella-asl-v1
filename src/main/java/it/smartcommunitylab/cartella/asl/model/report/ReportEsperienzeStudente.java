package it.smartcommunitylab.cartella.asl.model.report;

import org.apache.commons.lang3.builder.ReflectionToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;

public class ReportEsperienzeStudente {

	private String titolo;
	private int stato;
	private long dataInizio;
	private long dataFine;
	private int tipologia;
	
	private long esperienzaId;

	public String getTitolo() {
		return titolo;
	}

	public void setTitolo(String titolo) {
		this.titolo = titolo;
	}

	public int getStato() {
		return stato;
	}

	public void setStato(int stato) {
		this.stato = stato;
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

	public int getTipologia() {
		return tipologia;
	}

	public void setTipologia(int tipologia) {
		this.tipologia = tipologia;
	}

	
	
	public long getEsperienzaId() {
		return esperienzaId;
	}

	public void setEsperienzaId(long esperienzaId) {
		this.esperienzaId = esperienzaId;
	}

	@Override
	public String toString() {
		return ReflectionToStringBuilder.toString(this, ToStringStyle.SHORT_PREFIX_STYLE);
	}	
	
}
