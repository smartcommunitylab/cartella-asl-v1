package it.smartcommunitylab.cartella.asl.controller;

import java.util.List;
import java.util.stream.Collectors;

import javax.servlet.http.HttpServletRequest;

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

import it.smartcommunitylab.cartella.asl.exception.BadRequestException;
import it.smartcommunitylab.cartella.asl.manager.ASLRolesValidator;
import it.smartcommunitylab.cartella.asl.manager.AuditManager;
import it.smartcommunitylab.cartella.asl.manager.QueriesManager;
import it.smartcommunitylab.cartella.asl.model.Azienda;
import it.smartcommunitylab.cartella.asl.model.Opportunita;
import it.smartcommunitylab.cartella.asl.model.audit.AuditEntry;
import it.smartcommunitylab.cartella.asl.model.users.ASLAuthCheck;
import it.smartcommunitylab.cartella.asl.model.users.ASLRole;
import it.smartcommunitylab.cartella.asl.model.users.ASLUser;
import it.smartcommunitylab.cartella.asl.util.ErrorLabelManager;

//TODO acl
@RestController
public class OpportunitaController implements AslController {

	@Autowired
	private QueriesManager aslManager;

	@Autowired
	private ASLRolesValidator usersValidator;

	@Autowired
	private ErrorLabelManager errorLabelManager;
	
	@Autowired
	private AuditManager auditManager;		

	// TODO acl badrequest on empty azienda?
	@PostMapping("/api/opportunita/details")
	public Opportunita saveOpportunita(@RequestBody Opportunita o, HttpServletRequest request) throws Exception {
		checkNullId(o.getId());

		if (o.getAzienda() == null) {
			throw new BadRequestException(errorLabelManager.get("azienda.missing"));
		}		
		
		ASLUser user = usersValidator.validate(request, Lists.newArrayList(new ASLAuthCheck(ASLRole.LEGALE_RAPPRESENTANTE_AZIENDA, o.getAzienda().getId()), new ASLAuthCheck(ASLRole.REFERENTE_AZIENDA, o.getAzienda().getId())));

		Opportunita result = aslManager.saveOpportunita(o);
		
		if (result != null) {
			AuditEntry audit = new AuditEntry(request.getMethod(), Opportunita.class, result.getId(), user, new Object(){});
			auditManager.save(audit);
		}
		
		return result;
	}

	@GetMapping("/api/opportunita/details/{id}")
	public Opportunita getOpportunita(@PathVariable long id, HttpServletRequest request) throws Exception {
		String aziendaId = aslManager.findOpportunitaAziendaId(id);
		usersValidator.validate(request, Lists.newArrayList(new ASLAuthCheck(ASLRole.LEGALE_RAPPRESENTANTE_AZIENDA, aziendaId), new ASLAuthCheck(ASLRole.REFERENTE_AZIENDA, aziendaId)));

		return aslManager.getOpportunita(id);
	}

	@PutMapping("/api/opportunita/details/{id}")
	public void updateOpportunita(@PathVariable long id, @RequestBody Opportunita o, HttpServletRequest request)
			throws Exception {
		o.setId(id);

		String aziendaId = aslManager.findOpportunitaAziendaId(id);
		ASLUser user = usersValidator.validate(request, Lists.newArrayList(new ASLAuthCheck(ASLRole.LEGALE_RAPPRESENTANTE_AZIENDA, aziendaId), new ASLAuthCheck(ASLRole.REFERENTE_AZIENDA, aziendaId)));

		aslManager.updateOpportunita(o);
		
		AuditEntry audit = new AuditEntry(request.getMethod(), Opportunita.class, id, user, new Object(){});
		auditManager.save(audit);			
	}

	@PutMapping("/api/opportunita/{id}/competenze")
	public Opportunita setCompetenzeToOpportunita(@PathVariable long id, @RequestBody List<Long> aaIds,
			HttpServletRequest request) throws Exception {
		try {
			String aziendaId = aslManager.findOpportunitaAziendaId(id);
			ASLUser user = usersValidator.validate(request, Lists.newArrayList(new ASLAuthCheck(ASLRole.LEGALE_RAPPRESENTANTE_AZIENDA, aziendaId), new ASLAuthCheck(ASLRole.REFERENTE_AZIENDA, aziendaId)));

			Opportunita result = aslManager.setCompetenzeInOpportunita(id, aaIds);
			
			AuditEntry audit = new AuditEntry(request.getMethod(), Opportunita.class, id, user, new Object(){});
			auditManager.save(audit);				
			
			return result;			
		} catch (Exception e) {
			throw new BadRequestException(e);
		}
	}

	@DeleteMapping("/api/opportunita/{id}")
	public void deleteOpportunita(@PathVariable long id, HttpServletRequest request) throws Exception {
		String aziendaId = aslManager.findOpportunitaAziendaId(id);
		ASLUser user = usersValidator.validate(request, Lists.newArrayList(new ASLAuthCheck(ASLRole.LEGALE_RAPPRESENTANTE_AZIENDA, aziendaId), new ASLAuthCheck(ASLRole.REFERENTE_AZIENDA, aziendaId)));

		aslManager.deleteOpportunita(id);
		
		AuditEntry audit = new AuditEntry(request.getMethod(), Opportunita.class, id, user, new Object(){});
		auditManager.save(audit);			
	}

	@GetMapping("/api/opportunita/{id}")
	public Page<Opportunita> getOpportunitaByAziendaId(@PathVariable String id,
			@RequestParam(required = false) Long dataInizio, @RequestParam(required = false) Long dataFine,
			@RequestParam(required = false) String tipologia, @RequestParam(required = false) String filterText,
			Pageable pageRequest, HttpServletRequest request) throws Exception {
		usersValidator.validate(request, Lists.newArrayList(new ASLAuthCheck(ASLRole.LEGALE_RAPPRESENTANTE_AZIENDA, id), new ASLAuthCheck(ASLRole.REFERENTE_AZIENDA, id)));

		List<Integer> tipologiaList = null;

		if (tipologia != null) {
			tipologiaList = Splitter.on(",").splitToList(tipologia).stream().map(x -> Integer.parseInt(x))
					.collect(Collectors.toList());
		}

		Page<Opportunita> result = aslManager.findOpportunitaByAziendaId(id, dataInizio, dataFine, tipologiaList,
				filterText, pageRequest);

		result.forEach(x -> {
			x.setCompetenze(null);
		});

		return result;
	}

	@GetMapping("/api/azienda/{id}")
	public Azienda getAzienda(@PathVariable String id, HttpServletRequest request) throws Exception {
		usersValidator.validate(request, Lists.newArrayList(new ASLAuthCheck(ASLRole.LEGALE_RAPPRESENTANTE_AZIENDA, id), new ASLAuthCheck(ASLRole.REFERENTE_AZIENDA, id)));

		Azienda az = aslManager.getAzienda(id);
		return az;
	}

}
