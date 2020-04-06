package it.smartcommunitylab.cartella.asl.manager;

import java.util.Comparator;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import javax.persistence.EntityManager;
import javax.persistence.TypedQuery;
import javax.transaction.Transactional;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import com.google.common.collect.ArrayListMultimap;
import com.google.common.collect.Lists;
import com.google.common.collect.Maps;
import com.google.common.collect.Multimap;
import com.google.common.collect.Sets;

import it.smartcommunitylab.cartella.asl.exception.BadRequestException;
import it.smartcommunitylab.cartella.asl.model.AnnoAlternanza;
import it.smartcommunitylab.cartella.asl.model.AttivitaAlternanza;
import it.smartcommunitylab.cartella.asl.model.Competenza;
import it.smartcommunitylab.cartella.asl.model.EsperienzaSvolta;
import it.smartcommunitylab.cartella.asl.model.PianoAlternanza;
import it.smartcommunitylab.cartella.asl.model.Studente;
import it.smartcommunitylab.cartella.asl.model.TipologiaAttivita;
import it.smartcommunitylab.cartella.asl.model.report.ReportStudente;
import it.smartcommunitylab.cartella.asl.util.ErrorLabelManager;

@Repository
@Transactional
public class ProgrammazioneManager {
	
	private static Log logger = LogFactory.getLog(ProgrammazioneManager.class);

	@Autowired
	private QueriesManager aslManager;
	
	@Autowired
	protected EntityManager em;	
	
	@Autowired ErrorLabelManager errorLabelManager;
	
//	private static final String ESPERIENZA_SVOLTA_BY_ANNO_SCOLASTICO = "SELECT es0 FROM EsperienzaSvolta es0 JOIN es0.attivitaAlternanza aa0 JOIN aa0.annoAlternanza ana0 JOIN pa"
//	+ " WHERE aa0.annoScolastico = (:annoScolastico) AND ana0.id IN (SELECT pa0.anniAlternanza.id FROM PianoAlternanza pa0 WHERE pa0.id = (:pianoId))";
	private static final String ESPERIENZA_SVOLTA_BY_ANNO_SCOLASTICO = "SELECT DISTINCT es0 FROM EsperienzaSvolta es0 JOIN es0.attivitaAlternanza aa0 "
			+ " WHERE aa0.annoScolastico = (:annoScolastico) AND aa0.istitutoId = (:istitutoId) AND aa0.corsoId = (:corsoId) ";	
	
	private static final String ESPERIENZA_SVOLTA_FOR_STUDENTE_OR_CLASSE = "SELECT DISTINCT es0 FROM EsperienzaSvolta es0 JOIN es0.attivitaAlternanza aa0 "
			+ " WHERE aa0.annoCorso = (:annoCorso) AND aa0.istitutoId = (:istitutoId) AND aa0.corsoId = (:corsoId) ";		
	
	public Page<ReportStudente> generateReportStudente(Long pianoId, Integer annoCorso, String annoScolastico, String nome, String studenteId, Pageable pageRequest) throws BadRequestException {
		PianoAlternanza pa = aslManager.getPianoAlternanza(pianoId);
		if (pa == null) {
			throw new BadRequestException(errorLabelManager.get("piano.error.notfound"));
		}		
		
		String istitutoId = pa.getIstitutoId();
		String corsoId = pa.getCorsoDiStudioId();
		
		List<AnnoAlternanza> anas = pa.getAnniAlternanza();
		if (annoCorso != null) {
			anas = anas.stream().filter(x -> x.getAnnoCorso() == annoCorso).collect(Collectors.toList());
		}	
		
		Map<String, Studente> studenti = Maps.newTreeMap(); 
		Map<String, ReportStudente> reports = Maps.newTreeMap();
		Map<String, Set<Competenza>> competenzeMap = Maps.newTreeMap();
		
		List<Studente> studentiList = null;
		
		if (studenteId != null && !studenteId.isEmpty()) {
			Studente s = aslManager.findStudente(studenteId);
			if (s == null) {
				throw new BadRequestException(errorLabelManager.get("studente.error.notfound"));
			}
			studentiList = Lists.newArrayList(s);
		} else {
			studentiList = aslManager.findStudenti(pa.getIstitutoId(), pa.getCorsoDiStudioId(), annoScolastico, null, nome);
		} 
		if (annoCorso != null) {
			studentiList = studentiList.stream().filter(x -> {
				return x.getClassroom() != null && Integer.parseInt(x.getClassroom().substring(0, 1)) == annoCorso;
				}).collect(Collectors.toList());			
			
		}	
			
			
		for (Studente stud : studentiList) {
			reports.put(stud.getId(), new ReportStudente());
			competenzeMap.put(stud.getId(), new HashSet<Competenza>());
			studenti.put(stud.getId(), stud);
		}		
		
		StringBuilder sb = new StringBuilder(ESPERIENZA_SVOLTA_BY_ANNO_SCOLASTICO);
		if (annoCorso != null) {
			sb.append(" AND aa0.annoCorso = (:annoCorso)");
		}
		if (studenteId != null) {
			sb.append(" AND es0.studente.id = (:studenteId)");
		}
		if (nome != null && !nome.isEmpty()) {
			sb.append(" AND (lower(es0.studente.name) LIKE (:nome) OR lower(es0.studente.surname) LIKE (:nome))");
		}
		String q = sb.toString();
		
		TypedQuery<EsperienzaSvolta> query = em.createQuery(q, EsperienzaSvolta.class);		
		
		query.setParameter("annoScolastico", annoScolastico);
		if (annoCorso != null) {
			query.setParameter("annoCorso", annoCorso);	
		}
		if (studenteId != null) {
			query.setParameter("studenteId", studenteId);	
		}		
		if (nome != null && !nome.isEmpty()) {
			query.setParameter("nome",  "%" + nome.toLowerCase() + "%");
		}
		query.setParameter("istitutoId", istitutoId);
		query.setParameter("corsoId", corsoId);
		
		// NO!
//		sb.append(" AND aa0.individuale = TRUE");
		
		List<EsperienzaSvolta> esperienze = query.getResultList();
		
		List<EsperienzaSvolta> esperienzeFiltered = esperienze.stream().filter(x ->
			pa.getAnniAlternanza().contains(x.getAttivitaAlternanza().getAnnoAlternanza())).collect(Collectors.toList());
		
		for (EsperienzaSvolta es: esperienzeFiltered) {
			String id = es.getStudente().getId();
			Set<Competenza> competenzeClasse = competenzeMap.getOrDefault(id, new HashSet<Competenza>());
			competenzeClasse.addAll(es.getCompetenze());
			competenzeMap.put(id, competenzeClasse);
		}		
		
		for (EsperienzaSvolta es: esperienzeFiltered) {
			Studente studente = es.getStudente(); 
			String id = studente.getId();
			
			AttivitaAlternanza aa = es.getAttivitaAlternanza();

			ReportStudente rs = reports.getOrDefault(id, new ReportStudente());
			rs.setAttivitaProgrammate(rs.getAttivitaProgrammate() + 1);
			rs.setOreProgrammate(rs.getOreProgrammate() + aa.getOre());
			reports.put(id, rs);
		}
		
		// create temporary report.
		Map<String, ReportStudente> reportsTemp = new HashMap<String, ReportStudente>(); //TODO:BLOCKER
		reportsTemp.putAll(reports);//TODO:BLOCKER
		for (String id: reportsTemp.keySet()) {  //TODO:BLOCKER 
			ReportStudente rs = reports.get(id);
			rs.setCompetenzeEsperienze(Sets.intersection(competenzeMap.get(id), Sets.newTreeSet(pa.getCompetenze())).size());
			rs.setCompetenzePiano(pa.getCompetenze().size());
			rs.setAnnoScolastico(annoScolastico);
			
			Studente studente = studenti.get(id);
			
			if (studente == null) {
				logger.error(String.format("student not found: [%s]", id));
				reports.remove(id); //TODO:BLOCKER
				continue;//TODO:BLOCKER
//				throw new BadRequestException(errorLabelManager.get("studente.error.notfound")); TODO:BLOCKER 
			}
			
			rs.setNome(studente.getSurname() + " " + studente.getName());
			rs.setAnnoCorso(studenti.get(id).getAnnoCorso());	
			rs.setClasse(aslManager.findStudenteClassroomBySchoolYear(id, annoScolastico, pa.getIstitutoId(), pa.getCorsoDiStudioId()));
			rs.setIdStudente(studente.getId());
			rs.setCognomeNome(studente.getSurname() + " " + studente.getName());
			for (AnnoAlternanza ana: anas) {
				rs.setAttivitaTotali(rs.getAttivitaTotali() + ana.getTipologieAttivita().size());
				rs.setOreTotali(rs.getOreTotali() + ana.getOreTotali());
			}			
			
		}		
		
		List<ReportStudente> result = Lists.newArrayList(reports.values());
		
		result.sort(new Comparator<ReportStudente>(){

			@Override
			public int compare(ReportStudente o1, ReportStudente o2) {
				return o1.getCognomeNome().compareTo(o2.getCognomeNome());
			}
			
		});
		
		int from = pageRequest.getPageNumber() * pageRequest.getPageSize();
		int to = Math.min(result.size(), (pageRequest.getPageNumber() + 1) * pageRequest.getPageSize());
		int total = result.size();
		if (to > from) {
			result = result.subList(from, to);
		} else {
			result = Lists.newArrayList();
		}	

		Page<ReportStudente> page = new PageImpl<ReportStudente>(result, pageRequest, total);		
		
		return page;
	}
	
	
//	public Page<ReportClasse> generateReportClasse(Long pianoId, Integer annoCorso, String annoScolastico, String classe, Pageable pageRequest) throws BadRequestException {
//		PianoAlternanza pa = aslManager.getPianoAlternanza(pianoId);
//		if (pa == null) {
//			throw new BadRequestException(errorLabelManager.get("piano.error.notfound"));
//		}
//		
//		String istitutoId = pa.getIstitutoId();
//		String corsoId = pa.getCorsoDiStudioId();		
//		
//		List<AnnoAlternanza> anas = pa.getAnniAlternanza();
//		if (annoCorso != null) {
//			anas = anas.stream().filter(x -> x.getAnnoCorso() == annoCorso).collect(Collectors.toList());
//		}
//		
//		Map<String, ReportClasse> reports = Maps.newTreeMap();		
//		Map<String, Set<Competenza>> competenzeMap = Maps.newTreeMap();
//
//		List<String> classiList = null;
//		
//		if (classe != null && !classe.isEmpty()) {
//			classiList = Lists.newArrayList(classe);
//		} else {
//			classiList = aslManager.getClasses(corsoId, istitutoId, annoScolastico);
//		}
//		if (annoCorso != null) {
//			classiList = classiList.stream().filter(x -> Integer.parseInt(x.substring(0, 1)) == annoCorso).collect(Collectors.toList());
//		}
//		for (String cls : classiList) {
//			reports.put(cls, new ReportClasse());
//			competenzeMap.put(cls, new HashSet<Competenza>());
//		}
//			
//		StringBuilder sb = new StringBuilder(ESPERIENZA_SVOLTA_BY_ANNO_SCOLASTICO);
//		if (annoCorso != null) {
//			sb.append(" AND aa0.annoCorso = (:annoCorso)");
//		}
//		if (classe != null && !classe.isEmpty()) {
//			sb.append(" AND aa0.classe = (:classe)");
//		}		
//		sb.append(" AND aa0.individuale = FALSE");
//		String q = sb.toString();
//		
//		TypedQuery<EsperienzaSvolta> query = em.createQuery(q, EsperienzaSvolta.class);		
//		
////		query.setParameter("individuale", false);
//		query.setParameter("annoScolastico", annoScolastico);
//		if (annoCorso != null) {
//			query.setParameter("annoCorso", annoCorso);	
//		}
//		if (classe != null && !classe.isEmpty()) {
//			query.setParameter("classe", classe);	
//		}		
//		query.setParameter("istitutoId", istitutoId);
//		query.setParameter("corsoId", corsoId);		
//		
//		List<EsperienzaSvolta> esperienze = query.getResultList();
//		
//		List<EsperienzaSvolta> esperienzeFiltered = esperienze.stream().filter(x ->
//			x.getAttivitaAlternanza().getClasse() != null && pa.getAnniAlternanza().contains(x.getAttivitaAlternanza().getAnnoAlternanza())).collect(Collectors.toList());
//		
//
//		
//		Set<AttivitaAlternanza> attivitaSet = Sets.newHashSet(); 
//		for (EsperienzaSvolta es: esperienzeFiltered) {
//			String id = es.getAttivitaAlternanza().getClasse();
//
//			Set<Competenza> competenzeClasse = competenzeMap.getOrDefault(id, new HashSet<Competenza>());
//			competenzeClasse.addAll(es.getCompetenze());
//			competenzeMap.put(id, competenzeClasse);
//			
//			attivitaSet.add(es.getAttivitaAlternanza());
//		}
//		
//		for (AttivitaAlternanza aa: attivitaSet) {
////			AnnoAlternanza ana = aa.getAnnoAlternanza();
//			String id = aa.getClasse();
//
//			ReportClasse rc = reports.getOrDefault(id, new ReportClasse());
//			
//			rc.setAttivitaProgrammate(rc.getAttivitaProgrammate() + 1);
//			rc.setOreProgrammate(rc.getOreProgrammate() + aa.getOre());
//			
//			reports.put(id, rc);
//		}
//			
//		
//		for (String id: reports.keySet()) {
//			ReportClasse rc = reports.get(id);
//			rc.setCompetenzeEsperienze(Sets.intersection(competenzeMap.get(id), Sets.newTreeSet(pa.getCompetenze())).size());
//			rc.setCompetenzePiano(pa.getCompetenze().size());
//			rc.setAnnoScolastico(annoScolastico);
//			
//			rc.setNome(id);
//			rc.setAnnoCorso(Integer.parseInt(id.substring(0, 1)));
//			for (AnnoAlternanza ana: anas) {
//				List<Integer> tasId = ana.getTipologieAttivita().stream().map(x -> x.getTipologia()).collect(Collectors.toList());
//				Set<Integer> ttas = (tasId == null) || (tasId.isEmpty()) ? new HashSet<Integer>() : 
//					aslManager.findTipologiaTipologiaAttivitaByTipologia(tasId).stream().filter(x -> x.getIndividuale() == false).map(x -> x.getTipologia()).collect(Collectors.toSet());
//				int atSize = (int)ana.getTipologieAttivita().stream().filter(x -> ttas.contains(x.getTipologia())).count();
//				rc.setAttivitaTotali(rc.getAttivitaTotali() + atSize);
//				rc.setOreTotali(rc.getOreTotali() + ana.getOreTotali());
//			}
//		}
//		
//		List<ReportClasse> result = Lists.newArrayList(reports.values());
//		
//		int from = pageRequest.getPageNumber() * pageRequest.getPageSize();
//		int to = Math.min(result.size(), (pageRequest.getPageNumber() + 1) * pageRequest.getPageSize());
//		int total = result.size();
//		if (to > from) {
//			result = result.subList(from, to);
//		} else {
//			result = Lists.newArrayList();
//		}	
//
//		Page<ReportClasse> page = new PageImpl<ReportClasse>(result, pageRequest, total);		
//		
//		return page;
//	}	
	
	public Set<AttivitaAlternanza> findAttivitaAlternanza(Long pianoId, Integer annoCorso, String classe, String studenteId, Boolean individuale) throws BadRequestException {
		PianoAlternanza pa = aslManager.getPianoAlternanza(pianoId);
		if (pa == null) {
			throw new BadRequestException(errorLabelManager.get("piano.error.notfound"));
		}
		
		String istitutoId = pa.getIstitutoId();
		String corsoId = pa.getCorsoDiStudioId();		
		
		StringBuilder sb = new StringBuilder(ESPERIENZA_SVOLTA_FOR_STUDENTE_OR_CLASSE);

		if (classe != null && !classe.isEmpty()) {
			sb.append(" AND aa0.classe = (:classe)");
		}
		if (studenteId != null) {
			sb.append(" AND es0.studente.id = (:studenteId)");
		}		
		if (individuale != null) {
			sb.append(" AND aa0.individuale = (:individuale)");
		}
		
		String q = sb.toString();
		
		TypedQuery<EsperienzaSvolta> query = em.createQuery(q, EsperienzaSvolta.class);		
		
		query.setParameter("annoCorso", annoCorso);
		if (classe != null && !classe.isEmpty()) {
			query.setParameter("classe", classe);	
		}
		if (studenteId != null) {
			query.setParameter("studenteId", studenteId);	
		}		
		if (individuale != null) {
			query.setParameter("individuale", individuale);	
		}	
		query.setParameter("istitutoId", istitutoId);
		query.setParameter("corsoId", corsoId);			
		
		
		List<EsperienzaSvolta> esperienze = query.getResultList();
		
		List<EsperienzaSvolta> esperienzeFiltered = esperienze.stream().filter(x ->
			pa.getAnniAlternanza().contains(x.getAttivitaAlternanza().getAnnoAlternanza())).collect(Collectors.toList());
		
		Set<AttivitaAlternanza> result  = esperienzeFiltered.stream().map(x -> x.getAttivitaAlternanza()).collect(Collectors.toSet());
		
		return result;
	}	
	
	public Set<TipologiaAttivita> findTipologieAttivitaMancanti(Long pianoId, Integer annoCorso, String classe, String studenteId, Boolean individuale) throws Exception {
		PianoAlternanza pa = aslManager.getPianoAlternanza(pianoId);
		if (pa == null) {
			throw new BadRequestException(errorLabelManager.get("piano.error.notfound"));
		}
		
		Set<Integer> taTipologie = Sets.newHashSet();
		Multimap<Integer, TipologiaAttivita> tas = ArrayListMultimap.create();
		
		for (AnnoAlternanza aa: pa.getAnniAlternanza()) {
			if (aa.getAnnoCorso() != annoCorso) {
				continue;
			}
			taTipologie.addAll(aa.getTipologieAttivita().stream().map(x -> x.getTipologia()).collect(Collectors.toSet()));
			aa.getTipologieAttivita().forEach(x -> tas.put(x.getTipologia(), x));
		}
		
		Set<AttivitaAlternanza> attivitaAlternanza = findAttivitaAlternanza(pianoId, annoCorso, classe, studenteId, individuale);
		Set<TipologiaAttivita> result = Sets.newTreeSet();
		
		Set<Integer> aaTipologie = attivitaAlternanza.stream().map(x -> x.getTipologia()).collect(Collectors.toSet());

		for (AttivitaAlternanza aa: attivitaAlternanza) {
			aa.getAnnoAlternanza().getTipologieAttivita().forEach(x -> tas.put(x.getTipologia(), x));
		}

		taTipologie.removeAll(aaTipologie);
		
		for (Integer ta: taTipologie) {
			result.addAll(tas.get(ta));
		}
		
		if (individuale != null) {
			result = result.stream().filter(x -> aslManager.getTipologiaTipologiaAttivita(x.getTipologia()).getIndividuale() == individuale).collect(Collectors.toSet());
		}
		
		return result;
	}
		
}
