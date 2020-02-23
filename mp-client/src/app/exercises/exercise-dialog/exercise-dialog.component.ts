import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Subscription } from 'rxjs';
import { ExerciseService } from '../exercise.service';
import { tap, switchMap } from 'rxjs/operators';
import { MatProgressButtonOptions } from 'mat-progress-buttons';

enum Routes {
  add = "add",
  edit = "edit",
  delete = "delete",
  addSection = "add-section",
  editSection = "edit-section",
  deleteSection = "delete-section",
};

@Component({
  template: ''
})
export class DialogEntryComponent {
  paramOperation: string;

  constructor(public dialog: MatDialog, private router: Router,
    private route: ActivatedRoute, private _snackBar: MatSnackBar) {
      this.route.url.pipe(
        switchMap(url => {
          this.paramOperation = url[0].path;
          return this.route.params;
        }),
        tap(params => {
          if (params['exercise_id']) {
            this.openDialog(params['exercise_id']);
          } else if (params['section_id']) {
            this.openDialog(params['section_id']);
          } else {
            this.openDialog(false);
          }
        })
      ).subscribe();
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

  openDialog(id) {
    const hasId = id ? true : false;
    let route = this.paramOperation;
    let dialogRef;
    if (route === Routes.addSection || route === Routes.editSection || route === Routes.deleteSection) {
      dialogRef = this.dialog.open(SectionDialog, {
        data: {
          route,
          id: hasId ? id : false,
        },
        minWidth: "33vw",
      });
    } else {
      dialogRef = this.dialog.open(ExerciseDialog, {
        data: {
          route,
          id: hasId ? id : false,
        },
        minWidth: "33vw",
      });
    }
    dialogRef.afterClosed().subscribe(result => {
      if (hasId) {
        this.router.navigate(['../../'], { relativeTo: this.route });
        this.configureSnackBarMessage(result);
      } else {
        this.router.navigate(['../'], { relativeTo: this.route });
        this.configureSnackBarMessage(result);
      }
    });
  }
}

@Component({
  selector: 'exercise-dialog-overview',
  templateUrl: 'exercise-dialog.html',
  styleUrls: ['./exercise-dialog.component.scss'],
})
export class ExerciseDialog implements OnInit {
  submitExerciseForm: FormGroup;
  createUpdateExercise: Boolean = false;
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

  constructor(public dialogRef: MatDialogRef<ExerciseDialog>, @Inject(MAT_DIALOG_DATA) public data, private exerciseService: ExerciseService,
    private fb: FormBuilder) { }

  ngOnInit() {
    this.data.displayRoute = this.data.route[0].toUpperCase() + this.data.route.slice(1);
    if (this.data.route === Routes.add) {
      this.createUpdateExercise = true;
      this.submitExerciseForm = this.fb.group({
        exerciseName: ['', Validators.required]
      });
    } else if (this.data.route === Routes.edit) {
      this.createUpdateExercise = true;
      let getExercise = this.exerciseService.retrieveItem(this.data.id);
      this.submitExerciseForm = this.fb.group({
        exerciseName: ['', Validators.required]
      });
      this.submitExerciseForm.reset();
      this.submitExerciseForm.patchValue({
        exerciseName: getExercise.exerciseName,
      });
      this.buttonOptions.disabled = false;
    } else {
      this.submitExerciseForm = this.fb.group({});
      this.buttonOptions.disabled = false;
      this.buttonOptions.buttonColor = "warn";
      this.buttonOptions.text = "Delete";
    }
    this.submitExerciseForm.valueChanges.subscribe(() => {
      this.buttonOptions.disabled = !this.submitExerciseForm.valid;
    });
  }

  onCancel() {
    this.dialogRef.close();
  }

  onSubmit() {
    var values = { ...this.submitExerciseForm.value };
    this.buttonOptions.active = true;
    if (this.data.route === Routes.add) {
      this.exerciseService.addNewExercise(values.exerciseName)
        .subscribe(({ data }) => {
          if (data.addExercise.status.ok) {
            this.dialogRef.close({
              success: true,
              message: "Exercise Submitted",
            });
            const newExercise = {
              id: data.addExercise.id,
              exerciseName: data.addExercise.exerciseName,
              exerciseSections: []
            };
            this.exerciseService.addNewExerciseToArray(newExercise);
          } else {
            this.dialogRef.close({
              success: false,
              message: data.addExercise.status.errMessage,
            });
          }
        });
    } else if (this.data.route === Routes.edit) {
      this.exerciseService.updateExercise(values, this.data.id)
        .subscribe(({ data }) => {
          if (data.updateExercise.ok) {
            this.dialogRef.close({
              success: true,
              message: "Exercise Edited",
            });
            var updatedExercise = {
              id: this.data.id,
            };
            for (let key in values) {
              updatedExercise[key] = values[key];
            }
            this.exerciseService.updateExerciseWithinArray(updatedExercise);
          } else {
            this.dialogRef.close({
              success: false,
              message: data.updateExercise.errMessage,
            });
          }
        });
    } else if (this.data.route === Routes.delete) {
      this.exerciseService.removeExercise(this.data.id)
        .subscribe(({ data }) => {
          if (data.removeExercise.ok) {
            this.dialogRef.close({
              success: true,
              message: "Exercise Removed",
            });
            this.exerciseService.deleteExerciseFromArray(this.data.id);
            this.buttonOptions.buttonColor = "warn";
            this.buttonOptions.text = "Delete";
          } else {
            this.dialogRef.close({
              success: false,
              message: data.removeExercise.errMessage,
            });
          }
        });
    }
  }
}

@Component({
  selector: 'section-dialog-overview',
  templateUrl: 'section-dialog.html',
  styleUrls: ['./exercise-dialog.component.scss'],
})
export class SectionDialog {
  sectionForm: FormGroup;
  createUpdateSection: Boolean = false;
  updateSection: Boolean = false;
  titleText: String = "Invalid Section Route";
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
  private selectedExerciseSubscription: Subscription;
  private selectedExercise;

  constructor(public dialogRef: MatDialogRef<SectionDialog>, @Inject(MAT_DIALOG_DATA) public data, private fb: FormBuilder,
    private exerciseService: ExerciseService) {
    this.selectedExerciseSubscription = this.exerciseService.selectedExercise.subscribe(exercise => {
      this.selectedExercise = exercise;
    });
    this.createForm();
  }

  createForm() {
    if (this.data.route === Routes.addSection) {
      this.createUpdateSection = true;
      this.titleText = "Add Section";
      this.sectionForm = this.fb.group({
        sections: this.fb.array([]),
      });
      var newSection = new Section("", "");
      this.sections.push(this.fb.group(newSection.buildObject()));
    } else if (this.data.route === Routes.editSection) {
      this.createUpdateSection = true;
      this.updateSection = true;
      this.titleText = "Edit Section";
      var getSection = this.exerciseService.getSection(this.data.id);
      var newSection = new Section(getSection['sectionName'], getSection['targetBPM']);
      var sections = this.fb.array([
        this.fb.group(newSection.buildObject())
      ]);
      this.sectionForm = this.fb.group({
        sections,
      });
      this.buttonOptions.disabled = false;
    } else if (this.data.route === Routes.deleteSection) {
      this.titleText = "Delete Section";
      this.sectionForm = this.fb.group({});
      this.buttonOptions.disabled = false;
      this.buttonOptions.buttonColor = "warn";
      this.buttonOptions.text = "Delete";
    }
    this.sectionForm.valueChanges.subscribe(() => {
      this.buttonOptions.disabled = !this.sectionForm.valid;
    });
  }

  onCancel() {
    this.dialogRef.close(false);
  }

  removeSection(index) {
    this.sections.removeAt(index);
  }

  get sections(): FormArray {
    return this.sectionForm.get('sections') as FormArray;
  };

  addSection() {
    var newSection = new Section("", "");
    this.sections.push(this.fb.group(newSection.buildObject()));
  }

  onSubmit() {
    this.buttonOptions.active = true;
    if (this.data.route === Routes.addSection) {
      var values = { ...this.sectionForm.value };
      var exerciseId = this.data.id;
      this.exerciseService.addSections(values.sections, exerciseId)
        .subscribe((response) => {
          if (response.data.addSections.status.ok) {
            this.exerciseService.addSectionToExercises(response.data.addSections, exerciseId);
            this.dialogRef.close({
              success: true,
              message: "Section Submitted"
            });
          } else {
            this.dialogRef.close({
              success: false,
              message: response.data.addSections.status.errMessage,
            });
          }
        });
    } else if (this.data.route === Routes.editSection) {
      var sectionId = this.data.id;
      var value = this.sectionForm.value.sections[0];
      this.exerciseService.updateSection(value, sectionId).subscribe((response) => {
        if (response.data.updateSection.ok) {
          this.exerciseService.updateSectionInExercises(this.selectedExercise, sectionId, value);
          this.dialogRef.close({
            success: true,
            message: "Section Edited",
          });
        } else {
          this.dialogRef.close({
            success: false,
            message: response.data.updateSection.errMessage,
          });
      }
    });
      // this.exerciseService.selectedExercise.pipe(
      //   switchMap((d) => {
      //     selectedExercise = {...d};
      //     return this.exerciseService.updateSection(value, sectionId);
      //   })
      // ).subscribe((response) => {
        // if (response.data.updateSection.ok) {
        //   this.exerciseService.updateSectionInExercises(selectedExercise, sectionId, value);
        //   this.dialogRef.close({
        //     success: true,
        //     message: "Section Edited",
        //   });
        // } else {
        //   this.dialogRef.close({
        //     success: false,
        //     message: response.data.updateSection.errMessage,
        //   });
      //   }
      // });
    } else if (this.data.route === Routes.deleteSection) {
      var sectionId = this.data.id;
      this.exerciseService.removeSection(sectionId)
        .subscribe((response) => {
          this.exerciseService.removeSectionFromExercises(sectionId);
          if (response.data.removeSection.ok) {
            this.dialogRef.close({
              success: true,
              message: "Section Removed",
            });
          } else {
            this.dialogRef.close({
              success: false,
              message: response.data.removeSection.errMessage,
            });
          }
        });
    }
  }
}


export class Section {
  sectionName: string;
  targetBPM: string;

  constructor(sectionName, targetBPM) {
    this.sectionName = sectionName;
    this.targetBPM = targetBPM;
  }

  buildObject() {
    return {
      sectionName: [this.sectionName, Validators.required],
      targetBPM: [this.targetBPM, [Validators.required, Validators.min(1), Validators.max(160)]]
    }
  }
}