import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StudentiListaRoutingModule } from './studenti-lista-routing.module';
import { StudentiListaComponent } from './studenti-lista.component';
import { SharedModule } from '../../shared/shared.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BootstrapSwitchModule } from 'angular2-bootstrap-switch';
import { DpDatePickerModule } from 'ng2-date-picker';
import { SubNavbarModule } from '../../sub-navbar/sub-navbar.module';
import { OpportunitiesModal } from './studente-detail/opportunities-modal/opportunities-modal.component';
import { DiaryModal } from './studente-detail/diary-modal/diary-modal.component';
import { StudenteDetailComponent } from './studente-detail/studente-detail.component';
import { EsperienzaStudenteDetailComponent } from './studente-detail/esperienza-studente-detail/esperienza-studente-detail.component';

@NgModule({
  imports: [
    SharedModule,
    StudentiListaRoutingModule,
    NgbModule.forRoot(),
    BootstrapSwitchModule.forRoot(),
    DpDatePickerModule,
    SubNavbarModule
  ],
  declarations: [StudentiListaComponent, OpportunitiesModal, DiaryModal, StudenteDetailComponent, EsperienzaStudenteDetailComponent],
  entryComponents: [OpportunitiesModal, DiaryModal]
})
export class StudentiListaModule { }
