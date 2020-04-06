import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ProgrammaComponent } from './programma.component';
import { ProgrammaContainerComponent } from './programma-container.component';
import { ProgrammaDettaglioComponent } from './programma-dettaglio/programma-dettaglio.component';
import { ClasseDettaglioComponent } from './classe-dettaglio/classe-dettaglio.component';
import { StudenteDettaglioComponent } from './studente-dettaglio/studente-dettaglio.component';
import { SearchAttivitaContainer } from './actions/search-attivita/search-attivita-container.component';
import { RicercaModificaCompetenzeComponent } from '../../search-attivita/ricerca-modifica-competenze/ricerca-modifica-competenze.component';
import { GruppoModificaAttivitaAlt } from './actions/modifica-gruppo-attivita-alt/gruppo-aa-modifica.component';
import { GruppoDettaglioAttivitaAlt } from './actions/dettaglio-gruppo-attivita-alt/gruppo-aa-dettaglio.component';
import { GruppoGestioneAttivitaAlt } from './actions/gestione-gruppo-attivita-alt/gruppo-aa-gestione.component';
import { AttivitaGruppoCompetenze } from './actions/gruppo-alt-modifica-competenza/attivita-gruppo-competenze.component';
import { StudenteModificaAttivitaAlt } from './actions/modifica-studente-attivita-alt/studente-aa-modifica.component';

const routes: Routes = [
  { path: '', component: ProgrammaContainerComponent,
    children: [
      { path: 'incorso', component: ProgrammaComponent },
      { path: 'archivio', component: ProgrammaComponent},
      { path: 'detail/:id', component: ProgrammaDettaglioComponent},
      { path: 'detail/:id/classe/detail/:classeNome', component: ClasseDettaglioComponent},
      { path: 'detail/:id/classe/detail/:classeNome/search/:annoCorso', component: SearchAttivitaContainer},
      { path: 'detail/:id/classe/detail/:classeNome/search/:annoCorso/modificacompetenze', component: RicercaModificaCompetenzeComponent},
      { path: 'detail/:id/studente/detail/:studenteId', component: StudenteDettaglioComponent},
      { path: 'detail/:id/studente/detail/:studenteId/search/:annoCorso', component: SearchAttivitaContainer},
      { path: 'detail/:id/studente/detail/:studenteId/search/:annoCorso/modificacompetenze', component: RicercaModificaCompetenzeComponent },
      { path: 'detail/:id/classe/search/:annoCorso/:classeNome', component: SearchAttivitaContainer },
      { path: 'detail/:id/modifica/gruppoAttivita/:id', component: GruppoModificaAttivitaAlt },
      { path: 'detail/:id/detail/gruppoAttivita/:id', component: GruppoDettaglioAttivitaAlt },
      { path: 'detail/:id/detail/gruppoAttivita/:id/skills', component: AttivitaGruppoCompetenze },
      { path: 'detail/:id/gestione/gruppoAttivita/:id', component: GruppoGestioneAttivitaAlt },
      { path: 'detail/:id/studente/detail/:studenteId/modifica/studenteAttivita/:id', component: StudenteModificaAttivitaAlt },
      { path: '**', pathMatch:'full', redirectTo: 'incorso' }
      
    ]
  }
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class ProgrammaRoutingModule { 
  static components = [ ProgrammaComponent, ProgrammaContainerComponent];
}


