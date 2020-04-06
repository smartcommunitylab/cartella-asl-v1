import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LocalStorageModule } from '@ngx-pwa/local-storage';

import { ActivitiesMainComponent } from './activities-main.component';
import { ActivitiesComponent } from './tabs/activities.component';
import { ActivityComponent } from './activity/activity.component';
import { ActivityEvalutationComponent } from './valutazione/activity-evaluation.component';
import { ActivityEvalutationEditComponent } from './valutazione/activity-evaluation-edit.component';
import { AttivitaCancellaModal } from './modal/cancella/attivita-cancella-modal.component';
import { ActivitySimpleDiaryComponent } from './diary/activity-simple-diary.component';
import { GuideComponent } from './guida/attivita-guide.component';
// import { IncorsoTabsComponent } from './incorso-tabs/incorso-tabs.component'
import { AttivitaIncorsoIndividualiComponent } from './incorso-individuali/activities-incorso-individuali.component'
import { AttivitaIncorsoGruppiComponent } from './incorso-gruppi/activities-incorso-gruppi.component'
import { ActivityAlternanzaComponent } from './attivitaAlternanza/activityAlternanza.component';
import { NoteAziendaEditModalComponent } from './activity/modals/note-azienda-edit-modal/note-azienda-edit-modal.component';
import { SelectStudentsGruppo } from './select-students-gruppo/select-students.component';
import { SelectStudentsIndividuale } from './select-students-individuale/select-students-individuale.component';
import { AttivitaCompletateComponent} from './completate/activities-completate.component';

const routes: Routes = [];

@NgModule({
    imports: [RouterModule.forChild(routes), LocalStorageModule],
    exports: [RouterModule],
    entryComponents: [NoteAziendaEditModalComponent]
})
export class ActivitiesMainRoutingModule {
    static components = [ActivitiesMainComponent, ActivitiesComponent, ActivityComponent, ActivitySimpleDiaryComponent, ActivityEvalutationComponent, ActivityEvalutationEditComponent,
        GuideComponent, AttivitaCancellaModal, /*IncorsoTabsComponent,*/ AttivitaIncorsoIndividualiComponent, AttivitaIncorsoGruppiComponent, ActivityAlternanzaComponent, NoteAziendaEditModalComponent,
        SelectStudentsGruppo, SelectStudentsIndividuale, AttivitaCompletateComponent
    ];
}