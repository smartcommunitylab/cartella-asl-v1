import { NgModule }      from '@angular/core';

import { SharedModule }   from '../../shared/shared.module';
import { AttivitaRoutingModule } from './attivita-routing.module';
import { AttivitaContainerComponent } from './attivita-container.component';
import { NgbModule,NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AttivitaDettaglio } from './actions/attivita-dettaglio.component';
import { AttivitaModifica } from './actions/attivita-modifica.component';
import { AttivitaCancellaModal } from './actions/attivita-cancella-modal.component';
import { DpDatePickerModule } from 'ng2-date-picker';
import { AttivitaModificaCompetenze } from './actions/attivita-modifica-competenze.component';
import { SkillsSelectorModule } from '../../skills-selector/skills-selector.module';
import { SubNavbarModule } from '../../sub-navbar/sub-navbar.module';



@NgModule({
  imports:      [ 
    SharedModule,
    AttivitaRoutingModule,
    NgbModule.forRoot(),
    DpDatePickerModule,
    SkillsSelectorModule,
    SubNavbarModule  
  ],
  entryComponents: [
    AttivitaDettaglio,
    AttivitaModifica,
    AttivitaCancellaModal
  ],
  providers: [
    NgbActiveModal
  ],
  declarations: [ AttivitaRoutingModule.components, AttivitaDettaglio, AttivitaModifica, AttivitaCancellaModal, AttivitaContainerComponent, AttivitaModificaCompetenze ]
})
export class AttivitaModule { }