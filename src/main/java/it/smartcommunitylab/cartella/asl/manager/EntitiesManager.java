package it.smartcommunitylab.cartella.asl.manager;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import javax.annotation.PostConstruct;
import javax.persistence.EntityManager;
import javax.persistence.TypedQuery;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.annotation.Validated;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.common.base.Splitter;
import com.google.common.collect.Lists;
import com.google.common.collect.Maps;
import com.google.common.collect.Sets;

import it.smartcommunitylab.cartella.asl.exception.BadRequestException;
import it.smartcommunitylab.cartella.asl.exception.ParseErrorException;
import it.smartcommunitylab.cartella.asl.model.AnnoAlternanza;
import it.smartcommunitylab.cartella.asl.model.AttivitaAlternanza;
import it.smartcommunitylab.cartella.asl.model.AttivitaAlternanzaStub;
import it.smartcommunitylab.cartella.asl.model.Azienda;
import it.smartcommunitylab.cartella.asl.model.Competenza;
import it.smartcommunitylab.cartella.asl.model.Consenso;
import it.smartcommunitylab.cartella.asl.model.CorsoDiStudio;
import it.smartcommunitylab.cartella.asl.model.CorsoInterno;
import it.smartcommunitylab.cartella.asl.model.Documento;
import it.smartcommunitylab.cartella.asl.model.EsperienzaSvolta;
import it.smartcommunitylab.cartella.asl.model.EsperienzaSvoltaAllineamento;
import it.smartcommunitylab.cartella.asl.model.Istituzione;
import it.smartcommunitylab.cartella.asl.model.OppCorso;
import it.smartcommunitylab.cartella.asl.model.Opportunita;
import it.smartcommunitylab.cartella.asl.model.PianoAlternanza;
import it.smartcommunitylab.cartella.asl.model.PresenzaGiornaliera;
import it.smartcommunitylab.cartella.asl.model.ReferenteAlternanza;
import it.smartcommunitylab.cartella.asl.model.ReferenteAzienda;
import it.smartcommunitylab.cartella.asl.model.Studente;
import it.smartcommunitylab.cartella.asl.model.TipologiaAttivita;
import it.smartcommunitylab.cartella.asl.model.TipologiaTipologiaAttivita;
import it.smartcommunitylab.cartella.asl.model.audit.AuditEntry;
import it.smartcommunitylab.cartella.asl.model.ext.Registration;
import it.smartcommunitylab.cartella.asl.model.users.ASLRole;
import it.smartcommunitylab.cartella.asl.model.users.ASLUser;
import it.smartcommunitylab.cartella.asl.model.users.ASLUserRole;
import it.smartcommunitylab.cartella.asl.repository.ASLUserRepository;
import it.smartcommunitylab.cartella.asl.repository.AnnoAlternanzaRepository;
import it.smartcommunitylab.cartella.asl.repository.AttivitaAlternanzaRepository;
import it.smartcommunitylab.cartella.asl.repository.AziendaRepository;
import it.smartcommunitylab.cartella.asl.repository.CompetenzaRepository;
import it.smartcommunitylab.cartella.asl.repository.ConsensoRepository;
import it.smartcommunitylab.cartella.asl.repository.CorsoDiStudioRepository;
import it.smartcommunitylab.cartella.asl.repository.CorsoInternoRepository;
import it.smartcommunitylab.cartella.asl.repository.DocumentoRepository;
import it.smartcommunitylab.cartella.asl.repository.EsperienzaAllineamentoRepository;
import it.smartcommunitylab.cartella.asl.repository.EsperienzaSvoltaRepository;
import it.smartcommunitylab.cartella.asl.repository.IstituzioneRepository;
import it.smartcommunitylab.cartella.asl.repository.OppCorsoRepository;
import it.smartcommunitylab.cartella.asl.repository.OpportunitaRepository;
import it.smartcommunitylab.cartella.asl.repository.PianoAlternanzaRepository;
import it.smartcommunitylab.cartella.asl.repository.ReferenteAlternanzaRepository;
import it.smartcommunitylab.cartella.asl.repository.ReferenteAziendaRepository;
import it.smartcommunitylab.cartella.asl.repository.RegistrationRepository;
import it.smartcommunitylab.cartella.asl.repository.StudenteRepository;
import it.smartcommunitylab.cartella.asl.repository.TeachingUnitRepository;
import it.smartcommunitylab.cartella.asl.repository.TipologiaAttivitaRepository;
import it.smartcommunitylab.cartella.asl.repository.TipologiaTipologiaAttivitaRepository;
import it.smartcommunitylab.cartella.asl.security.ASLUserDetails;
import it.smartcommunitylab.cartella.asl.services.InfoTNAlignExpService;
import it.smartcommunitylab.cartella.asl.util.Constants;
import it.smartcommunitylab.cartella.asl.util.ErrorLabelManager;
import it.smartcommunitylab.cartella.asl.util.Utils;

@Repository
@Transactional
@Validated
public class EntitiesManager {
	
	private static final transient Log logger = LogFactory.getLog(EntitiesManager.class);
	
	@Autowired
	protected EntityManager em;	
	
	@Autowired
	protected PianoAlternanzaRepository pianoAlternanzaRepository;	

	@Autowired
	protected InfoTNAlignExpService infoTNAlignExpService;		
	
	@Autowired
	protected AnnoAlternanzaRepository annoAlternanzaRepository;	
	
	@Autowired
	protected TipologiaAttivitaRepository tipologiaAttivitaRepository;		
	
	@Autowired
	protected TipologiaTipologiaAttivitaRepository tipologiaTipologiaAttivitaRepository;		
	
	@Autowired
	protected CompetenzaRepository competenzaRepository;	
	
	@Autowired
	protected AttivitaAlternanzaRepository attivitaAlternanzaRepository;

	@Autowired
	protected CorsoInternoRepository corsoInternoRepository;	
	
	@Autowired
	protected OpportunitaRepository opportunitaRepository;	
	
	@Autowired
	protected EsperienzaSvoltaRepository esperienzaSvoltaRepository;
	
	@Autowired
	protected EsperienzaAllineamentoRepository esperienzaAllineamentoRepository;
	
	@Autowired
	protected StudenteRepository studenteRepository;		
	
	@Autowired
	protected ReferenteAlternanzaRepository referenteAlternanzaRepository;			

	@Autowired
	protected ReferenteAziendaRepository referenteAziendaRepository;		
	
	@Autowired
	protected DocumentoRepository documentoRepository;	
	
	@Autowired
	protected AziendaRepository aziendaRepository;	
	
	@Autowired
	protected CorsoDiStudioRepository corsoDiStudioRepository;
	
	@Autowired
	protected OppCorsoRepository oppCorsoRepository;
	
	@Autowired
	protected RegistrationRepository registrationRepository;	
	
	@Autowired
	protected IstituzioneRepository istituzioneRepository;
	
	@Autowired
	protected ASLUserRepository aslUserRepository;	
	
	@Autowired
	private ErrorLabelManager errorLabelManager;
	
	@Autowired
	protected AuditManager auditManager;
	
	@Autowired
	protected ConsensoRepository consensoRepository;
	
	SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");
	
	@PostConstruct
	public void init() {
//		Class
	}
	
	public void reset() {
		documentoRepository.deleteAll();
		esperienzaSvoltaRepository.deleteAll();
		opportunitaRepository.deleteAll();
		referenteAlternanzaRepository.deleteAll();
		studenteRepository.deleteAll();
		attivitaAlternanzaRepository.deleteAll();
		competenzaRepository.deleteAll();
		tipologiaAttivitaRepository.deleteAll();
		annoAlternanzaRepository.deleteAll();
//		pianoDiStudioRepository.deleteAll();
		pianoAlternanzaRepository.deleteAll();
		
		corsoInternoRepository.deleteAll();;		
		aziendaRepository.deleteAll();;			
	}
	
	// PianoAlternanza
	
	public PianoAlternanza saveNewPianoAlternanza(PianoAlternanza pa) {
		List<AnnoAlternanza> aas = Lists.newArrayList();
		for (AnnoAlternanza aa: pa.getAnniAlternanza()) {
			aas.add(saveAnnoAlternanza(aa));
		}
		pa.setAnniAlternanza(aas);
		return pianoAlternanzaRepository.saveAndFlush(pa);
	}
	
	public PianoAlternanza savePianoAlternanza(PianoAlternanza pa) {
		return pianoAlternanzaRepository.saveAndFlush(pa);
	}	
	
	public PianoAlternanza createPianoAlternanza(PianoAlternanza pa) {
//		disableOtherPianiAlternanza(pa);
		
		int anno = Utils.annoScolasticoToInt(pa.getAnnoScolasticoAttivazione());
//		List<AnnoAlternanza> anni = Lists.newArrayList();
//		for (int i = 0; i < 3; i++) {
//			AnnoAlternanza aa = new AnnoAlternanza();
//			aa.setNome(Utils.intToAnnoScolastico(anno + i));
//			aa.setAnnoCorso(3 + i);
//			// TODO temporary!
//			aa.setOreTotali((i + 1) * 50); 
//			anni.add(aa);
//		}
//		pa.setAnniAlternanza(anni);
		
		for (int i = 0; i < 3; i++) {
			AnnoAlternanza aa = pa.getAnniAlternanza().get(i);
			aa.setId(null);
			aa.setNome(Utils.intToAnnoScolastico(anno + i));
			aa.setAnnoCorso(3 + i);
		}
		pa.setAttivo(false);
		PianoAlternanza result = saveNewPianoAlternanza(pa);
		return result;
	}
	
	public PianoAlternanza activatePianoAlternanza(Long id) throws BadRequestException {
		PianoAlternanza pa = pianoAlternanzaRepository.findOne(id);
		
		if (pa == null) {
			throw new BadRequestException(errorLabelManager.get("piano.error.notfound")); //"PianoAlternanza non trovato"
		}	
		
		disableOtherPianiAlternanza(pa);
		pa.setAttivo(true);
		
		return savePianoAlternanza(pa);
	}	
	
	private void disableOtherPianiAlternanza(PianoAlternanza pa) {
		List<PianoAlternanza> pas = pianoAlternanzaRepository.findPianoAlternanzaByCorsoDiStudioIdAndIstitutoIdAndAttivo(pa.getCorsoDiStudioId(), pa.getIstitutoId(), true);
		for (PianoAlternanza pa0: pas) {
			pa0.setAttivo(false);
			pa0.setAnnoScolasticoDisattivazione(pa.getAnnoScolasticoAttivazione());
		}
		pianoAlternanzaRepository.save(pas);
	}
	
	public PianoAlternanza getPianoAlternanza(long id) {
		PianoAlternanza pa = pianoAlternanzaRepository.findOne(id);
		return pa;
//		PianoAlternanza pa = pianoAlternanzaRepository.findWithAnnoAlternanza(id);
//		return pianoAlternanzaRepository.findOne(id);
	}
	
	public List<PianoAlternanza> findPianoAlternanzaByIstitutoId(String id) {
		return pianoAlternanzaRepository.findPianoAlternanzaByIstitutoId(id);
	}
	
	public PianoAlternanza findPianoAlternanzaByAttivitaAlternanza(AttivitaAlternanza aa) {
		return pianoAlternanzaRepository.findPianoAlternanzaByAnniAlternanza(aa.getAnnoAlternanza());
	}	
	
	public void updatePianoAlternanza(PianoAlternanza pa) {
		pianoAlternanzaRepository.update(pa);
	}	
	
	public void updatePianoAlternanzaStato(long id, boolean stato) {
		pianoAlternanzaRepository.updateStato(id, stato);
	}		
	
	public boolean deletePianoAlternanza(long id) throws BadRequestException {
		PianoAlternanza pa = getPianoAlternanza(id);

		if (pa == null) {
			throw new BadRequestException(errorLabelManager.get("piano.error.notfound"));
		}		
		
		boolean deleteable = true;
		for (AnnoAlternanza aa : pa.getAnniAlternanza()) {
			List<AttivitaAlternanza> atts = attivitaAlternanzaRepository.findAttivitaAlternanzaByAnnoAlternanza(aa);
			if (!atts.isEmpty()) {
				deleteable = false;
				break;
			}
		}

		if (deleteable) {
			for (AnnoAlternanza aa : pa.getAnniAlternanza()) {
				deleteAnnoAlternanza(aa.getId());
			}

			pa.setAnniAlternanza(Lists.newArrayList());
			pa.setCompetenzeFromSet(Sets.newHashSet());
			pianoAlternanzaRepository.save(pa);

			pianoAlternanzaRepository.delete(id);
			return true;
		}
		
		return false;
	}
	
	public PianoAlternanza clonePianoAlternanza(long id) throws BadRequestException {
		PianoAlternanza pa = getPianoAlternanza(id);
		if (pa == null) {
			throw new BadRequestException(errorLabelManager.get("piano.error.notfound"));
		}
		
		ObjectMapper mapper = new ObjectMapper();

		PianoAlternanza pa2 = new PianoAlternanza();
		pa2.setAnnoScolasticoAttivazione(pa.getAnnoScolasticoAttivazione());
		pa2.setAnnoScolasticoDisattivazione(pa.getAnnoScolasticoDisattivazione());
		pa2.setAttivo(false);
		pa2.setCorsoDiStudio(pa.getCorsoDiStudio());
		pa2.setCorsoDiStudioId(pa.getCorsoDiStudioId());
		pa2.setFineValidita(pa.getFineValidita());
		pa2.setInizioValidita(pa.getInizioValidita());
		pa2.setIstituto(pa.getIstituto());
		pa2.setIstitutoId(pa.getIstitutoId());
		pa2.setStato(pa.getStato());
		pa2.setTitolo(pa.getTitolo());
		pa2.setCompetenzeFromSet(Sets.newHashSet(pa.getCompetenze()));
		// transient
		pa2.setInUso(pa.isInUso());
		pa2.setStato(pa.getStato());		
		
		for (AnnoAlternanza aa: pa.getAnniAlternanza()) {
			AnnoAlternanza aa2 = new AnnoAlternanza();
			aa2.setNome(aa.getNome());
			aa2.setOreTotali(aa.getOreTotali());
			aa2.setAnnoCorso(aa.getAnnoCorso());
			for (TipologiaAttivita ta: aa.getTipologieAttivita()) {
				TipologiaAttivita ta2 = new TipologiaAttivita();
				ta2.setTipologia(ta.getTipologia());
				ta2.setTitolo(ta.getTitolo());
				aa2.getTipologieAttivita().add(ta2);
			}
			pa2.getAnniAlternanza().add(aa2);
		}
		
		pa2 = saveNewPianoAlternanza(pa2);
		
		return pa2;
	}
	
	
//	// PianoDiStudio
//	public PianoDiStudio savePianoDiStudio(PianoDiStudio pds) {
//		return pianoDiStudioRepository.save(pds);
//	}
//	
//	public PianoDiStudio getPianoDiStudio(long id) {
//		return pianoDiStudioRepository.findOne(id);
//	}
//	
//	public void updatePianoDiStudio(PianoAlternanza pds) {
//		// TODO
////		pdsRepository.update(pds);
//	}	
//	
//	public void deletePianoDiStudio(long id) {
//		pianoDiStudioRepository.delete(id);
//	}	
	
	
	// AnnoAlternanza
	public AnnoAlternanza saveAnnoAlternanza(AnnoAlternanza aa) {
		return annoAlternanzaRepository.saveAndFlush(aa);
	}
	
	public AnnoAlternanza getAnnoAlternanza(long id) {
		return annoAlternanzaRepository.findOne(id);
	}
	
	public List<AnnoAlternanza> getAnniAlternanza(List<Long> ids) {
		return annoAlternanzaRepository.findAll(ids);
	}	
	
	public void updateAnnoAlternanza(AnnoAlternanza aa) {
		annoAlternanzaRepository.update(aa);
	}	
	
	public void deleteAnnoAlternanza(long id) {
		annoAlternanzaRepository.delete(id);
	}
	
	public void setOreTotaliAnnoAlternanza(long paId, int annoCorso, Integer oreTotali) throws BadRequestException {
		PianoAlternanza pa = getPianoAlternanza(paId);
		
		if (pa == null) {
			throw new BadRequestException(errorLabelManager.get("piano.error.notfound"));
		}		
		
		AnnoAlternanza annoAlternanza = pa.getAnniAlternanza().stream().filter(x -> x.getAnnoCorso() == annoCorso).findFirst().orElse(null);
		
		if (annoAlternanza == null) {
			throw new BadRequestException(errorLabelManager.get("anno.alt.error.notfound"));
		}
		
		annoAlternanza.setOreTotali(oreTotali);
		annoAlternanzaRepository.update(annoAlternanza);
	}
	
	
	// AttivitaAlternanza
	public AttivitaAlternanza saveAttivitaAlternanza(AttivitaAlternanza aa) {
		return attivitaAlternanzaRepository.save(aa);
	}
	
	public AttivitaAlternanza getAttivitaAlternanza(long id, boolean addStudenti) {
		AttivitaAlternanza aa =  attivitaAlternanzaRepository.findOne(id);
		
		if (aa != null && addStudenti) {
			List<EsperienzaSvolta> ess = findEsperienzaSvoltaByAttivitaAlternanza(aa);
			aa.getStudenti().addAll(ess.stream().filter(x -> x.getStudente() != null).map(x -> x.getStudente()).collect(Collectors.toSet()));
		}
		
		return aa;
	}
	
	public Page<AttivitaAlternanza> findAttivitaAlternanzaByAnnoAlternanzaId(long aaId, Pageable pageRequest) {
		return attivitaAlternanzaRepository.findAttivitaAlternanzaByAnnoAlternanzaId(aaId, pageRequest);
	}	
	
	public List<AttivitaAlternanza> getAttivitaAlternanza(List<Long> ids) {
		return attivitaAlternanzaRepository.findAll(ids);
	}	
	
	public void updateAttivitaAlternanza(AttivitaAlternanza aa) {
		attivitaAlternanzaRepository.update(aa);
	}	
	
	public void updateAttivitaAlternanzaAtCurrentDate(long id, AttivitaAlternanzaStub aaStub) throws BadRequestException, ParseErrorException {
		AttivitaAlternanza aa = attivitaAlternanzaRepository.findOne(id);
		
		if (aa == null) {
			throw new BadRequestException(errorLabelManager.get("attivita.alt.error.notfound"));
		}		
		
		// CARTELLA-323 - alignment with registration data check.
		Date upperAA = new Date(aaStub.getDataInizio());
		Date lowerAA = new Date(aaStub.getDataFine());
		for (String studenteId : aaStub.getStudentiId()) {
			if (!validDatesAA(aa.getCorsoId(), aa.getIstitutoId(), aa.getAnnoScolastico(),
					String.valueOf(aa.getAnnoCorso()), studenteId, upperAA, lowerAA)) {
				throw new BadRequestException(errorLabelManager.get("registration.date.error"));
			}
		}
		
		if (aaStub.getAnnoScolastico() != null) {
			aa.setAnnoScolastico(aaStub.getAnnoScolastico());
		}
		if (aaStub.getDataInizio() != null) {
			aa.setDataInizio(aaStub.getDataInizio());
		}
		if (aaStub.getDataFine() != null) { 
			aa.setDataFine(aaStub.getDataFine());
		}
		if (aaStub.getCompetenzeId() != null && !aaStub.getCompetenzeId().isEmpty()) {
			aa.setCompetenzeFromSet(Sets.newHashSet(competenzaRepository.findAll(aaStub.getCompetenzeId())));
		}	
		if (aaStub.getOre() != null) {
			aa.setOre(aaStub.getOre());
		}
		if (aaStub.getReferenteScuola() != null) {
			aa.setReferenteScuola(aaStub.getReferenteScuola());
		}	
		if (aaStub.getReferenteScuolaCF() != null) {
			aa.setReferenteScuolaCF(aaStub.getReferenteScuolaCF());
		}		
		if (aaStub.getTags() != null) {
			aa.setTags(aaStub.getTags());
		}
		if (aaStub.getTitolo() != null) {
			aa.setTitolo(aaStub.getTitolo());
		}		
		
		if (aaStub.getStudentiId() != null) {
			List<Studente> newStudenti = studenteRepository.findAll(aaStub.getStudentiId());

			List<EsperienzaSvolta> ess = esperienzaSvoltaRepository.findEsperienzaSvoltaByAttivitaAlternanza(aa);
			List<Studente> oldStudenti = ess.stream().map(x -> x.getStudente()).collect(Collectors.toList());

			List<EsperienzaSvolta> essToRemove = Lists.newArrayList();
			List<Studente> studentiToAdd = Lists.newArrayList();

			for (EsperienzaSvolta es : ess) {
				if (!newStudenti.contains(es.getStudente())) {
					essToRemove.add(es);
				}
			}

			for (Studente sta : newStudenti) {
				if (!oldStudenti.contains(sta)) {
					studentiToAdd.add(sta);
				}
			}

			if (aa.getOpportunita() != null) {
				boolean available = decreasePostiRimanenti(aa.getOpportunita(), essToRemove.size(),
						studentiToAdd.size());
				if (!available) {
					throw new BadRequestException(errorLabelManager.get("opportunita.error.posti"));
				}
				oppCorsoRepository.save(aa.getOpportunita());
			}

			for (EsperienzaSvolta es : ess) {
				if (!essToRemove.contains(es.getStudente())) {
					// CARTELLA-317 (ALIGN GIORNATE PER DATA MODIFICATA)
					try {
						alignPresenzeData(es, aaStub.getDataInizio(), aaStub.getDataFine());
					} catch (ParseException e) {
						// TODO Auto-generated catch block
						throw new ParseErrorException(e.getMessage());
					}
				}
			}

			for (Studente studente : studentiToAdd) {
				EsperienzaSvolta es = new EsperienzaSvolta();

				es.setStudente(studente);
				es.setAttivitaAlternanza(aa);

				if (aaStub.getCompetenzeId() != null && !aaStub.getCompetenzeId().isEmpty()) {
					es.setCompetenzeFromSet(Sets.newHashSet(competenzaRepository.findAll(aaStub.getCompetenzeId())));
				}

				// save teaching unit Id inside ES(CARTELLA-316).
				es.setTeachingUnitId(getLastRegistration(aa.getCorsoId(), aa.getIstitutoId(), aa.getAnnoScolastico(),
						String.valueOf(aa.getAnnoCorso()), studente.getId()).getTeachingUnitId());

				es = saveEsperienzaSvolta(es);
			}

			for (EsperienzaSvolta es : essToRemove) {
				es.setAttivitaAlternanza(null);
				es.setCompetenze(null);
				esperienzaSvoltaRepository.save(es);
				esperienzaSvoltaRepository.delete(es);
			}

			attivitaAlternanzaRepository.save(aa);
		}
		
	}		
	
	private void alignPresenzeData(EsperienzaSvolta es, Long dataInizio, Long dataFine) throws ParseException {
		Set<PresenzaGiornaliera> removeGiornateList = Sets.newHashSet();
		Date upper = new Date(dataInizio);
		Date lower = new Date(dataFine);
		for (PresenzaGiornaliera pg: es.getPresenze().getGiornate()) {
			Date date = format.parse(pg.getData());
			if ( (date.after(upper) || date.equals(upper)) && (date.equals(lower) || date.before(lower))) {
				continue;
			}
			removeGiornateList.add(pg);
		}
		es.getPresenze().getGiornate().removeAll(removeGiornateList);
		esperienzaSvoltaRepository.save(es);		
	}

	public void deleteAttivitaAlternanza(Long id) throws BadRequestException {
		AttivitaAlternanza aa = attivitaAlternanzaRepository.findOne(id);
		
		if (aa == null) {
			throw new BadRequestException(errorLabelManager.get("attivita.alt.error.notfound"));
		}		
		
		List<EsperienzaSvolta> ess = esperienzaSvoltaRepository.findEsperienzaSvoltaByAttivitaAlternanza(aa);
		
		Opportunita opp = aa.getOpportunita();
		if (opp != null) {
			opp.setPostiRimanenti(opp.getPostiRimanenti() + ess.size());
			oppCorsoRepository.save(opp);
		}		
		
		aa.setAnnoAlternanza(null);
		aa.setCorsoInterno(null);
		aa.setOpportunita(null);
		attivitaAlternanzaRepository.save(aa);
		
		
		for (EsperienzaSvolta es: ess) {
			es.setAttivitaAlternanza(null);
			es.setCompetenze(null);
			esperienzaSvoltaRepository.save(es);
			esperienzaSvoltaRepository.delete(es);
		}
		
		attivitaAlternanzaRepository.delete(aa);
	}	
	
	public Page<AttivitaAlternanza> findAttivitaAlternanzaByIstitutoIdAndTags(String istitutoId, String tag, Pageable pageRequest) {
		return attivitaAlternanzaRepository.findAttivitaAlternanzaByIstitutoIdAndTags(istitutoId, Splitter.on(",").splitToList(tag), pageRequest);
	}
	
	public void setCompletata(long id, boolean completata) {
		attivitaAlternanzaRepository.updateCompletata(id, completata);
	}
	
	
	// CorsoInterno
	public CorsoInterno saveCorsoInterno(CorsoInterno ci) {
		fillCorsoInterno(ci);
		return corsoInternoRepository.save(ci);
	}
	
	public void fillCorsoInterno(CorsoInterno ci) {
		if (ci.getCoordinate() == null || ci.getCoordinate().hasDefaultValue()) {
			Istituzione istituto = istituzioneRepository.findOne(ci.getIstitutoId());
			if (istituto != null) {
				ci.setCoordinate(istituto.getCoordinate());
			}
		}
	}	

	public CorsoInterno getCorsoInterno(long id) {
		return corsoInternoRepository.findOne(id);
	}

	public void updateCorsoInterno(CorsoInterno ci) {
		CorsoInterno old = corsoInternoRepository.findOne(ci.getId());
		if (old == null) {
			corsoInternoRepository.save(ci);
		} else {
			old.setAnnoScolastico(ci.getAnnoScolastico());
			old.setCoordinate(ci.getCoordinate());
			old.setCoordinatore(ci.getCoordinatore());
			old.setCoordinatoreCF(ci.getCoordinatoreCF());
			old.setCorso(ci.getCorso());
			old.setCorsoId(ci.getCorsoId());
			old.setDataFine(ci.getDataFine());
			old.setDataInizio(ci.getDataInizio());
			old.setDescrizione(ci.getDescrizione());
			old.setFormatore(ci.getFormatore());
			old.setFormatoreCF(ci.getFormatoreCF());
			old.setIndividuale(ci.isIndividuale());
			old.setInterna(ci.isInterna());
			old.setIstituto(ci.getIstituto());
			old.setIstitutoId(ci.getIstitutoId());
			old.setOraFine(ci.getOraFine());
			old.setOraInizio(ci.getOraInizio());
			old.setOre(ci.getOre());
			old.setReferenteFormazione(ci.getReferenteFormazione());
			old.setReferenteFormazioneCF(ci.getReferenteFormazioneCF());
			old.setTipologia(ci.getTipologia());
			old.setTitolo(ci.getTitolo());
			
			corsoInternoRepository.save(old);
		}
		
	}

	public void deleteCorsoInterno(long id) throws BadRequestException {

		CorsoInterno ci = getCorsoInterno(id);

		if (ci == null) {
			throw new BadRequestException(errorLabelManager.get("corso.interno.error.notfound"));
		}
		
		// check if attivita alternanza has used this course.
		List<AttivitaAlternanza>  aAList = attivitaAlternanzaRepository.findAttivitaAlternanzaByCorsoInterno(ci);
		
		if (aAList != null && !aAList.isEmpty()) {
			throw new BadRequestException(errorLabelManager.get("corso.interno.error.associato"));
		}
		
		ci.setCompetenzeFromSet(Sets.newHashSet());
		saveCorsoInterno(ci);

		corsoInternoRepository.delete(ci);
	}	
		
	// Competenza
	public Competenza saveCompetenza(Competenza c) {
		return competenzaRepository.save(c);
	}
	
	public Competenza getCompetenza(long id) {
		return competenzaRepository.findOne(id);
	}
	
	public List<Competenza> getCompetenze() {
		return competenzaRepository.findAll();
	}	
	
	public Page<Competenza> getCompetenzeByOwnerId(String ownerId, Pageable pageRequest) {
		return competenzaRepository.findCompetenzaByOwnerId(ownerId, pageRequest);
	}		
	
	public List<Competenza> getCompetenze(List<Long> ids) {
		return competenzaRepository.findAll(ids);
	}		
	
	public List<Map<String, Object>> getCompetenzeOwners() {
		List<Object[]> owners = competenzaRepository.findCompetenzeOwners();
		
		List<Map<String, Object>> result = Lists.newArrayList();
		
		for (Object[] owner : owners) {
			Map<String, Object> ownerMap = Maps.newTreeMap();
			ownerMap.put("source", owner[0]);
			ownerMap.put("ownerId", owner[1]);
			ownerMap.put("ownerName", owner[2]);
			
			result.add(ownerMap);
		}
		
		return result;
	}	
	
	public void updateCompetenza(Competenza c) {
//		competenzaRepository.update(c);
		
		Competenza old = competenzaRepository.findOne(c.getId());
		if (old == null) {
			competenzaRepository.save(c);
		} else {
			old.setAbilita(c.getAbilita());
			old.setConoscenze(c.getConoscenze());
			old.setIdCompetenza(c.getIdCompetenza());
			old.setIdProfilo(c.getIdProfilo());
			old.setLivelloEQF(c.getLivelloEQF());
			old.setTitolo(c.getTitolo());
			old.setProfilo(c.getProfilo());
			
			competenzaRepository.save(old);
		}
	}	
	
	public void deleteCompetenza(long id) {
		competenzaRepository.delete(id);
	}	
	
	public String findCompetenzaOwnerId(long id) {
		return competenzaRepository.findCompetenzaOwnerId(id);
	}	
	
	
	// TipologiaAttivita
	public TipologiaAttivita saveTipologiaAttivita(TipologiaAttivita ta) {
		return tipologiaAttivitaRepository.save(ta);
	}
	
	public TipologiaAttivita getTipologiaAttivita(long id) {
		return tipologiaAttivitaRepository.findOne(id);
	}
	
	public List<TipologiaAttivita> getTipologieAttivita(List<Long> ids) {
		return tipologiaAttivitaRepository.findAll(ids);
	}	
	
	public List<TipologiaAttivita> getTipologieAttivita() {
		return tipologiaAttivitaRepository.findAll();
	}		
	
	public void updateTipologiaAttivita(TipologiaAttivita ta, Long annoAlternanzaId) throws BadRequestException {
		TipologiaAttivita oldTa = tipologiaAttivitaRepository.findOne(ta.getId());
		
		if (oldTa != null) {
			AnnoAlternanza aaFrom = annoAlternanzaRepository.findAnnoAlternanzaByTipologieAttivita(oldTa);
			
			if (aaFrom == null) {
				throw new BadRequestException(errorLabelManager.get("attivita.alt.error.notfound"));
			}			
			
			AuditEntry audit = new AuditEntry("update", AnnoAlternanza.class, aaFrom.getId(), null, new Object(){});
			auditManager.save(audit);				
			
			if (!aaFrom.getTipologieAttivita().remove(oldTa)) {
				throw new BadRequestException(errorLabelManager.get("anno.alt.error.empty.tipo"));
			}
			annoAlternanzaRepository.save(aaFrom);
		}
		AnnoAlternanza aaTo = annoAlternanzaRepository.findOne(annoAlternanzaId);
		
		if (aaTo == null) {
			throw new BadRequestException(errorLabelManager.get("attivita.alt.error.notfound"));
		}		
		
		aaTo.getTipologieAttivita().add(ta);
		
		annoAlternanzaRepository.save(aaTo);
		
		AuditEntry audit = new AuditEntry("update", AnnoAlternanza.class, aaTo.getId(), null, new Object(){});
		auditManager.save(audit);						
		
		// TODO check
//		tipologiaAttivitaRepository.update(ta);
		
	
		
	}	
	
	public void deleteTipologiaAttivita(long id) {
		tipologiaAttivitaRepository.delete(id);
	}	
	
	// TipologiaTipologiaAttivita
	
	public TipologiaTipologiaAttivita getTipologiaTipologiaAttivita(long id) {
		return tipologiaTipologiaAttivitaRepository.findOne(id);
	}		
	
	public List<TipologiaTipologiaAttivita> findTipologiaTipologiaAttivitaByTipologia(List<Integer> tipologie) {
		return tipologiaTipologiaAttivitaRepository.findByTipologia(tipologie);
	}		
	
	public List<TipologiaTipologiaAttivita> getTipologieTipologiaAttivita() {
		return tipologiaTipologiaAttivitaRepository.findAll();
	}	
	
	// Opportunita
	public Opportunita saveOpportunita(Opportunita o) {
		fillOpportunita(o);
		return opportunitaRepository.save(o);
	}
	
	private void fillOpportunita(Opportunita o) {
		if (o.getAzienda() != null && o.getAzienda().getId() != null) {
			Azienda az = getAzienda(o.getAzienda().getId());
			o.setAzienda(az);
			if (o.getCoordinate() == null || o.getCoordinate().hasDefaultValue()) {
				o.setCoordinate(az.getCoordinate());
			}
		}
		o.setPostiRimanenti(o.getPostiDisponibili());
//		if (o.getReferenteAzienda() != null && o.getReferenteAzienda().getId() != null) {
//			ReferenteAzienda ref = getReferenteAzienda(o.getReferenteAzienda().getId());
//			o.setReferenteAzienda(ref);
//		}
	}	
	
	public Opportunita getOpportunita(long id) {
		return opportunitaRepository.findOne(id);
	}
	
	public void updateOpportunita(Opportunita o) {
//		opportunitaRepository.update(o);
		
		Opportunita old = opportunitaRepository.findOne(o.getId());
		
		if (old == null) {
			opportunitaRepository.save(o);
		} else {
			old.setCoordinate(o.getCoordinate());
			old.setDataFine(o.getDataFine());
			old.setOraFine(o.getOraFine());
			old.setDataInizio(o.getDataInizio());
			old.setOraInizio(o.getOraInizio());			
			old.setDescrizione(o.getDescrizione());
			old.setIndividuale(o.isIndividuale());
			old.setInterna(o.isInterna());
			old.setOre(o.getOre());
			old.setPostiDisponibili(o.getPostiDisponibili());
			old.setPostiRimanenti(o.getPostiRimanenti());
			old.setPrerequisiti(o.getPrerequisiti());
			old.setReferente(o.getReferente());
			old.setReferenteCF(o.getReferenteCF());
			old.setTipologia(o.getTipologia());
			old.setTitolo(o.getTitolo());
			old.setAzienda(o.getAzienda());
			
			opportunitaRepository.save(old);
		}
	}	
	
	public void deleteOpportunita(long id) throws BadRequestException {
		Opportunita o = getOpportunita(id);

		if (o == null) {
			throw new BadRequestException(errorLabelManager.get("opportunita.error.notfound"));
		}

		// check if attivita alternanza has used this oppurtunita.
		List<AttivitaAlternanza> aAList = attivitaAlternanzaRepository.findAttivitaAlternanzaByOpportunita(o);

		if (aAList != null && !aAList.isEmpty()) {
			throw new BadRequestException(errorLabelManager.get("opportunita.error.associato"));
		}

		o.setCompetenzeFromSet(Sets.newHashSet());
		saveOpportunita(o);
		List<AttivitaAlternanza> aas = attivitaAlternanzaRepository.findAttivitaAlternanzaByOpportunita(o);
		aas.forEach(x -> {
			x.setOpportunita(null);
			saveAttivitaAlternanza(x);
		});
		opportunitaRepository.delete(id);
	}		
	
	// EsperienzaSvolta
	public EsperienzaSvolta saveEsperienzaSvolta(EsperienzaSvolta es) {
		return esperienzaSvoltaRepository.save(es);
	}
	
	public EsperienzaSvolta getEsperienzaSvolta(long id) {
		return esperienzaSvoltaRepository.findOne(id);
	}
	
	public void updateEsperienzaSvolta(EsperienzaSvolta es) {
		esperienzaSvoltaRepository.update(es);
	}	
	
	public void deleteEsperienzaSvolta(long id) {
		esperienzaSvoltaRepository.delete(id);
	}	
	
	public List<EsperienzaSvolta> findEsperienzaSvoltaByAttivitaAlternanza(AttivitaAlternanza aa) {
		return esperienzaSvoltaRepository.findEsperienzaSvoltaByAttivitaAlternanza(aa);
	}
	
	public List<EsperienzaSvolta> findEsperienzaSvoltaByStudente(Studente studente) {
		return esperienzaSvoltaRepository.findEsperienzaSvoltaByStudente(studente);
	}	
	
	// Studente
	public Studente saveStudente(Studente s) {
		return studenteRepository.save(s);
	}
	
//	public Studente getStudente(String id) {
//		return findS
//	}
	
	public List<Studente> getStudenti(List<String> ids) {
		return studenteRepository.findAll(ids);
	}	
	
	public void updateStudente(Studente s) {
		studenteRepository.update(s);
	}	
	
	public void deleteStudente(String id) {
		studenteRepository.delete(id);
	}
	
//	public List<Studente> findStudentiByClasse(String classe, String corsoDiStudioId, String istitutoId, String annoScolastico) {
//		List<Object[]> srs = studenteRepository.findStudentiByClasse(classe, corsoDiStudioId, istitutoId, annoScolastico);
//		List<Studente> result = Lists.newArrayList();
//		
//		for (Object[] sr: srs) {
//			Studente s = (Studente)sr[0];
//			Registration r = (Registration)sr[0];
//			s.setClassroom(r.getClassroom());
//			s.setIstitutoId(r.getInstituteId());
//			
//			result.add(s);
//		}
//		
//		return result;
//	}
	
	
	public String findStudenteCorsoId(String id) {
		return studenteRepository.findStudenteCorsoId(id);
	}

//	public String findStudenteClassroom(String id) {
//		return studenteRepository.findStudenteClassroom(id);
//	}	
	
	public String findStudenteClassroomBySchoolYear(String id, String schoolYear, String instituteId, String courseId) {
		return studenteRepository.findStudenteClassroomBySchoolYear(id, schoolYear, instituteId, courseId);
	}
	
	// ReferenteAlternanza
	public ReferenteAlternanza saveReferenteAlternanza(ReferenteAlternanza ra) {
		return referenteAlternanzaRepository.save(ra);
	}
	
	public ReferenteAlternanza getReferenteAlternanza(String id) {
		return referenteAlternanzaRepository.findOne(id);
	}
	
	public void updateReferenteAlternanza(ReferenteAlternanza ra) {
		referenteAlternanzaRepository.update(ra);
	}	
	
	public void deleteReferenteAlternanza(String id) {
		referenteAlternanzaRepository.delete(id);
	}		
	
	
	// ReferenteAzienda
	public ReferenteAzienda saveReferenteAzienda(ReferenteAzienda ra) {
		return referenteAziendaRepository.save(ra);
	}
	
	public ReferenteAzienda getReferenteAzienda(long id) {
		return referenteAziendaRepository.findOne(id);
	}
	
	public void updateReferenteAzienda(ReferenteAzienda ra) {
		referenteAziendaRepository.update(ra);
	}	
	
	public void deleteReferenteAzienda(long id) {
		referenteAziendaRepository.delete(id);
	}	
	
	
	
	// Documento
	public Documento saveDocumento(Documento d) {
		return documentoRepository.save(d);
	}
	
	public Documento getDocumento(String id) {
		return documentoRepository.findDocumentoById(id);
	}
	
	public void updateDocumento(Documento d) {
		documentoRepository.update(d);
	}	
	
	public void deleteDocumento(String id) throws BadRequestException {
		Documento doc = documentoRepository.findDocumentoById(id);
		if (doc != null) {
			documentoRepository.delete(doc);
		} else {
			throw new BadRequestException(errorLabelManager.get("doc.error.notfound"));
		}
	}		
	
		
	// Azienda
	public Azienda saveAzienda(Azienda a) {
		return aziendaRepository.save(a);
	}
	
	public Azienda getAzienda(String id) {
		return aziendaRepository.findOne(id);
	}
	
	public void updateAzienda(Azienda a) {
		aziendaRepository.update(a);
	}	
	
	public void deleteAzienda(String id) {
		aziendaRepository.delete(id);
	}
	
    public List<Azienda> fetchAzienda() {
    	return aziendaRepository.findAll();
    }
	
	// Corso Di Studio
	
	public List<CorsoDiStudio> findCorsiDiStudio(String istitutoId, String annoScolastico) {
		if (annoScolastico == null || annoScolastico.isEmpty()) {
			return corsoDiStudioRepository.findCorsoDiStudioByIstitutoId(istitutoId);
		} else {
			return corsoDiStudioRepository.findCorsoDiStudioByIstitutoIdAndAnnoScolastico(istitutoId, annoScolastico);
		}
	}
	
	public CorsoDiStudio getCorsoDiStudio(String istitutoId, String annoScolastico, String corsoId) {
		return corsoDiStudioRepository.findCorsoDiStudioByIstitutoIdAndAnnoScolasticoAndCourseId(istitutoId, annoScolastico, corsoId);
	}
	
	// OppCorso
	
	public OppCorso getOppCorso(long id) {
		return oppCorsoRepository.findOne(id);
	}	
	
	// Registration
	public List<String> getClasses(String courseId, String instituteId, String schoolYear, String annoCorso) {
		List<String> classi = registrationRepository.getClasses(courseId, instituteId, schoolYear);
		if (annoCorso != null) {
			classi.removeIf(x -> !x.startsWith(annoCorso));
		}
		return classi;
	}

	public Istituzione findIstituto(String istitutoId) throws BadRequestException {

		Istituzione ist = istituzioneRepository.findOne(istitutoId);
		if (ist == null) {
			throw new BadRequestException(errorLabelManager.get("istituto.error.notfound"));
		}
		return ist;
	}
	
	//
	
	public List<OppCorso> findOppCorsoNear(double lat, double lon, double distance) {
		CriteriaBuilder cb = em.getCriteriaBuilder();
	    CriteriaQuery<OppCorso> cq1 = cb.createQuery(OppCorso.class);
	    Root<OppCorso> oppcorso = cq1.from(OppCorso.class);

	    double t1 = distance / Math.abs(Math.cos(Math.toRadians(lat)) * Constants.KM_IN_ONE_LAT);
	    double t2 = distance / Constants.KM_IN_ONE_LAT;

	    double lonA = lon - t1;
	    double lonB = lon + t1;

	    double latA = lat - t2;
	    double latB = lat + t2;
	    
	    Predicate predicate1 = cb.between(oppcorso.get("latitude").as(Double.class), latA, latB);
	    Predicate predicate2 = cb.between(oppcorso.get("longitude").as(Double.class), lonA, lonB);
	    Predicate predicate = cb.and(predicate1, predicate2);
	    
	    cq1.where(predicate);
	    
	    TypedQuery<OppCorso> query1 = em.createQuery(cq1);
	    
	    List<OppCorso> result = query1.getResultList(); 
		
//	    result = result.stream().filter(x -> Utils.harvesineDistance(x.getLatitude(), x.getLongitude(), lat, lon) <= distance).collect(Collectors.toList());
	    
	    return result;
		
	}		
	
	public List<Azienda> findAziendaNear(double lat, double lon, double distance) {
		CriteriaBuilder cb = em.getCriteriaBuilder();
	    CriteriaQuery<Azienda> cq1 = cb.createQuery(Azienda.class);
	    Root<Azienda> azienda = cq1.from(Azienda.class);

	    double t1 = distance / Math.abs(Math.cos(Math.toRadians(lat)) * Constants.KM_IN_ONE_LAT);
	    double t2 = distance / Constants.KM_IN_ONE_LAT;

	    double lonA = lon - t1;
	    double lonB = lon + t1;

	    double latA = lat - t2;
	    double latB = lat + t2;
	    
	    Predicate predicate1 = cb.between(azienda.get("latitude").as(Double.class), latA, latB);
	    Predicate predicate2 = cb.between(azienda.get("longitude").as(Double.class), lonA, lonB);
	    Predicate predicate = cb.and(predicate1, predicate2);
	    
	    cq1.where(predicate);
	    
	    TypedQuery<Azienda> query1 = em.createQuery(cq1);
		
	    List<Azienda> result = query1.getResultList(); 
		
//	    result = result.stream().filter(x -> Utils.harvesineDistance(x.getLatitude(), x.getLongitude(), lat, lon) <= distance).collect(Collectors.toList());
	    
	    return result;
	}	

	// ASL User
	public ASLUser saveASLUser(ASLUser user) {
		return aslUserRepository.save(user);
	}
	
	public ASLUser getASLUser(long id) {
		ASLUser user = aslUserRepository.findOne(id);
		if (user != null) {
			completeASLUser(user);
		}
		return user;
	}
	
	public ASLUser getExistingASLUser(ASLUser user) {
		ASLUser old = aslUserRepository.findByCfOrEmail(user.getCf(), user.getEmail());
		return old;
	}
	
	
	public void updateASLUser(ASLUser user) {
		aslUserRepository.update(user);
	}	
	
	public ASLUser createASLUser(ASLUser user) {
		ASLUser old = getExistingASLUser(user);
		ASLUser result = null;
		if (old != null) {
//			Set<ASLUserRole> newRoles = Sets.newHashSet(old.getRoles());
//			newRoles.addAll(user.getRoles());
//			old.setRoles(Sets.newHashSet());
			old.getRoles().addAll(user.getRoles());
//			aslUserRepository.save(old);
//			old.setRoles(newRoles);
			result = aslUserRepository.save(old);
		} else {
			result = aslUserRepository.save(user);
		}
		return result;
	}
	
	public ASLUser updateASLUserRoles(Long id, ASLRole role, String domainId) throws BadRequestException {
		ASLUser user = aslUserRepository.findOne(id);
		
		if (user == null) {
			ASLUserDetails details = (ASLUserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
			if (details != null && details.getUser() != null) {
				throw new BadRequestException(String.format(errorLabelManager.get("user.notfound"), details.getUser().getName(), details.getUser().getSurname()));	
			}
			throw new BadRequestException(errorLabelManager.get("api.access.error"));
		}
		
//		List<String> idsList = Splitter.on(",").splitToList(ids);
//		
//		for (String domainId: idsList) {
		ASLUserRole userRole = new ASLUserRole(role, domainId);
		user.getRoles().add(userRole);
//		}
		
//		user.getRoles().add(role);
//		switch (role) { 
//		case STUDENTE:
//			user.setStudentiId(Lists.newArrayList(Splitter.on(",").splitToList(ids)));
//			break;
//		case DIRIGENTE_SCOLASTICO:
//			user.setIstitutiId(Lists.newArrayList(Splitter.on(",").splitToList(ids)));
//			break;
//		case REFERENTE_AZIENDA:
//			user.setAziendeId(Lists.newArrayList(Splitter.on(",").splitToList(ids)));
//			break;			
//		}
		
		return aslUserRepository.save(user);
	}		
	
	public ASLUser deleteASLUserRoles(Long id, ASLRole role, String oldId) throws BadRequestException {
		ASLUser user = aslUserRepository.findOne(id);
		
		if (user == null) {
			ASLUserDetails details = (ASLUserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
			if (details != null && details.getUser() != null) {
				throw new BadRequestException(String.format(errorLabelManager.get("user.notfound"), details.getUser().getName(), details.getUser().getSurname()));	
			}
			throw new BadRequestException(errorLabelManager.get("api.access.error"));
		}
		
		if (oldId != null) {
//			List<String> domainIds = Splitter.on(",").splitToList(ids);
			user.getRoles().removeIf(x -> role.equals(x.getRole()) && oldId.equals(x.getDomainId()));
		} else {
			user.getRoles().removeIf(x -> role.equals(x.getRole()));
		}
		
//		user.getRoles().remove(role);
//		switch (role) { 
//		case STUDENTE:
//			user.setStudentiId(Lists.newArrayList());
//			break;
//		case DIRIGENTE_SCOLASTICO:
//			user.setIstitutiId(Lists.newArrayList());
//			break;
//		case REFERENTE_AZIENDA:
//			user.setAziendeId(Lists.newArrayList());
//			break;			
//		}
		
		return aslUserRepository.save(user);
	}	
	
	public void deleteASLUser(long id) {
		aslUserRepository.delete(id);
	}		
	
	public void completeASLUser(ASLUser user) {
		Map<String, Studente> studenti = Maps.newTreeMap();
		Map<String, Azienda> aziende = Maps.newTreeMap();
		Map<String, Istituzione> istituti = Maps.newTreeMap();
		
		for (ASLUserRole role: user.getRoles()) {
			if (ASLRole.STUDENTE.equals(role.getRole())) {
				Studente studente = studenteRepository.findOne(role.getDomainId());
				if (studente != null) {
					studenti.put(studente.getId(), studente);
				}
			}
			if (ASLRole.LEGALE_RAPPRESENTANTE_AZIENDA.equals(role.getRole()) || ASLRole.REFERENTE_AZIENDA.equals(role.getRole())) {
				Azienda azienda = aziendaRepository.findOne(role.getDomainId());
				if (azienda != null) {
					aziende.put(azienda.getId(), azienda);
				}
			}
			if (ASLRole.DIRIGENTE_SCOLASTICO.equals(role.getRole()) || ASLRole.FUNZIONE_STRUMENTALE.equals(role.getRole())) {
				Istituzione istituto = istituzioneRepository.findOne(role.getDomainId());
				if (istituto != null) {
					istituti.put(istituto.getId(), istituto);
				}
			}		
		}
		
		Consenso consenso = null;
		if (Utils.isNotEmpty(user.getEmail())) {
			consenso = consensoRepository.findByEmail(user.getEmail());	
		} else if (Utils.isNotEmpty(user.getCf())) {
			consenso = consensoRepository.findByCF(user.getCf());
		}
		
		if (consenso != null) {
			user.setAuthorized(consenso.getAuthorized());
		}		
		
		user.setAziende(aziende);
		user.setIstituti(istituti);
		user.setStudenti(studenti);
	}
	
//	public List<ASLUser> createStudentiASLUsers(String ids) {
//		List<String> sIds = Splitter.on(",").splitToList(ids);
//		
//		List<Studente> studenti = studenteRepository.findStudentiByIds(sIds);
//		
//		return studenti.stream().map(x -> {
//			ASLUser user = new ASLUser();
//			user.setCf(x.getCf());
//			user.setName(x.getName());
//			user.setSurname(x.getSurname());
//			user.getRoles().add(ASLRole.STUDENTE);
//			user.getStudentiId().add(x.getId());
//			
//			System.err.println(user);
//			return user;
//		}).collect(Collectors.toList());
//		
//	}
	
	// Note azienda
	
	public EsperienzaSvolta saveNoteStudente(long id, String note) throws BadRequestException {

		EsperienzaSvolta esp = getEsperienzaSvolta(id);
		if (esp == null) {
			throw new BadRequestException(errorLabelManager.get("esp.error.notfound"));
		}

		esp.setNoteStudente(note);
		// save.
		saveEsperienzaSvolta(esp);

		return esp;
	}
	
	public EsperienzaSvolta saveNoteAzienda(long id, String note) throws BadRequestException {

		EsperienzaSvolta esp = getEsperienzaSvolta(id);
		if (esp == null) {
			throw new BadRequestException(errorLabelManager.get("esp.error.notfound"));
		}

		esp.setNoteAzienda(note);
		// save.
		saveEsperienzaSvolta(esp);

		return esp;
	}	
	
	// Istituzione
	
	public Double getIstituzioneHoursThreshold(String id) {
		Double ht = istituzioneRepository.findIstitutoHoursThreshold(id);
		if (ht == null) {
			ht = 0.2;
		}
		return ht;
	}
	
	public String getIstituzioneName(String id) {
		return istituzioneRepository.findIstitutoName(id);
	}
	
	public void updateIstituzioneHoursThreshold(String id, Double hours) {
		istituzioneRepository.updateHoursThreshold(id, hours);
	}	
	
	// delegates
	
	public String findAnnoAlternanzaIstitutoId(Long id) {
		return annoAlternanzaRepository.findAnnoAlternanzaIstitutoId(id);
	}	
	
	public String findTipologiaAttivitaIstitutoId(Long id) {
		return tipologiaAttivitaRepository.findTipologiaAttivitaIstitutoId(id);
	}
	
	public String findPianoAlternanzaIstitutoId(Long id) {
		return pianoAlternanzaRepository.findPianoAlternanzaIstitutoId(id);
	}

	public String findAttivitaAlternanzaIstitutoId(Long id) {
		return attivitaAlternanzaRepository.findAttivitaAlternanzaIstitutoId(id);
	}

	public String findEsperienzaSvoltaIstitutoId(Long id) {
		return esperienzaSvoltaRepository.findEsperienzaSvoltaIstitutoId(id);
	}
	
	public String findEsperienzaSvoltaAziendaId(Long id) {
		return esperienzaSvoltaRepository.findEsperienzaSvoltaAziendaId(id);
	}

	public String findCorsoDiStudioIstitutoId(String id) {
		return corsoDiStudioRepository.findCorsoDiStudioIstitutoId(id);
	}

	public String findStudenteIstitutoId(String id) {
		return studenteRepository.findStudenteIstitutoId(id);
	}

	public String findOpportunitaAziendaId(Long id) {
		return opportunitaRepository.findOpportunitaAziendaId(id);
	}

	public String findEsperienzaSvoltaStudenteId(Long id) {
		return esperienzaSvoltaRepository.findEsperienzaSvoltaStudenteId(id);
	}

	public String findDocumentoStudenteId(String docId) {
		return documentoRepository.findDocumentoStudenteId(docId);
	}
	
	/**
	 * 
	 * @param opportunita
	 * @param removed integer (removed students)
	 * @param used integer (assigned students)
	 * @return
	 */
	public boolean decreasePostiRimanenti(Opportunita opportunita, int removed, int used) {
		if ((opportunita.getPostiRimanenti() + removed - used) < 0) {
			return false;
		}
		opportunita.setPostiRimanenti(opportunita.getPostiRimanenti() + removed - used);
		return true;
	}
	
	/**
	 * Teaching unit of last updated registration.
	 * @param courseId
	 * @param instituteId
	 * @param schoolYear
	 * @param annoCorso
	 * @param StudentId
	 * @return
	 * @throws BadRequestException
	 */
	public Registration getLastRegistration(String courseId, String instituteId, String schoolYear, String annoCorso,
			String studentId) throws BadRequestException {
		Registration reg = registrationRepository.findTeachingUnit(courseId, schoolYear, instituteId, studentId);
		if (reg != null && reg.getClassroom().startsWith(annoCorso)) {
			return reg;
		} else {
			throw new BadRequestException(errorLabelManager.get("studente.error.notfound"));
		}

	}
	
	/**
	 * Check if Attivita Alternanza start/end date lies within registration date range.
	 * @param courseId
	 * @param instituteId
	 * @param schoolYear
	 * @param annoCorso
	 * @param studentId
	 * @param aaStartDate AttivitaAlternanza start date.
	 * @param aaEndDate AttivitaAlternanza end date.
	 * @return
	 */
	public boolean validDatesAA(String courseId, String instituteId, String schoolYear, String annoCorso,
			String studentId, Date aaStartDate, Date aaEndDate) {

		Registration reg = registrationRepository.findTeachingUnit(courseId, schoolYear, instituteId, studentId);
		if (reg != null && reg.getClassroom().startsWith(annoCorso)) {
			return true; 
//			(Utils.isWithinRange(aaStartDate, reg.getDateFrom(), reg.getDateTo()) && Utils.isWithinRange(aaEndDate, reg.getDateFrom(), reg.getDateTo()));
		} else {
			return false;
		}
	}
	
	public void allineaEsperienzaSvolta(EsperienzaSvoltaAllineamento esperienzaSvoltaAllineamento) {
		
		if (esperienzaSvoltaAllineamento.isDaAllineare()) {
			esperienzaSvoltaAllineamento.setUltimoAllineamento(System.currentTimeMillis());
			// align with infoTN.
			String response;
			try {
				response = infoTNAlignExpService.alignEsperienza(esperienzaSvoltaRepository.findOne(esperienzaSvoltaAllineamento.getEspSvoltaId()));
				if (response != null && response.equalsIgnoreCase("ok")) {
					esperienzaSvoltaAllineamento.setAllineato(true);
					esperienzaSvoltaAllineamento.setDaAllineare(false); //shall i nullify errore, tentativi string here
				} else {
					esperienzaSvoltaAllineamento.setAllineato(false);
					esperienzaSvoltaAllineamento.setDaAllineare(true);
					esperienzaSvoltaAllineamento
							.setNumeroTentativi(esperienzaSvoltaAllineamento.getNumeroTentativi() + 1);
					esperienzaSvoltaAllineamento.setErrore(response);
				}
			} catch (Exception e) {
				esperienzaSvoltaAllineamento.setAllineato(false);
				esperienzaSvoltaAllineamento.setDaAllineare(true);
				esperienzaSvoltaAllineamento.setNumeroTentativi(esperienzaSvoltaAllineamento.getNumeroTentativi() + 1);
				if (e.getMessage() != null && !e.getMessage().isEmpty())
				esperienzaSvoltaAllineamento.setErrore(e.getMessage().substring(0, Math.min(e.getMessage().length(), 1000))); // save only first 1000 chars
				
				logger.error(e);
			}
		
			esperienzaAllineamentoRepository.save(esperienzaSvoltaAllineamento);
		}

	}
	
}
