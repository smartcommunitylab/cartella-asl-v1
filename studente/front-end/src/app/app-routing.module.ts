import { NgModule } from '@angular/core';
import { RouterModule, Routes, PreloadAllModules, NoPreloading } from '@angular/router';
import { AttivitaComponent } from './attivita/attivita.component';
import { PreloadModulesStrategy } from './core/strategies/preload-modules.strategy';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';

const app_routes: Routes = [
  { path: 'home', loadChildren: 'app/home/home.module#HomeModule' },
  { path: 'attivita', loadChildren: 'app/attivita/attivita.module#AttivitaModule' },
  { path: 'terms/:authorized', loadChildren: 'app/terms/terms.module#TermsModule'},
  { path: '**', pathMatch: 'full', redirectTo: '/home' }
];

@NgModule({
  imports: [RouterModule.forRoot(app_routes, { useHash: true, preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
