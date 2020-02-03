import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SettingsComponent } from './settings.component';
import { AuthGuard } from '../auth/auth.guard';
import { DialogEntryComponent } from './settings-dialog/settings-dialog.component';

const routes: Routes = [
  {
    path: '',
    component: SettingsComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'update-email',
        component: DialogEntryComponent,
      },
      {
        path: 'update-password',
        component: DialogEntryComponent,
      },
      {
        path: 'delete-account',
        component: DialogEntryComponent,
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule { }
