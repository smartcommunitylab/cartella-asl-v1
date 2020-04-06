import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { SharedModule }   from '../shared/shared.module';

import { GestioneComponent } from './gestione.component';
import { GestioneRoutingModule } from './gestione-routing.module';
import { ProgrammazioneGuideComponent } from './programmazione-guide/programmazione-guide.component';
import { SearchAttivitaContainer } from './attivita-giornaliera-eccezioni/search-attivita/search-attivita-container.component';
import { RicercaModificaCompetenzeComponent } from './attivita-giornaliera-eccezioni/search-attivita/ricerca-modifica-competenze/ricerca-modifica-competenze.component';
import { EccezioneDetailComponent } from './attivita-giornaliera-eccezioni/eccezione-detail/eccezione-detail.component';
import { SkillsSelectorModule } from '../skills-selector/skills-selector.module';
import { DpDatePickerModule } from 'ng2-date-picker';
import { SubNavbarModule } from '../sub-navbar/sub-navbar.module';
import { AttivitaGiornalieraEccezioniComponent } from './attivita-giornaliera-eccezioni/attivita-giornaliera-eccezioni.component';
import { SearchAttivitaModule } from '../search-attivita/search-attivita.module';
import { AttivitaGiornalieraEccezioneCreazioneComponent } from './attivita-giornaliera-eccezioni/eccezione-creazione/attivita-giornaliera-eccezione-creazione.component';
import { EccezioneModificaCompetenzeComponent } from './attivita-giornaliera-eccezioni/eccezione-creazione/eccezione-modifica-competenze/eccezione-modifica-competenze.component';
import { EccezioneModificaStudentiComponent } from './attivita-giornaliera-eccezioni/eccezione-creazione/eccezione-modifica-studenti/eccezione-modifica-studenti.component';


@NgModule({
  imports: [
    SharedModule,
      CommonModule,
      SkillsSelectorModule,
      DpDatePickerModule,
      SubNavbarModule,
      SearchAttivitaModule,
      NgbModule.forRoot(),
      GestioneRoutingModule
    ],
    entryComponents: [SearchAttivitaContainer, RicercaModificaCompetenzeComponent, AttivitaGiornalieraEccezioniComponent, AttivitaGiornalieraEccezioneCreazioneComponent, EccezioneDetailComponent, EccezioneModificaStudentiComponent, EccezioneModificaCompetenzeComponent],
    declarations: [GestioneComponent, ProgrammazioneGuideComponent, AttivitaGiornalieraEccezioniComponent, EccezioneDetailComponent,SearchAttivitaContainer,AttivitaGiornalieraEccezioneCreazioneComponent,RicercaModificaCompetenzeComponent,EccezioneModificaStudentiComponent,EccezioneModificaCompetenzeComponent]

})
export class GestioneModule { }