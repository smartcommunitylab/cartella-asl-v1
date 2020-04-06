import { NgModule }      from '@angular/core';
import { SharedModule }   from '../../shared/shared.module';
import { ProgrammaRoutingModule } from './programma-routing.module';
import { ProgrammaContainerComponent } from './programma-container.component';
import { NgbModule,NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { from } from 'rxjs/observable/from';
import { BootstrapSwitchModule } from 'angular2-bootstrap-switch';
import { ProgrammaDettaglioComponent } from './programma-dettaglio/programma-dettaglio.component';
import { StudenteDettaglioComponent } from './studente-dettaglio/studente-dettaglio.component';
import { ClasseDettaglioComponent } from './classe-dettaglio/classe-dettaglio.component';
import {ProgrammaCancellaAttivitaModal}  from './actions/cancella-attivita-modal/programma-cancella-attivita-modal.component';
import { SubNavbarModule } from '../../sub-navbar/sub-navbar.module';
import { ProgrammaOpenCompetenzaModal } from './actions/dettaglio-competenza-modal/dettaglio-competenza-modal.component';
import { ProgrammaOpenAttivitaPianoModal } from './actions/dettaglio-attivita-piano-modal/dettaglio-attivita-piano-modal.component';
import { ProgrammaOpenAttivitaModal } from './actions/dettaglio-attivita-modal/dettaglio-attivita-modal.component';
import { DpDatePickerModule } from 'ng2-date-picker';
import { ProgrammaAddAttivitaModal } from './actions/dettaglio-attivita-add/dettaglio-attivita-add.component';
import { SkillsSelectorModule } from '../../skills-selector/skills-selector.module';
import { SearchAttivitaModule } from '../../search-attivita/search-attivita.module';
import { SearchAttivitaContainer } from './actions/search-attivita/search-attivita-container.component';
import { ProgrammaEccezioneModal } from './actions/dettaglio-eccezione-modal/dettaglio-eccezione-modal.component';
import { RicercaModificaCompetenzeComponent } from '../../search-attivita/ricerca-modifica-competenze/ricerca-modifica-competenze.component';
import { GruppoModificaAttivitaAlt } from './actions/modifica-gruppo-attivita-alt/gruppo-aa-modifica.component';
import { StudenteModificaAttivitaAlt } from './actions/modifica-studente-attivita-alt/studente-aa-modifica.component'
import { GruppoDettaglioAttivitaAlt } from './actions/dettaglio-gruppo-attivita-alt/gruppo-aa-dettaglio.component';
import { GruppoGestioneAttivitaAlt } from './actions/gestione-gruppo-attivita-alt/gruppo-aa-gestione.component';
import { AttivitaGruppoCompetenze } from './actions/gruppo-alt-modifica-competenza/attivita-gruppo-competenze.component';


@NgModule({
  imports:      [ 
    SharedModule,
    ProgrammaRoutingModule,
    DpDatePickerModule,
    SkillsSelectorModule,
    SearchAttivitaModule,
    NgbModule.forRoot(),
    BootstrapSwitchModule.forRoot(),
    SubNavbarModule,
  ],
  providers: [
    NgbActiveModal,
  ],
  entryComponents: [ProgrammaCancellaAttivitaModal,SearchAttivitaContainer,ProgrammaEccezioneModal,ProgrammaOpenAttivitaPianoModal,ProgrammaOpenCompetenzaModal,ProgrammaAddAttivitaModal,ProgrammaOpenAttivitaModal,RicercaModificaCompetenzeComponent],
  declarations: [ ProgrammaRoutingModule.components, SearchAttivitaContainer,ProgrammaEccezioneModal, ProgrammaContainerComponent, ProgrammaDettaglioComponent, ProgrammaAddAttivitaModal,ProgrammaCancellaAttivitaModal,ProgrammaOpenAttivitaPianoModal,ProgrammaOpenCompetenzaModal,ProgrammaOpenAttivitaModal, StudenteDettaglioComponent, ClasseDettaglioComponent, RicercaModificaCompetenzeComponent, GruppoModificaAttivitaAlt, GruppoDettaglioAttivitaAlt, GruppoGestioneAttivitaAlt, AttivitaGruppoCompetenze, StudenteModificaAttivitaAlt ]
})
export class ProgrammaModule { }