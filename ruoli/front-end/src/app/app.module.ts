import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppLoadService } from './app-load.service';

export function init_app(appLoadService: AppLoadService) {
  return () => appLoadService.initializeApp();
}


@NgModule({
  providers: [
    AppLoadService,
    { provide: APP_INITIALIZER, useFactory: init_app, deps: [AppLoadService], multi: true }
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,     //Main routes for application
    CoreModule,           //Singleton objects (services, components that are loaded only once, etc.)
    SharedModule,          //Shared (multi-instance) objects
    NgbModule.forRoot()
  ],
  declarations: [AppComponent],
  exports: [AppComponent],
  entryComponents: [

  ],
  bootstrap: [AppComponent]

})
export class AppModule { }