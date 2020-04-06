import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AttivitaComponent } from './attivita.component';
import { AttivitaContainerComponent } from './attivita-container.component';
import { AttivitaDettaglio } from './actions/attivita-dettaglio.component';
import { AttivitaModifica } from './actions/attivita-modifica.component';
import { AttivitaModificaCompetenze } from './actions/attivita-modifica-competenze.component';

const routes: Routes = [
  { path: '', component: AttivitaContainerComponent,
    children: [
      { path: 'incorso', component: AttivitaComponent },
      { path: 'archivio', component: AttivitaComponent},
      { path: 'detail/:id', component: AttivitaDettaglio },
      { path: 'detail/:id/skills', component: AttivitaModificaCompetenze }, 
      { path: 'edit/:id', component: AttivitaModifica }, //edit
      { path: 'edit', component: AttivitaModifica }, //new
      { path: '**', pathMatch:'full', redirectTo: 'incorso' }
    ]
  }
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class AttivitaRoutingModule { 
  static components = [ AttivitaComponent, AttivitaContainerComponent];
}