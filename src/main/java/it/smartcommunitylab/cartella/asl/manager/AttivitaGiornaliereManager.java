package it.smartcommunitylab.cartella.asl.manager;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
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

import com.google.common.base.Splitter;
import com.google.common.collect.HashMultimap;
import com.google.common.collect.Lists;
import com.google.common.collect.Maps;
import com.google.common.collect.Multimap;
import com.google.common.collect.Sets;

import it.smartcommunitylab.cartella.asl.exception.BadRequestException;
import it.smartcommunitylab.cartella.asl.model.AttivitaAlternanza;
import it.smartcommunitylab.cartella.asl.model.Competenza;
import it.smartcommunitylab.cartella.asl.model.CorsoDiStudio;
import it.smartcommunitylab.cartella.asl.model.EsperienzaSvolta;
import it.smartcommunitylab.cartella.asl.model.PianoAlternanza;
import it.smartcommunitylab.cartella.asl.model.PresenzaGiornaliera;
import it.smartcommunitylab.cartella.asl.model.Presenze;
import it.smartcommunitylab.cartella.asl.model.Studente;
import it.smartcommunitylab.cartella.asl.model.audit.AuditEntry;
import it.smartcommunitylab.cartella.asl.model.report.ReportAttivitaGiornaliera;
import it.smartcommunitylab.cartella.asl.model.report.ReportEsperienzeStudente;
import it.smartcommunitylab.cartella.asl.model.report.ReportStudente;
import it.smartcommunitylab.cartella.asl.util.ErrorLabelManager;

@Repository
@Transactional
public class AttivitaGiornaliereManager {

	private static Log logger = LogFactory.getLog(AttivitaGiornaliereManager.class);
	
	@Autowired
	private QueriesManager aslManager;
	
	@Autowired
	protected EntityManager em;	
	
	
	@Autowired ErrorLabelManager errorLabelManager;	
	
	@Autowired
	private AuditManager auditManager;			
	
	// TODO add: individuale, interna + "aa0.corsoInterno IS NOT NULL" optional
	private static final String ATTIVITA_ALTERNANZA_WITH_CORSO_INTERNO = "SELECT aa0 FROM AttivitaAlternanza aa0 WHERE aa0.istitutoId = (:istitutoId) "; // AND aa0.corsoInterno IS NOT NULL ";
	
//	private static final String ESPERIENZA_SVOLTA_BY_STUDENTE = "SELECT es0 FROM EsperienzaSvolta es0 WHERE es0.studente.id = (:studenteId) ";
	private static final String ESPERIENZE_SVOLTE = "SELECT DISTINCT es0 FROM EsperienzaSvolta es0 JOIN es0.attivitaAlternanza aa0 WHERE aa0.istitutoId = (:istitutoId) and es0.studente.id IN (:studenteIds) ";
	
	public Page<AttivitaAlternanza> findAttivitaAlternanza(String istitutoId, String corsoId, String annoScolastico, Integer annoCorso, Integer tipologia, Long dataInizio, Long dataFine, String titolo, Boolean individuale, Boolean interna, Boolean completata, String tags, String nomeStudente, Pageable pageRequest) {
		StringBuilder sb = new StringBuilder(ATTIVITA_ALTERNANZA_WITH_CORSO_INTERNO);
		if (corsoId != null) {
			sb.append(" AND aa0.corsoId = (:corsoId)");
		}		
		if (annoCorso != null) {
			sb.append(" AND aa0.annoCorso = (:annoCorso)");
		}
		if (annoScolastico != null) {
			sb.append(" AND aa0.annoScolastico = (:annoScolastico)");
		}
		if (tipologia != null) {
			sb.append(" AND aa0.tipologia = (:tipologia)");
		}		
		if (dataInizio != null) {
			sb.append(" AND aa0.dataInizio >= (:dataInizio) ");
		}
		if (dataFine != null) {
			sb.append(" AND aa0.dataFine <= (:dataFine) ");
		}		
		if (titolo != null && !titolo.isEmpty()) {
			sb.append(" AND lower(aa0.titolo) LIKE (:titolo)");
		}	
		if (completata != null) {
			sb.append(" AND aa0.completata = (:completata)");
		}	
		if (individuale != null) {
			sb.append(" AND aa0.individuale = (:individuale)");
		}	
		if (interna != null) {
			sb.append(" AND aa0.interna = (:interna)");
		}			
		if (tags != null) {
			sb.append(" AND tags IN (:tags)");
		}
//		if (restricted != null && restricted == true) {
//			sb.append(" AND aa0.corsoInterno IS NOT NULL ");
//		}			
		
		
		String q = sb.toString();
		
		if (tags != null) {
			q = q.replaceAll("FROM AttivitaAlternanza aa0", "FROM AttivitaAlternanza aa0 LEFT JOIN aa0.tags tags");
		}
		
		System.err.println(q);
		
		TypedQuery<AttivitaAlternanza> query = em.createQuery(q, AttivitaAlternanza.class);		
		
		query.setParameter("istitutoId", istitutoId);	
		if (annoCorso != null) {
			query.setParameter("annoCorso", annoCorso);	
		}	
		if (corsoId != null) {
			query.setParameter("corsoId", corsoId);	
		}	
		if (annoScolastico != null) {
			query.setParameter("annoScolastico", annoScolastico);	
		}		
		if (tipologia != null) {
			query.setParameter("tipologia", tipologia);	
		}
		if (dataInizio != null) {
			query.setParameter("dataInizio", dataInizio);
		}
		if (dataFine != null) {
			query.setParameter("dataFine", dataFine);
		}	
		if (titolo != null && !titolo.isEmpty()) {
			query.setParameter("titolo",  "%" + titolo.toLowerCase() + "%");
		}
		if (completata != null) {
			query.setParameter("completata", completata);
		}	
		if (individuale != null) {
			query.setParameter("individuale", individuale);
		}	
		if (interna != null) {
			query.setParameter("interna", interna);
		}	
		if (tags != null) {
			List<String> tagsList = Splitter.on(",").splitToList(tags);
			query.setParameter("tags", tagsList);
		}
				
		List<AttivitaAlternanza> temp = query.getResultList();
		
		List<AttivitaAlternanza> result = new ArrayList<AttivitaAlternanza>();
		
		for (AttivitaAlternanza aa : temp) {
			List<EsperienzaSvolta> ess = aslManager.findEsperienzaSvoltaByAttivitaAlternanza(aa);
			for (EsperienzaSvolta es : ess) {
				es.getPresenze().computeOreSvolte();
			}
			if (nomeStudente != null && !nomeStudente.isEmpty()) {
				aa.getStudenti().addAll(ess.stream().filter(x -> x.getStudente() != null
						&& (x.getStudente().getName().toLowerCase().contains(nomeStudente.toLowerCase().trim())
								| x.getStudente().getSurname().toLowerCase().contains(nomeStudente.toLowerCase().trim())))
						.map(x -> x.getStudente()).collect(Collectors.toSet()));
				if (!aa.getStudenti().isEmpty()) {
					result.add(aa);
				}
			} else {
				aa.getStudenti().addAll(ess.stream().filter(x -> x.getStudente() != null).map(x -> x.getStudente())
						.collect(Collectors.toSet()));
				result.add(aa);
			}
		}
		
		int from = pageRequest.getPageNumber() * pageRequest.getPageSize();
		int to = Math.min(result.size(), (pageRequest.getPageNumber() + 1) * pageRequest.getPageSize());
		int total = result.size();
		if (to > from) {
			result = result.subList(from, to);
		} else {
			result = Lists.newArrayList();
		}	

		Page<AttivitaAlternanza> page = new PageImpl<AttivitaAlternanza>(result, pageRequest, total);		
		
		return page;	
	}
	
	public Page<ReportAttivitaGiornaliera> generateReportAttivitaGiornalieraStudente(String istitutoId, Integer annoCorso, String nome, String annoScolastico, Pageable pageRequest) throws Exception {
		List<Studente> studentiList = null;
		List<ReportAttivitaGiornaliera> result = new ArrayList<ReportAttivitaGiornaliera>();
		
		if (nome != null && !nome.isEmpty()) {
			nome = nome.trim();
		}
		
		studentiList = aslManager.findStudenti(istitutoId, null, annoScolastico, null, nome);

		if (annoCorso != null) {
			studentiList = studentiList.stream().filter(x -> {
				return x.getClassroom() != null && Integer.parseInt(x.getClassroom().substring(0, 1)) == annoCorso;
				}).collect(Collectors.toList());			
			
		}		
		
		// sort alphabetically and paginate.
		Collections.sort(studentiList);
		int total = studentiList.size();
		int from = pageRequest.getPageNumber() * pageRequest.getPageSize();
		int to = Math.min(studentiList.size(), (pageRequest.getPageNumber() + 1) * pageRequest.getPageSize());
		if (to > from) {
			studentiList = studentiList.subList(from, to);
		} else {
			studentiList = Lists.newArrayList();
		}
		
		if (studentiList.isEmpty()) {
			return new PageImpl<ReportAttivitaGiornaliera>(result, pageRequest, total);
		}
		
		Map<String, Studente> studenti = Maps.newTreeMap(); 
		Map<String, ReportAttivitaGiornaliera> reports = Maps.newTreeMap();
		List<String> studentIds = new ArrayList<String>();
		for (Studente stud : studentiList) {
			studentIds.add(stud.getId());
			reports.put(stud.getId(), new ReportAttivitaGiornaliera());
			studenti.put(stud.getId(), stud);
		}		
		
		StringBuilder sb = new StringBuilder(ESPERIENZE_SVOLTE);
		
		if (annoCorso != null) {
			sb.append(" AND aa0.annoCorso = (:annoCorso)");
		}	
		if (nome != null && !nome.isEmpty()) {
			sb.append(" AND (lower(es0.studente.surname) LIKE (:nome) OR lower(es0.studente.name) LIKE (:nome))");
		}
		if (annoScolastico != null && !annoScolastico.isEmpty()) {
			sb.append(" AND aa0.annoScolastico = (:annoScolastico) ");
		}	
		
		String q = sb.toString();
		
		TypedQuery<EsperienzaSvolta> query = em.createQuery(q, EsperienzaSvolta.class);		
		
		query.setParameter("istitutoId", istitutoId);
		query.setParameter("studenteIds", studentIds);
		
		if (annoCorso != null) {
			query.setParameter("annoCorso", annoCorso);
		}	
		if (nome != null && !nome.isEmpty()) {
			query.setParameter("nome", "%" + nome.toLowerCase() + "%");
		}	
		if (annoScolastico != null && !annoScolastico.isEmpty()) {
			query.setParameter("annoScolastico", annoScolastico);
		}
		
		List<EsperienzaSvolta> esperienze = query.getResultList();
		
		Multimap<String, Competenza> competenzePiano = HashMultimap.create();
		Multimap<String, Competenza> competenzeEsperienze = HashMultimap.create();
		
		for (EsperienzaSvolta es: esperienze) {
			Studente studente = es.getStudente(); 
			String id = studente.getId();
			
			ReportAttivitaGiornaliera rag = reports.getOrDefault(id, new ReportAttivitaGiornaliera());
			
			int oreSvolte = oreEsperienzaSvolta(es, istitutoId);
//			if (oreSvolte >= 0) {
				rag.setOreEffettuate(rag.getOreEffettuate() + Math.abs(oreSvolte));
				rag.setEsperienzeEffettuate(rag.getEsperienzeEffettuate() + 1);
				competenzeEsperienze.putAll(id, es.getCompetenze());
//			}
			if (rag.getOreTotali() == 0) {
				CorsoDiStudio cds = aslManager.getCorsoDiStudio(istitutoId, annoScolastico, es.getAttivitaAlternanza().getCorsoId());
				rag.setOreTotali(cds.getOreAlternanza());
			}			
			
			rag.setEsperienzeTotali(rag.getEsperienzeTotali() + 1);
			
			PianoAlternanza pa = aslManager.findPianoAlternanzaByAttivitaAlternanza(es.getAttivitaAlternanza());
			competenzePiano.putAll(id, pa.getCompetenze());
			
			reports.put(id, rag);			
		}
		
		// create temporary report.
		Map<String, ReportAttivitaGiornaliera> reportsTemp = new HashMap<String, ReportAttivitaGiornaliera>(); // TODO:BLOCKER
		reportsTemp.putAll(reports);// TODO:BLOCKER
		for (String id : reportsTemp.keySet()) { // TODO:BLOCKER
			Studente studente = studenti.get(id);

			if (studente == null) {
				logger.error(String.format("student not found: [%s]", id));
				reports.remove(id); // TODO:BLOCKER
				continue;// TODO:BLOCKER
				// throw new BadRequestException(errorLabelManager.get("studente.error.notfound"));
			}
			
			ReportAttivitaGiornaliera rag = reports.get(id);
			
			rag.setStudenteId(id);
			rag.setClasse(studente.getClassroom());
			rag.setNome(studente.getSurname() + " " + studente.getName());
			
			if (competenzePiano.containsKey(id)) {
				rag.setCompetenzeTotali(competenzePiano.get(id).size());
			}
			if (competenzeEsperienze.containsKey(id)) {
				reports.get(id).setCompetenzeEffettuate(competenzeEsperienze.get(id).size());	
			}
		}
		
		result = Lists.newArrayList(reports.values());
		Collections.sort(result);
		Page<ReportAttivitaGiornaliera> page = new PageImpl<ReportAttivitaGiornaliera>(result, pageRequest, total);		
		
		return page;
	}
	
	public List<ReportEsperienzeStudente> generateReportEsperienzeStudente(String studenteId) {
		List<ReportEsperienzeStudente> result = Lists.newArrayList();
		Studente studente = aslManager.findStudente(studenteId);
		List<EsperienzaSvolta> esperienze = aslManager.findEsperienzaSvoltaByStudente(studente);
		
		for (EsperienzaSvolta es: esperienze) {
			ReportEsperienzeStudente res = new ReportEsperienzeStudente();
			
			res.setEsperienzaId(es.getId());
			
			AttivitaAlternanza aa = es.getAttivitaAlternanza();
			res.setTitolo(aa.getTitolo());
			res.setTipologia(aa.getTipologia());
			res.setDataInizio(aa.getDataInizio());
			res.setDataFine(aa.getDataFine());
			
			int ore = oreEsperienzaSvolta(es, es.getAttivitaAlternanza().getIstitutoId());
			
			long now = System.currentTimeMillis();
			if (ore > 0) {
				res.setStato(0); // completato
			} else if (now > res.getDataFine() && ore <= 0) {
				res.setStato(1); // non completato
			} else if (now < res.getDataInizio()) {
				res.setStato(2); // da fare
			} else {
				res.setStato(3); // in corso
			}
			
			result.add(res);
		}
		
		return result;
	}
	
	public void updateCompletata(long id, boolean completata) {
		aslManager.setCompletata(id, completata);
	}
	
	public Map<String, Presenze> findAttivitaAlternanzaCalendario(Long attivitaId) {
		AttivitaAlternanza aa = aslManager.getAttivitaAlternanza(attivitaId, false);
		List<EsperienzaSvolta> esperienze = aslManager.findEsperienzaSvoltaByAttivitaAlternanza(aa);
		
		Map<String, Presenze> map = Maps.newTreeMap();
		
		esperienze.stream().forEach(x -> {
			x.getPresenze().setStudenteId(x.getStudente().getId());
			x.getPresenze().setClasse(aslManager.findStudenteClassroomBySchoolYear(x.getStudente().getId(), aa.getAnnoScolastico(), aa.getIstitutoId(), aa.getCorsoId()));
			x.getPresenze().setEsperienzaSvoltaId(x.getId());
			x.getPresenze().setNome(x.getStudente().getSurname() + " " + x.getStudente().getName());
			x.getPresenze().computeOreSvolte();
			x.getPresenze().setCompletato(x.isCompletata());
			
		});
		esperienze.stream().forEach(x -> map.put(x.getStudente().getId(), x.getPresenze()));
		
		return map;
	}	
	
	public void setAttivitaAlternanzaCalendario(Map<String, Presenze> calendar, Map<Presenze, Boolean> isNotOnlyStudent) throws Exception {
		for (Presenze presenze: calendar.values()) {
			EsperienzaSvolta es = aslManager.findEsperienzaSvoltaById(presenze.getEsperienzaSvoltaId());

			if (es == null) {
				throw new BadRequestException(errorLabelManager.get("esp.error.notfound"));
			}
			
			Set<PresenzaGiornaliera> updated = Sets.newHashSet();
			es.getPresenze().getGiornate().forEach(x -> {
				presenze.getGiornate().forEach(y -> {
					if (x.equals(y)) {
						x.setAttivitaSvolta(y.getAttivitaSvolta());
						x.setOreSvolte(y.getOreSvolte());
						
						if (isNotOnlyStudent.get(presenze)) {
							x.setVerificata(y.getVerificata());
						}
						
						updated.add(x);
					}
				});
				
			});
			es.getPresenze().getGiornate().addAll(presenze.getGiornate());
//			for (PresenzaGiornaliera presenza: presenze.getGiornate()) {
//				if (updated.contains(presenza)) {
//					AuditEntry audit = new AuditEntry("update", PresenzaGiornaliera.class, presenza.getId(), null, new Object(){});
//					auditManager.save(audit);
//				} else {
//					AuditEntry audit = new AuditEntry("create", PresenzaGiornaliera.class, presenza.getId(), null, new Object(){});
//					auditManager.save(audit);					
//				}
//			}
			
			aslManager.saveEsperienzaSvolta(es);
			
			AuditEntry audit = new AuditEntry("update", EsperienzaSvolta.class, es.getId(), null, new Object(){});
			auditManager.save(audit);
		}
		
	}	
	
	private int oreEsperienzaSvolta(EsperienzaSvolta es, String istitutoId) {
		Presenze pc = es.getPresenze();
		if (pc == null) {
			return -1;
		}
		pc.computeOreSvolte();
		if (pc.getOreSvolte() >= es.getAttivitaAlternanza().getOre() * aslManager.getIstituzioneHoursThreshold(istitutoId)) {
			return pc.getOreSvolte();
		}
		return -pc.getOreSvolte();
	}		
	
	
}