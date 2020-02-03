import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ResetPasswordComponent } from "./reset-password.component";
import { ResetPasswordEmailComponent } from "./reset-password-email/reset-password-email.component";
import { ResetPasswordFormComponent } from "./reset-password-form/reset-password-form.component";
import { ResetPasswordRoutingModule } from './reset-password-routing.module';

@NgModule({
  declarations: [
    ResetPasswordComponent,
    ResetPasswordEmailComponent,
    ResetPasswordFormComponent,
  ],
  imports: [
    RouterModule,
    SharedModule,
    FormsModule,
    ResetPasswordRoutingModule,
    ReactiveFormsModule,
  ],
})
export class ResetPasswordModule {}
