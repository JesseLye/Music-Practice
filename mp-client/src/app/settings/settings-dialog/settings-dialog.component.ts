import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MyErrorStateMatcher } from "../../shared/shared-error-state-matcher";
import { AuthService } from "../../auth/auth.service";
import { of } from 'rxjs';
import { tap, exhaustMap } from 'rxjs/operators';
import { MatProgressButtonOptions } from 'mat-progress-buttons';

enum Routes {
    updateEmail = "update-email",
    updatePassword = "update-password",
    deleteAccount = "delete-account",
};

@Component({
    template: ''
})
export class DialogEntryComponent {
    isAuthed = false;
    constructor(public dialog: MatDialog, private router: Router,
        private route: ActivatedRoute, private _snackBar: MatSnackBar) {
        this.route.url.subscribe((url) => {
            this.openDialog(url[0].path);
        });
    }

    openSnackBar(message: string, action: string) {
        this._snackBar.open(message, action, {
            duration: 2000,
        });
    }

    configureSnackBarMessage(result) {
        if (result) {
            if (result.success) {
                if (result.didRemove) {
                    this.openSnackBar(result.message, "Success");
                    this.router.navigate(["/"]);
                } else {
                    this.openSnackBar(result.message, "Success");
                }
            } else {
                this.openSnackBar(result.errMessage, "Error");
            }
        } else {
            return;
        }
    }

    openDialog(url) {
        let authRef;
        let dialogRef;
        authRef = this.dialog.open(SettingsDialog, {
            data: {
                url,
                isAuthed: false,
            },
            minWidth: "33vw",
        });
        authRef.afterClosed()
            .pipe(
                exhaustMap((data) => {
                    if (data && data["success"]) {
                        dialogRef = this.dialog.open(SettingsDialog, {
                            data: {
                                url,
                                isAuthed: true,
                            },
                            minWidth: "33vw",
                        });
                        this.configureSnackBarMessage(data);
                        return dialogRef.afterClosed();
                    } else if (data && !data["success"]) {
                        this.configureSnackBarMessage(data);
                        return of(null);
                    } else {
                        return of(null);
                    }
                }),
                tap(data => {
                    if (data) {
                        this.router.navigate(['../'], { relativeTo: this.route });
                        this.configureSnackBarMessage(data);
                    } else {
                        this.router.navigate(['../'], { relativeTo: this.route });
                    }
                }),
            )
            .subscribe();
    }
}

@Component({
    selector: 'settings-dialog-overview',
    templateUrl: 'settings-dialog.component.html',
    styleUrls: ['./settings-dialog.component.scss'],
})
export class SettingsDialog implements OnInit {
    settingsForm: FormGroup;
    displayForm = {};
    headerText: string;
    matcher = new MyErrorStateMatcher();
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

    constructor(public dialogRef: MatDialogRef<SettingsDialog>, @Inject(MAT_DIALOG_DATA) public data,
        private authService: AuthService) {

        if (this.data.isAuthed) {
            this.displayForm[this.data.url] = true;
            if (this.displayForm[Routes.updateEmail]) {
                this.headerText = "Update Email";
            } else if (this.displayForm[Routes.updatePassword]) {
                this.headerText = "Update Password";
            } else {
                this.headerText = "Delete Account";
            }
        } else {
            this.displayForm["authForm"] = true;
            this.headerText = "Verification Required";
        }
    }

    ngOnInit() {
        if (!this.data.isAuthed) {
            this.settingsForm = new FormGroup({
                "password": new FormControl(null, Validators.required)
            });
        } else if (this.displayForm[Routes.updateEmail]) {
            this.settingsForm = new FormGroup({
                "newEmail": new FormControl(null, [Validators.required, Validators.email, this.forceValidators.bind(this)]),
                "confirmEmail": new FormControl(null, [Validators.required, Validators.email, this.compareStrings.bind(this)]),
            });
        } else if (this.displayForm[Routes.updatePassword]) {
            this.settingsForm = new FormGroup({
                "newPassword": new FormControl(null, [Validators.required, this.forceValidators.bind(this)]),
                "confirmPassword": new FormControl(null, [Validators.required, this.compareStrings.bind(this)]),
            });
        } else {
            this.settingsForm = new FormGroup({});
            this.buttonOptions.disabled = false;
            this.buttonOptions.buttonColor = "warn";
            this.buttonOptions.text = "Delete";
        }
        this.settingsForm.valueChanges.subscribe(() => {
            this.buttonOptions.disabled = !this.settingsForm.valid;
        });
    }

    forceValidators() {
        if (this.settingsForm) {
            if (this.displayForm[Routes.updateEmail]) {
                this.settingsForm.controls['newEmail'].valueChanges.subscribe(() => {
                    this.settingsForm.controls['confirmEmail'].updateValueAndValidity();
                });
            } else {
                this.settingsForm.controls['newPassword'].valueChanges.subscribe(() => {
                    this.settingsForm.controls['confirmPassword'].updateValueAndValidity();
                });
            }
        }
    }

    compareStrings(control: FormControl): { [s: string]: boolean } {
        if (this.settingsForm) {
            if (this.displayForm[Routes.updateEmail]) {
                const newEmail = this.settingsForm.value.newEmail;
                const confirmEmail = control.value;
                if (newEmail !== confirmEmail) {
                    return { "emailMismatch1": true };
                }
                return null;
            } else {
                const newPassword = this.settingsForm.value.newPassword;
                const confirmPassword = control.value;
                if (newPassword !== confirmPassword) {
                    return { "passwordMismatch": true };
                }
            }
        }
    }

    onCancel() {
        this.dialogRef.close();
    }

    onSubmit() {
        this.buttonOptions.active = true;
        if (!this.data.isAuthed) {
            var values = { ...this.settingsForm.value };
            this.authService.securityCheck(values.password).subscribe(({ data }) => {
                if (data.authUser.status.ok) {
                    this.dialogRef.close({
                        success: true,
                        message: `Verification Successful`,
                    });
                } else {
                    this.dialogRef.close({
                        success: false,
                        errMessage: data.authUser.status.errMessage,
                    });
                }
            });
        } else if (this.displayForm[Routes.updateEmail]) {
            var values = { ...this.settingsForm.value };
            this.authService.updateEmail(values.newEmail, values.confirmEmail).subscribe(({ data }) => {
                if (data.updateUser.status.ok) {
                    this.authService.userDetails.next({
                        id: data.updateUser.id,
                        email: data.updateUser.email,
                    });
                    this.dialogRef.close({
                        success: true,
                        message: `Email Address Updated To: ${values.newEmail}`,
                    });
                } else {
                    this.dialogRef.close({
                        success: false,
                        errMessage: data.updateUser.status.errMessage,
                    });
                }
            });
        } else if (this.displayForm[Routes.updatePassword]) {
            var values = { ...this.settingsForm.value };
            this.authService.updatePassword(values.newPassword, values.confirmPassword).subscribe(({ data }) => {
                if (data.updateUser.status.ok) {
                    this.dialogRef.close({
                        success: true,
                        message: `Password Successfully Updated`,
                    });
                } else {
                    this.dialogRef.close({
                        success: false,
                        errMessage: data.updateUser.status.errMessage,
                    });
                }
            });
        } else if (this.displayForm[Routes.deleteAccount]) {
            this.authService.removeUser().subscribe(({ data }) => {
                if (data.removeUser.ok) {
                    this.authService.setLoggedOut();
                    this.dialogRef.close({
                        success: true,
                        message: "Account Successfully Removed",
                        didRemove: true,
                    });
                } else {
                    this.dialogRef.close({
                        success: false,
                        errMessage: "Failure to Remove Account",
                        didRemove: false,
                    });
                }
            });
        }
    }
}