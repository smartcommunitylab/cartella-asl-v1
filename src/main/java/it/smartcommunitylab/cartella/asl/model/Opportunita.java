package it.smartcommunitylab.cartella.asl.model;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import org.apache.commons.lang3.builder.ReflectionToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;

@Entity
// @Indexed
@Table(name = "oppcorsi")
public class Opportunita extends OppCorso {

	@Column(columnDefinition="VARCHAR(1024)")
	private String prerequisiti;

	private int postiDisponibili;
	private int postiRimanenti;

	private long dataInizio;
	private long dataFine;

	// @Spatial
	// private Point coordinate = new Point();

	// TODO?
	// private int tipo;

	@ManyToOne(optional = true, cascade = { CascadeType.PERSIST, CascadeType.MERGE })
	@JoinColumn(name = "azienda_id", nullable = true)
	private Azienda azienda;

	private String referente;
	private String referenteCF;

	public String getPrerequisiti() {
		return prerequisiti;
	}

	public void setPrerequisiti(String prerequisiti) {
		this.prerequisiti = prerequisiti;
	}

	public int getPostiDisponibili() {
		return postiDisponibili;
	}

	public void setPostiDisponibili(int postiDisponibili) {
		this.postiDisponibili = postiDisponibili;
	}

	public int getPostiRimanenti() {
		return postiRimanenti;
	}

	public void setPostiRimanenti(int postRimanenti) {
		this.postiRimanenti = postRimanenti;
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

	public Azienda getAzienda() {
		return azienda;
	}

	public void setAzienda(Azienda azienda) {
		this.azienda = azienda;
	}

	public Point getCoordinate() {
		// return coordinate;
		return new Point(latitude, longitude);
	}

	public void setCoordinate(Point coordinate) {
		// this.coordinate = coordinate;
		this.latitude = coordinate.getLatitude();
		this.longitude = coordinate.getLongitude();
	}

	public Double getLatitude() {
		return latitude;
	}

	public void setLatitude(Double latitude) {
		this.latitude = latitude;
	}

	public Double getLongitude() {
		return longitude;
	}

	public void setLongitude(Double longitude) {
		this.longitude = longitude;
	}

	public String getReferente() {
		return referente;
	}

	public void setReferente(String referente) {
		this.referente = referente;
	}

	public String getReferenteCF() {
		return referenteCF;
	}

	public void setReferenteCF(String referenteCF) {
		this.referenteCF = referenteCF;
	}

	@Override
	public String toString() {
		return ReflectionToStringBuilder.toString(this, ToStringStyle.SHORT_PREFIX_STYLE);
	}

}
