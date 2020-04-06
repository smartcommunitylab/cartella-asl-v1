package it.smartcommunitylab.cartella.asl.controller;

import java.util.List;
import java.util.stream.Collectors;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
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

import it.smartcommunitylab.cartella.asl.manager.ASLRolesValidator;
import it.smartcommunitylab.cartella.asl.manager.AuditManager;
import it.smartcommunitylab.cartella.asl.manager.QueriesManager;
import it.smartcommunitylab.cartella.asl.model.AttivitaAlternanza;
import it.smartcommunitylab.cartella.asl.model.AttivitaAlternanzaStub;
import it.smartcommunitylab.cartella.asl.model.Presenze;
import it.smartcommunitylab.cartella.asl.model.audit.AuditEntry;
import it.smartcommunitylab.cartella.asl.model.users.ASLAuthCheck;
import it.smartcommunitylab.cartella.asl.model.users.ASLRole;
import it.smartcommunitylab.cartella.asl.model.users.ASLUser;

@RestController
public class AttivitaAlternanzaController implements AslController {

	@Autowired
	private QueriesManager aslManager;

	@Autowired
	private ASLRolesValidator usersValidator;

	@Autowired
	private AuditManager auditManager;

	private static Log logger = LogFactory.getLog(AttivitaAlternanzaController.class);

	@GetMapping("/api/attivitaAlternanza/{id}")
	public AttivitaAlternanza getAttivitaAlternanza(@PathVariable long id, HttpServletRequest request)
			throws Exception {
		AttivitaAlternanza aa = aslManager.getAttivitaAlternanza(id, true);

		if (aa != null) {
			usersValidator.validate(request,
					Lists.newArrayList(new ASLAuthCheck(ASLRole.DIRIGENTE_SCOLASTICO, aa.getIstitutoId()),
							new ASLAuthCheck(ASLRole.FUNZIONE_STRUMENTALE, aa.getIstitutoId())));
		}

		return aa;
	}

	@GetMapping("/api/attivitaAlternanza/anno/{id}")
	public Page<AttivitaAlternanza> getAttivitaAlternanza(@PathVariable long id, HttpServletRequest request,
			Pageable pageRequest) throws Exception {
		String istitutoId = aslManager.findAnnoAlternanzaIstitutoId(id);
		usersValidator.validate(request, Lists.newArrayList(new ASLAuthCheck(ASLRole.DIRIGENTE_SCOLASTICO, istitutoId),
				new ASLAuthCheck(ASLRole.FUNZIONE_STRUMENTALE, istitutoId)));

		return aslManager.findAttivitaAlternanzaByAnnoAlternanzaId(id, pageRequest);
	}

	@GetMapping("/api/attivitaAlternanza/tags/{istitutoId}/{tags}")
	public Page<AttivitaAlternanza> getAttivitaAlternanza(@PathVariable String istitutoId, @PathVariable String tags,
			HttpServletRequest request, Pageable pageRequest) throws Exception {
		usersValidator.validate(request, Lists.newArrayList(new ASLAuthCheck(ASLRole.DIRIGENTE_SCOLASTICO, istitutoId),
				new ASLAuthCheck(ASLRole.FUNZIONE_STRUMENTALE, istitutoId)));

		return aslManager.findAttivitaAlternanzaByIstitutoIdAndTags(istitutoId, tags, pageRequest);
	}

	@PutMapping("/api/attivitaAlternanza/{id}")
	public void updateAttivitaAlternanzaAtCurrentDate(@RequestBody AttivitaAlternanzaStub aaStub, @PathVariable Long id,
			HttpServletRequest request) throws Exception {
		String istitutoId = aslManager.findAttivitaAlternanzaIstitutoId(id);
		ASLUser user = usersValidator.validate(request,
				Lists.newArrayList(new ASLAuthCheck(ASLRole.DIRIGENTE_SCOLASTICO, istitutoId),
						new ASLAuthCheck(ASLRole.FUNZIONE_STRUMENTALE, istitutoId)));

		aslManager.updateAttivitaAlternanzaAtCurrentDate(id, aaStub);

		AuditEntry audit = new AuditEntry(request.getMethod(), AttivitaAlternanza.class, id, user, new Object() {
		});
		auditManager.save(audit);
	}

	@DeleteMapping("/api/attivitaAlternanza/{id}")
	public void deleteAttivitaAlternanza(@PathVariable Long id, HttpServletRequest request) throws Exception {
		String istitutoId = aslManager.findAttivitaAlternanzaIstitutoId(id);
		ASLUser user = usersValidator.validate(request,
				Lists.newArrayList(new ASLAuthCheck(ASLRole.DIRIGENTE_SCOLASTICO, istitutoId),
						new ASLAuthCheck(ASLRole.FUNZIONE_STRUMENTALE, istitutoId)));

		aslManager.deleteAttivitaAlternanza(id);

		AuditEntry audit = new AuditEntry(request.getMethod(), AttivitaAlternanza.class, id, user, new Object() {
		});
		auditManager.save(audit);
	}

	@GetMapping("/api/attivitaAlternanza/azienda")
	public Page<AttivitaAlternanza> findAttivitaAlternanzaByIstitutoAndAziendaIds(
			@RequestParam(required = false) String istitutoId, @RequestParam String aziendaId,
			@RequestParam(required = false) Long dataInizio, @RequestParam(required = false) Long dataFine,
			@RequestParam(required = false) String tipologia, @RequestParam(required = false) Boolean individuale,
			HttpServletRequest request, Pageable pageRequest) throws Exception {
		usersValidator.validate(request,
				Lists.newArrayList(new ASLAuthCheck(ASLRole.LEGALE_RAPPRESENTANTE_AZIENDA, aziendaId),
						new ASLAuthCheck(ASLRole.REFERENTE_AZIENDA, aziendaId)));

		List<Integer> tipologiaList = null;
		if (tipologia != null) {
			tipologiaList = Splitter.on(",").splitToList(tipologia).stream().map(x -> Integer.parseInt(x))
					.collect(Collectors.toList());
		}
		return aslManager.findAttivitaAlternanzaByIstitutoAndAziendaIds(istitutoId, aziendaId, dataInizio, dataFine,
				tipologiaList, individuale, pageRequest);
	}

	@PostMapping("/api/attivitaAlternanza/{opcorsoId}/gruppo/pianoAlternanza/{pianoAlternanzaId}/annoCorso/{annoCorso}")
	public AttivitaAlternanza saveAttivitaAlternanzaGruppo(@PathVariable Long opcorsoId,
			@PathVariable Long pianoAlternanzaId, @PathVariable Long annoCorso,
			@RequestBody AttivitaAlternanzaStub aaStub, HttpServletRequest request) throws Exception {
		String istitutoId = aslManager.findPianoAlternanzaIstitutoId(pianoAlternanzaId);
		ASLUser user = usersValidator.validate(request,
				Lists.newArrayList(new ASLAuthCheck(ASLRole.DIRIGENTE_SCOLASTICO, istitutoId),
						new ASLAuthCheck(ASLRole.FUNZIONE_STRUMENTALE, istitutoId)));

		auditManager.beginAudit(user);

		AttivitaAlternanza aa = aslManager.createAttivitaAlternanzaByOppCorsoAndGruppo(opcorsoId, pianoAlternanzaId,
				annoCorso, aaStub);

		if (aa != null) {
			AuditEntry audit = new AuditEntry(request.getMethod(), AttivitaAlternanza.class, aa.getId(), user,
					new Object() {
					});
			auditManager.save(audit);
		}

		auditManager.endAudit();

		return aa;
	}
	
	@PutMapping("/api/attivitaAlternanza/{id}/completa")
	public void completaAttivitaAlternanza(@PathVariable long id, @RequestBody List<Presenze> updatedES, HttpServletRequest request) throws Exception {
		
		String istitutoId = aslManager.findAttivitaAlternanzaIstitutoId(id);
		usersValidator.validate(request, Lists.newArrayList(new ASLAuthCheck(ASLRole.DIRIGENTE_SCOLASTICO, istitutoId), new ASLAuthCheck(ASLRole.FUNZIONE_STRUMENTALE, istitutoId)));		
		
		aslManager.completaAttivitaAlternanza(id, updatedES);
	}

}
