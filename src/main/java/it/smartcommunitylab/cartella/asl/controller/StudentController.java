package it.smartcommunitylab.cartella.asl.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.http.HttpStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.google.common.base.Splitter;
import com.google.common.collect.Lists;

import it.smartcommunitylab.cartella.asl.exception.ASLCustomException;
import it.smartcommunitylab.cartella.asl.manager.ASLRolesValidator;
import it.smartcommunitylab.cartella.asl.manager.AttivitaGiornaliereManager;
import it.smartcommunitylab.cartella.asl.manager.AuditManager;
import it.smartcommunitylab.cartella.asl.manager.QueriesManager;
import it.smartcommunitylab.cartella.asl.model.Documento;
import it.smartcommunitylab.cartella.asl.model.EsperienzaSvolta;
import it.smartcommunitylab.cartella.asl.model.Presenze;
import it.smartcommunitylab.cartella.asl.model.Studente;
import it.smartcommunitylab.cartella.asl.model.audit.AuditEntry;
import it.smartcommunitylab.cartella.asl.model.users.ASLAuthCheck;
import it.smartcommunitylab.cartella.asl.model.users.ASLRole;
import it.smartcommunitylab.cartella.asl.model.users.ASLUser;
import it.smartcommunitylab.cartella.asl.storage.LocalDocumentManager;

// TODO acl
@RestController
public class StudentController implements AslController {

	@Autowired
	private QueriesManager aslManager;
	
	@Autowired
	private AttivitaGiornaliereManager agManager;

	@Autowired
	private LocalDocumentManager docManager;
	
	@Autowired
	private ASLRolesValidator usersValidator;		
	
	@Autowired
	private AuditManager auditManager;		
	
	private static Log logger = LogFactory.getLog(StudentController.class);

	@GetMapping("/api/attivita/studente")
	public Page<EsperienzaSvolta> findEsperienzaSvoltaByStudentId(@RequestParam String studenteId,
			@RequestParam(required = false) Long dataInizio, @RequestParam(required = false) Long dataFine,
			@RequestParam(required = false) String stato, @RequestParam(required = false) String tipologia,
			@RequestParam(required = false) String filterText, Pageable pageRequest, HttpServletRequest request) throws Exception {
		usersValidator.validate(request, new ASLAuthCheck(ASLRole.STUDENTE, studenteId));
		
		if (logger.isInfoEnabled()) {
			logger.info("/attivita/studente :" + studenteId);
		}

		List<Integer> statoList = null;
		List<Integer> tipologiaList = null;
		if (stato != null) {
			statoList = Splitter.on(",").splitToList(stato).stream().map(x -> Integer.parseInt(x))
					.collect(Collectors.toList());
		}
		if (tipologia != null) {
			tipologiaList = Splitter.on(",").splitToList(tipologia).stream().map(x -> Integer.parseInt(x))
					.collect(Collectors.toList());
		}
		Page<EsperienzaSvolta> result = aslManager.findAllEsperienzaSvoltaByStudenteId(studenteId, dataInizio, dataFine,
				statoList, tipologiaList, filterText, pageRequest);

		result.forEach(x -> {
			x.getAttivitaAlternanza().setOpportunita(null);
			x.setSchedaValutazioneAzienda(null);
			x.setSchedaValutazioneStudente(null);
		});

		return result;
	}
	
	@GetMapping("/api/studente/{id}")
	public Studente getStudente(@PathVariable String id, HttpServletRequest request) throws Exception {
		usersValidator.validate(request, new ASLAuthCheck(ASLRole.STUDENTE, id));	
		
		return aslManager.findStudente(id);
	}	

	@GetMapping("/api/attivita/studente/details/{esId}")
	public EsperienzaSvolta getEsperienzaSvolta(@PathVariable long esId, HttpServletRequest request) throws Exception {
		String studenteId = aslManager.findEsperienzaSvoltaStudenteId(esId);
		usersValidator.validate(request, new ASLAuthCheck(ASLRole.STUDENTE, studenteId));
		
		if (logger.isInfoEnabled()) {
			logger.info(String.format("/attivita/studente/details/[%s]", esId));
		}
		return aslManager.getEsperienzaSvolta(esId);
	}

	@PostMapping("/api/attivita/noteStudente/{esId}")
	public EsperienzaSvolta saveNoteStudente(@PathVariable long esId, @RequestParam String note, HttpServletRequest request) throws Exception {
		String studenteId = aslManager.findEsperienzaSvoltaStudenteId(esId);
		ASLUser user = usersValidator.validate(request, new ASLAuthCheck(ASLRole.STUDENTE, studenteId));
		
		try {
			if (logger.isInfoEnabled()) {
				logger.info(String.format("/attivita/noteStudente/[%s]", esId));
			}
			EsperienzaSvolta result = aslManager.saveNoteStudente(esId, note);
			
			if (result != null) {
				AuditEntry audit = new AuditEntry(request.getMethod(), EsperienzaSvolta.class, result.getId(), user, new Object(){});
				auditManager.save(audit);
			}
			
			return result;

		} catch (Exception e) {
			logger.error(e.getMessage());
			throw new ASLCustomException(HttpStatus.SC_INTERNAL_SERVER_ERROR, e.getMessage());
		}
	}

	@PostMapping("/api/attivita/esperienzaSvolta/{esId}/documento")
	public Documento addDocumentToExperience(@PathVariable Long esId, @RequestParam String nome,
			@RequestParam(required = false) MultipartFile data, HttpServletRequest request) throws Exception {
		String studenteId = aslManager.findEsperienzaSvoltaStudenteId(esId);
		ASLUser user = usersValidator.validate(request, new ASLAuthCheck(ASLRole.STUDENTE, studenteId));		
		
		try {
			Documento result = docManager.addDocument(nome, esId, data, request);
			if (logger.isInfoEnabled()) {
				logger.info(String.format("/attivita/experienceSvolta/[%s]/document : [%s]", esId, result.getId()));
			}
			
			AuditEntry audit1 = new AuditEntry("update", EsperienzaSvolta.class, esId, user, new Object(){});
			auditManager.save(audit1);	
			if (result != null) {
				AuditEntry audit2 = new AuditEntry(request.getMethod(), Documento.class, result.getId(), user, new Object(){});
				auditManager.save(audit2);
			}
			
			return result;
		} catch (Exception e) {
			throw new ASLCustomException(HttpStatus.SC_INTERNAL_SERVER_ERROR, e.getMessage());
		}

	}

	@PutMapping("/api/attivita/esperienzaSvolta/documento/{documentoId}")
	public Documento updateDocumentToExperience(@PathVariable String documentoId, @RequestParam String nome,
			@RequestParam(required = false) MultipartFile data, HttpServletRequest request) throws Exception {
		String studenteId = aslManager.findDocumentoStudenteId(documentoId);
		ASLUser user = usersValidator.validate(request, new ASLAuthCheck(ASLRole.STUDENTE, studenteId));
		
		try {
			Documento result = docManager.updateDocument(documentoId, nome, data, request);
			if (logger.isInfoEnabled()) {
				logger.info(String.format("/attivita/experienceSvolta/document/[%s} : ", documentoId, result.getId()));
			}
			
			if (result != null) {
				AuditEntry audit = new AuditEntry(request.getMethod(), Documento.class, result.getId(), user, new Object(){});
				auditManager.save(audit);
			}
			
			return result;
		} catch (Exception e) {
			throw new ASLCustomException(HttpStatus.SC_INTERNAL_SERVER_ERROR, e.getMessage());
		}

	}

	@GetMapping("/api/download/esperienzaSvolta/documento/{documentoId}")
	public @ResponseBody Documento getDocumento(@PathVariable String documentoId, HttpServletRequest request)
			throws Exception {
		return docManager.getDocumento(documentoId, request);

	}

	@DeleteMapping("/api/attivita/esperienzaSvolta/{esperienzaId}/documento/{documentId}")
	public @ResponseBody boolean deleteDocumentFromExperience(@PathVariable Long esperienzaId, @PathVariable String documentId, HttpServletRequest request) throws Exception {
		String studenteId = aslManager.findDocumentoStudenteId(documentId);
		ASLUser user = usersValidator.validate(request, new ASLAuthCheck(ASLRole.STUDENTE, studenteId));		
		boolean result = docManager.removeDocument(esperienzaId, documentId);
		
		AuditEntry audit = new AuditEntry(request.getMethod(), Documento.class, documentId, user, new Object(){});
		auditManager.save(audit);			
		
		return result;
	}
	
	@GetMapping("/api/studente/{studenteId}/attivitaGiornaliera/calendario/{attivitaId}")
	public Map<String, Presenze> findAttivitaAlternanzaCalendario(
			@PathVariable String studenteId,
			@PathVariable Long attivitaId, 
			HttpServletRequest request) throws Exception {
		usersValidator.validate(request, Lists.newArrayList(new ASLAuthCheck(ASLRole.STUDENTE, studenteId)));		
		Map<String, Presenze> presenzeMap = agManager.findAttivitaAlternanzaCalendario(attivitaId);
		Map<String, Presenze> result = new HashMap<>();
		for(String id : presenzeMap.keySet()) {
			if(id.equals(studenteId)) {
				result.put(id, presenzeMap.get(id));
			}
		}
		return result; 
	}


}