package it.smartcommunitylab.cartella.asl.controller;

import java.util.List;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import it.smartcommunitylab.cartella.asl.exception.ASLCustomException;
import it.smartcommunitylab.cartella.asl.manager.CartellaAPIManager;
import it.smartcommunitylab.cartella.asl.model.CorsoDiStudio;
import it.smartcommunitylab.cartella.asl.model.ext.Istituzione;

@RestController
public class CartellaAPIController implements AslController {

	@Autowired
	private CartellaAPIManager cartellaAPIManager;
	private static Log logger = LogFactory.getLog(CartellaAPIController.class);

	@GetMapping("/api/istituzioni")
	public List<Istituzione> getIstituzione() throws ASLCustomException {

		List<Istituzione> result = cartellaAPIManager.getMappedIstituzione(null);
		if (logger.isInfoEnabled()) {
			logger.info(String.format("getIstituzione"));
		}
		return result;

	}

	@GetMapping("/api/corsi")
	public List<CorsoDiStudio> getCorsoDiStudioByIstitutoSchoolYear(@RequestParam(required = true) String istitutoId,
			@RequestParam(required = true) String schoolYear) throws ASLCustomException {

		List<CorsoDiStudio> result = cartellaAPIManager.getCorsi(istitutoId, schoolYear);
		if (logger.isInfoEnabled()) {
			logger.info(String.format("getCorso[%s, %s]", istitutoId, schoolYear));
		}
		return result;

	}

//	TODO: reenable if needed
//	@GetMapping("/api/studente/cf/{cf}")
//	public Studente getStudentByCF(@PathVariable String cf, @RequestParam(required = false) Boolean foto) throws ASLCustomException {
//
//		Studente result = cartellaAPIManager.getStudentByCF(null, cf, foto == null ? false : foto);
//		if (logger.isInfoEnabled()) {
//			logger.info(String.format("getStudentByCF[] - %s", result.getId()));
//		}
//		return result;
//
//	}

}
