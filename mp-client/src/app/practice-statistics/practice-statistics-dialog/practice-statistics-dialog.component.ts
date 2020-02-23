import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PracticeStatisticDialogService } from "./practice-statistics-dialog.service";
import { MyErrorStateMatcher } from "../../shared/shared-error-state-matcher";

@Component({
    template: ''
})
export class DialogEntryComponent {
    constructor(public dialog: MatDialog, private router: Router,
        private route: ActivatedRoute) {
        this.openDialog();
    }
    openDialog() {
        let dialogRef = this.dialog.open(PracticeStatisticsDialog, {
            minWidth: "33vw",
        });
        dialogRef.afterClosed().subscribe(result => {
            this.router.navigate(['../'], { relativeTo: this.route });
        });
    }
}

@Component({
    selector: "practice-statistics-dialog-overview",
    templateUrl: './practice-statistics-dialog.component.html',
    styleUrls: ['./practice-statistics-dialog.component.scss'],
})
export class PracticeStatisticsDialog implements OnInit {
    constructor(public dialogRef: MatDialogRef<PracticeStatisticsDialog>, @Inject(MAT_DIALOG_DATA) public data, private practiceStatsService: PracticeStatisticDialogService) { }
    dateForm: FormGroup;
    startDate;
    endDate;
    dateLimit = 2;
    matcher = new MyErrorStateMatcher();

    ngOnInit() {
        this.practiceStatsService.dateRange.subscribe(({ startDate, endDate }) => {
            this.startDate = startDate;
            this.endDate = endDate;
            if (!this.dateForm) {
                this.dateForm = new FormGroup({
                    "startDate": new FormControl(new Date(this.startDate), [Validators.required, this.forceValidators.bind(this)]),
                    "endDate": new FormControl(new Date(this.endDate), [Validators.required, this.compareDates.bind(this)]),
                });
            }
        });
    }

    onCancel() {
        this.dialogRef.close();
    }

    forceValidators() {
        if (this.dateForm) {
            this.dateForm.controls['startDate'].valueChanges.subscribe(() => {
                this.dateForm.controls['endDate'].updateValueAndValidity();
            });
        }
    }

    compareDates(control: FormControl): { [s: string]: boolean } {
        if (this.dateForm) {
            const startDate = new Date(this.dateForm.value.startDate).getTime();
            const endDate = new Date(control.value).getTime();
            if (startDate > endDate) {
                return {
                    "dateError": true
                };
            }
            var firstDate = new Date(startDate).getTime();
            var lastDate = new Date(endDate).getTime();
            var differenceInTime = lastDate - firstDate;
            var differenceInDays = differenceInTime / (1000 * 3600 * 24);
            if (differenceInDays < this.dateLimit) {
                return {
                    "dateLimitError": true
                };
            }
            return null;
        }
    }

    onSubmit() {
        var values = { ...this.dateForm.value };
        this.practiceStatsService.setDates(values.startDate, values.endDate);
        this.dialogRef.close();
    }
}