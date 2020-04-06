package it.smartcommunitylab.cartella.asl.controller;

import java.io.File;
import java.io.FileReader;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;

import it.smartcommunitylab.cartella.asl.csv.ImportFromCsv;
import it.smartcommunitylab.cartella.asl.manager.APIUpdateManager;
import it.smartcommunitylab.cartella.asl.manager.ASLRolesValidator;
import it.smartcommunitylab.cartella.asl.manager.EntitiesManager;
import it.smartcommunitylab.cartella.asl.manager.QueriesManager;
import it.smartcommunitylab.cartella.asl.model.AttivitaAlternanza;
import it.smartcommunitylab.cartella.asl.model.Azienda;
import it.smartcommunitylab.cartella.asl.model.Competenza;
import it.smartcommunitylab.cartella.asl.model.CorsoDiStudio;
import it.smartcommunitylab.cartella.asl.model.EsperienzaSvolta;
import it.smartcommunitylab.cartella.asl.model.EsperienzaSvoltaAllineamento;
import it.smartcommunitylab.cartella.asl.model.Istituzione;
import it.smartcommunitylab.cartella.asl.model.Opportunita;
import it.smartcommunitylab.cartella.asl.model.PianoAlternanza;
import it.smartcommunitylab.cartella.asl.model.Studente;
import it.smartcommunitylab.cartella.asl.model.TipologiaAttivita;
import it.smartcommunitylab.cartella.asl.model.TipologiaTipologiaAttivita;
import it.smartcommunitylab.cartella.asl.model.ext.Registration;
import it.smartcommunitylab.cartella.asl.model.users.ASLRole;
import it.smartcommunitylab.cartella.asl.model.users.ASLUser;
import it.smartcommunitylab.cartella.asl.repository.ASLUserRepository;
import it.smartcommunitylab.cartella.asl.repository.AttivitaAlternanzaRepository;
import it.smartcommunitylab.cartella.asl.repository.AziendaRepository;
import it.smartcommunitylab.cartella.asl.repository.CompetenzaRepository;
import it.smartcommunitylab.cartella.asl.repository.CorsoDiStudioRepository;
import it.smartcommunitylab.cartella.asl.repository.EsperienzaAllineamentoRepository;
import it.smartcommunitylab.cartella.asl.repository.EsperienzaSvoltaRepository;
import it.smartcommunitylab.cartella.asl.repository.IstituzioneRepository;
import it.smartcommunitylab.cartella.asl.repository.OpportunitaRepository;
import it.smartcommunitylab.cartella.asl.repository.RegistrationRepository;
import it.smartcommunitylab.cartella.asl.repository.StudenteRepository;
import it.smartcommunitylab.cartella.asl.repository.TipologiaAttivitaRepository;
import it.smartcommunitylab.cartella.asl.repository.TipologiaTipologiaAttivitaRepository;
import it.smartcommunitylab.cartella.asl.util.JsonDB;

@RestController
public class DevController {

	@Autowired
	private QueriesManager aslManager;

	@Autowired
	private CompetenzaRepository cRepository;

	@Autowired
	private EsperienzaSvoltaRepository esRepository;

	@Autowired
	private StudenteRepository sRepository;

	@Autowired
	private AttivitaAlternanzaRepository aaRepository;

	@Autowired
	private OpportunitaRepository oRepository;

	@Autowired
	private AziendaRepository azRepository;

	@Autowired
	private EsperienzaAllineamentoRepository esperienzaAllineamentoRepository;

	@Autowired
	private TipologiaAttivitaRepository taRepository;

	@Autowired
	private TipologiaTipologiaAttivitaRepository ttaRepository;

	@Autowired
	private CorsoDiStudioRepository cdsRepository;

	@Autowired
	private IstituzioneRepository iRepository;

	@Autowired
	private RegistrationRepository rRepository;

	@Autowired
	private TipologiaTipologiaAttivitaRepository tRepository;

	@Autowired
	private ASLUserRepository uRepository;

	@Autowired
	private APIUpdateManager apiUpdateManager;
	
	@Autowired
	private EntitiesManager entitiesManager;

	@Autowired
	private JsonDB jsonDB;

	@Autowired
	private ASLRolesValidator usersValidator;
	
	@Autowired
	private ImportFromCsv csvManager;

	@Value("${testdata.azienda}")
	private String testDataAzienda;

	@Value("${testdata.scuola}")
	private String testDataScuola;

	@Value("${testdata.dataset}")
	private String testDataset;

	private ObjectMapper mapper = new ObjectMapper().configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES,
			false);

	private static Log logger = LogFactory.getLog(DevController.class);
	
	
	@GetMapping("/admin/importStudenteRole")
	public void importStudenteRole(@RequestParam String filePath, HttpServletRequest request) throws Exception {
		usersValidator.checkRole(request, ASLRole.ADMIN);
		File file = new File(filePath);
		if(file.exists()) {
			FileReader fileReader = new FileReader(file);
			csvManager.importStudenteRole(fileReader);
			logger.warn("importStudenteRole - file imported:" + filePath);
		} else {
			logger.warn("importStudenteRole - file doesn't exists:" + filePath);
		}
	}

	@GetMapping("/admin/importFunzioneStrumentaleRole")
	public void importFunzioneStrumentaleRole(@RequestParam String filePath, HttpServletRequest request) throws Exception {
		usersValidator.checkRole(request, ASLRole.ADMIN);
		File file = new File(filePath);
		if(file.exists()) {
			FileReader fileReader = new FileReader(file);
			csvManager.importFunzioneStrumentaleRole(fileReader);
			logger.warn("importFunzioneStrumentaleRole - file imported:" + filePath);
		} else {
			logger.warn("importFunzioneStrumentaleRole - file doesn't exists:" + filePath);
		}
	}
	

	@GetMapping("/admin/importDataset")
	public void initDataset(HttpServletRequest request) throws Exception {
		usersValidator.checkRole(request, ASLRole.ADMIN);

		List<Istituzione> istituzioni = mapper.readValue(new File(testDataset + "/istituzioni.json"),
				new TypeReference<List<Istituzione>>() {
				});
		// iRepository.save(istituzioni);

		List<Registration> registration = mapper.readValue(new File(testDataset + "/registration.json"),
				new TypeReference<List<Registration>>() {
				});
		// rRepository.save(registration);

		List<CorsoDiStudio> corsi = mapper.readValue(new File(testDataset + "/corsi.json"),
				new TypeReference<List<CorsoDiStudio>>() {
				});
		// cdsRepository.save(corsi);

		List<Studente> studenti = mapper.readValue(new File(testDataset + "/studenti.json"),
				new TypeReference<List<Studente>>() {
				});
		// sRepository.save(studenti);

		List<TipologiaTipologiaAttivita> tipologie = mapper.readValue(
				new File(testDataset + "/tipologiaTipologiaAttivita.json"),
				new TypeReference<List<TipologiaTipologiaAttivita>>() {
				});
		tRepository.save(tipologie);

		List<Competenza> competenze = mapper.readValue(new File(testDataset + "/competenze.json"),
				new TypeReference<List<Competenza>>() {
				});
		cRepository.save(competenze);

		List<Azienda> aziende = mapper.readValue(new File(testDataset + "/aziende.json"),
				new TypeReference<List<Azienda>>() {
				});
		// azRepository.save(aziende);
	}

	@GetMapping("/admin/addCompetences")
	public void addCompetences(HttpServletRequest request) throws Exception {
		usersValidator.checkRole(request, ASLRole.ADMIN);
		List<Competenza> competenze = mapper.readValue(new File(testDataset + "/competenze.json"),
				new TypeReference<List<Competenza>>() {
				});
		cRepository.save(competenze);
	}

	@GetMapping("/admin/importUsers")
	public void initUsers(HttpServletRequest request) throws Exception {
		usersValidator.checkRole(request, ASLRole.ADMIN);
		List<ASLUser> users = mapper.readValue(new File(testDataset + "/users.json"),
				new TypeReference<List<ASLUser>>() {
				});
		uRepository.save(users);

	}

	// Resources.getResource("challenges/challenges_descriptions.json")

	@GetMapping("/admin/initDB")
	public void init(HttpServletRequest request) throws Exception {
		usersValidator.checkRole(request, ASLRole.ADMIN);
		delete();
		importAttivitaAlternanza();
		importEsperienzeSvolte();
		importAziende();
		importCompetenze();
		importOpportunita();
		importStudenti();
		importPianiDiStudio();
		importCorsiDiStudio();
		// associate();
		populateData();
	}

	@GetMapping("/admin/importJsonDB")
	public void importJsonDB(HttpServletRequest request) throws Exception {
		usersValidator.checkRole(request, ASLRole.ADMIN);
		jsonDB.importTipologieAttivita();
		jsonDB.importCompetenze();
		jsonDB.importEsperienzeSvolte();
		jsonDB.importAnniAlternanza();
		jsonDB.importPianiAlternanza();
	}

	@GetMapping("/admin/exportJsonDB")
	public void exportJsonDB(HttpServletRequest request) throws Exception {
		usersValidator.checkRole(request, ASLRole.ADMIN);
		jsonDB.exportTipologieAttivita();
		jsonDB.exportCompetenze();
		jsonDB.exportEsperienzeSvolte();
		jsonDB.exportAnniAlternanza();
		jsonDB.exportPianiAlternanza();
	}

	@GetMapping("/admin/dumpCartella")
	public void dumpCartella(HttpServletRequest request) throws Exception {
		usersValidator.checkRole(request, ASLRole.ADMIN);
		apiUpdateManager.importAllCartella();
	}

	@GetMapping("/admin/dumpCartella/registration")
	public void dumpCartellaRegistration(HttpServletRequest request) throws Exception {
		usersValidator.checkRole(request, ASLRole.ADMIN);
		apiUpdateManager.importCartellaRegistration();
	}

	@GetMapping("/admin/dumpCartella/studenti")
	public void dumpCartellaStudenti(HttpServletRequest request) throws Exception {
		usersValidator.checkRole(request, ASLRole.ADMIN);
		apiUpdateManager.importCartellaStudenti();
	}

	@GetMapping("/admin/dumpCartella/istituti")
	public void dumpCartellaIstituti(HttpServletRequest request) throws Exception {
		usersValidator.checkRole(request, ASLRole.ADMIN);
		apiUpdateManager.importCartellaIstituti();
	}

	@GetMapping("/admin/dumpCartella/aziende")
	public void dumpCartellaAziende(HttpServletRequest request) throws Exception {
		usersValidator.checkRole(request, ASLRole.ADMIN);
		apiUpdateManager.importCartellaAziende();
	}

	@GetMapping("/admin/dumpCartella/courseMetaInfo")
	public void dumpCartellaCourseMetaInfo(HttpServletRequest request) throws Exception {
		usersValidator.checkRole(request, ASLRole.ADMIN);
		apiUpdateManager.importCartellaCourseMetaInfo();
	}

	@GetMapping("/admin/dumpCartella/courses")
	public void dumpCartellaCourses(HttpServletRequest request) throws Exception {
		usersValidator.checkRole(request, ASLRole.ADMIN);
		apiUpdateManager.importCartellaCourses();
	}
	
	@GetMapping("/admin/dumpCartella/unita")
	public void dumpCartellaTeachingUnit(HttpServletRequest request) throws Exception {
		usersValidator.checkRole(request, ASLRole.ADMIN);
		apiUpdateManager.importCartellaTeachingUnit();;
	}

	@GetMapping("/admin/dumpInfoTN")
	public void dumpInfoTN(HttpServletRequest request) throws Exception {
		usersValidator.checkRole(request, ASLRole.ADMIN);
		apiUpdateManager.importAllInfoTN();
	}

	@GetMapping("/admin/dumpInfoTN/professori")
	public void dumpInfoTNProfessori(HttpServletRequest request) throws Exception {
		usersValidator.checkRole(request, ASLRole.ADMIN);
		apiUpdateManager.importInfoTNProfessori();
	}

	@GetMapping("/admin/dumpInfoTN/professoriClassi")
	public void dumpInfoTNProfessoriClassi(HttpServletRequest request) throws Exception {
		usersValidator.checkRole(request, ASLRole.ADMIN);
		apiUpdateManager.importInfoTNProfessoriClassi();
	}

	private void delete() {
		aslManager.reset();
	}

	public void importCompetenze() throws Exception {
		String path = testDataAzienda + "/competenze.json";

		List<Competenza> competenze = mapper.readValue(new File(path), new TypeReference<List<Competenza>>() {
		});

		competenze.forEach(x -> aslManager.saveCompetenza(x));
	}

	public void importAziende() throws Exception {
		String path = testDataAzienda + "/aziende.json";

		List<Azienda> competenze = mapper.readValue(new File(path), new TypeReference<List<Azienda>>() {
		});

		competenze.forEach(x -> aslManager.saveAzienda(x));
	}

	public void importAttivitaAlternanza() throws Exception {
		String path = testDataAzienda + "/attivitaAlternanza.json";

		List<AttivitaAlternanza> attivitaAlternanza = mapper.readValue(new File(path),
				new TypeReference<List<AttivitaAlternanza>>() {
				});

		attivitaAlternanza.forEach(x -> aslManager.saveAttivitaAlternanza(x));
	}

	public void importEsperienzeSvolte() throws Exception {
		String path = testDataAzienda + "/esperienzeSvolte.json";

		List<EsperienzaSvolta> esperienzeSvolte = mapper.readValue(new File(path),
				new TypeReference<List<EsperienzaSvolta>>() {
				});

		esperienzeSvolte.forEach(x -> aslManager.saveEsperienzaSvolta(x));
	}

	public void importOpportunita() throws Exception {
		String path = testDataAzienda + "/opportunita.json";

		List<Opportunita> opportunita = mapper.readValue(new File(path), new TypeReference<List<Opportunita>>() {
		});

		opportunita.forEach(x -> aslManager.saveOpportunita(x));
	}

	public void importStudenti() throws Exception {
		String path = testDataAzienda + "/studenti.json";

		List<Studente> studenti = mapper.readValue(new File(path), new TypeReference<List<Studente>>() {
		});

		studenti.forEach(x -> aslManager.saveStudente(x));
	}

	public void importTipologiaAttivita() throws Exception {
		String path = testDataScuola + "/tipologiaTipologiaAttivita.json";
		List<TipologiaTipologiaAttivita> tipologiaTipologiaAttivita = mapper.readValue(new File(path),
				new TypeReference<List<TipologiaTipologiaAttivita>>() {
				});
		tipologiaTipologiaAttivita.forEach(x -> ttaRepository.save(x));

		path = testDataScuola + "/tipologiaAttivita.json";
		List<TipologiaAttivita> tipologiaAttivita = mapper.readValue(new File(path),
				new TypeReference<List<TipologiaAttivita>>() {
				});
		tipologiaAttivita.forEach(x -> taRepository.save(x));
	}

	public void importPianiDiStudio() throws Exception {
		String path = testDataScuola + "/pianiAlternanza.json";
		List<PianoAlternanza> pianiAlternanza = mapper.readValue(new File(path),
				new TypeReference<List<PianoAlternanza>>() {
				});
		// pianiAlternanza.forEach(x -> {
		// for (int i = 0; i < 3; i++) {
		// AnnoAlternanza aa = new AnnoAlternanza();
		// aa.setNome("2017/2018");
		// aa.setOreTotali((i + 1) * 10);
		// aa = anaRepository.save(aa);
		// x.getAnniAlternanza().add(aa);
		// }
		// aslManager.savePianoAlternanza(x);
		// });
		pianiAlternanza.forEach(x -> {
			aslManager.createPianoAlternanza(x);
		});
	}

	public void importCorsiDiStudio() throws Exception {
		String path = testDataScuola + "/corsiDiStudio.json";

		List<CorsoDiStudio> corsi = mapper.readValue(new File(path), new TypeReference<List<CorsoDiStudio>>() {
		});
		corsi.forEach(x -> cdsRepository.save(x));
	}

	// public void associate() throws Exception {
	// long base = azRepository.findAll().stream().mapToLong(x ->
	// x.getId()).min().orElse(1L) - 1;
	// System.err.println("BASE = " + base);
	//
	// Azienda az = azRepository.findOne(base + 1);
	//
	// EsperienzaSvolta es = esRepository.findOne(base * 5 + 1);
	// Studente s = sRepository.findAll().get(1);
	// es.setStudente(s);
	// AttivitaAlternanza aa = aaRepository.findOne(base * 5 + 1);
	// Opportunita o = oRepository.findOne(base * 3 + 1);
	// o.setAzienda(az);
	//// o.setReferenteAzienda(az.getReferentiAzienda().get(0));
	// Competenza c = cRepository.findOne(base * 5 + 1);
	// o.getCompetenze().add(c);
	// aa.setOpportunita(o);
	// es.setAttivitaAlternanza(aa);
	// esRepository.save(es);
	//
	// es = esRepository.findOne(base * 5 + 2);
	// s = sRepository.findAll().get(2);
	// es.setStudente(s);
	// aa = aaRepository.findOne(base * 5 + 2);
	// o = oRepository.findOne(base * 3 + 1);
	// aa.setOpportunita(o);
	// es.setAttivitaAlternanza(aa);
	// esRepository.save(es);
	//
	// es = esRepository.findOne(base * 5 + 3);
	// s = sRepository.findAll().get(3);
	// es.setStudente(s);
	// aa = aaRepository.findOne(base * 5 + 3);
	// o = oRepository.findOne(base * 3 + 1);
	// aa.setOpportunita(o);
	// es.setAttivitaAlternanza(aa);
	// esRepository.save(es);
	//
	// es = esRepository.findOne(base * 5 + 4);
	// s = sRepository.findAll().get(2);
	// es.setStudente(s);
	// aa = aaRepository.findOne(base * 5 + 4);
	// o = oRepository.findOne(base * 3 + 2);
	//// o.setReferenteAzienda(az.getReferentiAzienda().get(1));
	// o.setAzienda(az);
	// c = cRepository.findOne(base * 5 + 2);
	// o.getCompetenze().add(c);
	// aa.setOpportunita(o);
	// es.setAttivitaAlternanza(aa);
	// esRepository.save(es);
	//
	// es = esRepository.findOne(base * 5 + 5);
	// s = sRepository.findAll().get(1);
	// es.setStudente(s);
	// aa = aaRepository.findOne(base * 5 + 5);
	// o = oRepository.findOne(base * 3 + 3);
	//// o.setReferenteAzienda(az.getReferentiAzienda().get(2));
	// o.setAzienda(az);
	// c = cRepository.findOne(base * 5 + 2);
	// o.getCompetenze().add(c);
	// aa.setOpportunita(o);
	// es.setAttivitaAlternanza(aa);
	// esRepository.save(es);
	//
	// }

	public void populateData() throws Exception {

		// Azienda.
		Azienda azienda = azRepository.findAll().get(0);
		AttivitaAlternanza refattAlt = aaRepository.findAll().get(0);
		Studente refStudent = sRepository.findAll().get(0);

		List<Integer> tipoAzienda = new ArrayList<Integer>();
		tipoAzienda.add(6);
		tipoAzienda.add(7);
		tipoAzienda.add(8);
		tipoAzienda.add(9);
		tipoAzienda.add(10);

		Map<String, Opportunita> offerStateMap = new HashMap<String, Opportunita>();

		// loop through all opportunita and set Azienda.
		for (Opportunita offerta : oRepository.findAll()) {
			if (tipoAzienda.contains(offerta.getTipologia())) {
				offerta.setAzienda(azienda);

				// create map s0,s1,s2
				String key = offerta.getTipologia() + "_"
						+ offerta.getTitolo().substring(offerta.getTitolo().lastIndexOf("-") + 1);
				offerStateMap.put(key, offerta);

				oRepository.save(offerta);
			}
		}

		// loop through iterator of attivita_alternanza and set opportunita
		// based on state.
		for (AttivitaAlternanza aa : aaRepository.findAll()) {
			String key = aa.getTipologia() + "_" + aa.getTitolo().substring(aa.getTitolo().lastIndexOf("-") + 1);

			if (offerStateMap.containsKey(key)) {
				Opportunita temp = offerStateMap.get(key);
				aa.setOpportunita(temp);
				aa.setDataInizio(temp.getDataInizio());
				aa.setDataFine(temp.getDataFine());

				aaRepository.save(aa);
			}
		}

		Random r = new Random();
		int Low = 1;
		int High = 5;

		// create esperienza svolta
		for (EsperienzaSvolta esp : esRepository.findAll()) {
			AttivitaAlternanza temp = aaRepository.findOne(esp.getId());
			if (temp != null) {
				if (temp.getTitolo().indexOf("-s2") != -1) {
					esp.setStato(2);
				} else if (temp.getTitolo().indexOf("-s1") != -1) {
					esp.setStato(1);
				} else if (temp.getTitolo().indexOf("-s0") != -1) {
					esp.setStato(0);
				} else if (temp.getTitolo().indexOf("-sMin1") != -1) {
					esp.setStato(-1);
				} else {
					esp.setStato(2);
				}
				esp.setAttivitaAlternanza(temp);
			} else {
				esp.setAttivitaAlternanza(refattAlt);
			}

			Studente tempStudent = sRepository.findAll().get(1);
			if (tempStudent != null) {
				esp.setStudente(tempStudent);
			} else {
				esp.setStudente(refStudent);
			}

			esRepository.save(esp);

		}

	}
	
	@GetMapping("/admin/scheduleImport")
	public void adminSchedule(HttpServletRequest request) throws Exception {
		usersValidator.checkRole(request, ASLRole.ADMIN);
		if (logger.isInfoEnabled()) {
			logger.info("start InfoTnScheduledTask");
		}
		apiUpdateManager.importCartellaIstituti();
		apiUpdateManager.importCartellaTeachingUnit();
		apiUpdateManager.importCartellaAziende();
		apiUpdateManager.importCartellaCourseMetaInfo();
		apiUpdateManager.importCartellaCourses();
		apiUpdateManager.importCartellaStudenti();
		apiUpdateManager.importCartellaRegistration();
	}
	
	
	/**
	 * SCHEDULED ROUTINE
	 * @throws Exception
	 */
	@Scheduled(cron = "0 00 02 * * ?")
	public void scheduledImport() throws Exception {
		if (logger.isInfoEnabled()) {
			logger.info("start schedule import from Cartella");
		}
		apiUpdateManager.importCartellaAziende();
		apiUpdateManager.importCartellaStudenti();
		apiUpdateManager.importCartellaRegistration();
	}
	
	
	/**
	 * ADMIN API CALL FOR ALLINEARE ESPERIENZA.
	 * @throws Exception
	 */
	@GetMapping("/admin/alignEsperienzaInfoTN")
	public void allineamentEsperienzaAdmin(HttpServletRequest request) throws Exception {
		usersValidator.checkRole(request, ASLRole.ADMIN);
		if (logger.isInfoEnabled()) {
			logger.info("start InfoTnScheduledTask per allineare esperienza");
		}
		for (EsperienzaSvoltaAllineamento esAl : esperienzaAllineamentoRepository.findByDaAllineare(true)) {
			entitiesManager.allineaEsperienzaSvolta(esAl);
		}
	}
	/**
	 * SCHEDULED ROUTINE
	 * @throws Exception
	 */
	@Scheduled(cron = "0 00 03 * * ?")
	public void allineamentEsperienza() throws Exception {
		if (logger.isInfoEnabled()) {
			logger.info("start InfoTnScheduledTask per allineare esperienza");
		}
		for (EsperienzaSvoltaAllineamento esAl : esperienzaAllineamentoRepository.findByDaAllineare(true)) {
			entitiesManager.allineaEsperienzaSvolta(esAl);
		}
	}

}
