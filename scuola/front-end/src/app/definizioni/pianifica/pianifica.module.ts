import { NgModule }      from '@angular/core';
import { SharedModule }   from '../../shared/shared.module';
import { PianificaRoutingModule } from './pianifica-routing.module';
import { PianificaContainerComponent } from './pianifica-container.component';
import { NgbModule,NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { from } from 'rxjs/observable/from';
import { BootstrapSwitchModule } from 'angular2-bootstrap-switch';
import { PianificaCancellaModal } from './actions/cancella-piano-modal/pianifica-cancella-modal.component';
import { NewPianoModalComponent } from './actions/new-piano-modal/new-piano-modal.component';
import { PianoDettaglioComponent } from './piano-dettaglio/piano-dettaglio.component';
import { PianificaCloneModal } from './actions/pianifica-clone-modal/pianifica-clone-modal.component';
import { PianoModificaCompetenzeComponent } from './actions/piano-modifica-competenze/piano-modifica-competenze.component';
import { ActivatePianoModal } from './actions/activate-piano-modal/activate-piano-modal.component';
import { SkillsSelectorModule } from '../../skills-selector/skills-selector.module';
import { SubNavbarModule } from '../../sub-navbar/sub-navbar.module';
import { PianoAttivitaEditComponent } from './piano-dettaglio/piano-attivita-edit/piano-attivita-edit.component';
import { PianoAttivitaDeleteModal } from './piano-dettaglio/modals/piano-attivita-delete-modal/piano-attivita-delete-modal.component';
import { DeleteCompetenzaModalComponent } from './actions/delete-competenza-modal/delete-competenza-modal.component';



@NgModule({
  imports:      [ 
    SharedModule,
    PianificaRoutingModule,
    NgbModule.forRoot(),
    BootstrapSwitchModule.forRoot(),
    SkillsSelectorModule,
    SubNavbarModule  ],
  providers: [
    NgbActiveModal,
  ],
  entryComponents: [NewPianoModalComponent, PianificaCancellaModal, PianificaCloneModal, PianoAttivitaDeleteModal, ActivatePianoModal, DeleteCompetenzaModalComponent],
  declarations: [ PianificaRoutingModule.components,  PianificaContainerComponent,PianificaCancellaModal, NewPianoModalComponent, PianoDettaglioComponent, PianificaCloneModal, PianoModificaCompetenzeComponent, PianoAttivitaEditComponent, PianoAttivitaDeleteModal, ActivatePianoModal, DeleteCompetenzaModalComponent ]
})
export class PianificaModule { }