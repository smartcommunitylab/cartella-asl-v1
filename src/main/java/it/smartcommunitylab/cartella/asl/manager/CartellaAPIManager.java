package it.smartcommunitylab.cartella.asl.manager;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.EntityManager;
import javax.servlet.http.HttpServletResponse;
import javax.transaction.Transactional;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;

import it.smartcommunitylab.cartella.asl.exception.ASLCustomException;
import it.smartcommunitylab.cartella.asl.model.CorsoDiStudio;
import it.smartcommunitylab.cartella.asl.repository.AziendaRepository;
import it.smartcommunitylab.cartella.asl.repository.CorsoDiStudioRepository;
import it.smartcommunitylab.cartella.asl.repository.CorsoMetaInfoRepository;
import it.smartcommunitylab.cartella.asl.repository.IstituzioneRepository;
import it.smartcommunitylab.cartella.asl.repository.StudenteRepository;
import it.smartcommunitylab.cartella.asl.util.HttpsUtils;

@Component
@Transactional
public class CartellaAPIManager {

	private static final transient Log logger = LogFactory.getLog(CartellaAPIManager.class);

	@Value("${cartella.api}")
	private String cartellaAPIUrl;

	@Autowired
	private HttpsUtils httpsUtils;

	@Autowired
	StudenteRepository studenteRepository;

	@Autowired
	IstituzioneRepository istituzioneRepository;

	@Autowired
	CorsoDiStudioRepository corsoDiStudioRepository;

	@Autowired
	CorsoMetaInfoRepository corsoMetaInfoRepository;

	@Autowired
	AziendaRepository aziendaRepository;

	@Autowired
	protected EntityManager em;

	public List<it.smartcommunitylab.cartella.asl.model.ext.Istituzione> getMappedIstituzione(String bearerHeader)
			throws ASLCustomException {

		ObjectMapper mapper = new ObjectMapper();
		String istitutoAPIUrl = cartellaAPIUrl + "/institute";
		List<it.smartcommunitylab.cartella.asl.model.ext.Istituzione> mappedASLIstitute = new ArrayList<it.smartcommunitylab.cartella.asl.model.ext.Istituzione>();

		try {
			String cartellaResponse = httpsUtils.sendGET(istitutoAPIUrl, "application/json", "application/json",
					bearerHeader, -1);
			if (cartellaResponse != null && !cartellaResponse.isEmpty()) {

				List<it.smartcommunitylab.cartella.asl.model.ext.Istituzione> temp = mapper.readValue(cartellaResponse,
						List.class);
				mappedASLIstitute.addAll(temp);
			}

		} catch (Exception e) {
			logger.error(istitutoAPIUrl + " " + e.getMessage());
			throw new ASLCustomException(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, e.getMessage());
		}

		return mappedASLIstitute;

	}

	public List<CorsoDiStudio> getCorsi(String istitutoId, String schoolYear) throws ASLCustomException {

		List<CorsoDiStudio> mappedCorsi = corsoDiStudioRepository
				.findCorsoDiStudioByIstitutoIdAndAnnoScolastico(istitutoId, schoolYear);

		return mappedCorsi;
	}

	public it.smartcommunitylab.cartella.asl.model.ext.Studente getStudentByCF(String bearerHeader, String cf,
			Boolean foto) throws ASLCustomException {

		ObjectMapper mapper = new ObjectMapper();
		mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
		String studentAPIUrl = cartellaAPIUrl + "/student/cf/" + cf + "?foto=" + foto;

		try {
			String cartellaResponse = httpsUtils.sendGET(studentAPIUrl, "application/json", "application/json",
					bearerHeader, -1);
			if (cartellaResponse != null && !cartellaResponse.isEmpty()) {

				it.smartcommunitylab.cartella.asl.model.ext.Studente temp = mapper.readValue(cartellaResponse,
						it.smartcommunitylab.cartella.asl.model.ext.Studente.class);
				return temp;
			}
		} catch (Exception e) {
			logger.error(studentAPIUrl + " " + e.getMessage());
			throw new ASLCustomException(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, e.getMessage());
		}
		return null;
	}

}
