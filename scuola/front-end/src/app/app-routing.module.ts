import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LocalStorageModule } from '@ngx-pwa/local-storage';

const app_routes: Routes = [
  { path: 'home', loadChildren: 'app/home/home.module#HomeModule' },
  { path: 'definizioni', loadChildren: 'app/definizioni/definizioni.module#DefinizioniModule' },
  { path: 'gestione', loadChildren: 'app/gestione/gestione.module#GestioneModule' },
  { path: 'studenti', loadChildren: 'app/studenti/studenti.module#StudentiModule' },
  { path: 'azienda', loadChildren: 'app/azienda/azienda.module#AziendaModule' },
  { path: 'terms/:authorized', loadChildren: 'app/terms/terms.module#TermsModule'},
  { path: '**', pathMatch: 'full', redirectTo: '/home' }
];

@NgModule({
  imports: [RouterModule.forRoot(app_routes, {  useHash: true }), LocalStorageModule],
  exports: [RouterModule]
})
export class AppRoutingModule { }
