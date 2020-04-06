package it.smartcommunitylab.cartella.asl.controller;

import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.google.common.collect.Lists;

import it.smartcommunitylab.cartella.asl.exception.BadRequestException;
import it.smartcommunitylab.cartella.asl.manager.ASLRolesValidator;
import it.smartcommunitylab.cartella.asl.manager.AuditManager;
import it.smartcommunitylab.cartella.asl.manager.QueriesManager;
import it.smartcommunitylab.cartella.asl.model.AnnoAlternanza;
import it.smartcommunitylab.cartella.asl.model.AttivitaAlternanza;
import it.smartcommunitylab.cartella.asl.model.TipologiaAttivita;
import it.smartcommunitylab.cartella.asl.model.TipologiaTipologiaAttivita;
import it.smartcommunitylab.cartella.asl.model.audit.AuditEntry;
import it.smartcommunitylab.cartella.asl.model.users.ASLAuthCheck;
import it.smartcommunitylab.cartella.asl.model.users.ASLRole;
import it.smartcommunitylab.cartella.asl.model.users.ASLUser;
import it.smartcommunitylab.cartella.asl.util.ErrorLabelManager;

@RestController
public class AnnoAlternanzaController implements AslController {

	@Autowired
	private QueriesManager aslManager;
	
	@Autowired
	private ASLRolesValidator usersValidator;		

	@Autowired
	private ErrorLabelManager errorLabelManager;	
	
	@Autowired
	private AuditManager auditManager;
		
	private static Log logger = LogFactory.getLog(AnnoAlternanzaController.class);
	
	@PutMapping("/api/annoAlternanza/{id}/tipologiaAttivita")
	public @ResponseBody AnnoAlternanza addTipologiaAttivitToAnnoAlternanza(@PathVariable long id, @RequestBody TipologiaAttivita ta, HttpServletRequest request) throws Exception {
		String istitutoId = aslManager.findAnnoAlternanzaIstitutoId(id);
		ASLUser user = usersValidator.validate(request, Lists.newArrayList(new ASLAuthCheck(ASLRole.DIRIGENTE_SCOLASTICO, istitutoId), new ASLAuthCheck(ASLRole.FUNZIONE_STRUMENTALE, istitutoId)));

		AnnoAlternanza result = aslManager.addTipologiaAttivitaToAnnoAlternanza(id, ta);
		
		if (result != null) {
			AuditEntry audit = new AuditEntry(request.getMethod(), AnnoAlternanza.class, result.getId(), user, new Object(){});
			auditManager.save(audit);
		}
		
		return result;
	}	
	
	@GetMapping("/api/tipologiaAttivita/{id}")
	public @ResponseBody TipologiaAttivita getTipologiaAttivita(@PathVariable long id, HttpServletRequest request) throws Exception {
		String istitutoId = aslManager.findTipologiaAttivitaIstitutoId(id);
		usersValidator.validate(request, Lists.newArrayList(new ASLAuthCheck(ASLRole.DIRIGENTE_SCOLASTICO, istitutoId), new ASLAuthCheck(ASLRole.FUNZIONE_STRUMENTALE, istitutoId)));
		
		return aslManager.getTipologiaAttivita(id);
	}		
	
	@PutMapping("/api/tipologiaAttivita/{annoAlternanzaId}")
	public @ResponseBody void updateTipologiaAttivita(@RequestBody TipologiaAttivita ta, @PathVariable long annoAlternanzaId, HttpServletRequest request) throws Exception {
		checkId(ta.getId());
		
		String istitutoId = aslManager.findAnnoAlternanzaIstitutoId(annoAlternanzaId);
		ASLUser user = usersValidator.validate(request, Lists.newArrayList(new ASLAuthCheck(ASLRole.DIRIGENTE_SCOLASTICO, istitutoId), new ASLAuthCheck(ASLRole.FUNZIONE_STRUMENTALE, istitutoId)));
		
		auditManager.beginAudit(user);
		
		// TODO move anno
		aslManager.updateTipologiaAttivita(ta, annoAlternanzaId);
		
		AuditEntry audit = new AuditEntry(request.getMethod(), TipologiaAttivita.class, ta.getId(), user, new Object(){});
		auditManager.save(audit);
		
		auditManager.endAudit();
		
	}	
	
	@DeleteMapping("/api/annoAlternanza/{aaId}/tipologiaAttivita/{taId}")
	public @ResponseBody AnnoAlternanza removeTipologiaAttivitFromAnnoAlternanza(@PathVariable long aaId, @PathVariable long taId, HttpServletRequest request) throws Exception {
		String istitutoId = aslManager.findAnnoAlternanzaIstitutoId(aaId);
		ASLUser user = usersValidator.validate(request, Lists.newArrayList(new ASLAuthCheck(ASLRole.DIRIGENTE_SCOLASTICO, istitutoId), new ASLAuthCheck(ASLRole.FUNZIONE_STRUMENTALE, istitutoId)));		
		
		AnnoAlternanza ana = aslManager.getAnnoAlternanza(aaId);
		if (ana == null) {
			throw new BadRequestException(errorLabelManager.get("anno.alt.error.notfound"));
		}	
		ana.getTipologieAttivita().removeIf(x -> x.getId() == taId);
		AnnoAlternanza ana2 = aslManager.saveAnnoAlternanza(ana);
		
		AuditEntry audit = new AuditEntry(request.getMethod(), TipologiaAttivita.class, taId, user, new Object(){});
		auditManager.save(audit);		
		
		return ana2;
	}	
	
	@PostMapping("/api/annoAlternanza/{id}/attivitaAlternanza")
	public @ResponseBody AttivitaAlternanza addAttivitaAlternanzaToAnnoAlternanza(@PathVariable long id, @RequestBody AttivitaAlternanza aa, HttpServletRequest request) throws Exception {
		String istitutoId = aslManager.findAnnoAlternanzaIstitutoId(id);
		ASLUser user = usersValidator.validate(request, Lists.newArrayList(new ASLAuthCheck(ASLRole.DIRIGENTE_SCOLASTICO, istitutoId), new ASLAuthCheck(ASLRole.FUNZIONE_STRUMENTALE, istitutoId)));				
		
		AnnoAlternanza ana = aslManager.getAnnoAlternanza(id);
		if (ana == null) {
			throw new BadRequestException(errorLabelManager.get("anno.alt.error.notfound"));
		}	
		aa.setAnnoAlternanza(ana);
		AttivitaAlternanza aa2 = aslManager.saveAttivitaAlternanza(aa);

		if (aa2 != null) {
			AuditEntry audit1 = new AuditEntry(request.getMethod(), AttivitaAlternanza.class, aa2.getId(), user, new Object() {
			});
			auditManager.save(audit1);
		}
		AuditEntry audit2 = new AuditEntry(request.getMethod(), AnnoAlternanza.class, id, user, new Object(){});
		auditManager.save(audit2);			
		
		return aa2;
	}		
	
	@GetMapping("/api/annoAlternanza/{id}")
	public AnnoAlternanza getAnnoAlternanza(@PathVariable long id, HttpServletRequest request) throws Exception {
		String istitutoId = aslManager.findAnnoAlternanzaIstitutoId(id);
		usersValidator.validate(request, Lists.newArrayList(new ASLAuthCheck(ASLRole.DIRIGENTE_SCOLASTICO, istitutoId), new ASLAuthCheck(ASLRole.FUNZIONE_STRUMENTALE, istitutoId)));
		
		return aslManager.getAnnoAlternanza(id);
	}

	@PutMapping("/api/annoAlternanza")
	public void updateAnnoAlternanza(@RequestBody AnnoAlternanza aa, HttpServletRequest request) throws Exception {
		checkId(aa.getId());
		
		String istitutoId = aslManager.findAnnoAlternanzaIstitutoId(aa.getId());
		ASLUser user = usersValidator.validate(request, Lists.newArrayList(new ASLAuthCheck(ASLRole.DIRIGENTE_SCOLASTICO, istitutoId), new ASLAuthCheck(ASLRole.FUNZIONE_STRUMENTALE, istitutoId)));				
		
		aslManager.updateAnnoAlternanza(aa);
		
		AuditEntry audit = new AuditEntry(request.getMethod(), AnnoAlternanza.class, aa.getId(), user, new Object(){});
		auditManager.save(audit);			
	}

	@GetMapping("/api/tipologiaTipologiaAttivita/{id}")
	public TipologiaTipologiaAttivita getTipologiaAttivita(@PathVariable long id) {
		return aslManager.getTipologiaTipologiaAttivita(id);
	}		
	
	@GetMapping("/api/tipologieTipologiaAttivita")
	public List<TipologiaTipologiaAttivita> getTipologiaAttivita() {
		return aslManager.getTipologieTipologiaAttivita();
	}	

}
