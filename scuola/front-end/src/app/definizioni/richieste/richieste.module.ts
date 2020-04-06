import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { SharedModule }   from '../../shared/shared.module';

import { RichiesteRoutingModule } from './richieste-routing.module';
import { RichiestaDetailsComponent } from './richiesta-details/richiesta-details.component';
import { RefuseRequestConfirmModalComponent } from './modals/refuse-request-confirm-modal/refuse-request-confirm-modal.component';
import { SubNavbarModule } from '../../sub-navbar/sub-navbar.module';



@NgModule({
  imports: [
    SharedModule,
    CommonModule,
    NgbModule.forRoot(),
    RichiesteRoutingModule,
    SubNavbarModule
  ],
  declarations: [
    RichiesteRoutingModule.components],
  entryComponents: [
    RichiestaDetailsComponent,
    RefuseRequestConfirmModalComponent
  ]
})
export class RichiesteModule { }
