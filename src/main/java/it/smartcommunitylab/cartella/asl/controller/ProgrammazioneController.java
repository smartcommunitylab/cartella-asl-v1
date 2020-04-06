package it.smartcommunitylab.cartella.asl.controller;

import java.util.Set;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.google.common.collect.Lists;

import it.smartcommunitylab.cartella.asl.manager.ASLRolesValidator;
import it.smartcommunitylab.cartella.asl.manager.ProgrammazioneManager;
import it.smartcommunitylab.cartella.asl.manager.QueriesManager;
import it.smartcommunitylab.cartella.asl.model.AttivitaAlternanza;
import it.smartcommunitylab.cartella.asl.model.TipologiaAttivita;
import it.smartcommunitylab.cartella.asl.model.report.ReportStudente;
import it.smartcommunitylab.cartella.asl.model.users.ASLAuthCheck;
import it.smartcommunitylab.cartella.asl.model.users.ASLRole;

@RestController
public class ProgrammazioneController implements AslController {


	@Autowired
	private ProgrammazioneManager reportManager;
	
	@Autowired
	private QueriesManager aslManager;	
	
	@Autowired
	private ASLRolesValidator usersValidator;	
	
	private static Log logger = LogFactory.getLog(ProgrammazioneController.class);	
	
	@GetMapping("/api/programmazione/{pianoId}/studenti/report")
	public @ResponseBody Page<ReportStudente> reportStudente(@PathVariable Long pianoId, @RequestParam(required=false) Integer annoCorso, @RequestParam(required=true) String annoScolastico, @RequestParam(required=false) String nome, @RequestParam(required=false) String studenteId, Pageable pageRequest, HttpServletRequest request) throws Exception {
//		String istitutoId = aslManager.findPianoAlternanzaIstitutoId(pianoId);
//		usersValidator.validate(request, Lists.newArrayList(new ASLAuthCheck(ASLRole.DIRIGENTE_SCOLASTICO, istitutoId), new ASLAuthCheck(ASLRole.FUNZIONE_STRUMENTALE, istitutoId)));			
		
		return reportManager.generateReportStudente(pianoId, annoCorso, annoScolastico, nome, studenteId, pageRequest);
	}	

//	@GetMapping("/api/programmazione/{pianoId}/classi/report")
//	public @ResponseBody Page<ReportClasse> reportClasse(@PathVariable Long pianoId, @RequestParam(required=false) Integer annoCorso, @RequestParam(required=true) String annoScolastico, @RequestParam(required=false) String classe, Pageable pageRequest, HttpServletRequest request) throws Exception {
//		String istitutoId = aslManager.findPianoAlternanzaIstitutoId(pianoId);
//		usersValidator.validate(request, Lists.newArrayList(new ASLAuthCheck(ASLRole.DIRIGENTE_SCOLASTICO, istitutoId), new ASLAuthCheck(ASLRole.FUNZIONE_STRUMENTALE, istitutoId)));	
//		
//		return reportManager.generateReportClasse(pianoId, annoCorso, annoScolastico, classe, pageRequest);
//	}	
		
	@GetMapping("/api/programmazione/{pianoId}/attivitaAlternanza")
	public @ResponseBody Set<AttivitaAlternanza> getAttivitaAlternanzaByClasseOrStudente(@PathVariable Long pianoId, @RequestParam(required=true) Integer annoCorso, @RequestParam(required=false) String classe, @RequestParam(required=false) String studenteId, @RequestParam(required=false) Boolean individuale, HttpServletRequest request) throws Exception {
		String istitutoId = aslManager.findPianoAlternanzaIstitutoId(pianoId);
		usersValidator.validate(request, Lists.newArrayList(new ASLAuthCheck(ASLRole.DIRIGENTE_SCOLASTICO, istitutoId), new ASLAuthCheck(ASLRole.FUNZIONE_STRUMENTALE, istitutoId)));			
		
		return reportManager.findAttivitaAlternanza(pianoId, annoCorso, classe, studenteId, individuale);
	}		
	
	@GetMapping("/api/programmazione/{pianoId}/tipologieAttivitaMancanti")
	public @ResponseBody Set<TipologiaAttivita> getTipologieAttivitaMancantiByClasseOrStudente(@PathVariable Long pianoId, @RequestParam(required=true) Integer annoCorso, @RequestParam(required=false) String classe, @RequestParam(required=false) String studenteId, @RequestParam(required=false) Boolean individuale, HttpServletRequest request) throws Exception {
		String istitutoId = aslManager.findPianoAlternanzaIstitutoId(pianoId);
		usersValidator.validate(request, Lists.newArrayList(new ASLAuthCheck(ASLRole.DIRIGENTE_SCOLASTICO, istitutoId), new ASLAuthCheck(ASLRole.FUNZIONE_STRUMENTALE, istitutoId)));			
		
		return reportManager.findTipologieAttivitaMancanti(pianoId, annoCorso, classe, studenteId, individuale);
	}	
	
}
