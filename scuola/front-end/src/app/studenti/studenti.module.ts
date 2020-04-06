import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StudentiRoutingModule } from './studenti-routing.module';
import { StudentiComponent } from './studenti.component';
import { StudentiGuideComponent } from './studenti-guide/studenti-guide.component';

@NgModule({
  imports: [
    CommonModule,
    StudentiRoutingModule
  ],
  declarations: [StudentiComponent, StudentiGuideComponent]
})
export class StudentiModule { }
