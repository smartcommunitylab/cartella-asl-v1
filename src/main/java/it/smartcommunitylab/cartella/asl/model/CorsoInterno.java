package it.smartcommunitylab.cartella.asl.model;

import javax.persistence.Entity;
import javax.persistence.Table;

import org.apache.commons.lang3.builder.ReflectionToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;

@Entity
// @Indexed
@Table(name = "oppcorsi")
public class CorsoInterno extends OppCorso {

	private String corso;
	private String corsoId;
	private String annoScolastico;
	private String referenteFormazione;
	private String referenteFormazioneCF;
	private String formatore;
	private String formatoreCF;
	private String coordinatore;
	private String coordinatoreCF;

	public String getCorso() {
		return corso;
	}

	public void setCorso(String corso) {
		this.corso = corso;
	}

	public String getCorsoId() {
		return corsoId;
	}

	public void setCorsoId(String corsoId) {
		this.corsoId = corsoId;
	}

	public String getAnnoScolastico() {
		return annoScolastico;
	}

	public void setAnnoScolastico(String annoScolastico) {
		this.annoScolastico = annoScolastico;
	}

	public String getReferenteFormazione() {
		return referenteFormazione;
	}

	public void setReferenteFormazione(String referenteFormazione) {
		this.referenteFormazione = referenteFormazione;
	}

	public String getFormatore() {
		return formatore;
	}

	public void setFormatore(String formatore) {
		this.formatore = formatore;
	}

	public String getCoordinatore() {
		return coordinatore;
	}

	public void setCoordinatore(String coordinatore) {
		this.coordinatore = coordinatore;
	}

	public Point getCoordinate() {
		return new Point(latitude, longitude);
	}

	public void setCoordinate(Point coordinate) {
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

	public String getReferenteFormazioneCF() {
		return referenteFormazioneCF;
	}

	public void setReferenteFormazioneCF(String referenteFormazioneCF) {
		this.referenteFormazioneCF = referenteFormazioneCF;
	}

	public String getFormatoreCF() {
		return formatoreCF;
	}

	public void setFormatoreCF(String formatoreCF) {
		this.formatoreCF = formatoreCF;
	}

	public String getCoordinatoreCF() {
		return coordinatoreCF;
	}

	public void setCoordinatoreCF(String coordinatoreCF) {
		this.coordinatoreCF = coordinatoreCF;
	}

	@Override
	public String toString() {
		return ReflectionToStringBuilder.toString(this, ToStringStyle.SHORT_PREFIX_STYLE);
	}

}
