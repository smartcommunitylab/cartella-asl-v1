import { NgModule }      from '@angular/core';

import { SharedModule }   from '../../shared/shared.module';
import { AziendeRoutingModule } from './aziende-routing.module';
import { AziendeContainerComponent } from './aziende-container.component';
import { NgbModule,NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AziendaModifica } from './actions/azienda-modifica.component';
import { AziendaDettaglio } from './actions/azienda-dettaglio.component';
import { AziendaCancellaModal } from './actions/azienda-cancella-modal.component';
import { SubNavbarModule } from '../../sub-navbar/sub-navbar.module';



@NgModule({
  imports:      [ 
    SharedModule,
    AziendeRoutingModule,
    NgbModule.forRoot(),
    SubNavbarModule  
  ],
  entryComponents: [
    AziendaDettaglio,
    AziendaModifica,
    AziendaCancellaModal
  ],
  providers: [
    NgbActiveModal
  ],
  declarations: [ AziendeRoutingModule.components, AziendaModifica, AziendaDettaglio, AziendaCancellaModal,  AziendeContainerComponent]
})
export class AziendeModule { }