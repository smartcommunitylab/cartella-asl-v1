package it.smartcommunitylab.cartella.asl.model;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import org.apache.commons.lang3.builder.ReflectionToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;

@Entity
@Table(name = "tipologia_attivita")
public class TipologiaAttivita implements Comparable<TipologiaAttivita> {

	@Id
	@GeneratedValue (strategy = GenerationType.IDENTITY)
	private Long id;

	private String titolo;
	
	private int tipologia;
	
	private int preventivoOre ;

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

	public int getTipologia() {
		return tipologia;
	}

	public void setTipologia(int tipologia) {
		this.tipologia = tipologia;
	}

	public int getPreventivoOre() {
		return preventivoOre;
	}

	public void setPreventivoOre(int preventivoOre) {
		this.preventivoOre = preventivoOre;
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((id == null) ? 0 : id.hashCode());
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
		TipologiaAttivita other = (TipologiaAttivita) obj;
		if (id == null) {
			if (other.id != null)
				return false;
		} else if (!id.equals(other.id))
			return false;
		return true;
	}

	@Override
	public int compareTo(TipologiaAttivita o) {
		return Long.compare(id, o.id);
	}			

	@Override
	public String toString() {
		return ReflectionToStringBuilder.toString(this, ToStringStyle.SHORT_PREFIX_STYLE);
	}

	
	
}
