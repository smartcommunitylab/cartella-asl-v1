package it.smartcommunitylab.cartella.asl.controller;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import it.smartcommunitylab.cartella.asl.manager.DataManager;


@RestController
public class DataController implements AslController {

	@Autowired
	private DataManager dataManager;
	
	private static Log logger = LogFactory.getLog(DataController.class);

	@GetMapping("/api/data")
	public Object getData(@RequestParam(required=false) String type) throws Exception {
		logger.info(String.format("getData[%s]", type));
		if (type == null || type.isEmpty()) {
			return dataManager.getAll();
		}
		return dataManager.get(type);
	}

		
	

}
