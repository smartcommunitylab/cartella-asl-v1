package it.smartcommunitylab.cartella.asl.util;

import java.io.File;
import java.util.List;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Repository;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import it.smartcommunitylab.cartella.asl.model.AnnoAlternanza;
import it.smartcommunitylab.cartella.asl.model.Competenza;
import it.smartcommunitylab.cartella.asl.model.EsperienzaSvolta;
import it.smartcommunitylab.cartella.asl.model.PianoAlternanza;
import it.smartcommunitylab.cartella.asl.model.TipologiaAttivita;
import it.smartcommunitylab.cartella.asl.repository.AnnoAlternanzaRepository;
import it.smartcommunitylab.cartella.asl.repository.CompetenzaRepository;
import it.smartcommunitylab.cartella.asl.repository.EsperienzaSvoltaRepository;
import it.smartcommunitylab.cartella.asl.repository.PianoAlternanzaRepository;
import it.smartcommunitylab.cartella.asl.repository.TipologiaAttivitaRepository;

@Component
@Transactional
@Repository
public class JsonDB {

	@Autowired
	private TipologiaAttivitaRepository tipologiaAttivitaRepository;	
	
	@Autowired
	private CompetenzaRepository competenzeRepository;
	
	@Autowired
	private EsperienzaSvoltaRepository esperienzaSvoltaRepository;	

	@Autowired
	private AnnoAlternanzaRepository annoAlternanzaRepository;	
	
	@Autowired
	private PianoAlternanzaRepository pianoAlternanzaRepository;
	
	@Autowired
	@Value("${import.dir}")
	private String path;
	
	ObjectMapper mapper = new ObjectMapper();
	
	public void exportTipologieAttivita() throws Exception {
		List<TipologiaAttivita> tipologieAttivita = tipologiaAttivitaRepository.findAll();
		File f = new File(path, "tipologieAttivita.json");
		mapper.writerWithDefaultPrettyPrinter().writeValue(f, tipologieAttivita);
	}

	public void importTipologieAttivita() throws Exception {
//		if (tipologiaAttivitaRepository.count() != 0) {
//			return;
//		}
		File f = new File(path, "tipologieAttivita.json");
		List<TipologiaAttivita> tipologieAttivita = mapper.readValue(f, new TypeReference<List<TipologiaAttivita>>() {});
		tipologiaAttivitaRepository.save(tipologieAttivita);
	}	
	
	public void exportCompetenze() throws Exception {
		List<Competenza> competenze = competenzeRepository.findAll();
		File f = new File(path, "competenze.json");
		mapper.writerWithDefaultPrettyPrinter().writeValue(f, competenze);
	}

	public void importCompetenze() throws Exception {
//		if (competenzeRepository.count() != 0) {
//			return;
//		}		
		File f = new File(path, "competenze.json");
		List<Competenza> competenze = mapper.readValue(f, new TypeReference<List<Competenza>>() {});
		competenzeRepository.save(competenze);
	}	
	
	public void exportEsperienzeSvolte() throws Exception {
		List<EsperienzaSvolta> esperienzeSvolte = esperienzaSvoltaRepository.findAll();
		File f = new File(path, "esperienzeSvolte.json");
		mapper.writerWithDefaultPrettyPrinter().writeValue(f, esperienzeSvolte);
	}

	public void importEsperienzeSvolte() throws Exception {
//		if (esperienzaSvoltaRepository.count() != 0) {
//			return;
//		}		
		File f = new File(path, "esperienzeSvolte.json");
		List<EsperienzaSvolta> esperienzeSvolte = mapper.readValue(f, new TypeReference<List<EsperienzaSvolta>>() {});
		esperienzaSvoltaRepository.save(esperienzeSvolte);
	}	
	
	public void exportAnniAlternanza() throws Exception {
		List<AnnoAlternanza> anniAlternanza = annoAlternanzaRepository.findAll();
		File f = new File(path, "anniAlternanza.json");
		mapper.writerWithDefaultPrettyPrinter().writeValue(f, anniAlternanza);
	}

	public void importAnniAlternanza() throws Exception {
//		if (annoAlternanzaRepository.count() != 0) {
//			return;
//		}		
		File f = new File(path, "anniAlternanza.json");
		List<AnnoAlternanza> anniAlternanza = mapper.readValue(f, new TypeReference<List<AnnoAlternanza>>() {});
		annoAlternanzaRepository.save(anniAlternanza);
	}	
	
	
	public void exportPianiAlternanza() throws Exception {
		List<PianoAlternanza> pianiAlternanza = pianoAlternanzaRepository.findAll();
		File f = new File(path, "pianiAlternanza.json");
		mapper.writerWithDefaultPrettyPrinter().writeValue(f, pianiAlternanza);
	}

	public void importPianiAlternanza() throws Exception {
//		if (pianoAlternanzaRepository.count() != 0) {
//			return;
//		}		
		File f = new File(path, "pianiAlternanza.json");
		List<PianoAlternanza> pianiAlternanza = mapper.readValue(f, new TypeReference<List<PianoAlternanza>>() {});
		pianoAlternanzaRepository.save(pianiAlternanza);
	}	
	
}
