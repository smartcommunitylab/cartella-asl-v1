import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StudentiComponent } from './studenti.component';
import { StudentiGuideComponent } from './studenti-guide/studenti-guide.component';

const routes: Routes = [
  { path: '', component: StudentiComponent,
    children: [
      { path: 'lista', loadChildren: './studenti-lista/studenti-lista.module#StudentiListaModule' },
      { path: 'guide', component: StudentiGuideComponent},
      { path: '**', pathMatch:'full', redirectTo: 'lista' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudentiRoutingModule { }
