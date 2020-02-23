import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

import { SongService } from '../song.service';
import { Subscription } from 'rxjs';
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
        if (params['song_id']) {
          this.openDialog(params['song_id']);
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
      dialogRef = this.dialog.open(SongDialog, {
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
  selector: 'song-dialog-overview',
  templateUrl: 'song-dialog.html',
  styleUrls: ['./song-dialog.component.scss'],
})
export class SongDialog implements OnInit {
  submitSongForm: FormGroup;
  createUpdateSong: Boolean = false;
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

  constructor(public dialogRef: MatDialogRef<SongDialog>, @Inject(MAT_DIALOG_DATA) public data, private songService: SongService,
    private fb: FormBuilder) { }

  ngOnInit() {
    this.data.displayRoute = this.data.route[0].toUpperCase() + this.data.route.slice(1);
    if (this.data.route === Routes.add) {
      this.createUpdateSong = true;
      this.submitSongForm = this.fb.group({
        artistName: ['', Validators.required],
        songName: ['', Validators.required]
      });
    } else if (this.data.route === Routes.edit) {
      this.createUpdateSong = true;
      let getSong = this.songService.retrieveItem(this.data.id);
      this.submitSongForm = this.fb.group({
        artistName: ['', Validators.required],
        songName: ['', Validators.required]
      });
      this.submitSongForm.reset();
      this.submitSongForm.patchValue({
        artistName: getSong.artistName,
        songName: getSong.songName,
      });
      this.buttonOptions.disabled = false;
    } else {
      this.submitSongForm = this.fb.group({});
      this.buttonOptions.disabled = false;
      this.buttonOptions.buttonColor = "warn";
      this.buttonOptions.text = "Delete";
    }
    this.submitSongForm.valueChanges.subscribe(() => {
      this.buttonOptions.disabled = !this.submitSongForm.valid;
    });
  }

  onCancel() {
    this.dialogRef.close();
  }

  onSubmit() {
    var values = { ...this.submitSongForm.value };
    this.buttonOptions.active = true;
    if (this.data.route === Routes.add) {
      this.songService.addNewSong(values.artistName, values.songName)
        .subscribe(({ data }) => {
          if (data.addSong.status.ok) {
            this.dialogRef.close({
              success: true,
              message: "Song Submitted",
            });
            const newSong = {
              id: data.addSong.id,
              songName: data.addSong.songName,
              artistName: data.addSong.artistName,
              songSections: []
            };
            this.songService.addNewSongToArray(newSong);
          } else {
            this.dialogRef.close({
              success: false,
              errMessage: data.addSong.status.errMessage,
            });
          }
        });
    } else if (this.data.route === Routes.edit) {
      this.songService.updateSong(values, this.data.id)
        .subscribe(({ data }) => {
          if (data.updateSong.ok) {
            this.dialogRef.close({
              success: true,
              message: "Song Edited",
            });
            var updatedSong = {
              id: this.data.id,
            };
            for (let key in values) {
              updatedSong[key] = values[key];
            }
            this.songService.updateSongWithinArray(updatedSong);
          } else {
            this.dialogRef.close({
              success: false,
              errMessage: data.updateSong.errMessage,
            });
          }
        });
    } else if (this.data.route === Routes.delete) {
      this.songService.deleteSong(this.data.id)
        .subscribe(({ data }) => {
          if (data.removeSong.ok) {
            this.dialogRef.close({
              success: true,
              message: "Song Removed",
            });
            this.songService.deleteSongFromArray(this.data.id);
          } else {
            this.dialogRef.close({
              success: false,
              errMessage: data.removeSong.errMessage,
            });
          }
        });
    }
  }
}

@Component({
  selector: 'section-dialog-overview',
  templateUrl: 'section-dialog.html',
  styleUrls: ['./song-dialog.component.scss'],
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
  private selectedSongSubscription: Subscription;
  private selectedSong;

  constructor(public dialogRef: MatDialogRef<SectionDialog>, @Inject(MAT_DIALOG_DATA) public data, private fb: FormBuilder,
    private songService: SongService) {
    this.createForm();
    this.selectedSongSubscription = this.songService.selectedSong.subscribe(song => {
      this.selectedSong = song;
    });
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
      var getSection = this.songService.getSection(this.data.id);
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
      var songId = this.data.id;
      this.songService.addSections(values.sections, songId)
        .subscribe((response) => {
          if (response.data.addSections.status.ok) {
            this.songService.addSectionToSongs(response.data.addSections, songId);
            this.dialogRef.close({
              success: true,
              message: "Section Submitted"
            });
          } else {
            this.dialogRef.close({
              success: false,
              errMessage: response.data.addSections.status.errMessage,
            });
          }
        });
    } else if (this.data.route === Routes.editSection) {
      var sectionId = this.data.id;
      var value = this.sectionForm.value.sections[0];
      this.songService.updateSection(value, sectionId).subscribe((response) => {
        if (response.data.updateSection.ok) {
          this.songService.updateSectionInSongs(this.selectedSong, sectionId, value);
          this.dialogRef.close({
            success: true,
            message: "Section Edited",
          });
        } else {
          this.dialogRef.close({
            success: false,
            errMessage: response.data.updateSection.errMessage,
          });
        }
      })
    } else if (this.data.route === Routes.deleteSection) {
      var sectionId = this.data.id;
      this.songService.removeSection(sectionId)
        .subscribe((response) => {
          if (response.data.removeSection.ok) {
            this.songService.removeSectionFromSongs(sectionId);
            this.dialogRef.close({
              success: true,
              message: "Section Removed",
            });
          } else {
            this.dialogRef.close({
              success: false,
              errMessage: response.data.removeSection.errMessage,
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