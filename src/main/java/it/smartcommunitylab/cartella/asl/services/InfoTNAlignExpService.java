package it.smartcommunitylab.cartella.asl.services;

import java.text.SimpleDateFormat;
import java.util.AbstractMap;
import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;

import it.smartcommunitylab.cartella.asl.exception.BadRequestException;
import it.smartcommunitylab.cartella.asl.model.EsperienzaSvolta;
import it.smartcommunitylab.cartella.asl.model.Istituzione;
import it.smartcommunitylab.cartella.asl.model.TeachingUnit;
import it.smartcommunitylab.cartella.asl.model.ext.AlignEsperienza;
import it.smartcommunitylab.cartella.asl.model.ext.Registration;
import it.smartcommunitylab.cartella.asl.repository.IstituzioneRepository;
import it.smartcommunitylab.cartella.asl.repository.RegistrationRepository;
import it.smartcommunitylab.cartella.asl.repository.TeachingUnitRepository;
import it.smartcommunitylab.cartella.asl.util.ErrorLabelManager;
import it.smartcommunitylab.cartella.asl.util.HttpsUtils;
import it.smartcommunitylab.cartella.asl.util.Utils;

@Service
public class InfoTNAlignExpService {

	private static final transient Log logger = LogFactory.getLog(InfoTNAlignExpService.class);

	@Value("${infoTN.esAlignUri}")
	private String infoTNAPIUrl;
	@Value("${infoTN.esAlignToken}")
	private String token;
	@Value("${infoTN.esAlignOrigine}")
	private String sistemaOrigine;
	@Autowired
	private IstituzioneRepository istitutoRepository;
	@Autowired
	private TeachingUnitRepository teachingUnitRepository;
	@Autowired
	private RegistrationRepository registrationRepository;
	@Autowired
	private HttpsUtils httpsUtils;
	@Autowired
	private ErrorLabelManager errorLabelManager;

	private SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/YYYY");
	private ObjectMapper mapper = new ObjectMapper();

	Map<String, String> infoTNAslCodDesr = Stream.of(new AbstractMap.SimpleEntry<>("10", "Tirocinio curriculare"),
			new AbstractMap.SimpleEntry<>("11", "Tirocinio estivo retribuito (L.P. 19 16/06/83)"),
			new AbstractMap.SimpleEntry<>("20", "Commessa esterna"),
			new AbstractMap.SimpleEntry<>("25", "Visita aziendale"),
			new AbstractMap.SimpleEntry<>("30", "Impresa formativa simulata/Cooperativa Formativa Scolastica"),
			new AbstractMap.SimpleEntry<>("35", "Attività sportiva"),
			new AbstractMap.SimpleEntry<>("40", "Anno all'estero"),
			new AbstractMap.SimpleEntry<>("50", "Lavoro retribuito"),
			new AbstractMap.SimpleEntry<>("55", "Volontariato"), new AbstractMap.SimpleEntry<>("60", "Formazione"),
			new AbstractMap.SimpleEntry<>("65", "Testimonianze"),
			new AbstractMap.SimpleEntry<>("70", "Elaborazione esperienze/project work"))
			.collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue));

	Map<String, String> infoTNAslAS = Stream
			.of(new AbstractMap.SimpleEntry<>("10", "A"), new AbstractMap.SimpleEntry<>("11", "A"),
					new AbstractMap.SimpleEntry<>("20", "A"), new AbstractMap.SimpleEntry<>("25", "A"),
					new AbstractMap.SimpleEntry<>("30", "A"), new AbstractMap.SimpleEntry<>("35", "A"),
					new AbstractMap.SimpleEntry<>("40", "A"), new AbstractMap.SimpleEntry<>("50", "A"),
					new AbstractMap.SimpleEntry<>("55", "A"), new AbstractMap.SimpleEntry<>("60", "S"),
					new AbstractMap.SimpleEntry<>("65", "S"), new AbstractMap.SimpleEntry<>("70", "S"))
			.collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue));

	Map<String, String> fbkToInfoTNASL = Stream
			.of(new AbstractMap.SimpleEntry<>("7", "10"), new AbstractMap.SimpleEntry<>("10", "11"),
					new AbstractMap.SimpleEntry<>("8", "20"), new AbstractMap.SimpleEntry<>("6", "25"),
					new AbstractMap.SimpleEntry<>("5", "30"), new AbstractMap.SimpleEntry<>("9", "35"),
					new AbstractMap.SimpleEntry<>("4", "40"), new AbstractMap.SimpleEntry<>("11", "50"),
					new AbstractMap.SimpleEntry<>("12", "55"), new AbstractMap.SimpleEntry<>("2", "60"),
					new AbstractMap.SimpleEntry<>("1", "65"), new AbstractMap.SimpleEntry<>("3", "70"))
			.collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue));

	public String alignEsperienza(EsperienzaSvolta es) throws Exception {
		logger.info("call align experience service infoTN");
		ObjectMapper objectMapper = new ObjectMapper();
		objectMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
		String url = infoTNAPIUrl;

		TeachingUnit teachingUnit = null;
		String mappedCodeASL = fbkToInfoTNASL.get(String.valueOf(es.getAttivitaAlternanza().getTipologia()));

		if (es.getTeachingUnitId() == null || es.getTeachingUnitId().isEmpty()) {
			List<Registration> regs = registrationRepository
					.findRegistrationByCourseIdAndSchoolYearAndInstituteIdAndStudentId(
							es.getAttivitaAlternanza().getCorsoId(), es.getAttivitaAlternanza().getAnnoScolastico(),
							es.getAttivitaAlternanza().getIstitutoId(), es.getStudente().getId());
			
			if (regs != null && !regs.isEmpty()) {
				regs.sort(Comparator.comparing(Registration::getDateFrom).reversed());
//				regs.sort((r1,r2) -> r2.getDateFrom().compareTo(r1.getDateFrom())); // change object position to reverse order
				teachingUnit = teachingUnitRepository.findOne(regs.get(0).getTeachingUnitId());
			}
			
		} else {
			teachingUnit = teachingUnitRepository.findOne(es.getTeachingUnitId());
		}

		if (teachingUnit == null) {
			throw new BadRequestException(errorLabelManager.get("teaching.unit.error.notfound"));
		}

		AlignEsperienza ae = new AlignEsperienza();
		ae.setSistemaOrigine(sistemaOrigine);
		ae.setCodiceOrigine(es.getId());
		ae.setCodiceMiurUnitaScolastica(teachingUnit.getCodiceMiur());
		ae.setAnnoScolastico(getSchoolYear(es.getAttivitaAlternanza().getAnnoScolastico()));
		ae.setCodiceFiscaleStudente(es.getStudente().getCf());
		ae.setCognomeStudente(es.getStudente().getSurname());
		ae.setNomeStudente(es.getStudente().getName());
		ae.setDataDiNascitaStudente(es.getStudente().getBirthdate());
		ae.setCodiceTipoEsperienzaASL(Long.valueOf(mappedCodeASL));
		ae.setDescTipoEsperienzaASL(infoTNAslCodDesr.get(mappedCodeASL));
		ae.setDenominazioneEsperienzaASL(es.getAttivitaAlternanza().getTitolo());
		ae.setNumeroOreEsperienzaASL(es.getAttivitaAlternanza().getOre());
		ae.setDataInizioEsperienzaASL(sdf.format(new Date(es.getAttivitaAlternanza().getDataInizio())));
		ae.setDataFineEsperienzaASL(sdf.format(new Date(es.getAttivitaAlternanza().getDataFine())));
		ae.setEsperienzaASLAziendaScuola(infoTNAslAS.get(mappedCodeASL));
		ae.setTutorInternoEsperienzaASL(es.getAttivitaAlternanza().getReferenteScuola());
		es.getPresenze().computeOreSvolte(); // compute ore svolte.
		ae.setNumeroOreFrequentateStudente(String.valueOf(es.getPresenze().getOreSvolte()));
		/**
		 * Fix for tackling topologies
		 * (Anno all'estero | Impresa formativa simulata/Cooperativa Formativa Scolastica)
		 **/
		if (es.getAttivitaAlternanza().getTipologia() == 5 | es.getAttivitaAlternanza().getTipologia() == 4) {
			logger.info(infoTNAslCodDesr.get(mappedCodeASL));
			Istituzione ist = istitutoRepository.findOne(es.getAttivitaAlternanza().getIstitutoId());
			ae.setDenominazioneAzienda(ist.getName());
			ae.setCodiceTipoAzienda(20); // pubblica amministrazione
			ae.setTipoAzienda(ist.getName());
			ae.setPartitaIVAAzienda(ist.getCf());
			ae.setTutorEsternoEsperienzaASL(es.getAttivitaAlternanza().getReferenteScuola());
		} else if (es.getAttivitaAlternanza().getOpportunita() != null) { // external.
			if (es.getAttivitaAlternanza().getOpportunita().getAzienda().getIdTipoAzienda() > 0) {
				ae.setDenominazioneAzienda(es.getAttivitaAlternanza().getOpportunita().getAzienda().getNome());
				ae.setCodiceTipoAzienda(es.getAttivitaAlternanza().getOpportunita().getAzienda().getIdTipoAzienda());
				ae.setTipoAzienda(es.getAttivitaAlternanza().getOpportunita().getAzienda().getNome());
				ae.setPartitaIVAAzienda(es.getAttivitaAlternanza().getOpportunita().getAzienda().getPartita_iva());
				// obligatory while defining opportunity.
				ae.setTutorEsternoEsperienzaASL(es.getAttivitaAlternanza().getOpportunita().getReferente());
			} else {
				throw new BadRequestException(errorLabelManager.get("codice.tipo.azienda.error.notfound"));
			}
		}

		String json = mapper.writeValueAsString(ae);
		// logger.info("token" + token);
		// logger.info("url" + url);
		logger.info("body" + json);

		return httpsUtils.sendPOSTSAA(url, "application/json", "application/json", token, json);

	}

	private String getSchoolYear(String annoScolastico) {
		return annoScolastico.replace("-", "/");
	}

}
