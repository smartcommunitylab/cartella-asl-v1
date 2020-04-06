package it.smartcommunitylab.cartella.asl.storage;

public class DocumentManager {
	/*
	private static final transient Logger logger = LoggerFactory.getLogger(DocumentManager.class);

	private AmazonS3 s3;

	@Autowired
	@Value("${storage.s3.bucketName}")
	private String bucketName;

	@Autowired
	@Value("${storage.s3.docUrlExpiration}")
	private Long docUrlExpiration;

	@Autowired
	private EsperienzaSvoltaRepository espRepo;

	@Autowired
	private QueriesManager aslManager;
	
	@Autowired
	private ErrorLabelManager errorLabelManager;
	
	@SuppressWarnings("deprecation")
	public DocumentManager() {
		this.s3 = new AmazonS3Client(new ProfileCredentialsProvider());
	}

	public EsperienzaSvolta addSchedaAzienda(Long espId, MultipartFile file) throws Exception {

		EsperienzaSvolta esp = espRepo.findOne(espId);

		if (esp != null) {
			SchedaValutazioneAzienda scheda = esp.getSchedaValutazioneAzienda();

			if (scheda == null) {
				scheda = new SchedaValutazioneAzienda();
				scheda.setId(UUID.randomUUID().toString());
			}

			scheda.setName(file.getOriginalFilename());
			scheda.setType(file.getContentType());
			esp.setSchedaValutazioneAzienda(scheda);
			espRepo.save(esp);

			s3.putObject(
					new PutObjectRequest(bucketName, esp.getSchedaValutazioneAzienda().getId(), createTmpFile(file)));

			if (logger.isInfoEnabled()) {
				logger.info(String.format("addedFileToEsperienzaSvolta: %s", espId));
			}
		}
		return esp;
	}

	public SchedaValutazioneAzienda getSchedaAziendaSignedUrl(Long espId) {

		EsperienzaSvolta esp = espRepo.findOne(espId);

		if (esp != null) {
			SchedaValutazioneAzienda scheda = esp.getSchedaValutazioneAzienda();
			if (scheda != null) {
				URL signedUrl = generateSignedUrl(bucketName, scheda.getId(), scheda.getType(), scheda.getName());
				scheda.setUrl(signedUrl.toString());
				return scheda;
			}

		}

		return null;

	}

	public Boolean removeSchedaAzienda(Long espId) throws Exception {

		EsperienzaSvolta esp = espRepo.findOne(espId);

		if (esp != null) {
			SchedaValutazioneAzienda scheda = esp.getSchedaValutazioneAzienda();
			if (scheda != null) {
				s3.deleteObject(new DeleteObjectRequest(bucketName, scheda.getId()));
				esp.setSchedaValutazioneAzienda(null);
				espRepo.save(esp);
				return true;
			}
		}

		return false;
	}

	public EsperienzaSvolta addSchedaStudente(Long espId, MultipartFile file) throws Exception {
		EsperienzaSvolta esp = espRepo.findOne(espId);

		if (esp != null) {
			SchedaValutazioneStudente scheda = esp.getSchedaValutazioneStudente();

			if (scheda == null) {
				scheda = new SchedaValutazioneStudente();
				scheda.setId(UUID.randomUUID().toString());
			}

			scheda.setName(file.getOriginalFilename());
			scheda.setType(file.getContentType());
			esp.setSchedaValutazioneStudente(scheda);
			espRepo.save(esp);

			s3.putObject(
					new PutObjectRequest(bucketName, esp.getSchedaValutazioneStudente().getId(), createTmpFile(file)));

			if (logger.isInfoEnabled()) {
				logger.info(String.format("addedFileToEsperienzaSvolta: %s", espId));
			}
		}
		return esp;
	}

	public SchedaValutazioneStudente getSchedaStudenteSignedUrl(Long espId) {

		EsperienzaSvolta esp = espRepo.findOne(espId);

		if (esp != null) {
			SchedaValutazioneStudente scheda = esp.getSchedaValutazioneStudente();
			if (scheda != null) {
				URL signedUrl = generateSignedUrl(bucketName, scheda.getId(), scheda.getType(), scheda.getName());
				scheda.setUrl(signedUrl.toString());
				return scheda;
			}

		}

		return null;

	}

	public Boolean removeSchedaStudente(Long espId) throws Exception {

		EsperienzaSvolta esp = espRepo.findOne(espId);

		if (esp != null) {
			SchedaValutazioneStudente scheda = esp.getSchedaValutazioneStudente();
			if (scheda != null) {
				s3.deleteObject(new DeleteObjectRequest(bucketName, scheda.getId()));
				esp.setSchedaValutazioneStudente(null);
				espRepo.save(esp);
				return true;
			}
		}

		return false;
	}

	public Documento addDocument(String name, Long experienceId, MultipartFile data) throws Exception {
		EsperienzaSvolta es = espRepo.findOne(experienceId);
		if (es == null) {
			throw new BadRequestException(errorLabelManager.get("esp.error.notfound"));
		}
		Documento doc = new Documento();
		doc.setNome(name);
		doc.setId(UUID.randomUUID().toString());
		if (data != null) {
			doc.setDocumentPresent(Boolean.TRUE);
			doc.setContentType(data.getContentType());
			doc.setFilename(data.getOriginalFilename());
			s3.putObject(new PutObjectRequest(bucketName, doc.getId(), createTmpFile(data)));
		} else {
			doc.setDocumentPresent(Boolean.FALSE);
		}
		aslManager.saveDocumento(doc);
		es.getDocumenti().add(doc);
		aslManager.saveEsperienzaSvolta(es);
		return doc;
	}

	public Documento updateDocument(String documentoId, String nome, MultipartFile data) throws Exception {

		Documento doc = aslManager.getDocumento(documentoId);

		if (doc == null) {
			throw new BadRequestException(errorLabelManager.get("doc.error.notfound"));
		}
		doc.setNome(nome);
		if (data != null) {
			doc.setDocumentPresent(Boolean.TRUE);
			doc.setContentType(data.getContentType());
			doc.setFilename(data.getOriginalFilename());
			s3.putObject(new PutObjectRequest(bucketName, doc.getId(), createTmpFile(data)));
		} else {
			doc.setDocumentPresent(Boolean.FALSE);
		}

		aslManager.saveDocumento(doc);
		return doc;
	}
	
	public String getDocumentDownloadURL(String documentId) throws BadRequestException {

		Documento doc = aslManager.getDocumento(documentId);

		if (doc == null) {
			throw new BadRequestException(errorLabelManager.get("doc.error.notfound"));
		}

		URL signedUrl = generateSignedUrl(bucketName, doc.getId(), doc.getContentType(), doc.getFilename());

		return signedUrl.toString();

	}
	
	public boolean removeDocument(String documentId) throws ASLCustomException {

		boolean removed = false;

		try {
			s3.deleteObject(new DeleteObjectRequest(bucketName, documentId));
			aslManager.deleteDocumento(documentId);
			removed = true;
		} catch (Exception e) {
			throw new ASLCustomException(e.getMessage());
		}

		return removed;

	}
	
	private URL generateSignedUrl(String bucketName, String key, String contentType, String filename) {
		Date expiration = new java.util.Date();
		long milliSeconds = expiration.getTime();
		milliSeconds += 1000 * 60 * docUrlExpiration;
		expiration.setTime(milliSeconds);

		ResponseHeaderOverrides override = new ResponseHeaderOverrides();
		override.setContentType(contentType);
		override.setContentDisposition("attachment; filename=" + filename);

		GeneratePresignedUrlRequest generatePresignedUrlRequest = new GeneratePresignedUrlRequest(bucketName, key);
		generatePresignedUrlRequest.setMethod(HttpMethod.GET);
		generatePresignedUrlRequest.setExpiration(expiration);
		generatePresignedUrlRequest.setResponseHeaders(override);

		URL url = s3.generatePresignedUrl(generatePresignedUrlRequest);
		return url;
	}

	private File createTmpFile(MultipartFile file) throws IOException {
		Path tempFile = Files.createTempFile("cs-doc", ".tmp");
		tempFile.toFile().deleteOnExit();
		Files.copy(file.getInputStream(), tempFile, StandardCopyOption.REPLACE_EXISTING);
		return tempFile.toFile();
	}
*/
}
