import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MyErrorStateMatcher } from "../shared/shared-error-state-matcher";
import { MatProgressButtonOptions } from 'mat-progress-buttons';
import { take } from "rxjs/operators";

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {
  authForm: FormGroup;
  errMessageSubscription: Subscription;
  matcher = new MyErrorStateMatcher();
  signup: Boolean;
  loggedInSubscription: Subscription;
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

  constructor(private authService: AuthService, private router: Router,
    private _snackBar: MatSnackBar) { }

  ngOnInit() {
    // Checks to see if the user is already authenticated.
    this.loggedInSubscription = this.authService.userDetails
      .pipe(
        take(1),
      )
      .subscribe((userDetails) => {
        if (userDetails) {
          this.router.navigate(['/songs']);
        }
      });

    if (this.router.url === "/signin") {
      this.signup = false;
      this.authForm = new FormGroup({
        "email": new FormControl(null, [Validators.required, Validators.email]),
        "password": new FormControl(null, [Validators.required]),
      });
    } else {
      this.signup = true;
      this.authForm = new FormGroup({
        "email": new FormControl(null, [Validators.required, Validators.email]),
        "password": new FormControl(null, [Validators.required, this.forceValidators.bind(this)]),
        "password2": new FormControl(null, [Validators.required, this.comparePasswords.bind(this)]),
      });
    }
    this.errMessageSubscription = this.authService.authErr
      .subscribe((err: string) => {
        this.openSnackBar(err, "Error");
        this.buttonOptions.active = false;
      });
    this.authForm.valueChanges.subscribe(() => {
      this.buttonOptions.disabled = !this.authForm.valid;
    });
  }

  comparePasswords(control: FormControl): { [s: string]: boolean } {
    if (this.authForm) {
      const password1 = this.authForm.value.password;
      const password2 = control.value;
      if (password1 !== password2) {
        return { "passwordMismatch": true };
      }
      return null;
    }
  }

  forceValidators() {
    if (this.authForm) {
      this.authForm.controls['password'].valueChanges.subscribe(() => {
        this.authForm.controls['password2'].updateValueAndValidity();
      });
    }
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 6000,
    });
  }

  onSubmit() {
    if (this.signup) {
      if (!this.authForm.value.email || !this.authForm.value.password || !this.authForm.value.password2) {
        this.buttonOptions.active = false;
        return;
      }
      this.authService.signUp(this.authForm.value.email, this.authForm.value.password, this.authForm.value.password2)
        .subscribe(({ data }) => {
          if (!data.addUser.status.ok) {
            this.authService.authErr.next(data.addUser.status.errMessage);
          } else {
            localStorage.setItem("jwtToken", data.addUser.token);
            this.authService.resetStore();
            this.authService.userDetails.next({
              id: data.addUser.id,
              email: data.addUser.email,
            });
            this.router.navigate(['/songs']);
          }
        }, (error) => {
          this.openSnackBar(error, "Error");
        });
      this.buttonOptions.active = true;
    } else {
      if (!this.authForm.value.email || !this.authForm.value.password) {
        this.buttonOptions.active = false;
        return;
      }
      this.authService.logIn(this.authForm.value.email, this.authForm.value.password)
      .subscribe(({ data }) => {
        if (!data.authUser.status.ok) {
          this.authService.authErr.next(data.authUser.status.errMessage);
        } else {
          // this.loggedIn.next(true);
          localStorage.setItem("jwtToken", data.authUser.token);
          this.authService.resetStore();
          this.authService.userDetails.next({
            id: data.authUser.id,
            email: data.authUser.email,
          });
          this.router.navigate(['/songs']);
        }
      }, (error) => {
        this.openSnackBar(error, "Error");
      });
      this.buttonOptions.active = true;
    }
  }

}
