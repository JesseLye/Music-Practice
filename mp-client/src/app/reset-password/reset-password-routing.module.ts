import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ResetPasswordComponent } from './reset-password.component';
import { ResetPasswordEmailComponent } from './reset-password-email/reset-password-email.component';
import { ResetPasswordFormComponent } from "./reset-password-form/reset-password-form.component";

const routes: Routes = [
  {
    path: '',
    component: ResetPasswordComponent,
    children: [
      {
        path: '',
        component: ResetPasswordEmailComponent,
        pathMatch: 'full',
      },
      {
        path: ':id',
        component: ResetPasswordFormComponent,
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ResetPasswordRoutingModule { }
