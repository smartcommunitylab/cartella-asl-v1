import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PianificaComponent } from './pianifica.component';
import { PianificaContainerComponent } from './pianifica-container.component';
import { PianoDettaglioComponent } from './piano-dettaglio/piano-dettaglio.component';
import { PianoModificaCompetenzeComponent } from './actions/piano-modifica-competenze/piano-modifica-competenze.component';
import { PianoAttivitaEditComponent } from './piano-dettaglio/piano-attivita-edit/piano-attivita-edit.component';

const routes: Routes = [
  { path: '', component: PianificaContainerComponent,
    children: [
      { path: 'incorso', component: PianificaComponent },
      { path: 'archivio', component: PianificaComponent},
      { path: 'detail/:id', component: PianoDettaglioComponent},
      { path: 'detail/:id/skills', component: PianoModificaCompetenzeComponent},
      { path: 'detail/:id/:idAttivita', component: PianoAttivitaEditComponent},
      { path: '**', pathMatch:'full', redirectTo: 'incorso' }
    ]
  }
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class PianificaRoutingModule { 
  static components = [ PianificaComponent, PianificaContainerComponent];
}


