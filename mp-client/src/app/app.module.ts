import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { LandingPageModule } from './landing-page/landing-page.module';
import { SharedModule } from './shared/shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GraphQLModule } from './graphql.module';

import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { MatProgressButtonsModule } from 'mat-progress-buttons';
import { AuthService } from "./auth/auth.service";

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    LandingPageModule,
    SharedModule,
    BrowserAnimationsModule,
    GraphQLModule,
    ServiceWorkerModule.register('service-worker.js', { enabled: environment.production }),
    MatProgressButtonsModule,
  ],
  providers: [
    {
      provide: LocationStrategy,
      useClass: HashLocationStrategy,
    },
    AuthService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
