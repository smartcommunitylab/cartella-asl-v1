import { NgModule } from '@angular/core';
import { NgbModule, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { SharedModule } from '../../shared/shared.module';
import { OppurtunitiesRoutingModule } from './oppurtunities-routing.module';
import { PaginationModule } from '../../shared/pagination/pagination.module';
import { DpDatePickerModule } from 'ng2-date-picker';
import { AttivitaCancellaModal } from './modal/cancella/attivita-cancella-modal.component';
import { AppModule } from '../../app.module';
import { SkillsSelectorModule } from '../../skills-selector/skills-selector.module';
import { SceltaAziendaModalComponent } from './edit/scelta-azienda-modal/scelta-azienda-modal.component';

@NgModule({
  imports: [OppurtunitiesRoutingModule, SharedModule, NgbModule.forRoot(), DpDatePickerModule, PaginationModule],
  declarations: [OppurtunitiesRoutingModule.components],
  entryComponents: [SceltaAziendaModalComponent],
  providers: [
    NgbActiveModal,
    AppModule
  ]
})
export class OppurtunitiesModule { }