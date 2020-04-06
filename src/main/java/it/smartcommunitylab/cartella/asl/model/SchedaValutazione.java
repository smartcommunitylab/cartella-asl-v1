package it.smartcommunitylab.cartella.asl.model;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

import org.apache.commons.lang3.builder.ReflectionToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;

@Entity
@Table(name = "scheda_valutazione")
public class SchedaValutazione implements StoredFile {

	@Id
	private String id;

	private String name;
	private String url;
	private String type;
	
	private String tipoValutazione;

	// private String nome;
	// private String storageId;
	//
	// private Boolean documentPresent = Boolean.FALSE;
	// private String contentType;
	// private String filename;
	//
	// public String getId() {
	// return id;
	// }
	//
	// public void setId(String id) {
	// this.id = id;
	// }
	//
	// public String getNome() {
	// return nome;
	// }
	//
	// public void setNome(String nome) {
	// this.nome = nome;
	// }
	//
	// public String getStorageId() {
	// return storageId;
	// }
	//
	// public void setStorageId(String storageId) {
	// this.storageId = storageId;
	// }
	//
	// public Boolean getDocumentPresent() {
	// return documentPresent;
	// }
	//
	// public void setDocumentPresent(Boolean documentPresent) {
	// this.documentPresent = documentPresent;
	// }
	//
	// public String getContentType() {
	// return contentType;
	// }
	//
	// public void setContentType(String contentType) {
	// this.contentType = contentType;
	// }
	//
	// public String getFilename() {
	// return filename;
	// }
	//
	// public void setFilename(String filename) {
	// this.filename = filename;
	// }

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getUrl() {
		return url;
	}

	public void setUrl(String url) {
		this.url = url;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public String getTipoValutazione() {
		return tipoValutazione;
	}

	public void setTipoValutazione(String tipoValutazione) {
		this.tipoValutazione = tipoValutazione;
	}

	@Override
	public String toString() {
		return ReflectionToStringBuilder.toString(this, ToStringStyle.SHORT_PREFIX_STYLE);
	}

}
