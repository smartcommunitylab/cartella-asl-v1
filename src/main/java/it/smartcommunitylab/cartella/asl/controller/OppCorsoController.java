package it.smartcommunitylab.cartella.asl.controller;

import java.util.List;
import java.util.stream.Collectors;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.google.common.base.Splitter;
import com.google.common.collect.Lists;
import com.google.common.primitives.Doubles;

import it.smartcommunitylab.cartella.asl.manager.ASLRolesValidator;
import it.smartcommunitylab.cartella.asl.manager.QueriesManager;
import it.smartcommunitylab.cartella.asl.model.OppCorso;
import it.smartcommunitylab.cartella.asl.model.users.ASLAuthCheck;
import it.smartcommunitylab.cartella.asl.model.users.ASLRole;

@RestController
public class OppCorsoController {

	@Autowired
	private QueriesManager aslManager;

	@Autowired
	private ASLRolesValidator usersValidator;			
	
	@GetMapping("/api/oppCorso/{id}")
	public OppCorso getOppCorso(@PathVariable Long id) {
		return aslManager.getOppCorso(id);
	}

	// torna lista di opportunità o/e corsi interni con dettagli completa
	@GetMapping("/api/oppCorsi/ricerca")
	public Page<OppCorso> cercaOppCorsi(@RequestParam(required = true) String istitutoId, @RequestParam(required = false) Integer tipologia, @RequestParam(required = false) String competenze, @RequestParam(required = false) Long dataInizio,
			@RequestParam(required = false) Long dataFine, @RequestParam(required = false) String coordinate, @RequestParam(required = false) Integer raggio, @RequestParam(required = false) Boolean individuale, @RequestParam(required = false) String titolo, @RequestParam String orderBy, Pageable pageRequest, HttpServletRequest request) throws Exception {
		usersValidator.validate(request, Lists.newArrayList(new ASLAuthCheck(ASLRole.DIRIGENTE_SCOLASTICO, istitutoId), new ASLAuthCheck(ASLRole.FUNZIONE_STRUMENTALE, istitutoId)));
		
		List<Long> cIds = null;
		if (competenze != null && !competenze.isEmpty()) {
			cIds = Splitter.on(",").splitToList(competenze).stream().map(x -> Long.parseLong(x)).collect(Collectors.toList());
		}
		double[] coords = null;
		if (coordinate != null && !coordinate.isEmpty()) {
			coords = Doubles.toArray(Splitter.on(",").splitToList(coordinate).stream().map(x -> Double.parseDouble(x)).collect(Collectors.toList()));
		}
		return aslManager.findOppCorsi(istitutoId, tipologia, cIds, dataInizio, dataFine, coords, raggio, individuale, titolo, orderBy, pageRequest);
	}

}
