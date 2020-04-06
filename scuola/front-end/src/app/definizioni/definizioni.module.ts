import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { SharedModule }   from '../shared/shared.module';

import { DefinizioniComponent } from './definizioni.component';
import { DefinizioniRoutingModule } from './definizioni-routing.module';
import { AttivitaInterneGuideComponent } from './attivita-interne-guide/attivita-interne-guide.component';

@NgModule({
  imports: [
    SharedModule,
    CommonModule,
    NgbModule.forRoot(),
    DefinizioniRoutingModule
  ],
  declarations: [DefinizioniComponent, AttivitaInterneGuideComponent]
})
export class DefinizioniModule { }