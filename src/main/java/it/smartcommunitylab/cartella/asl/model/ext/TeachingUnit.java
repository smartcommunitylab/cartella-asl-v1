package it.smartcommunitylab.cartella.asl.model.ext;

public class TeachingUnit {
	private String id;
	private String extId;
	private String origin;
	private String name;
	private String description;
	private String cf;
	private String address;
	private String phone;
	private String email;
	private String pec;
	private Double[] geocode;
	private String instituteId;
	private String codiceIstat;
	private String codiceMiur;

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
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

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getCf() {
		return cf;
	}

	public void setCf(String cf) {
		this.cf = cf;
	}

	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	public String getPhone() {
		return phone;
	}

	public void setPhone(String phone) {
		this.phone = phone;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getPec() {
		return pec;
	}

	public void setPec(String pec) {
		this.pec = pec;
	}

	public Double[] getGeocode() {
		return geocode;
	}

	public void setGeocode(Double[] geocode) {
		this.geocode = geocode;
	}
	
	public String getInstituteId() {
		return instituteId;
	}

	public void setInstituteId(String instituteId) {
		this.instituteId = instituteId;
	}

	public String getCodiceIstat() {
		return codiceIstat;
	}

	public void setCodiceIstat(String codiceIstat) {
		this.codiceIstat = codiceIstat;
	}

	public String getCodiceMiur() {
		return codiceMiur;
	}

	public void setCodiceMiur(String codiceMiur) {
		this.codiceMiur = codiceMiur;
	}

}
