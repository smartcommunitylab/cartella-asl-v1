import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RichiesteComponent } from './richieste.component';
import { RichiestaDetailsComponent } from './richiesta-details/richiesta-details.component'
import { RefuseRequestConfirmModalComponent } from './modals/refuse-request-confirm-modal/refuse-request-confirm-modal.component';

const routes: Routes = [
  { path: '', component: RichiesteComponent },
  { path: 'detail/:id', component: RichiestaDetailsComponent }
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class RichiesteRoutingModule { 
  static components = [
    RichiesteComponent,
    RichiestaDetailsComponent,
    RefuseRequestConfirmModalComponent
  ];
}