import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AziendaRoutingModule } from './azienda-routing.module';
import { SharedModule } from '../shared/shared.module';
import { NgbModule, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DpDatePickerModule } from 'ng2-date-picker';
import { PaginationModule } from '../shared/pagination/pagination.module';
import { AppModule } from '../app.module';
import { SkillsSelectorModule } from '../skills-selector/skills-selector.module';
import { ActivitiesMainModule } from './activities/activities-main.module';
import { OppurtunitiesModule } from './oppurtunities/oppurtunities.module';
import { AziendeModule } from './aziende/aziende.module';
import { AziendaComponent } from './azienda.component';
import { SceltaAziendaModalComponent } from './oppurtunities/edit/scelta-azienda-modal/scelta-azienda-modal.component';
import { AttivitaCancellaModal } from './activities/modal/cancella/attivita-cancella-modal.component';
import { CompetenzaDetailModalComponent } from "./oppurtunities/skills-selector/modals/competenza-detail-modal/competenza-detail-modal.component";
import { CompetenzeCancellaModal } from './oppurtunities/details/cancella-competenze/competenze-cancella-modal.component';

@NgModule({
  imports: [
    CommonModule,
    AziendaRoutingModule,
    SharedModule,
    NgbModule.forRoot(), 
    DpDatePickerModule, 
    PaginationModule,
    SkillsSelectorModule,
    ActivitiesMainModule, //Contains all activity components
    OppurtunitiesModule, //Contains all opportunity components     
    AziendeModule //Contails all list aziende menu
  ],
  entryComponents: [
    SceltaAziendaModalComponent,
    AttivitaCancellaModal,
    CompetenzaDetailModalComponent,
    CompetenzeCancellaModal],
  declarations: [
    SceltaAziendaModalComponent,
    AziendaComponent,
    CompetenzaDetailModalComponent,
    CompetenzeCancellaModal
  ],
  providers: [
    NgbActiveModal,
    AppModule
  ],

})
export class AziendaModule { }
