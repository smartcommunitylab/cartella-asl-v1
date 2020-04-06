package it.smartcommunitylab.cartella.asl.controller;

import java.util.List;

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
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.google.common.collect.Lists;

import it.smartcommunitylab.cartella.asl.manager.ASLRolesValidator;
import it.smartcommunitylab.cartella.asl.manager.AuditManager;
import it.smartcommunitylab.cartella.asl.manager.QueriesManager;
import it.smartcommunitylab.cartella.asl.model.CorsoDiStudio;
import it.smartcommunitylab.cartella.asl.model.PianoAlternanza;
import it.smartcommunitylab.cartella.asl.model.audit.AuditEntry;
import it.smartcommunitylab.cartella.asl.model.users.ASLAuthCheck;
import it.smartcommunitylab.cartella.asl.model.users.ASLRole;
import it.smartcommunitylab.cartella.asl.model.users.ASLUser;

@RestController
public class PianoAlternanzaController implements AslController {

	@Autowired
	private QueriesManager aslManager;
	
	@Autowired
	private ASLRolesValidator usersValidator;			

	@Autowired
	private AuditManager auditManager;		
	
	private static Log logger = LogFactory.getLog(PianoAlternanzaController.class);

	@GetMapping("/api/reset")
	public @ResponseBody void reset() throws Exception {
		aslManager.reset();
	}

	@PostMapping("/api/pianoAlternanza")
	public @ResponseBody PianoAlternanza savePianoAlternanza(@RequestBody PianoAlternanza pa, HttpServletRequest request) throws Exception {
		checkNullId(pa.getId());
		
		String istitutoId = pa.getIstitutoId();
		ASLUser user = usersValidator.validate(request, Lists.newArrayList(new ASLAuthCheck(ASLRole.DIRIGENTE_SCOLASTICO, istitutoId), new ASLAuthCheck(ASLRole.FUNZIONE_STRUMENTALE, istitutoId)));
		
		PianoAlternanza result = aslManager.createPianoAlternanza(pa);
		
		if (result != null) {
			AuditEntry audit = new AuditEntry(request.getMethod(), PianoAlternanza.class, result.getId(), user, new Object(){});
			auditManager.save(audit);
		}
		
		return result;
	}

	@GetMapping("/api/pianoAlternanza/{id}")
	public PianoAlternanza getPianoAlternanza(@PathVariable long id, HttpServletRequest request) throws Exception {
		String istitutoId = aslManager.findPianoAlternanzaIstitutoId(id);
		usersValidator.validate(request, Lists.newArrayList(new ASLAuthCheck(ASLRole.DIRIGENTE_SCOLASTICO, istitutoId), new ASLAuthCheck(ASLRole.FUNZIONE_STRUMENTALE, istitutoId)));		
		
		return aslManager.getPianoAlternanza(id);
	}

	@PutMapping("/api/pianoAlternanza")
	public void updatePianoAlternanza(@RequestBody PianoAlternanza pa, HttpServletRequest request) throws Exception {
		checkId(pa.getId());
		
		String istitutoId = pa.getIstitutoId();
		ASLUser user = usersValidator.validate(request, Lists.newArrayList(new ASLAuthCheck(ASLRole.DIRIGENTE_SCOLASTICO, istitutoId), new ASLAuthCheck(ASLRole.FUNZIONE_STRUMENTALE, istitutoId)));		
		
		aslManager.updatePianoAlternanza(pa);
		
		AuditEntry audit = new AuditEntry(request.getMethod(), PianoAlternanza.class, pa.getId(), user, new Object(){});
		auditManager.save(audit);			
	}
	
	@PutMapping("/api/pianoAlternanza/{id}/competenze")
	public PianoAlternanza addCompetenzeToPianoAlternanza(@PathVariable long id, @RequestBody List<Long> ids, HttpServletRequest request) throws Exception {
		String istitutoId = aslManager.findPianoAlternanzaIstitutoId(id);
		ASLUser user = usersValidator.validate(request, Lists.newArrayList(new ASLAuthCheck(ASLRole.DIRIGENTE_SCOLASTICO, istitutoId), new ASLAuthCheck(ASLRole.FUNZIONE_STRUMENTALE, istitutoId)));		
		
		PianoAlternanza result =  aslManager.addCompetenzeToPianoAlternanza(id, ids);
		
		if (result != null) {
			AuditEntry audit = new AuditEntry(request.getMethod(), PianoAlternanza.class, result.getId(), user, new Object(){});
			auditManager.save(audit);
		}
		
		return result;
	}	
	
	@DeleteMapping("/api/pianoAlternanza/{paId}/competenze/{cId}")
	public PianoAlternanza deleteCompetenzaFromPianoAlternanza(@PathVariable long paId, @PathVariable long cId, HttpServletRequest request) throws Exception {
		String istitutoId = aslManager.findPianoAlternanzaIstitutoId(paId);
		ASLUser user = usersValidator.validate(request, Lists.newArrayList(new ASLAuthCheck(ASLRole.DIRIGENTE_SCOLASTICO, istitutoId), new ASLAuthCheck(ASLRole.FUNZIONE_STRUMENTALE, istitutoId)));
		
		PianoAlternanza result = aslManager.deleteCompetenzaFromPianoAlternanza(paId, cId);
		
		if (result != null) {
			AuditEntry audit = new AuditEntry(request.getMethod(), PianoAlternanza.class, result.getId(), user, new Object(){});
			auditManager.save(audit);
		}
		
		return result;
	}	
	
	@DeleteMapping("/api/pianoAlternanza/{id}")
	public boolean deletePianoAlternanza(@PathVariable long id, HttpServletRequest request) throws Exception {
		String istitutoId = aslManager.findPianoAlternanzaIstitutoId(id);
		ASLUser user = usersValidator.validate(request, Lists.newArrayList(new ASLAuthCheck(ASLRole.DIRIGENTE_SCOLASTICO, istitutoId), new ASLAuthCheck(ASLRole.FUNZIONE_STRUMENTALE, istitutoId)));	
		
		boolean result = aslManager.deletePianoAlternanza(id);
		
		AuditEntry audit = new AuditEntry(request.getMethod(), PianoAlternanza.class, id, user, new Object(){});
		auditManager.save(audit);			
		
		return result;
	}
	
	@GetMapping("/api/pianiAlternanza/uso")
	public Page<PianoAlternanza> getPianiAlternanzaUso(@RequestParam(required=true) String istitutoId, @RequestParam(required=false) String corsoDiStudioId, Pageable pageRequest, HttpServletRequest request) throws Exception {
		usersValidator.validate(request, Lists.newArrayList(new ASLAuthCheck(ASLRole.DIRIGENTE_SCOLASTICO, istitutoId), new ASLAuthCheck(ASLRole.FUNZIONE_STRUMENTALE, istitutoId)));
		
		return aslManager.findPianoAlternanzaByIstitutoAndCorsoDiStudioIdsInUso(istitutoId, corsoDiStudioId, pageRequest);
	}	
	
	@GetMapping("/api/pianiAlternanza/stato")
	public Page<PianoAlternanza> getPianiAlternanzaStato(@RequestParam(required=true) String istitutoId, @RequestParam(required=false) String corsoDiStudioId, @RequestParam(required=true) String annoScolasticoCorrente,  @RequestParam(required=false) Integer stato, Pageable pageRequest, HttpServletRequest request) throws Exception {
		usersValidator.validate(request, Lists.newArrayList(new ASLAuthCheck(ASLRole.DIRIGENTE_SCOLASTICO, istitutoId), new ASLAuthCheck(ASLRole.FUNZIONE_STRUMENTALE, istitutoId)));
		
		return aslManager.findPianoAlternanzaByIstitutoAndCorsoDiStudioIdsStato(istitutoId, corsoDiStudioId, annoScolasticoCorrente, stato, pageRequest);
	}		
	
	@GetMapping("/api/pianiAlternanza/completo")
	public Page<PianoAlternanza> findPianoAlternanzaComplete(@RequestParam(required=true) String istitutoId, @RequestParam(required=false) String corsoDiStudioId, @RequestParam(required=true) String annoScolasticoCorrente,  @RequestParam(required=false) Integer stato, Pageable pageRequest, HttpServletRequest request) throws Exception {
		usersValidator.validate(request, Lists.newArrayList(new ASLAuthCheck(ASLRole.DIRIGENTE_SCOLASTICO, istitutoId), new ASLAuthCheck(ASLRole.FUNZIONE_STRUMENTALE, istitutoId)));
		
		return aslManager.findPianoAlternanzaComplete(istitutoId, corsoDiStudioId, annoScolasticoCorrente, stato, pageRequest);
	}		
	
	@PostMapping("/api/pianoAlternanza/clone/{id}")
	public PianoAlternanza clonePianoAlternanza(@PathVariable long id, HttpServletRequest request) throws Exception {
		String istitutoId = aslManager.findPianoAlternanzaIstitutoId(id);
		ASLUser user = usersValidator.validate(request, Lists.newArrayList(new ASLAuthCheck(ASLRole.DIRIGENTE_SCOLASTICO, istitutoId), new ASLAuthCheck(ASLRole.FUNZIONE_STRUMENTALE, istitutoId)));			
		
		PianoAlternanza result =  aslManager.clonePianoAlternanza(id);
		
		if (result != null) {
			AuditEntry audit = new AuditEntry(request.getMethod(), PianoAlternanza.class, result.getId(), user, new Object(){});
			auditManager.save(audit);
		}
		
		return result;
	}	
	
	@PutMapping("/api/pianoAlternanza/activate/{id}")
	public @ResponseBody PianoAlternanza activatePianoAlternanza(@PathVariable Long id, HttpServletRequest request) throws Exception {
		String istitutoId = aslManager.findPianoAlternanzaIstitutoId(id);
		ASLUser user = usersValidator.validate(request, Lists.newArrayList(new ASLAuthCheck(ASLRole.DIRIGENTE_SCOLASTICO, istitutoId), new ASLAuthCheck(ASLRole.FUNZIONE_STRUMENTALE, istitutoId)));			
		
		PianoAlternanza result = aslManager.activatePianoAlternanza(id);
		
		if (result != null) {
			AuditEntry audit = new AuditEntry(request.getMethod(), PianoAlternanza.class, result.getId(), user, new Object(){});
			auditManager.save(audit);
		}
		
		return result;		
	}	
	
	@PutMapping("/api/pianoAlternanza/deactivate/{id}")
	public @ResponseBody void dactivatePianoAlternanza(@PathVariable Long id, HttpServletRequest request) throws Exception {
		String istitutoId = aslManager.findPianoAlternanzaIstitutoId(id);
		ASLUser user = usersValidator.validate(request, Lists.newArrayList(new ASLAuthCheck(ASLRole.DIRIGENTE_SCOLASTICO, istitutoId), new ASLAuthCheck(ASLRole.FUNZIONE_STRUMENTALE, istitutoId)));			
		
		aslManager.updatePianoAlternanzaStato(id, false);
		
		AuditEntry audit = new AuditEntry(request.getMethod(), PianoAlternanza.class, id, user, new Object(){});
		auditManager.save(audit);			
	}		
	
	@GetMapping("/api/corsiDiStudio/{istitutoId}")
	public List<CorsoDiStudio> getCorsiDiStudio(@PathVariable String istitutoId, @RequestParam(required=false) String annoScolastico, HttpServletRequest request) throws Exception {
		usersValidator.validate(request, Lists.newArrayList(new ASLAuthCheck(ASLRole.DIRIGENTE_SCOLASTICO, istitutoId), new ASLAuthCheck(ASLRole.FUNZIONE_STRUMENTALE, istitutoId)));
		
		return aslManager.findCorsiDiStudio(istitutoId, annoScolastico);
	}
	
	@PutMapping("/api/annoAlternanza/{paId}/{annoCorso}")
	public void updateAnnoAlternanza(@PathVariable long paId, @PathVariable int annoCorso, @RequestParam(required=true) Integer oreTotali, HttpServletRequest request) throws Exception {
		String istitutoId = aslManager.findPianoAlternanzaIstitutoId(paId);
		ASLUser user = usersValidator.validate(request, Lists.newArrayList(new ASLAuthCheck(ASLRole.DIRIGENTE_SCOLASTICO, istitutoId), new ASLAuthCheck(ASLRole.FUNZIONE_STRUMENTALE, istitutoId)));		
		
		aslManager.setOreTotaliAnnoAlternanza(paId, annoCorso, oreTotali);
		
		AuditEntry audit = new AuditEntry(request.getMethod(), PianoAlternanza.class, paId, user, new Object(){});
		auditManager.save(audit);				
	}	
	
}
