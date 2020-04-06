package it.smartcommunitylab.cartella.asl.model;

import java.util.Collections;
import java.util.List;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.OrderColumn;
import javax.persistence.Table;
import javax.persistence.Transient;

import com.google.common.collect.Lists;

@Entity
//@Indexed
@Table(name = "oppcorsi")
public abstract class OppCorso {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	protected Long id;

	protected String titolo;

//	@Column(columnDefinition = "TEXT")
	protected String descrizione;

	protected int tipologia;

	protected long dataInizio;
	protected long dataFine;
	private String oraInizio;
	private String oraFine;

	protected int ore;

	@Transient
	private boolean interna;

	@Transient
	private boolean individuale;

	@ManyToMany(fetch = FetchType.EAGER, cascade = { CascadeType.ALL })
	@JoinTable(name = "oppcorso_competenze")
	@OrderColumn(name = "competenze_order")
	protected List<Competenza> competenze = Lists.newArrayList();

	private String istituto;
	private String istitutoId;
	
	protected Double latitude;
	protected Double longitude;		

	public String getIstituto() {
		return istituto;
	}

	public void setIstituto(String istituto) {
		this.istituto = istituto;
	}

	public String getIstitutoId() {
		return istitutoId;
	}

	public void setIstitutoId(String istitutoId) {
		this.istitutoId = istitutoId;
	}

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

	public int getTipologia() {
		return tipologia;
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
	
	public String getOraInizio() {
		return oraInizio;
	}

	public void setOraInizio(String oraInizio) {
		this.oraInizio = oraInizio;
	}

	public String getOraFine() {
		return oraFine;
	}

	public void setOraFine(String oraFine) {
		this.oraFine = oraFine;
	}

	public void setTipologia(int tipologia) {
		this.tipologia = tipologia;
	}

	public List<Competenza> getCompetenze() {
		return competenze;
	}

	public void setCompetenze(List<Competenza> competenze) {
		this.competenze = competenze;
		if (competenze != null) {
			Collections.sort(competenze);
		}
	}

	public void setCompetenzeFromSet(Set<Competenza> competenza) {
		this.competenze = Lists.newArrayList(competenza);
		Collections.sort(competenze);
	}

	public int getOre() {
		return ore;
	}

	public void setOre(int ore) {
		this.ore = ore;
	}

	public boolean isInterna() {
		return interna;
	}

	public void setInterna(boolean interna) {
		this.interna = interna;
	}

	public boolean isIndividuale() {
		return individuale;
	}

	public void setIndividuale(boolean individuale) {
		this.individuale = individuale;
	}

	public abstract Point getCoordinate();

	public abstract void setCoordinate(Point coordinate);
	
	public abstract Double getLatitude();

	public abstract void setLatitude(Double latitude);

	public abstract Double getLongitude();

	public abstract void setLongitude(Double longitude);

}
