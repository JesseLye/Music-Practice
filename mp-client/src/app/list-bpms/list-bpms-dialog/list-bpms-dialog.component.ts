import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ListBpmsDialogService } from "./list-bpms-dialog.service";
import { Apollo } from 'apollo-angular';
import { removeBpm } from "../../shared/shared.queries";
import { RemoveBpm } from "../../shared/shared-response.model";
import { allUserSongs } from "../../songs/song.queries";
import { allUserExercises } from "../../exercises/exercise.queries";
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressButtonOptions } from 'mat-progress-buttons';

export interface BpmChart {
    position: number
    bpm: number;
    createdAt: String;
}

@Component({
    template: ''
})
export class DialogEntryComponent {
    bpmOperation: string;
    constructor(public dialog: MatDialog, private router: Router,
        private route: ActivatedRoute, private _snackBar: MatSnackBar) {
        this.openDialog();
    }
    openDialog() {
        let dialogRef = this.dialog.open(ListBpmsDialog, {
            minWidth: "25vw",
        });
        dialogRef.afterClosed().subscribe(result => {
            this.router.navigate(['../'], { relativeTo: this.route });
            this.configureSnackBarMessage(result);
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
                this.openSnackBar(result.message, "Success");
            } else {
                this.openSnackBar(result.errMessage, "Error");
            }
        } else {
            return;
        }
    }
}

@Component({
    selector: "list-bpms-dialog-overview",
    templateUrl: './list-bpms-dialog.component.html',
    styleUrls: ['./list-bpms-dialog.component.scss'],
})
export class ListBpmsDialog implements OnInit {
    bpmAmount: number;
    bpmArr: BpmChart[];
    bpmServiceType: String;
    bpmSectionId: String;
    buttonOptions: MatProgressButtonOptions = {
        active: false,
        text: 'Delete',
        spinnerSize: 18,
        flat: true,
        stroked: false,
        buttonColor: 'warn',
        spinnerColor: 'primary',
        fullWidth: false,
        disabled: false,
        mode: 'indeterminate',
    };

    constructor(public dialogRef: MatDialogRef<ListBpmsDialog>, @Inject(MAT_DIALOG_DATA) public data,
        private listBpmsDialogService: ListBpmsDialogService, private apollo: Apollo) { }

    ngOnInit() {
        this.listBpmsDialogService.bpmDetails.subscribe((value) => {
            if (value) {
                this.bpmAmount = value.bpmArray.length;
                this.bpmArr = [...value.bpmArray];
                this.bpmServiceType = value.serviceType;
                this.bpmSectionId = value.sectionId;
            } else {
                // Hack to get around "ExpressionChangedAfterItHasBeenCheckedError"
                const func = () => new Promise((resolve, reject) => resolve(this.onCancel()))
                setTimeout(func, 0);
            }
        });
    }

    onCancel() {
        this.dialogRef.close();
    }

    onSubmit() {
        this.buttonOptions.active = true;
        if (this.bpmServiceType === "song") {
            this.apollo.mutate<RemoveBpm>({
                mutation: removeBpm,
                variables: {
                    bpms: this.bpmArr,
                    sectionId: this.bpmSectionId,
                    isSong: true,
                },
                refetchQueries: [{
                    query: allUserSongs,
                }]
            }).subscribe(({ data }) => {
                if (data.removeBpm.ok) {
                    this.listBpmsDialogService.didUpdate.next(true);
                    this.dialogRef.close({
                        success: true,
                        message: `${this.bpmAmount} bpms removed`,
                    });
                } else {
                    this.listBpmsDialogService.didUpdate.next(false);
                    this.dialogRef.close({
                        success: false,
                        errMessage: data.removeBpm.errMessage,
                    });
                }
            });
        } else {
            this.apollo.mutate<RemoveBpm>({
                mutation: removeBpm,
                variables: {
                    bpms: this.bpmArr,
                    sectionId: this.bpmSectionId,
                    isSong: false,
                },
                refetchQueries: [{
                    query: allUserExercises,
                }]
            }).subscribe(({ data }) => {
                if (data.removeBpm.ok) {
                    this.listBpmsDialogService.didUpdate.next(true);
                    this.dialogRef.close({
                        success: true,
                        message: `${this.bpmAmount} bpms removed`,
                    });
                } else {
                    this.listBpmsDialogService.didUpdate.next(false);
                    this.dialogRef.close({
                        success: false,
                        errMessage: data.removeBpm.errMessage,
                    });
                }
            });
        }
    }

}