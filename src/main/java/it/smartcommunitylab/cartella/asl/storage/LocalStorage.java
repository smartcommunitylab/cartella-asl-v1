package it.smartcommunitylab.cartella.asl.storage;

//@Component
//@Qualifier(value="localStorage")
public class LocalStorage { //implements Storage {

/*	@Value("${storage.local.dir}")
	private String storageDir;

	@Override
	public void save(MultipartFile data, String name, StoredFile storedFile) throws Exception {
		String fileName = data.getOriginalFilename();
		String ext = fileName.substring(fileName.lastIndexOf("."));		
		
		File file = new File(storageDir + "/" + name + ext);
		data.transferTo(file);	

		storedFile.setPath(file.getAbsolutePath());
		storedFile.setUrl("files/" + file.getName());
//		return "files/" + file.getName();
	}

	@Override
	public String getURL(StoredFile storedFile) throws Exception {
		return storedFile.getUrl();
//		return "files/" + path;
	}

	@Override
	public boolean delete(StoredFile storedFile) throws Exception {
		File f = new File(storedFile.getPath());
		return f.delete();
	}*/

}

