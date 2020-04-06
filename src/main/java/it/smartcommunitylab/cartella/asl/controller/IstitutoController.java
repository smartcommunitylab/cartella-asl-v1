package it.smartcommunitylab.cartella.asl.controller;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.google.common.collect.Lists;

import it.smartcommunitylab.cartella.asl.exception.BadRequestException;
import it.smartcommunitylab.cartella.asl.manager.ASLRolesValidator;
import it.smartcommunitylab.cartella.asl.manager.AuditManager;
import it.smartcommunitylab.cartella.asl.manager.QueriesManager;
import it.smartcommunitylab.cartella.asl.model.Istituzione;
import it.smartcommunitylab.cartella.asl.model.audit.AuditEntry;
import it.smartcommunitylab.cartella.asl.model.users.ASLAuthCheck;
import it.smartcommunitylab.cartella.asl.model.users.ASLRole;
import it.smartcommunitylab.cartella.asl.model.users.ASLUser;
import it.smartcommunitylab.cartella.asl.util.ErrorLabelManager;

@RestController
public class IstitutoController implements AslController {

	@Autowired
	private QueriesManager aslManager;
	
	@Autowired
	private ASLRolesValidator usersValidator;		

	@Autowired
	private ErrorLabelManager errorLabelManager;
	
	@Autowired
	private AuditManager auditManager;		
	
	private static Log logger = LogFactory.getLog(IstitutoController.class);
	
	@PutMapping("/api/istituto/{istitutoId}/sogliaOraria/{hoursThreshold}")
	public @ResponseBody void updateHoursThreshold(@PathVariable String istitutoId, @PathVariable Double hoursThreshold, HttpServletRequest request) throws Exception {
		ASLUser user = usersValidator.validate(request, Lists.newArrayList(new ASLAuthCheck(ASLRole.DIRIGENTE_SCOLASTICO, istitutoId), new ASLAuthCheck(ASLRole.FUNZIONE_STRUMENTALE, istitutoId)));
		
		if (hoursThreshold < 0 || hoursThreshold > 1) {
			throw new BadRequestException(errorLabelManager.get("hoursThreshold.outofrange"));
		}
		
		aslManager.updateIstituzioneHoursThreshold(istitutoId, hoursThreshold);
		
		AuditEntry audit = new AuditEntry(request.getMethod(), Istituzione.class, istitutoId, user, new Object(){});
		auditManager.save(audit);			
	}	
	
	
}
