package it.smartcommunitylab.cartella.asl.controller;

import java.util.List;
import java.util.stream.Collectors;

import javax.servlet.http.HttpServletRequest;

import org.apache.http.HttpStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.google.common.base.Splitter;
import com.google.common.collect.Lists;

import it.smartcommunitylab.cartella.asl.exception.ASLCustomException;
import it.smartcommunitylab.cartella.asl.exception.BadRequestException;
import it.smartcommunitylab.cartella.asl.manager.ASLRolesValidator;
import it.smartcommunitylab.cartella.asl.manager.AuditManager;
import it.smartcommunitylab.cartella.asl.manager.QueriesManager;
import it.smartcommunitylab.cartella.asl.model.AttivitaAlternanza;
import it.smartcommunitylab.cartella.asl.model.Azienda;
import it.smartcommunitylab.cartella.asl.model.CorsoInterno;
import it.smartcommunitylab.cartella.asl.model.EsperienzaSvolta;
import it.smartcommunitylab.cartella.asl.model.Opportunita;
import it.smartcommunitylab.cartella.asl.model.SchedaValutazione;
import it.smartcommunitylab.cartella.asl.model.audit.AuditEntry;
import it.smartcommunitylab.cartella.asl.model.users.ASLAuthCheck;
import it.smartcommunitylab.cartella.asl.model.users.ASLRole;
import it.smartcommunitylab.cartella.asl.model.users.ASLUser;
import it.smartcommunitylab.cartella.asl.util.Constants;
import it.smartcommunitylab.cartella.asl.util.ErrorLabelManager;
import it.smartcommunitylab.cartella.asl.util.Utils;

@RestController
public class IstitutoAziendaController implements AslController {
	@Autowired
	private QueriesManager aslManager;

	@Autowired
	private ASLRolesValidator usersValidator;

	@Autowired
	private ErrorLabelManager errorLabelManager;
	
	@Autowired
	private AuditManager auditManager;	

	@PostMapping("/api/opportunita/{istitutoId}/details")
	public Opportunita saveOpportunita(@PathVariable String istitutoId, @RequestBody Opportunita o,
			HttpServletRequest request) throws Exception {
		checkNullId(o.getId());
		o.setIstitutoId(istitutoId);

		ASLUser user = usersValidator.validate(request, Lists.newArrayList(new ASLAuthCheck(ASLRole.DIRIGENTE_SCOLASTICO, istitutoId), new ASLAuthCheck(ASLRole.FUNZIONE_STRUMENTALE, istitutoId)));

		if (o.getAzienda() == null) {
			throw new BadRequestException(errorLabelManager.get("azienda.missing"));
		}

		Opportunita result = aslManager.saveOpportunita(o);
		
		if (result != null) {
			AuditEntry audit = new AuditEntry(request.getMethod(), Opportunita.class, result.getId(), user, new Object(){});
			auditManager.save(audit);
		}
		
		return result;
	}

	@GetMapping("/api/opportunita/{istitutoId}/details/{id}")
	public Opportunita getOpportunita(@PathVariable String istitutoId, @PathVariable long id,
			HttpServletRequest request) throws Exception {

		usersValidator.validate(request, Lists.newArrayList(new ASLAuthCheck(ASLRole.DIRIGENTE_SCOLASTICO, istitutoId), new ASLAuthCheck(ASLRole.FUNZIONE_STRUMENTALE, istitutoId)));

		return aslManager.getOpportunita(id);
	}

	@PutMapping("/api/opportunita/{istitutoId}/details/{id}")
	public void updateOpportunita(@PathVariable String istitutoId, @PathVariable long id, @RequestBody Opportunita o,
			HttpServletRequest request) throws Exception {
		
		ASLUser user = usersValidator.validate(request, Lists.newArrayList(new ASLAuthCheck(ASLRole.DIRIGENTE_SCOLASTICO, istitutoId), new ASLAuthCheck(ASLRole.FUNZIONE_STRUMENTALE, istitutoId)));
		o.setId(id);
		o.setIstituto(istitutoId);
		aslManager.updateOpportunita(o);
		
		AuditEntry audit = new AuditEntry(request.getMethod(), Opportunita.class, id, user, new Object(){});
		auditManager.save(audit);		
	}

	@PutMapping("/api/opportunita/{istitutoId}/{id}/competenze")
	public Opportunita setCompetenzeToOpportunita(@PathVariable String istitutoId, @PathVariable long id,
			@RequestBody List<Long> aaIds, HttpServletRequest request) throws Exception {
		try {
			ASLUser user = usersValidator.validate(request, Lists.newArrayList(new ASLAuthCheck(ASLRole.DIRIGENTE_SCOLASTICO, istitutoId), new ASLAuthCheck(ASLRole.FUNZIONE_STRUMENTALE, istitutoId)));
			Opportunita result = aslManager.setCompetenzeInOpportunita(id, aaIds);
			
			if (result != null) {
				AuditEntry audit = new AuditEntry(request.getMethod(), Opportunita.class, result.getId(), user, new Object(){});
				auditManager.save(audit);
			}
			
			return result;
		} catch (Exception e) {
			throw new BadRequestException(e);
		}
	}

	@DeleteMapping("/api/opportunita/{istitutoId}/{id}")
	public void deleteOpportunita(@PathVariable String istitutoId, @PathVariable long id, HttpServletRequest request)
			throws Exception {
		ASLUser user = usersValidator.validate(request, Lists.newArrayList(new ASLAuthCheck(ASLRole.DIRIGENTE_SCOLASTICO, istitutoId), new ASLAuthCheck(ASLRole.FUNZIONE_STRUMENTALE, istitutoId)));
		aslManager.deleteOpportunita(id);
		
		AuditEntry audit = new AuditEntry(request.getMethod(), Opportunita.class, id, user, new Object(){});
		auditManager.save(audit);		
	}

	@GetMapping("/api/opportunita")
	public Page<Opportunita> getOpportunitaByIstitutoId(@RequestParam String istitutoId, @RequestParam(required = false) Long dataInizio, @RequestParam(required = false) Long dataFine,
			@RequestParam(required = false) String tipologia, @RequestParam(required = false) String filterText,
			Pageable pageRequest, HttpServletRequest request) throws Exception {

		usersValidator.validate(request, Lists.newArrayList(new ASLAuthCheck(ASLRole.DIRIGENTE_SCOLASTICO, istitutoId), new ASLAuthCheck(ASLRole.FUNZIONE_STRUMENTALE, istitutoId)));

		List<Integer> tipologiaList = null;

		if (tipologia != null) {
			tipologiaList = Splitter.on(",").splitToList(tipologia).stream().map(x -> Integer.parseInt(x))
					.collect(Collectors.toList());
		}

		Page<Opportunita> result = aslManager.findOpportunitaByIstitutoId(istitutoId, dataInizio, dataFine,
				tipologiaList, filterText, pageRequest);

		result.forEach(x -> {
			x.setCompetenze(null);
		});

		return result;
	}

	@GetMapping("/api/azienda/{istitutoId}/{aziendaId}")
	public Azienda getAzienda(@PathVariable String istitutoId, @PathVariable String aziendaId,
			HttpServletRequest request) throws Exception {
		usersValidator.validate(request, Lists.newArrayList(new ASLAuthCheck(ASLRole.DIRIGENTE_SCOLASTICO, istitutoId), new ASLAuthCheck(ASLRole.FUNZIONE_STRUMENTALE, istitutoId)));
		Azienda az = aslManager.getAzienda(aziendaId);
		return az;
	}
	
	@PostMapping("/api/azienda/{istitutoId}")
	public Azienda addAzienda(@PathVariable String istitutoId, @RequestBody Azienda az, HttpServletRequest request) throws Exception {
		ASLUser user = usersValidator.validate(request, Lists.newArrayList(new ASLAuthCheck(ASLRole.DIRIGENTE_SCOLASTICO, istitutoId), new ASLAuthCheck(ASLRole.FUNZIONE_STRUMENTALE, istitutoId)));
		
		// check for 'partita_iva' && 'origin'(INFOTNISTRUZIONE).
		Azienda azInfoTN = aslManager.checkExistingAzienda(az.getPartita_iva(), Constants.ORIGIN_INFOTN);
		if (azInfoTN != null) {
			throw new BadRequestException(errorLabelManager.get("azienda.error.exist"));
		}
		
		az.setId(Utils.getUUID());
		Azienda saved = aslManager.saveAzienda(az);
		
		AuditEntry audit = new AuditEntry(request.getMethod(), Azienda.class, saved.getId(), user, new Object(){});
		auditManager.save(audit);	
		
		return saved;
	}
	
	@PutMapping("/api/azienda/{istitutoId}/{aziendaId}")
	public void updateAzienda(@PathVariable String istitutoId, @PathVariable String aziendaId, @RequestBody Azienda az,
			HttpServletRequest request) throws Exception {
		ASLUser user = usersValidator.validate(request, Lists.newArrayList(new ASLAuthCheck(ASLRole.DIRIGENTE_SCOLASTICO, istitutoId), new ASLAuthCheck(ASLRole.FUNZIONE_STRUMENTALE, istitutoId)));
		
		// check for 'partita_iva' && 'origin'(INFOTNISTRUZIONE).
		Azienda azInfoTN = aslManager.checkExistingAzienda(az.getPartita_iva(), Constants.ORIGIN_INFOTN);
		if (azInfoTN != null) {
			throw new BadRequestException(errorLabelManager.get("azienda.error.exist"));
		}
		
		az.setId(aziendaId);
		aslManager.updateAzienda(az);
		
		AuditEntry audit = new AuditEntry(request.getMethod(), Azienda.class, aziendaId, user, new Object(){});
		auditManager.save(audit);		
	}
	
	@DeleteMapping("/api/azienda/{istitutoId}/{aziendaId}")
	public void deleteAzienda(@PathVariable String istitutoId, @PathVariable String aziendaId, HttpServletRequest request) throws Exception {
		Azienda az = aslManager.getAzienda(aziendaId);
		
		if (az == null) {
			throw new BadRequestException(errorLabelManager.get("azienda.error.notfound"));
		}		
		
		ASLUser user = usersValidator.validate(request, Lists.newArrayList(new ASLAuthCheck(ASLRole.DIRIGENTE_SCOLASTICO, istitutoId), new ASLAuthCheck(ASLRole.FUNZIONE_STRUMENTALE, istitutoId)));		
		
		if (logger.isInfoEnabled()) {
			logger.info(String.format("deleteAzienda[%s]", aziendaId));
		}

		aslManager.deleteAzienda(aziendaId);
		
		AuditEntry audit = new AuditEntry(request.getMethod(), Azienda.class, aziendaId, user, new Object(){});
		auditManager.save(audit);			
	}

	@GetMapping("/api/aziende/{istitutoId}")
	public List<Azienda> getAllAziende(@PathVariable String istitutoId, HttpServletRequest request) throws Exception {
		usersValidator.validate(request, Lists.newArrayList(new ASLAuthCheck(ASLRole.DIRIGENTE_SCOLASTICO, istitutoId), new ASLAuthCheck(ASLRole.FUNZIONE_STRUMENTALE, istitutoId)));
		List<Azienda> az = aslManager.fetchAzienda();
		return az;
	}

	@GetMapping("/api/list/aziende/{istitutoId}")
	public Page<Azienda> getAziende(@PathVariable String istitutoId, @RequestParam(required = false) String text,
			@RequestParam(required = false) String pIva, HttpServletRequest request, Pageable pageRequest)
			throws Exception {
		usersValidator.validate(request, Lists.newArrayList(new ASLAuthCheck(ASLRole.DIRIGENTE_SCOLASTICO, istitutoId),
				new ASLAuthCheck(ASLRole.FUNZIONE_STRUMENTALE, istitutoId)));
		return aslManager.findAziende(text, pIva, pageRequest);
	}

	/** ATTIVITA ALTERNANZA (GRUPPO API) **/
	
	@GetMapping("/api/attivitaGruppo/istituto/{istitutoId}")
	public Page<AttivitaAlternanza> findAttivitaAlternanzaByIstitutoId(@PathVariable String istitutoId, @RequestParam(required=false) Long dataInizio, @RequestParam(required=false) Long dataFine, @RequestParam(required=false) String tipologia, @RequestParam(required=false) Boolean individuale, @RequestParam(required = false) Boolean completata, HttpServletRequest request, Pageable pageRequest) throws Exception {
		usersValidator.validate(request, Lists.newArrayList(new ASLAuthCheck(ASLRole.DIRIGENTE_SCOLASTICO, istitutoId), new ASLAuthCheck(ASLRole.FUNZIONE_STRUMENTALE, istitutoId)));
		
		List<Integer> tipologiaList = null;
		if (tipologia != null) {
		 tipologiaList = Splitter.on(",").splitToList(tipologia).stream().map(x -> Integer.parseInt(x)).collect(Collectors.toList());
		}		
		return aslManager.findAttivitaAlternanzaByIstitutoId(istitutoId, dataInizio, dataFine, tipologiaList, individuale, completata, pageRequest);
	}
	
	/** ESPERIENZE SVOLTA APIS **/
	
	@GetMapping("/api/esperienzaSvolta/istituto/{istitutoId}")
	public Page<EsperienzaSvolta> findEsperienzaSvoltaByIstitutoId(@PathVariable String istitutoId,
			@RequestParam(required = false) Long dataInizio, @RequestParam(required = false) Long dataFine,
			@RequestParam(required = false) String stato, @RequestParam(required = false) String tipologia,
			@RequestParam(required = false) String filterText, @RequestParam(required = false) Boolean individuale,
			@RequestParam(required = false) Boolean terminata, HttpServletRequest request,
			@RequestParam(required = false) String nomeStudente, Pageable pageRequest) throws Exception {
		usersValidator.validate(request, Lists.newArrayList(new ASLAuthCheck(ASLRole.DIRIGENTE_SCOLASTICO, istitutoId),
				new ASLAuthCheck(ASLRole.FUNZIONE_STRUMENTALE, istitutoId)));

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
		Page<EsperienzaSvolta> result = aslManager.findEsperienzaSvoltaByIstitutoId(istitutoId, dataInizio, dataFine,
				statoList, tipologiaList, filterText, individuale, terminata, nomeStudente, pageRequest);

		return result;
	}

	@GetMapping("/api/esperienzaSvolta/{istitutoId}/details/{id}")
	public EsperienzaSvolta getEsperienzaSvolta(@PathVariable String istitutoId, @PathVariable long id, HttpServletRequest request) throws Exception {
		usersValidator.validate(request, Lists.newArrayList(new ASLAuthCheck(ASLRole.DIRIGENTE_SCOLASTICO, istitutoId), new ASLAuthCheck(ASLRole.FUNZIONE_STRUMENTALE, istitutoId)));
		EsperienzaSvolta result = aslManager.getEsperienzaSvolta(id);
		result.getPresenze().computeOreSvolte();
		return result;
	}
	
	
	@PostMapping("/api/esperienzaSvolta/{istitutoId}/noteAzienda/{esId}")
	public EsperienzaSvolta saveNoteAzienda(@PathVariable String istitutoId, @PathVariable long esId, @RequestParam String note, HttpServletRequest request)
			throws Exception {
		ASLUser user = usersValidator.validate(request, Lists.newArrayList(new ASLAuthCheck(ASLRole.DIRIGENTE_SCOLASTICO, istitutoId), new ASLAuthCheck(ASLRole.FUNZIONE_STRUMENTALE, istitutoId)));
		try {
			if (logger.isInfoEnabled()) {
				logger.info(String.format("/esperienzaSvolta/noteAzienda/[%s]", esId));
			}
			EsperienzaSvolta result = aslManager.saveNoteAzienda(esId, note);
			
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
	
	@GetMapping("/api/schedaValutazioneAzienda/{istitutoId}/details/{id}")
	public SchedaValutazione getSchedaValutazioneAzienda(@PathVariable String istitutoId, @PathVariable long id, HttpServletRequest request) throws Exception {
		usersValidator.validate(request, Lists.newArrayList(new ASLAuthCheck(ASLRole.DIRIGENTE_SCOLASTICO, istitutoId), new ASLAuthCheck(ASLRole.FUNZIONE_STRUMENTALE, istitutoId)));

		EsperienzaSvolta es = aslManager.findEsperienzaSvoltaById(id);
		if (es == null) {
			throw new BadRequestException(errorLabelManager.get("esp.error.notfound"));
		}			
		return es.getSchedaValutazioneAzienda();
	}	
	
	@PostMapping("/api/schedaValutazioneAzienda/{istitutoId}/{id}")
	public SchedaValutazione saveSchedaValutazioneAzienda(@PathVariable String istitutoId, @PathVariable long id, @RequestBody SchedaValutazione sva, HttpServletRequest request) throws Exception {
		checkId(id);
		
		ASLUser user = usersValidator.validate(request, Lists.newArrayList(new ASLAuthCheck(ASLRole.DIRIGENTE_SCOLASTICO, istitutoId), new ASLAuthCheck(ASLRole.FUNZIONE_STRUMENTALE, istitutoId)));
		
		EsperienzaSvolta es = aslManager.findEsperienzaSvoltaById(id);
		if (es == null) {
			throw new BadRequestException(errorLabelManager.get("esp.error.notfound"));
		}
		
		es.setSchedaValutazioneAzienda(sva);
		es = aslManager.saveEsperienzaSvolta(es);
		
		SchedaValutazione result = es.getSchedaValutazioneAzienda();

		AuditEntry audit1 = new AuditEntry(request.getMethod(), EsperienzaSvolta.class, es.getId(), user, new Object(){});
		auditManager.save(audit1);
		if (result != null) {
			AuditEntry audit2 = new AuditEntry(request.getMethod(), SchedaValutazione.class, result.getId(), user, new Object(){});
			auditManager.save(audit2);
		}
		
		return result;
	}

}
