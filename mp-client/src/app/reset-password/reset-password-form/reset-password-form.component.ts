import { Component, OnInit } from '@angular/core';
import { AuthService } from "../../auth/auth.service";
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';
import { tap, switchMap } from 'rxjs/operators';
import { MyErrorStateMatcher } from "../../shared/shared-error-state-matcher";
import { MatProgressButtonOptions } from 'mat-progress-buttons';

@Component({
  selector: 'app-reset-password-form',
  templateUrl: './reset-password-form.component.html',
  styleUrls: ['./reset-password-form.component.scss']
})
export class ResetPasswordFormComponent implements OnInit {
  resetPasswordForm: FormGroup;
  loading: boolean = true;
  errMessageSubscription: Subscription;
  matcher = new MyErrorStateMatcher();
  redisKey: String;
  // isDisabled: boolean = false;
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

  constructor(private authService: AuthService, private _snackBar: MatSnackBar,
    private router: Router, private route: ActivatedRoute) {
    this.route.params.pipe(
      switchMap(params => {
        this.redisKey = params['id'];
        return this.authService.checkResetPassword(this.redisKey);
      }),
      tap(responseData => {
        if (!responseData.data["checkResetPassword"].ok) {
          this.router.navigate(['/']);
        }
      })
    ).subscribe();
  }

  ngOnInit() {
    this.resetPasswordForm = new FormGroup({
      "newPassword": new FormControl(null, [Validators.required, this.forceValidators.bind(this)]),
      "confirmPassword": new FormControl(null, [Validators.required, this.compareStrings.bind(this)]),
    });
    this.resetPasswordForm.valueChanges.subscribe(() => {
      this.buttonOptions.disabled = !this.resetPasswordForm.valid;
    });
  }

  forceValidators() {
    if (this.resetPasswordForm) {
      this.resetPasswordForm.controls['newPassword'].valueChanges.subscribe(() => {
        this.resetPasswordForm.controls['confirmPassword'].updateValueAndValidity();
      });
    }
  }

  compareStrings(control: FormControl): { [s: string]: boolean } {
    if (this.resetPasswordForm) {
      const newPassword = this.resetPasswordForm.value.newPassword;
      const confirmPassword = control.value;
      if (newPassword !== confirmPassword) {
        return { "passwordMismatch": true };
      }
    }
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
    var values = { ...this.resetPasswordForm.value };
    this.buttonOptions.active = true;
    this.authService.performResetPassword(values.newPassword, values.confirmPassword, this.redisKey).subscribe(({ data }) => {
      if (data["performResetPassword"].ok) {
        this.buttonOptions.disabled = true;
        this.buttonOptions.active = false;
        this.configureSnackBarMessage({
          success: true,
          message: "Password successfully updated",
        });
      } else {
        this.configureSnackBarMessage({
          success: false,
          errMessage: data["performResetPassword"].errMessage,
        });
        this.buttonOptions.active = false;
      }
    });
  }
}