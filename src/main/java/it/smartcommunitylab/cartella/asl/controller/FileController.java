package it.smartcommunitylab.cartella.asl.controller;

import java.io.File;
import java.io.FileNotFoundException;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.io.FileUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.http.HttpStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.google.common.collect.Lists;

import it.smartcommunitylab.cartella.asl.exception.ASLCustomException;
import it.smartcommunitylab.cartella.asl.manager.ASLRolesValidator;
import it.smartcommunitylab.cartella.asl.manager.AuditManager;
import it.smartcommunitylab.cartella.asl.manager.QueriesManager;
import it.smartcommunitylab.cartella.asl.model.EsperienzaSvolta;
import it.smartcommunitylab.cartella.asl.model.SchedaValutazione;
import it.smartcommunitylab.cartella.asl.model.StoredFile;
import it.smartcommunitylab.cartella.asl.model.audit.AuditEntry;
import it.smartcommunitylab.cartella.asl.model.users.ASLAuthCheck;
import it.smartcommunitylab.cartella.asl.model.users.ASLRole;
import it.smartcommunitylab.cartella.asl.model.users.ASLUser;
import it.smartcommunitylab.cartella.asl.storage.LocalDocumentManager;

@RestController
public class FileController {

	@Value("${storage.type}")
	private String storageType;

	@Autowired()
	LocalDocumentManager documentManager;
	
	@Autowired
	private QueriesManager aslManager;	
	
	@Autowired
	private ASLRolesValidator usersValidator;	
	
	@Autowired
	private AuditManager auditManager;		
	
	private static Log logger = LogFactory.getLog(FileController.class);

	@PostMapping("/api/upload/schedaValutazioneAzienda/{id}")
	public @ResponseBody SchedaValutazione uploadSchedaValutazioneAzienda(
			@RequestParam("data") MultipartFile data, @PathVariable Long id, HttpServletRequest request) throws Exception {
		String aziendaId = aslManager.findEsperienzaSvoltaAziendaId(id);
		ASLUser user = usersValidator.validate(request, Lists.newArrayList(new ASLAuthCheck(ASLRole.LEGALE_RAPPRESENTANTE_AZIENDA, aziendaId), new ASLAuthCheck(ASLRole.REFERENTE_AZIENDA, aziendaId)));		
		
		try {
			EsperienzaSvolta es = documentManager.addSchedaAzienda(id, data, request);
			if (es.getSchedaValutazioneAzienda() != null) {
				SchedaValutazione result = es.getSchedaValutazioneAzienda();
				
				AuditEntry audit = new AuditEntry(request.getMethod(), SchedaValutazione.class, result.getId(), user, new Object(){});
				auditManager.save(audit);
				
				return result;
			}
		} catch (Exception e) {
			throw new ASLCustomException(HttpStatus.SC_INTERNAL_SERVER_ERROR, e.getMessage());
		}

		return null;

	}

	@GetMapping("/api/download/schedaValutazioneAzienda/{id}")
	public @ResponseBody SchedaValutazione getSchedaValutazioneAziendaURL(@PathVariable Long id, HttpServletRequest request) throws Exception {
		String aziendaId = aslManager.findEsperienzaSvoltaAziendaId(id);
		String istitutoId = aslManager.findEsperienzaSvoltaIstitutoId(id);
		usersValidator.validate(request, Lists.newArrayList(new ASLAuthCheck(ASLRole.LEGALE_RAPPRESENTANTE_AZIENDA, aziendaId), new ASLAuthCheck(ASLRole.REFERENTE_AZIENDA, aziendaId), new ASLAuthCheck(ASLRole.DIRIGENTE_SCOLASTICO, istitutoId), new ASLAuthCheck(ASLRole.FUNZIONE_STRUMENTALE, istitutoId)));		
		
		return documentManager.getSchedaAzienda(id, request);

	}

	@DeleteMapping("/api/remove/schedaValutazioneAzienda/{id}")
	public @ResponseBody boolean removeSchedaValutazioneAziendaURL(@PathVariable Long id, HttpServletRequest request) throws Exception {
		String aziendaId = aslManager.findEsperienzaSvoltaAziendaId(id);

		ASLUser user = usersValidator.validate(request, Lists.newArrayList(new ASLAuthCheck(ASLRole.LEGALE_RAPPRESENTANTE_AZIENDA, aziendaId), new ASLAuthCheck(ASLRole.REFERENTE_AZIENDA, aziendaId)));		
		
		try {
			boolean result =  documentManager.removeSchedaAzienda(id);
			
			AuditEntry audit = new AuditEntry(request.getMethod(), SchedaValutazione.class, id, user, new Object(){});
			auditManager.save(audit);
			
			return result;
		} catch (Exception e) {
			throw new ASLCustomException(HttpStatus.SC_INTERNAL_SERVER_ERROR, e.getMessage());
		}

	}

	@PostMapping("/api/upload/schedaValutazioneStudente/{id}")
	public @ResponseBody SchedaValutazione uploadSchedaValutazioneStudente(
			@RequestParam("data") MultipartFile data, @PathVariable Long id, HttpServletRequest request) throws Exception {
		String studenteId = aslManager.findEsperienzaSvoltaStudenteId(id);
		ASLUser user = usersValidator.validate(request, new ASLAuthCheck(ASLRole.STUDENTE, studenteId));
		
		try {
			EsperienzaSvolta es = documentManager.addSchedaStudente(id, data, request);
			if (es.getSchedaValutazioneStudente() != null) {
				SchedaValutazione result = es.getSchedaValutazioneStudente();
				
				AuditEntry audit = new AuditEntry(request.getMethod(), SchedaValutazione.class, result.getId(), user, new Object(){});
				auditManager.save(audit);				
				
				return result;
			}

		} catch (Exception e) {
			throw new ASLCustomException(HttpStatus.SC_INTERNAL_SERVER_ERROR, e.getMessage());
		}

		return null;

	}

	@GetMapping("/api/download/schedaValutazioneStudente/{id}")
	public @ResponseBody SchedaValutazione getSchedaValutazioneStudenteURL(@PathVariable Long id, HttpServletRequest request) throws Exception {
		String istitutoId = aslManager.findEsperienzaSvoltaIstitutoId(id);
		String studenteId = aslManager.findEsperienzaSvoltaStudenteId(id);
		usersValidator.validate(request, Lists.newArrayList(new ASLAuthCheck(ASLRole.STUDENTE, studenteId), new ASLAuthCheck(ASLRole.DIRIGENTE_SCOLASTICO, istitutoId), new ASLAuthCheck(ASLRole.FUNZIONE_STRUMENTALE, istitutoId)));
		
		return documentManager.getSchedaStudente(id, request);

	}

	@DeleteMapping("/api/remove/schedaValutazioneStudente/{id}")
	public @ResponseBody boolean removeSchedaValutazioneStudenteURL(@PathVariable Long id, HttpServletRequest request) throws Exception {
		String istitutoId = aslManager.findEsperienzaSvoltaIstitutoId(id);

		ASLUser user = usersValidator.validate(request, Lists.newArrayList(new ASLAuthCheck(ASLRole.DIRIGENTE_SCOLASTICO, istitutoId), new ASLAuthCheck(ASLRole.FUNZIONE_STRUMENTALE, istitutoId)));
		
		try {
			boolean result = documentManager.removeSchedaStudente(id);
			
			AuditEntry audit = new AuditEntry(request.getMethod(), SchedaValutazione.class, id, user, new Object(){});
			auditManager.save(audit);
			
			return result;
		} catch (Exception e) {
			throw new ASLCustomException(HttpStatus.SC_INTERNAL_SERVER_ERROR, e.getMessage());
		}

	}
	
	
	/** SCUOLA AZIENDA INTEGRATION **/
	
	@PostMapping("/api/upload/schedaValutazioneScuola/{istitutoId}/es/{id}")
	public @ResponseBody SchedaValutazione uploadSchedaValutazioneAziendaScuola(
			@RequestParam("data") MultipartFile data, @PathVariable String istitutoId, @PathVariable Long id,
			HttpServletRequest request) throws Exception {

		ASLUser user = usersValidator.validate(request, Lists.newArrayList(new ASLAuthCheck(ASLRole.DIRIGENTE_SCOLASTICO, istitutoId), new ASLAuthCheck(ASLRole.FUNZIONE_STRUMENTALE, istitutoId)));

		try {
			EsperienzaSvolta es = documentManager.addSchedaAzienda(id, data, request);
			if (es.getSchedaValutazioneAzienda() != null) {
				SchedaValutazione result = es.getSchedaValutazioneAzienda();
				
				AuditEntry audit = new AuditEntry(request.getMethod(), SchedaValutazione.class, result.getId(), user, new Object(){});
				auditManager.save(audit);
				
				return result;
			}
		} catch (Exception e) {
			throw new ASLCustomException(HttpStatus.SC_INTERNAL_SERVER_ERROR, e.getMessage());
		}

		return null;

	}

	@DeleteMapping("/api/remove/schedaValutazioneScuola/{istitutoId}/es/{id}")
	public @ResponseBody boolean removeSchedaValutazioneAziendaScuolaURL(@PathVariable String istitutoId,
			@PathVariable Long id, HttpServletRequest request) throws Exception {

		ASLUser user = usersValidator.validate(request, Lists.newArrayList(new ASLAuthCheck(ASLRole.DIRIGENTE_SCOLASTICO, istitutoId), new ASLAuthCheck(ASLRole.FUNZIONE_STRUMENTALE, istitutoId)));

		try {
			boolean result = documentManager.removeSchedaAzienda(id);
			
			AuditEntry audit = new AuditEntry(request.getMethod(), SchedaValutazione.class, id, user, new Object(){});
			auditManager.save(audit);			
			
			return result;
		} catch (Exception e) {
			throw new ASLCustomException(HttpStatus.SC_INTERNAL_SERVER_ERROR, e.getMessage());
		}

	}

	@GetMapping("/api/download/schedaValutazioneScuola/{istitutoId}/es/{id}")
	public @ResponseBody SchedaValutazione getSchedaValutazioneAziendaScuolaURL(@PathVariable String istitutoId,
			@PathVariable Long id, HttpServletRequest request) throws Exception {

		usersValidator.validate(request, Lists.newArrayList(new ASLAuthCheck(ASLRole.DIRIGENTE_SCOLASTICO, istitutoId), new ASLAuthCheck(ASLRole.FUNZIONE_STRUMENTALE, istitutoId)));

		return documentManager.getSchedaAzienda(id, request);

	}
	
	@GetMapping("/api/download/file")
	public void downloadFile(@RequestParam(required=true) String key, HttpServletResponse response) throws Exception {
		String[] split = documentManager.decode(key);
		
		Long expiration = Long.parseLong(split[2]);
		if (System.currentTimeMillis() > expiration) {
			logger.debug("Url expired");
			response.sendError(HttpServletResponse.SC_REQUEST_TIMEOUT);
		}
		
		try {
			StoredFile sf = documentManager.getEntity(Integer.parseInt(split[0]), split[1]);

			File file = documentManager.loadFile(sf.getId());

			response.setContentType(sf.getType());
			response.setHeader("Content-Disposition", "attachment; filename=\"" + sf.getName() + "\"");
			response.getOutputStream().write(FileUtils.readFileToByteArray(file));
		} catch (FileNotFoundException e) {
			response.sendError(HttpServletResponse.SC_NOT_FOUND);
		}		
	}

}
