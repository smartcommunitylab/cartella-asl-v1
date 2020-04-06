import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CompetenzeComponent } from './competenze.component';
import { CompetenzeContainerComponent } from './competenze-container.component';
import { CompetenzeDettaglio } from './actions/competenze-dettaglio.component';
import { CompetenzeModifica } from './actions/competenze-modifica.component';

const routes: Routes = [
  { path: '', component: CompetenzeContainerComponent,
    children: [
      { path: 'list', component: CompetenzeComponent },
      { path: 'list/detail/:id', component: CompetenzeDettaglio },
      { path: 'list/edit/:id', component: CompetenzeModifica }, //edit
      { path: 'list/edit', component: CompetenzeModifica }, //new
      { path: '**', pathMatch:'full', redirectTo: 'list' }
    ]
  }
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class CompetenzeRoutingModule { 
  static components = [ CompetenzeComponent, CompetenzeContainerComponent];
}