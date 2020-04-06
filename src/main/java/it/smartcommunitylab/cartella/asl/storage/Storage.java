package it.smartcommunitylab.cartella.asl.storage;

import org.springframework.web.multipart.MultipartFile;

import it.smartcommunitylab.cartella.asl.model.StoredFile;

public interface Storage {

	public void save(MultipartFile data, String name, StoredFile storedFile) throws Exception;
	public String getURL(StoredFile storedFile) throws Exception;
	public boolean delete(StoredFile storedFile) throws Exception;
	
}
