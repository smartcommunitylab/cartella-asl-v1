import { NgModule }      from '@angular/core';

import { SharedModule }   from '../../shared/shared.module';
import { CompetenzeRoutingModule } from './competenze-routing.module';
import { CompetenzeContainerComponent } from './competenze-container.component';
import { NgbModule,NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CompetenzeDettaglio } from './actions/competenze-dettaglio.component';
import { CompetenzeModifica } from './actions/competenze-modifica.component';
import { CompetenzeCancellaModal } from './actions/competenze-cancella-modal.component';
import { SubNavbarModule } from '../../sub-navbar/sub-navbar.module';



@NgModule({
  imports:      [ 
    SharedModule,
    CompetenzeRoutingModule,
    NgbModule.forRoot(),
    SubNavbarModule  
  ],
  entryComponents: [
    CompetenzeDettaglio,
    CompetenzeModifica,
    CompetenzeCancellaModal
  ],
  providers: [
    NgbActiveModal
  ],
  declarations: [ CompetenzeRoutingModule.components, CompetenzeDettaglio, CompetenzeModifica, CompetenzeCancellaModal, CompetenzeContainerComponent]
})
export class CompetenzeModule { }