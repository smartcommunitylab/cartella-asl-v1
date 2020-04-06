package it.smartcommunitylab.cartella.asl.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import org.apache.commons.lang3.builder.ReflectionToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;

@Entity
@Table(name = "presenze_giornaliere")
public class PresenzaGiornaliera implements Comparable<PresenzaGiornaliera> {

	@Id
	@GeneratedValue (strategy = GenerationType.IDENTITY)
	private Long id;
	
//	@Temporal(TemporalType.DATE)
	private String data;
	
	@Column(columnDefinition="VARCHAR(1024)")
	private String attivitaSvolta;
	
	private Boolean verificata;
//	private Boolean presente;
	
	private int oreSvolte;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getData() {
		return data;
	}

	public void setData(String data) {
		this.data = data;
	}

	public String getAttivitaSvolta() {
		return attivitaSvolta;
	}

	public void setAttivitaSvolta(String attivitaSvolta) {
		this.attivitaSvolta = attivitaSvolta;
	}

	public Boolean getVerificata() {
		return verificata;
	}

	public void setVerificata(Boolean verificata) {
		this.verificata = verificata;
	}

//	public Boolean getPresente() {
//		return presente;
//	}
//
//	public void setPresente(Boolean presente) {
//		this.presente = presente;
//	}
	
	public int getOreSvolte() {
		return oreSvolte;
	}

	public void setOreSvolte(int oreSvolte) {
		this.oreSvolte = oreSvolte;
	}

//	@Override
//	public int hashCode() {
//		final int prime = 31;
//		int result = 1;
//		result = prime * result + ((data == null) ? 0 : data.hashCode());
//		result = prime * result + ((id == null) ? 0 : id.hashCode());
//		result = prime * result + oreSvolte;
//		return result;
//	}
//
//	@Override
//	public boolean equals(Object obj) {
//		if (this == obj)
//			return true;
//		if (obj == null)
//			return false;
//		if (getClass() != obj.getClass())
//			return false;
//		PresenzaGiornaliera other = (PresenzaGiornaliera) obj;
//		if (data == null) {
//			if (other.data != null)
//				return false;
//		} else if (!data.equals(other.data))
//			return false;
//		if (id == null) {
//			if (other.id != null)
//				return false;
//		} else if (!id.equals(other.id))
//			return false;
//		if (oreSvolte != other.oreSvolte)
//			return false;
//		return true;
//	}

	
	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((data == null) ? 0 : data.hashCode());
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
		PresenzaGiornaliera other = (PresenzaGiornaliera) obj;
		if (data == null) {
			if (other.data != null)
				return false;
		} else if (!data.equals(other.data))
			return false;
		return true;
	}

	@Override
	public int compareTo(PresenzaGiornaliera o) {
		return data.compareTo(o.data);
	}		
	
	
	@Override
	public String toString() {
		return ReflectionToStringBuilder.toString(this, ToStringStyle.SHORT_PREFIX_STYLE);
	}	
		
	
}
