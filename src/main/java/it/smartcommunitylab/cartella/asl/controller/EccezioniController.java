package it.smartcommunitylab.cartella.asl.controller;

import java.util.List;
import java.util.stream.Collectors;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
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
import it.smartcommunitylab.cartella.asl.model.audit.AuditEntry;
import it.smartcommunitylab.cartella.asl.model.eccezioni.EccezioniGroup;
import it.smartcommunitylab.cartella.asl.model.users.ASLAuthCheck;
import it.smartcommunitylab.cartella.asl.model.users.ASLRole;
import it.smartcommunitylab.cartella.asl.model.users.ASLUser;
import it.smartcommunitylab.cartella.asl.util.ErrorLabelManager;

@RestController
public class EccezioniController implements AslController {

	@Autowired
	private QueriesManager aslManager;
	
	@Autowired
	private ASLRolesValidator usersValidator;		
	
	@Autowired
	private ErrorLabelManager errorLabelManager;
	
	@Autowired
	private AuditManager auditManager;		

	private static Log logger = LogFactory.getLog(EccezioniController.class);

	// TODO: add classe/studente
	@GetMapping("/api/eccezioni/list")
	public List<EccezioniGroup> findEccezioni(@RequestParam String istitutoId, @RequestParam(required = false) String corsoDiStudioId, @RequestParam(required = false) Integer annoCorso,
			@RequestParam(required = false) Long dataInizio, @RequestParam(required = false) Long dataFine, @RequestParam(required = false) String tipologia, @RequestParam(required = false) String classe, @RequestParam(required = false) String studenteId, HttpServletRequest request, Pageable pageRequest) throws Exception {
		usersValidator.validate(request, Lists.newArrayList(new ASLAuthCheck(ASLRole.DIRIGENTE_SCOLASTICO, istitutoId), new ASLAuthCheck(ASLRole.FUNZIONE_STRUMENTALE, istitutoId)));
		
		List<Integer> tipologiaList = null;
		if (tipologia != null) {
			tipologiaList = Splitter.on(",").splitToList(tipologia).stream().map(x -> Integer.parseInt(x)).collect(Collectors.toList());
		}

		return aslManager.findEccezioni(istitutoId, corsoDiStudioId, annoCorso, dataInizio, dataFine, tipologiaList, classe, studenteId, pageRequest);
	}

	@PostMapping("/api/eccezioni/attivita/{oppCorsoId}/studente")
	public AttivitaAlternanza solveEccezioneWithOppCorso(@PathVariable long oppCorsoId, @RequestParam(required = true) Long pianoAlternanzaId, @RequestParam(required = true) String studenti, @RequestParam(required = true) Long attivitaAlternanzaId, @RequestBody AttivitaAlternanzaStub aaStub, HttpServletRequest request) throws Exception {
		String istitutoId = aslManager.findPianoAlternanzaIstitutoId(pianoAlternanzaId);
		ASLUser user = usersValidator.validate(request, Lists.newArrayList(new ASLAuthCheck(ASLRole.DIRIGENTE_SCOLASTICO, istitutoId), new ASLAuthCheck(ASLRole.FUNZIONE_STRUMENTALE, istitutoId)));
		
		List<String> studentiList = null;
		studentiList = Splitter.on(",").splitToList(studenti);

		AttivitaAlternanza result = aslManager.createEccezioneSolution(oppCorsoId, pianoAlternanzaId, studentiList, attivitaAlternanzaId, aaStub);
		
		if (result != null) {
			AuditEntry audit = new AuditEntry(request.getMethod(), AttivitaAlternanza.class, result.getId(), user, new Object(){});
			auditManager.save(audit);
		}
		
		return result;
	}

}
