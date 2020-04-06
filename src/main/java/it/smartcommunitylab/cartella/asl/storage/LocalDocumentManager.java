package it.smartcommunitylab.cartella.asl.storage;

import java.io.File;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.security.InvalidAlgorithmParameterException;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.util.UUID;

import javax.annotation.PostConstruct;
import javax.crypto.BadPaddingException;
import javax.crypto.Cipher;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import javax.servlet.http.HttpServletRequest;

import org.apache.commons.codec.binary.Base64;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import it.smartcommunitylab.cartella.asl.exception.ASLCustomException;
import it.smartcommunitylab.cartella.asl.exception.BadRequestException;
import it.smartcommunitylab.cartella.asl.manager.QueriesManager;
import it.smartcommunitylab.cartella.asl.model.Documento;
import it.smartcommunitylab.cartella.asl.model.EsperienzaSvolta;
import it.smartcommunitylab.cartella.asl.model.SchedaValutazione;
import it.smartcommunitylab.cartella.asl.model.StoredFile;
import it.smartcommunitylab.cartella.asl.repository.DocumentoRepository;
import it.smartcommunitylab.cartella.asl.repository.EsperienzaSvoltaRepository;
import it.smartcommunitylab.cartella.asl.repository.SchedaValutazioneRepository;
import it.smartcommunitylab.cartella.asl.util.ErrorLabelManager;

@Component
public class LocalDocumentManager {
	private static final transient Logger logger = LoggerFactory.getLogger(LocalDocumentManager.class);

	@Autowired
	@Value("${storage.s3.docUrlExpiration}")
	private Long docUrlExpiration;

	@Value("${storage.local.dir}")
	private String storageDir;	

	@Value("${server.contextPath}")
	private String contextPath;
	
	@Value("${encrypt.key}")
	private String encryptKey;	
	
	private static final String DOWNLOAD = "download/file?key=";
	
	@Autowired
	private EsperienzaSvoltaRepository espRepo;

	@Autowired
	private DocumentoRepository docRepo;	

	@Autowired
	private SchedaValutazioneRepository svRepo;
	
	
	@Autowired
	private QueriesManager aslManager;
	
	@Autowired
	private ErrorLabelManager errorLabelManager;
	
    private IvParameterSpec ivParameterSpec;
    private SecretKeySpec secretKeySpec;
    private Cipher cipher;
	
	@PostConstruct
	public void init() throws Exception {
        ivParameterSpec = new IvParameterSpec(encryptKey.getBytes("UTF-8"));
        secretKeySpec = new SecretKeySpec(encryptKey.getBytes("UTF-8"), "AES");
        cipher = Cipher.getInstance("AES/CBC/PKCS5PADDING");		
	}
	
	public EsperienzaSvolta addSchedaAzienda(Long espId, MultipartFile file, HttpServletRequest request) throws Exception {

		EsperienzaSvolta esp = espRepo.findOne(espId);

		if (esp == null) {
			throw new BadRequestException(errorLabelManager.get("esp.error.notfound"));
		}

		SchedaValutazione scheda = esp.getSchedaValutazioneAzienda();

		if (scheda == null) {
			scheda = new SchedaValutazione();
			scheda.setId(UUID.randomUUID().toString());
		}

		scheda.setName(file.getOriginalFilename());
		scheda.setTipoValutazione("Azienda");
		scheda.setType(file.getContentType());
		scheda.setUrl(extractAddress(request) + DOWNLOAD + URLEncoder.encode(encode(scheda, scheda.getId()), "UTF-8"));

		File f = saveFile(file, scheda.getId());

		esp.setSchedaValutazioneAzienda(scheda);
		espRepo.save(esp);

		if (logger.isInfoEnabled()) {
			logger.info(String.format("addedFileToEsperienzaSvolta: %s", espId));
		}

		return esp;
	}

	public SchedaValutazione getSchedaAzienda(Long espId, HttpServletRequest request) throws Exception {

		EsperienzaSvolta esp = espRepo.findOne(espId);

		if (esp == null) {
			throw new BadRequestException(errorLabelManager.get("esp.error.notfound"));
		}

		SchedaValutazione scheda = esp.getSchedaValutazioneAzienda();
		if (scheda != null) {
			scheda.setUrl(extractAddress(request) + DOWNLOAD + URLEncoder.encode(encode(scheda, scheda.getId()), "UTF-8"));
			return scheda;
		}

		return null;

	}

	public Boolean removeSchedaAzienda(Long espId) throws Exception {

		EsperienzaSvolta esp = espRepo.findOne(espId);

		if (esp == null) {
			throw new BadRequestException(errorLabelManager.get("esp.error.notfound"));
		}

		SchedaValutazione scheda = esp.getSchedaValutazioneAzienda();
		if (scheda != null) {
			deleteFile(scheda.getId());
			esp.setSchedaValutazioneAzienda(null);
			espRepo.save(esp);
			return true;
		}

		return false;
	}

	public EsperienzaSvolta addSchedaStudente(Long espId, MultipartFile file, HttpServletRequest request) throws Exception {
		EsperienzaSvolta esp = espRepo.findOne(espId);

		if (esp == null) {
			throw new BadRequestException(errorLabelManager.get("esp.error.notfound"));
		}

		SchedaValutazione scheda = esp.getSchedaValutazioneStudente();

		if (scheda == null) {
			scheda = new SchedaValutazione();
			scheda.setId(UUID.randomUUID().toString());
		}

		scheda.setTipoValutazione("Studente");
		scheda.setName(file.getOriginalFilename());
		scheda.setType(file.getContentType());
		scheda.setUrl(extractAddress(request) + DOWNLOAD + URLEncoder.encode(encode(scheda, scheda.getId()), "UTF-8"));

		File f = saveFile(file, scheda.getId());

		esp.setSchedaValutazioneStudente(scheda);
		espRepo.save(esp);

		if (logger.isInfoEnabled()) {
			logger.info(String.format("addedFileToEsperienzaSvolta: %s", espId));
		}

		return esp;
	}

	public SchedaValutazione getSchedaStudente(Long espId, HttpServletRequest request) throws Exception {

		EsperienzaSvolta esp = espRepo.findOne(espId);

		if (esp == null) {
			throw new BadRequestException(errorLabelManager.get("esp.error.notfound"));
		}

		SchedaValutazione scheda = esp.getSchedaValutazioneStudente();
		if (scheda != null) {
			scheda.setUrl(extractAddress(request) + DOWNLOAD + URLEncoder.encode(encode(scheda, scheda.getId()), "UTF-8"));
			return scheda;
		}

		return null;

	}

	public Boolean removeSchedaStudente(Long espId) throws Exception {

		EsperienzaSvolta esp = espRepo.findOne(espId);

		if (esp == null) {
			throw new BadRequestException(errorLabelManager.get("esp.error.notfound"));
		}

		SchedaValutazione scheda = esp.getSchedaValutazioneStudente();
		if (scheda != null) {
			deleteFile(scheda.getId());
			esp.setSchedaValutazioneStudente(null);
			espRepo.save(esp);
			return true;
		}

		return false;
	}

	public Documento addDocument(String name, Long experienceId, MultipartFile data, HttpServletRequest request) throws Exception {
		EsperienzaSvolta es = espRepo.findOne(experienceId);
		if (es == null) {
			throw new BadRequestException(errorLabelManager.get("esp.error.notfound"));
		}
		Documento doc = new Documento();
		doc.setDocumentName(name);
		doc.setId(UUID.randomUUID().toString());
		if (data != null) {
			doc.setDocumentPresent(Boolean.TRUE);
			doc.setType(data.getContentType());
			doc.setName(data.getOriginalFilename());
			doc.setUrl(extractAddress(request) + DOWNLOAD + URLEncoder.encode(encode(doc, doc.getId()), "UTF-8"));
			File f = saveFile(data, doc.getId());
		} else {
			doc.setDocumentPresent(Boolean.FALSE);
		}
		
		aslManager.saveDocumento(doc);
		es.getDocumenti().add(doc);
		aslManager.saveEsperienzaSvolta(es);
		return doc;
	}

	public Documento updateDocument(String documentoId, String nome, MultipartFile data, HttpServletRequest request) throws Exception {

		Documento doc = aslManager.getDocumento(documentoId);

		if (doc == null) {
			throw new BadRequestException(errorLabelManager.get("doc.error.notfound"));
		}
		
		doc.setDocumentName(nome);
		if (data != null) {
			doc.setDocumentPresent(Boolean.TRUE);
			doc.setType(data.getContentType());
			doc.setName(data.getOriginalFilename());
			doc.setUrl(extractAddress(request) + DOWNLOAD + URLEncoder.encode(encode(doc, doc.getId()), "UTF-8"));
			File f = saveFile(data, doc.getId());
		} else {
			doc.setDocumentPresent(Boolean.FALSE);
		}
		aslManager.saveDocumento(doc);

		return doc;
	}
	
	public Documento getDocumento(String documentId, HttpServletRequest request) throws Exception {

		Documento doc = aslManager.getDocumento(documentId);

		if (doc == null) {
			throw new BadRequestException(errorLabelManager.get("doc.error.notfound"));
		}

		doc.setUrl(extractAddress(request) + DOWNLOAD + URLEncoder.encode(encode(doc, doc.getId()), "UTF-8"));

		return doc;

	}
	
	public boolean removeDocument(Long esperienzaId, String documentId) throws Exception {
		EsperienzaSvolta es = espRepo.findOne(esperienzaId);
		
		if (es == null) {
			throw new BadRequestException(errorLabelManager.get("esp.error.notfound"));
		}		
		
		es.getDocumenti().removeIf(x -> documentId.equals(x.getId()));
		
		boolean removed = false;

		try {
			espRepo.save(es);
			deleteFile(documentId);
			aslManager.deleteDocumento(documentId);
			removed = true;
		} catch (Exception e) {
			throw new ASLCustomException(e.getMessage());
		}

		return removed;

	}
	
	public String encode(Object obj, String id) throws Exception {
		return encrypt(entityToType(obj.getClass()) + "?" + id + "?" + (System.currentTimeMillis() + 60 * 1000 * docUrlExpiration));
	}	
	
	public String[] decode(String key) throws Exception {
		String decrypted = decrypt(key);
		String split[] = decrypted.split("\\?");
		
		StoredFile sf = getEntity(Integer.parseInt(split[0]), split[1]);
		
		String result[] = new String[3];
		result[0] = split[0]; // entity type
		result[1] = sf.getId();
		result[2] = split[2]; // expiration
		
		return result;
	}
	
	private String encrypt(String toBeEncrypt) throws NoSuchPaddingException, NoSuchAlgorithmException, InvalidAlgorithmParameterException, InvalidKeyException, BadPaddingException,
			IllegalBlockSizeException, UnsupportedEncodingException {
		cipher.init(Cipher.ENCRYPT_MODE, secretKeySpec, ivParameterSpec);
		byte[] encrypted = cipher.doFinal(toBeEncrypt.getBytes());
		return Base64.encodeBase64URLSafeString(encrypted);
	}


	public String decrypt(String encrypted) throws InvalidAlgorithmParameterException, InvalidKeyException, BadPaddingException, IllegalBlockSizeException {
		cipher.init(Cipher.DECRYPT_MODE, secretKeySpec, ivParameterSpec);
		byte[] decryptedBytes = cipher.doFinal(Base64.decodeBase64(encrypted));
		return new String(decryptedBytes);
	}	

	private File saveFile(MultipartFile data, String key) throws IOException {
		File file = new File(storageDir, key);
		data.transferTo(file);			
		
		return file;
	}

	public File loadFile(String name) throws IOException {
		File file = new File(storageDir, name);
		
		return file;
	}	
	
	public boolean deleteFile(String name) throws IOException {
		File file = new File(storageDir, name);
		return file.delete();
		
	}	
	
	private int entityToType(Class entity) {
		switch (entity.getSimpleName()) {
		case "SchedaValutazione":
			return 1;
		case "Documento":
			return 2;
		default:
			return 0;
		}
	}
	
	public StoredFile getEntity(int type, String id) {
		switch (type) {
		case 1:
			return svRepo.findOne(id);
		case 2:
			return docRepo.findOne(id);
		default:
			return null;
		}
	}	
	
	private String extractAddress(HttpServletRequest request) {
//		String uri = request.getRequestURI().toString();
//		String url = request.getRequestURL().toString();
//		return url.replace(uri, "") + contextPath;
		return "";
	}
	
}
