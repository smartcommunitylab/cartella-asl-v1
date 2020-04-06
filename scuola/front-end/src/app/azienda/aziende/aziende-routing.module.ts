import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AziendeComponent } from './aziende.component';
import { AziendeContainerComponent } from './aziende-container.component';
import { AziendaModifica } from './actions/azienda-modifica.component';

const routes: Routes = []

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class AziendeRoutingModule { 
  static components = [ AziendeComponent, AziendeContainerComponent];
}