package it.smartcommunitylab.cartella.asl.util;

import java.util.Comparator;

import org.springframework.stereotype.Component;

import it.smartcommunitylab.cartella.asl.model.EsperienzaSvolta;

@Component
public class EsperienzeSvoltaComparator implements Comparator<EsperienzaSvolta> {

	@Override
	public int compare(EsperienzaSvolta esp1, EsperienzaSvolta esp2) {
		Long time1 = esp1.getAttivitaAlternanza().getDataInizio();
		Long time2 = esp2.getAttivitaAlternanza().getDataInizio();
		return time1.compareTo(time2);
		
	}
}
