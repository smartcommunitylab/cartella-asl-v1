package it.smartcommunitylab.cartella.asl.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.google.common.collect.Lists;
import com.google.common.collect.Maps;
import com.google.common.collect.Sets;

import it.smartcommunitylab.cartella.asl.exception.BadRequestException;
import it.smartcommunitylab.cartella.asl.manager.ASLRolesValidator;
import it.smartcommunitylab.cartella.asl.manager.AttivitaGiornaliereManager;
import it.smartcommunitylab.cartella.asl.manager.AuditManager;
import it.smartcommunitylab.cartella.asl.manager.QueriesManager;
import it.smartcommunitylab.cartella.asl.model.AttivitaAlternanza;
import it.smartcommunitylab.cartella.asl.model.Presenze;
import it.smartcommunitylab.cartella.asl.model.Studente;
import it.smartcommunitylab.cartella.asl.model.audit.AuditEntry;
import it.smartcommunitylab.cartella.asl.model.report.ReportAttivitaGiornaliera;
import it.smartcommunitylab.cartella.asl.model.report.ReportEsperienzeStudente;
import it.smartcommunitylab.cartella.asl.model.users.ASLAuthCheck;
import it.smartcommunitylab.cartella.asl.model.users.ASLRole;
import it.smartcommunitylab.cartella.asl.model.users.ASLUser;
import it.smartcommunitylab.cartella.asl.util.ErrorLabelManager;
import it.smartcommunitylab.cartella.asl.util.Utils;

@RestController
public class AttivitaGiornaliereController implements AslController {

	@Autowired
	private AttivitaGiornaliereManager agManager;

	@Autowired
	private QueriesManager aslManager;	
	
	@Autowired
	private AttivitaGiornaliereManager reportManager;
	
	@Autowired
	private ASLRolesValidator usersValidator;		
	
	@Autowired
	private ErrorLabelManager errorLabelManager;	
	
	@Autowired
	private AuditManager auditManager;		

	private static Log logger = LogFactory.getLog(AttivitaGiornaliereController.class);

	@GetMapping("/api/attivitaGiornaliera/{istitutoId}")
	public Page<AttivitaAlternanza> findAttivitaAlternanzaClasse(@PathVariable String istitutoId, @RequestParam(required = false) String corsoStudioId, @RequestParam(required = false) String nomeStudente,
			@RequestParam(required = false) String annoScolastico, @RequestParam(required = false) Integer annoCorso, @RequestParam(required = false) Integer tipologia,
			@RequestParam(required = false) Long dataInizio, @RequestParam(required = false) Long dataFine,
			@RequestParam(required = false) String titolo, @RequestParam(required = false) Boolean individuale, @RequestParam(required = false) Boolean interna, @RequestParam(required = false) Boolean completata, @RequestParam(required = false) String tags, HttpServletRequest request, Pageable pageRequest) throws Exception {
		usersValidator.validate(request, Lists.newArrayList(new ASLAuthCheck(ASLRole.DIRIGENTE_SCOLASTICO, istitutoId), new ASLAuthCheck(ASLRole.FUNZIONE_STRUMENTALE, istitutoId)));
		return agManager.findAttivitaAlternanza(istitutoId, corsoStudioId, annoScolastico, annoCorso, tipologia, dataInizio, dataFine, titolo, individuale, interna, completata, tags, nomeStudente, pageRequest);
	}

	@PutMapping("/api/attivitaGiornaliera/archivio/{attivitaId}/completata/{completata}")
	public void setAttivitaAlternanzaCompletata(@PathVariable long attivitaId, @PathVariable boolean completata, HttpServletRequest request) throws Exception {
		String istitutoId = aslManager.findAttivitaAlternanzaIstitutoId(attivitaId);
		ASLUser user = usersValidator.validate(request, Lists.newArrayList(new ASLAuthCheck(ASLRole.DIRIGENTE_SCOLASTICO, istitutoId), new ASLAuthCheck(ASLRole.FUNZIONE_STRUMENTALE, istitutoId)));		
		
		agManager.updateCompletata(attivitaId, completata);
		
		AuditEntry audit = new AuditEntry(request.getMethod(), AttivitaAlternanza.class, attivitaId, user, new Object(){});
		auditManager.save(audit);		
	}

	@GetMapping("/api/attivitaGiornaliera/calendario/{attivitaId}")
	public Map<String, Presenze> findAttivitaAlternanzaCalendario(@PathVariable Long attivitaId, HttpServletRequest request) throws Exception {
		String istitutoId = aslManager.findAttivitaAlternanzaIstitutoId(attivitaId);
		usersValidator.validate(request, Lists.newArrayList(new ASLAuthCheck(ASLRole.DIRIGENTE_SCOLASTICO, istitutoId), new ASLAuthCheck(ASLRole.FUNZIONE_STRUMENTALE, istitutoId)));		
		
		return agManager.findAttivitaAlternanzaCalendario(attivitaId);
	}

	@PutMapping("/api/attivitaGiornaliera/calendario")
	public void setAttivitaAlternanzaCalendario(@RequestBody Map<String, Presenze> calendar, HttpServletRequest request) throws Exception {
		Map<Presenze, Set<ASLAuthCheck>> allChecks = buildCalendarAuthChecks(calendar);
		ASLUser user = null;
		for (Set<ASLAuthCheck> checks : allChecks.values()) {
			user = usersValidator.validate(request, checks);
		}
		
		Map<Presenze, Boolean> isNotOnlyStudent = Maps.newHashMap();
		for (Presenze presenza : allChecks.keySet()) {
			Set<ASLAuthCheck> checks = allChecks.get(presenza);
			if (usersValidator.hasOnlyRole(request, ASLRole.STUDENTE)) {
				isNotOnlyStudent.put(presenza, false);
			} else {
				isNotOnlyStudent.put(presenza, true);
			}
		}

		if (user != null) {
			auditManager.beginAudit(user);

			agManager.setAttivitaAlternanzaCalendario(calendar, isNotOnlyStudent);

			auditManager.endAudit();
		}
	}

	@GetMapping("/api/attivitaGiornaliera/studenti/report/{istitutoId}/studenti/report")
	public @ResponseBody Page<ReportAttivitaGiornaliera> reportAttivitaGiornalieraStudente(@PathVariable String istitutoId, @RequestParam(required = false) Integer annoCorso,
			@RequestParam(required = false) String classe, @RequestParam(required = false) String nome, @RequestParam(required = true) String annoScolastico, HttpServletRequest request, Pageable pageRequest)
			throws Exception {
		usersValidator.validate(request, Lists.newArrayList(new ASLAuthCheck(ASLRole.DIRIGENTE_SCOLASTICO, istitutoId), new ASLAuthCheck(ASLRole.FUNZIONE_STRUMENTALE, istitutoId)));

		return reportManager.generateReportAttivitaGiornalieraStudente(istitutoId, annoCorso, nome, annoScolastico, pageRequest);
	}

	@GetMapping("/api/attivitaGiornaliera/esperienze/report/{studenteId}")
	public @ResponseBody List<ReportEsperienzeStudente> reportEsperienzeStudenti(@PathVariable String studenteId, HttpServletRequest request) throws Exception {
		Studente student = aslManager.findStudente(studenteId);
		
		if (student == null) {
			throw new BadRequestException(errorLabelManager.get("studente.error.notfound"));
		}	
		String istitutoId = aslManager.findStudenteIstitutoId(studenteId);
		usersValidator.validate(request, Lists.newArrayList(new ASLAuthCheck(ASLRole.DIRIGENTE_SCOLASTICO, istitutoId), new ASLAuthCheck(ASLRole.FUNZIONE_STRUMENTALE, istitutoId)));				
		
		return reportManager.generateReportEsperienzeStudente(studenteId);
	}
	
	private Map<Presenze, Set<ASLAuthCheck>> buildCalendarAuthChecks(Map<String, Presenze> calendar) {
		Map<Presenze, Set<ASLAuthCheck>> allChecks = Maps.newHashMap();
		Map<String, Presenze> copy = new HashMap<String, Presenze>();
		copy.putAll(calendar);
		
		for (Presenze presenza: copy.values()) {
			Set<ASLAuthCheck> checks = Sets.newHashSet();
			
			String attivitaIstituteId = aslManager.getEsperienzaSvolta(presenza.getEsperienzaSvoltaId()).getAttivitaAlternanza().getIstitutoId();
			String studenteId = presenza.getStudenteId();
			String istitutoId = aslManager.findStudenteIstitutoId(studenteId);
			
			if (!attivitaIstituteId.equalsIgnoreCase(istitutoId)) {
				calendar.remove(Utils.getKey(copy, presenza));
				continue;
			}
			
			checks.add(new ASLAuthCheck(ASLRole.STUDENTE, studenteId));
			checks.add(new ASLAuthCheck(ASLRole.DIRIGENTE_SCOLASTICO, istitutoId));
			checks.add(new ASLAuthCheck(ASLRole.FUNZIONE_STRUMENTALE, istitutoId));
			
			String aziendaId = aslManager.findEsperienzaSvoltaAziendaId(presenza.getEsperienzaSvoltaId());
			if (aziendaId != null) {
				checks.add(new ASLAuthCheck(ASLRole.LEGALE_RAPPRESENTANTE_AZIENDA, aziendaId));
				checks.add(new ASLAuthCheck(ASLRole.REFERENTE_AZIENDA, aziendaId));
			}
			
			allChecks.put(presenza, checks);
		}
		
		return allChecks; 
	}

}
