import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SettingsRoutingModule } from './settings-routing.module';
import { SettingsComponent } from "./settings.component";
import { SettingsDialog, DialogEntryComponent } from './settings-dialog/settings-dialog.component';

@NgModule({
  declarations: [
    SettingsComponent,
    SettingsDialog,
    DialogEntryComponent,
  ],
  entryComponents: [
    SettingsDialog,
    DialogEntryComponent,
  ],
  imports: [
    RouterModule,
    SettingsRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class SettingsModule {}
