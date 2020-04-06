import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CorsiComponent } from './corsi.component';
import { CorsoPresenzeComponent } from './corso-presenze/corso-presenze.component';
import { SelectStudent } from './select-students/select-students.component';

const routes: Routes = [
  { path: 'incorso', component: CorsiComponent },
  { path: 'archivio', component: CorsiComponent },
  { path: 'incorso/presenze/:id', component: CorsoPresenzeComponent },
  { path: 'archivio/presenze/:id', component: CorsoPresenzeComponent },
  { path: 'incorso/completa/:id', component: SelectStudent },
  { path: '**', pathMatch:'full', redirectTo: 'incorso' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CorsiRoutingModule { }
