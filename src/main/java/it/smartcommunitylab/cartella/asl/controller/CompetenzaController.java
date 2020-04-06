package it.smartcommunitylab.cartella.asl.controller;

import java.util.List;
import java.util.Map;

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

import com.google.common.collect.Lists;

import it.smartcommunitylab.cartella.asl.manager.ASLRolesValidator;
import it.smartcommunitylab.cartella.asl.manager.AuditManager;
import it.smartcommunitylab.cartella.asl.manager.QueriesManager;
import it.smartcommunitylab.cartella.asl.model.Competenza;
import it.smartcommunitylab.cartella.asl.model.audit.AuditEntry;
import it.smartcommunitylab.cartella.asl.model.users.ASLAuthCheck;
import it.smartcommunitylab.cartella.asl.model.users.ASLRole;
import it.smartcommunitylab.cartella.asl.model.users.ASLUser;

// TODO acl?
@RestController
public class CompetenzaController implements AslController {

	@Autowired
	private QueriesManager aslManager;
	
	@Autowired
	private ASLRolesValidator usersValidator;	
	
	@Autowired
	private AuditManager auditManager;
	
	private static Log logger = LogFactory.getLog(CompetenzaController.class);

	@GetMapping("/api/competenza/{id}")
	public Competenza getCompetenza(@PathVariable long id, HttpServletRequest request) throws Exception {
		return aslManager.getCompetenza(id);
	}
	
	@GetMapping("/api/competenza/inuso/{id}")
	public boolean isCompetenzainUso(@PathVariable long id) {
		return aslManager.isCompetenzaInUso(id);
	}	

	@GetMapping("/api/competenze")
	public Page<Competenza> getCompetenze(@RequestParam(required=false) String filterText, @RequestParam(required=false) String istitutoId, Pageable pageRequest) throws Exception {
		return aslManager.findCompetenze(filterText, istitutoId, pageRequest);
	}	
	
	// CRUD
	
	@GetMapping("/api/competenze/istituto/{istitutoId}")
	public Page<Competenza> getCompetenzeByOwnerId(@PathVariable String istitutoId, Pageable pageRequest, HttpServletRequest request) throws Exception {
		usersValidator.validate(request, Lists.newArrayList(new ASLAuthCheck(ASLRole.DIRIGENTE_SCOLASTICO, istitutoId), new ASLAuthCheck(ASLRole.FUNZIONE_STRUMENTALE, istitutoId)));
		
		return aslManager.getCompetenzeByOwnerId(istitutoId, pageRequest);
	}		
	
	@PostMapping("/api/competenza/istituto/{istitutoId}")
	public Competenza saveCompetenza(@PathVariable String istitutoId, @RequestBody Competenza competenza, HttpServletRequest request) throws Exception {
		checkNullId(competenza.getId());
		
		ASLUser user = usersValidator.validate(request, Lists.newArrayList(new ASLAuthCheck(ASLRole.DIRIGENTE_SCOLASTICO, istitutoId), new ASLAuthCheck(ASLRole.FUNZIONE_STRUMENTALE, istitutoId)));
		
		competenza.setSource("istituto");
		competenza.setOwnerId(istitutoId);
		competenza.setOwnerName(aslManager.getIstituzioneName(istitutoId));
		
		Competenza result = aslManager.saveCompetenza(competenza);
		
		if (result != null) {
			AuditEntry audit = new AuditEntry(request.getMethod(), Competenza.class, result.getId(), user, new Object(){});
			auditManager.save(audit);
		}
		
		return result;
	}		

	@PutMapping("/api/competenza/istituto/{istitutoId}")
	public Competenza updateCompetenza(@PathVariable String istitutoId, @RequestBody Competenza competenza, HttpServletRequest request) throws Exception {
		checkId(competenza.getId());
		
		ASLUser user = usersValidator.validate(request, Lists.newArrayList(new ASLAuthCheck(ASLRole.DIRIGENTE_SCOLASTICO, istitutoId), new ASLAuthCheck(ASLRole.FUNZIONE_STRUMENTALE, istitutoId)));
		
		competenza.setSource("istituto");
		competenza.setOwnerId(istitutoId);
		competenza.setOwnerName(aslManager.getIstituzioneName(istitutoId));
		
		Competenza result = aslManager.saveCompetenza(competenza);
		
		if (result != null) {
			AuditEntry audit = new AuditEntry(request.getMethod(), Competenza.class, result.getId(), user, new Object(){});
			auditManager.save(audit);
		}
		
		return result;
	}		
	
	@DeleteMapping("/api/competenza/istituto/{id}")
	public void deleteCompetenza(@PathVariable long id, HttpServletRequest request) throws Exception {
		String istitutoId = aslManager.findCompetenzaOwnerId(id);
		ASLUser user = usersValidator.validate(request, Lists.newArrayList(new ASLAuthCheck(ASLRole.DIRIGENTE_SCOLASTICO, istitutoId), new ASLAuthCheck(ASLRole.FUNZIONE_STRUMENTALE, istitutoId)));			
		
		aslManager.deleteCompetenza(id);
		
		AuditEntry audit = new AuditEntry(request.getMethod(), Competenza.class, id, user, new Object(){});
		auditManager.save(audit);			
	}		
	
	
	///
	
	@GetMapping("/api/competenze/owners")
	public List<Map<String, Object>> getCompetenzeOwnersId() throws Exception {
		return aslManager.getCompetenzeOwners();
	}		
	
	
	/// list owners, source
}
