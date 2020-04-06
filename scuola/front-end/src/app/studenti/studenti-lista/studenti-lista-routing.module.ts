import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StudentiListaComponent } from './studenti-lista.component';
import { StudenteDetailComponent } from './studente-detail/studente-detail.component';
import { EsperienzaStudenteDetailComponent } from './studente-detail/esperienza-studente-detail/esperienza-studente-detail.component';

const routes: Routes = [
  { path: '', component: StudentiListaComponent },
  { path: ':id', component: StudenteDetailComponent },
  { path: ':idStudente/:idEsperienza', component: EsperienzaStudenteDetailComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudentiListaRoutingModule { }
