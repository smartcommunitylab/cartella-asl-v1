import { NgModule } from '@angular/core';
import { RouterModule, Routes} from '@angular/router';
import { GestioneComponent } from './gestione.component';
import { SearchAttivitaContainer } from './attivita-giornaliera-eccezioni/search-attivita/search-attivita-container.component';
import { RicercaModificaCompetenzeComponent } from './attivita-giornaliera-eccezioni/search-attivita/ricerca-modifica-competenze/ricerca-modifica-competenze.component';
import { AttivitaGiornalieraEccezioniComponent } from './attivita-giornaliera-eccezioni/attivita-giornaliera-eccezioni.component';
import { AttivitaGiornalieraEccezioneCreazioneComponent } from './attivita-giornaliera-eccezioni/eccezione-creazione/attivita-giornaliera-eccezione-creazione.component';
import { EccezioneModificaStudentiComponent } from './attivita-giornaliera-eccezioni/eccezione-creazione/eccezione-modifica-studenti/eccezione-modifica-studenti.component';
import { EccezioneModificaCompetenzeComponent } from './attivita-giornaliera-eccezioni/eccezione-creazione/eccezione-modifica-competenze/eccezione-modifica-competenze.component';
import { ProgrammazioneGuideComponent } from './programmazione-guide/programmazione-guide.component';

const app_routes: Routes = [
  { path: '', component: GestioneComponent,
        children: [
          { path: 'corsi', loadChildren: './corsi/corsi.module#CorsiModule' },
          { path: 'eccezioni', component: AttivitaGiornalieraEccezioniComponent },
          { path: 'eccezioni/search', component: SearchAttivitaContainer },
          { path: 'eccezioni/search/modificacompetenze', component: RicercaModificaCompetenzeComponent },
          { path: 'eccezioni/create-eccezione/:idAttivita', component: AttivitaGiornalieraEccezioneCreazioneComponent },
          { path: 'eccezioni/create-eccezione/:idAttivita/modifica-studenti', component: EccezioneModificaStudentiComponent },
          { path: 'eccezioni/create-eccezione/:idAttivita/modifica-competenze', component: EccezioneModificaCompetenzeComponent },
          { path: 'programma', loadChildren: './programma/programma.module#ProgrammaModule' },
          { path: 'guide', component: ProgrammazioneGuideComponent },
          { path: '**', pathMatch: 'full', redirectTo: 'programma' }          
    ]
  }
  
];

@NgModule({
  imports: [ RouterModule.forChild(app_routes) ],
  exports: [ RouterModule ]
})
export class GestioneRoutingModule { }
