package it.smartcommunitylab.cartella.asl.model;

import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.persistence.Table;

import org.apache.commons.lang3.builder.ReflectionToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;

import com.google.common.collect.Lists;

@Entity
// @Indexed
@Table(name = "azienda")
public class Azienda {

	@Id
	private String id;

	@Column(columnDefinition = "VARCHAR(1024)")
	private String nome;

	@OneToOne(fetch = FetchType.EAGER, cascade = { CascadeType.ALL })
	private Convenzione convenzione;

	@OneToMany(fetch = FetchType.EAGER, cascade = { CascadeType.PERSIST, CascadeType.MERGE }, orphanRemoval = true)
	@JoinColumn(name = "azienda_id", nullable = false)
	private List<ReferenteAzienda> referentiAzienda = Lists.newArrayList();

	private String extId;
	private String origin;
	@Column(columnDefinition = "VARCHAR(1024)")
	private String address;
	@Column(columnDefinition = "VARCHAR(1024)")
	private String description;
	private String email;
	private String geocode;
	private String partita_iva;
	private String pec;
	private String phone;
	@Column(columnDefinition = "VARCHAR(1024)")
	private String businessName;

	@Column(columnDefinition = "BLOB")
	private String[] atecoCode;
	@Column(columnDefinition = "BLOB")
	private String[] atecoDesc;

	// @Spatial
	// private Point coordinate = new Point();

	private Double latitude;
	private Double longitude;
	private int idTipoAzienda;

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getNome() {
		return nome;
	}

	public void setNome(String nome) {
		this.nome = nome;
	}

	public Convenzione getConvenzione() {
		return convenzione;
	}

	public void setConvenzione(Convenzione convenzione) {
		this.convenzione = convenzione;
	}

	public List<ReferenteAzienda> getReferentiAzienda() {
		return referentiAzienda;
	}

	public void setReferentiAzienda(List<ReferenteAzienda> referentiAzienda) {
		this.referentiAzienda = referentiAzienda;
	}

	public String getExtId() {
		return extId;
	}

	public void setExtId(String extId) {
		this.extId = extId;
	}

	public String getOrigin() {
		return origin;
	}

	public void setOrigin(String origin) {
		this.origin = origin;
	}

	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getGeocode() {
		return geocode;
	}

	public void setGeocode(String geocode) {
		this.geocode = geocode;
	}

	public String getPartita_iva() {
		return partita_iva;
	}

	public void setPartita_iva(String partita_iva) {
		this.partita_iva = partita_iva;
	}

	public String getPec() {
		return pec;
	}

	public void setPec(String pec) {
		this.pec = pec;
	}

	public String getPhone() {
		return phone;
	}

	public void setPhone(String phone) {
		this.phone = phone;
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

	@Override
	public String toString() {
		return ReflectionToStringBuilder.toString(this, ToStringStyle.SHORT_PREFIX_STYLE);
	}

	public String getBusinessName() {
		return businessName;
	}

	public void setBusinessName(String businessName) {
		this.businessName = businessName;
	}

	public String[] getAtecoCode() {
		return atecoCode;
	}

	public void setAtecoCode(String[] atecoCode) {
		this.atecoCode = atecoCode;
	}

	public String[] getAtecoDesc() {
		return atecoDesc;
	}

	public void setAtecoDesc(String[] atecoDesc) {
		this.atecoDesc = atecoDesc;
	}

	public int getIdTipoAzienda() {
		return idTipoAzienda;
	}

	public void setIdTipoAzienda(int idTipoAzienda) {
		this.idTipoAzienda = idTipoAzienda;
	}

}
