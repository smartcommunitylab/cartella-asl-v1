package it.smartcommunitylab.cartella.asl.controller;

import java.util.List;
import java.util.stream.Collectors;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
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
import it.smartcommunitylab.cartella.asl.model.CorsoInterno;
import it.smartcommunitylab.cartella.asl.model.audit.AuditEntry;
import it.smartcommunitylab.cartella.asl.model.users.ASLAuthCheck;
import it.smartcommunitylab.cartella.asl.model.users.ASLRole;
import it.smartcommunitylab.cartella.asl.model.users.ASLUser;
import it.smartcommunitylab.cartella.asl.util.ErrorLabelManager;

@RestController
public class CorsoInternoController implements AslController {

	@Autowired
	private QueriesManager aslManager;
	
	@Autowired
	private ASLRolesValidator usersValidator;	
	
	@Autowired
	private ErrorLabelManager errorLabelManager;	
	
	@Autowired
	private AuditManager auditManager;			

	private static Log logger = LogFactory.getLog(CorsoInternoController.class);

	@GetMapping("/api/corsointerno/{id}")
	public Page<CorsoInterno> getCorsoInternoByIstituto(@PathVariable String id,
			@RequestParam(required = false) Long dataInizio, @RequestParam(required = false) Long dataFine,
			@RequestParam(required = false) String tipologia, @RequestParam(required = false) String filterText,
			Pageable pageRequest, HttpServletRequest request) throws Exception {
		usersValidator.validate(request, Lists.newArrayList(new ASLAuthCheck(ASLRole.DIRIGENTE_SCOLASTICO, id), new ASLAuthCheck(ASLRole.FUNZIONE_STRUMENTALE, id)));
		
		List<Integer> tipologiaList = null;

		if (tipologia != null) {
			tipologiaList = Splitter.on(",").splitToList(tipologia).stream().map(x -> Integer.parseInt(x))
					.collect(Collectors.toList());
		}

		Page<CorsoInterno> result = aslManager.findCorsoInternoByIstitutoId(id, dataInizio, dataFine, tipologiaList,
				filterText, pageRequest);

		if (logger.isInfoEnabled()) {
			logger.info(String.format("getCorsoInternoByIstituto[%s]: %s", id, result.getNumberOfElements()));
		}

		result.forEach(x -> {
			x.setCompetenze(null);
		});

		return result;
	}

	@GetMapping("/api/corsointerno/details/{id}")
	public CorsoInterno getCorsoInterno(@PathVariable long id, HttpServletRequest request) throws Exception {
		CorsoInterno ci = aslManager.getCorsoInterno(id);
		
		if (ci == null) {
			throw new BadRequestException(errorLabelManager.get("corso.interno.error.notfound"));
		}		
		
		usersValidator.validate(request, Lists.newArrayList(new ASLAuthCheck(ASLRole.DIRIGENTE_SCOLASTICO, ci.getIstitutoId()), new ASLAuthCheck(ASLRole.FUNZIONE_STRUMENTALE, ci.getIstitutoId())));
		
		if (logger.isInfoEnabled()) {
			logger.info(String.format("getCorsoInterno[%s]", id));
		}
		return ci;
	}

	@PostMapping("/api/corsointerno/details")
	public CorsoInterno saveCorsoInterno(@RequestBody CorsoInterno ci,  HttpServletRequest request) throws Exception {
		try {
			checkNullId(ci.getId());
			if (logger.isInfoEnabled()) {
				logger.info(String.format("saveCorsoInterno[%s]", ci.getId()));
			}

			ASLUser user = usersValidator.validate(request, Lists.newArrayList(new ASLAuthCheck(ASLRole.DIRIGENTE_SCOLASTICO, ci.getIstitutoId()), new ASLAuthCheck(ASLRole.FUNZIONE_STRUMENTALE, ci.getIstitutoId())));
			
			CorsoInterno result = aslManager.saveCorsoInterno(ci);
			
			if (result != null) {
				AuditEntry audit = new AuditEntry(request.getMethod(), CorsoInterno.class, result.getId(), user, new Object(){});
				auditManager.save(audit);
			}
			
			return result;
		} catch (Exception e) {
			logger.error(e.getMessage());
			throw new ASLCustomException(HttpStatus.SC_INTERNAL_SERVER_ERROR, e.getMessage());
		}
	}

	// TODO acl update can save too (no id)
	@PutMapping("/api/corsointerno/details/{id}")
	public void updateCorsoInterno(@PathVariable long id, @RequestBody CorsoInterno ci,  HttpServletRequest request) throws Exception {
		ci.setId(id);

		if (logger.isInfoEnabled()) {
			logger.info(String.format("updateCorsoInterno[%s]", ci.getId()));
		}

		ASLUser user = usersValidator.validate(request, Lists.newArrayList(new ASLAuthCheck(ASLRole.DIRIGENTE_SCOLASTICO, ci.getIstitutoId()), new ASLAuthCheck(ASLRole.FUNZIONE_STRUMENTALE, ci.getIstitutoId())));
		
		aslManager.updateCorsoInterno(ci);
		
		AuditEntry audit = new AuditEntry(request.getMethod(), CorsoInterno.class, id, user, new Object(){});
		auditManager.save(audit);			
	}

	@PutMapping("/api/corsointerno/{id}/competenze")
	public CorsoInterno setCompetenzeToCorsoInterno(@PathVariable long id, @RequestBody List<Long> cIds, HttpServletRequest request)
			throws Exception {
		CorsoInterno ci = aslManager.getCorsoInterno(id);
		
		if (ci == null) {
			throw new BadRequestException(errorLabelManager.get("corso.interno.error.notfound"));
		}		
		
		ASLUser user = usersValidator.validate(request, Lists.newArrayList(new ASLAuthCheck(ASLRole.DIRIGENTE_SCOLASTICO, ci.getIstitutoId()), new ASLAuthCheck(ASLRole.FUNZIONE_STRUMENTALE, ci.getIstitutoId())));
		
		try {
			if (logger.isInfoEnabled()) {
				logger.info(String.format("setCompetenzeToCorsoInterno[%s]: %s", id, cIds));
			}
			CorsoInterno result = aslManager.setCompetenzeInCorsoInterno(id, cIds);
			
			if (result != null) {
				AuditEntry audit = new AuditEntry(request.getMethod(), CorsoInterno.class, result.getId(), user, new Object(){});
				auditManager.save(audit);
			}
			
			return result;
		} catch (Exception e) {
			logger.error(e.getMessage());
			throw new BadRequestException(e);
		}
	}

	@DeleteMapping("/api/corsointerno/{id}")
	public void deleteCorsoInterno(@PathVariable long id, HttpServletRequest request) throws Exception {
		CorsoInterno ci = aslManager.getCorsoInterno(id);
		
		if (ci == null) {
			throw new BadRequestException(errorLabelManager.get("corso.interno.error.notfound"));
		}		
		
		ASLUser user = usersValidator.validate(request, Lists.newArrayList(new ASLAuthCheck(ASLRole.DIRIGENTE_SCOLASTICO, ci.getIstitutoId()), new ASLAuthCheck(ASLRole.FUNZIONE_STRUMENTALE, ci.getIstitutoId())));		
		
		if (logger.isInfoEnabled()) {
			logger.info(String.format("deleteCorsoInterno[%s]", id));
		}

		aslManager.deleteCorsoInterno(id);
		
		AuditEntry audit = new AuditEntry(request.getMethod(), CorsoInterno.class, id, user, new Object(){});
		auditManager.save(audit);			
	}

}
