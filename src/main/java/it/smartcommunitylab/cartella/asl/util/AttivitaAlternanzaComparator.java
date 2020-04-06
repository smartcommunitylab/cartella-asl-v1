package it.smartcommunitylab.cartella.asl.util;

import java.util.Comparator;

import org.springframework.stereotype.Component;

import it.smartcommunitylab.cartella.asl.model.AttivitaAlternanza;

@Component
public class AttivitaAlternanzaComparator implements Comparator<AttivitaAlternanza> {

	@Override
	public int compare(AttivitaAlternanza aa1, AttivitaAlternanza aa2) {
		Long time1 = aa1.getDataInizio();
		Long time2 = aa2.getDataInizio();
		return time1.compareTo(time2);
		
	}
}
