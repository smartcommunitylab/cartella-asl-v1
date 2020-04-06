import { NgModule } from '@angular/core';
import { RouterModule, Routes} from '@angular/router';
import { DefinizioniComponent } from './definizioni.component';
import { AttivitaInterneGuideComponent } from './attivita-interne-guide/attivita-interne-guide.component'

const app_routes: Routes = [
  { path: '', component: DefinizioniComponent,
    children: [
      { path: 'attivita', loadChildren: './attivita/attivita.module#AttivitaModule' },
      { path: 'competenze', loadChildren: './competenze/competenze.module#CompetenzeModule' },
      { path: 'pianifica', loadChildren: './pianifica/pianifica.module#PianificaModule' },
      { path: 'guide', component: AttivitaInterneGuideComponent },
      { path: '**', pathMatch:'full', redirectTo: 'attivita' }      
    ]
  }
  
];

@NgModule({
  imports: [ RouterModule.forChild(app_routes) ],
  exports: [ RouterModule ]
})
export class DefinizioniRoutingModule { }
