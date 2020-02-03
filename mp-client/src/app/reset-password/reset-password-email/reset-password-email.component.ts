import { Component, OnInit } from '@angular/core';
import { AuthService } from "../../auth/auth.service";
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MyErrorStateMatcher } from "../../shared/shared-error-state-matcher";
import { MatProgressButtonOptions } from 'mat-progress-buttons';

@Component({
  selector: 'app-reset-password-email',
  templateUrl: './reset-password-email.component.html',
  styleUrls: ['./reset-password-email.component.scss']
})
export class ResetPasswordEmailComponent implements OnInit {
  retrievePasswordForm: FormGroup;
  errMessageSubscription: Subscription;
  matcher = new MyErrorStateMatcher();
  loading: boolean = true;
  // isDisabled = false;
  buttonOptions: MatProgressButtonOptions = {
    active: false,
    text: 'Submit',
    spinnerSize: 18,
    flat: true,
    stroked: false,
    buttonColor: 'primary',
    spinnerColor: 'primary',
    fullWidth: false,
    disabled: true,
    mode: 'indeterminate',
  };

  constructor(private authService: AuthService, private _snackBar: MatSnackBar) { }

  ngOnInit() {
    this.retrievePasswordForm = new FormGroup({
      "email": new FormControl(null, [Validators.required, Validators.email]),
    });
    this.retrievePasswordForm.valueChanges.subscribe(() => {
      this.buttonOptions.disabled = !this.retrievePasswordForm.valid;
    });
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 5000,
    });
  }

  configureSnackBarMessage(result) {
    if (result) {
      if (result.success) {
        this.openSnackBar(result.message, "Success");
      } else {
        this.openSnackBar(result.errMessage, "Error");
      }
    } else {
      return;
    }
  }

  onSubmit() {
    var values = { ...this.retrievePasswordForm.value };
    // this.isDisabled = true;
    this.buttonOptions.active = true;
    this.authService.initResetPassword(values.email).subscribe(({ data }) => {
      if (data.initResetPassword.ok) {
        this.buttonOptions.active = false;
        this.buttonOptions.disabled = true;
        this.configureSnackBarMessage({
          success: true,
          message: `A retrieval link has been sent to ${values.email}`
        });
      } else {
        // this.isDisabled = false;
        this.buttonOptions.active = false;
        this.configureSnackBarMessage({
          success: false,
          errMessage: data.initResetPassword.errMessage,
        });
      }
    });
  }
}