import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OppurtunityDetailsComponent } from './oppurtunities/details/oppurtunity-details.component';
import { OppurtunitiesGridComponent } from './oppurtunities/list/oppurtunities-grid.component';
import { SkillsSelectorComponent } from './oppurtunities/skills-selector/skills-selector.component';
import { OppurtunityEditComponent } from './oppurtunities/edit/oppurtunity-edit.component';
import { OpportunitaGuideComponent } from './oppurtunities/guida/pianifica-guide.component';
import { ActivitiesComponent } from './activities/tabs/activities.component';
import { ActivityComponent } from './activities/activity/activity.component';
import { ActivityAlternanzaComponent } from './activities/attivitaAlternanza/activityAlternanza.component';
import { AziendaComponent } from './azienda.component';
import { SelectStudentsGruppo } from './activities/select-students-gruppo/select-students.component';
import { SelectStudentsIndividuale } from './activities/select-students-individuale/select-students-individuale.component';
import { AttivitaCompletateComponent } from './activities/completate/activities-completate.component';
import { AziendeComponent } from './aziende/aziende.component';
import { AziendaDettaglio } from './aziende/actions/azienda-dettaglio.component';
import { AziendaModifica } from './aziende/actions/azienda-modifica.component';

const routes: Routes = [
  { path: '', component: AziendaComponent,
    children: [
      { path: '', redirectTo: 'opportunita/list' },
      { path: 'opportunita/list', component: OppurtunitiesGridComponent },
      { path: 'opportunita/list/details/:id', component: OppurtunityDetailsComponent },
      { path: 'opportunita/list/details/:id/skills', component: SkillsSelectorComponent },
      { path: 'opportunita/list/edit/:id', component: OppurtunityEditComponent },

      { path: 'attivita/incorso/individuali', component: ActivitiesComponent },
      { path: 'attivita/incorso/individuali/view/:id', component: ActivityComponent },
      { path: 'attivita/incorso/individuali/viewAA/:id', component: ActivityAlternanzaComponent }, //AA = attivita alternanza
      { path: 'attivita/incorso/individuali/completa/:id', component: SelectStudentsIndividuale },
      { path: 'attivita/incorso/gruppo', component: ActivitiesComponent},
      { path: 'attivita/incorso/gruppo/view/:id', component: ActivityComponent },
      { path: 'attivita/incorso/gruppo/viewAA/:id', component: ActivityAlternanzaComponent }, //AA = attivita alternanza
      { path: 'attivita/incorso/gruppo/completa/:id', component: SelectStudentsGruppo },
      { path: 'attivita/completate', component: AttivitaCompletateComponent },
      { path: 'attivita/completate/viewAA/:id', component: ActivityAlternanzaComponent },

      { path: 'aziende/list', component: AziendeComponent },
      { path: 'aziende/list/details/:id', component: AziendaDettaglio },
      { path: 'aziende/list/edit/:id', component: AziendaModifica },

      { path: 'guida', component: OpportunitaGuideComponent },
    ],
  },
  { path: '**', pathMatch: 'full', redirectTo: 'opportunita/list' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class AziendaRoutingModule {
}