import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap/modal/modal-ref';
import { CorsiComponent } from './corsi.component';
import { CorsiRoutingModule } from './corsi-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BootstrapSwitchModule } from 'angular2-bootstrap-switch';
import { SubNavbarModule } from '../../sub-navbar/sub-navbar.module';
import { ArchiviaCorsoModalComponent } from './modals/archivia-corso-modal/archivia-corso-modal.component';
import { CorsoPresenzeComponent } from './corso-presenze/corso-presenze.component';
import { DpDatePickerModule } from 'ng2-date-picker';
import { NewDayPresenzeModalComponent } from './corso-presenze/new-day-presenze-modal/new-day-presenze-modal.component';
import { SelectStudent } from './select-students/select-students.component';

@NgModule({
  imports:      [
    SharedModule,
    CorsiRoutingModule,
    NgbModule.forRoot(),
    BootstrapSwitchModule.forRoot(),
    DpDatePickerModule,
    SubNavbarModule,
  ],
  providers: [
    NgbActiveModal,
  ],
  entryComponents: [
    ArchiviaCorsoModalComponent, NewDayPresenzeModalComponent
  ],
  declarations: [CorsiComponent, ArchiviaCorsoModalComponent, CorsoPresenzeComponent, NewDayPresenzeModalComponent, SelectStudent]
})
export class CorsiModule { }

