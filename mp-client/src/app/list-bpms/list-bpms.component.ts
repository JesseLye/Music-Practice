import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { SongService } from '../songs/song.service';
import { ExerciseService } from '../exercises/exercise.service';
import { ListBpmsDialogService } from "./list-bpms-dialog/list-bpms-dialog.service";
import { of } from 'rxjs';
import { take, tap, exhaustMap, switchMap, mergeMap } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

export interface BpmChart {
  id: string;
  position: number;
  bpm: number;
  createdAt: String;
}

@Component({
  selector: 'app-list-bpms',
  templateUrl: './list-bpms.component.html',
  styleUrls: ['./list-bpms.component.scss']
})
export class ListBpmsComponent implements OnInit {
  loading = true;
  displayedColumns: string[] = ['select', 'position', 'bpm', 'createdAt'];
  dataSource: MatTableDataSource<BpmChart>;
  selection = new SelectionModel<BpmChart>(true, []);
  serviceType: string;
  typeSections: string;
  serviceId: string;
  sectionId: string;
  sectionIndex: number;
  unfilteredData;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(private router: Router, private route: ActivatedRoute,
    private songService: SongService, private exerciseService: ExerciseService,
    private listBpmsDialogService: ListBpmsDialogService, private _snackBar: MatSnackBar) {
    this.route.url.pipe(
      switchMap(url => {
        this.serviceType = url[0].path;
        return this.route.params;
      }),
      tap(params => {
        this.serviceId = params['song_id'] ? params['song_id'] : params['exercise_id'];
        this.sectionId = params['section_id'];
      })
    ).subscribe();

    if (this.serviceType === "song") {
      this.songService.selectedSong.pipe(
        exhaustMap((d) => of(d).pipe(take(1)))
      ).subscribe((d) => {
        if (d !== null && d !== undefined) {
          this.unfilteredData = { ...d };
        }
      });
    } else {
      this.exerciseService.selectedExercise.pipe(
        exhaustMap((d) => of(d).pipe(take(1)))
      ).subscribe((d) => {
        if (d !== null && d !== undefined) {
          this.unfilteredData = { ...d };
        }
      });
    }

    this.listBpmsDialogService.bpmDetails.pipe(
      mergeMap((val) => this.listBpmsDialogService.didUpdate, (bpmDialog, didUpdate) => {
        if (bpmDialog) {
          return {
            ...bpmDialog,
            didUpdate,
          }
        }
      })
    ).subscribe((d) => {
      if (d && d.didUpdate) {
        var newData = {...this.unfilteredData};
        let findTypeSections = `${this.serviceType}Sections`;
        var bpmIds = d.bpmArray.map(d => d["bpmId"]);
        let filterData = newData[findTypeSections][this.sectionIndex].sectionBpms.filter(function(e) {
          return this.indexOf(e.id) < 0;
        }, bpmIds);
        newData[findTypeSections][this.sectionIndex].sectionBpms = [...filterData];
        this.unfilteredData = {...newData};
        this.exerciseService.selectedExercise.next({...this.unfilteredData});
        this.selection.clear();
        this.buildBpmTable(newData, this.serviceType, true);
      }
    });
  }

  ngOnInit() {
    if (this.serviceType === "song") {
      this.typeSections = "songSections";
      if (this.unfilteredData && this.unfilteredData.id === this.serviceId) {
        let checkIntegrity = this.checkDataIntegrity(this.unfilteredData.songSections);
        if (checkIntegrity) {
          this.songService.selectedSong.subscribe((data) => {
            const foundSection = this.checkIfSectionExists(data, this.sectionId);
            if (foundSection) {
              this.buildBpmTable(data, this.serviceType);
              this.loading = false;
            } else {
              this.router.navigate([`./songs`]);
            }
          });
        } else {
          this.performOperationSong();
        }
      } else {
        this.performOperationSong();
      }
    } else {
      this.typeSections = "exerciseSections";
      if (this.unfilteredData && this.unfilteredData.id === this.serviceId) {
        let checkIntegrity = this.checkDataIntegrity(this.unfilteredData.exerciseSections);
        if (checkIntegrity) {
          this.exerciseService.selectedExercise.subscribe((data) => {
            const foundSection = this.checkIfSectionExists(data, this.sectionId);
            if (foundSection) {
              this.buildBpmTable(data, this.serviceType);
              this.loading = false;
            } else {
              this.router.navigate([`./exercises`]);
            }
          });
        } else {
          this.performOperationExercise();
        }
      } else {
        this.performOperationExercise();
      }
    }
  }

  isAllSelected() {
    if (this.dataSource) {
      const numSelected = this.selection.selected.length;
      const numRows = this.dataSource.data.length;
      return numSelected === numRows;
    }
  }

  masterToggle() {
    if (this.dataSource) {
      this.isAllSelected() ?
        this.selection.clear() :
        this.dataSource.data.forEach(row => this.selection.select(row));
    }
  }

  checkboxLabel(row?: BpmChart): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }

  buildBpmTable(data, findType, index = false) {
    let findTypeSections = `${findType}Sections`;

    if (index === false) {
      for (let i = 0; i < data[findTypeSections].length; i++) {
        if (data[findTypeSections][i].id == this.sectionId) {
          this.sectionIndex = i;
          break;
        }
      }
    }

    let mapData = data[findTypeSections][this.sectionIndex].sectionBpms.map((d, i) => {
      return {
        id: d.id,
        position: i + 1,
        bpm: d.bpm,
        createdAt: new Date(d.createdAt).toLocaleDateString("en-US"),
      }
    });

    this.dataSource = new MatTableDataSource<BpmChart>(mapData);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  onDelete() {
    var bpmArray = this.selection.selected.map(d => {
      return {
        bpmId: d.id,
      }
    });
    if (!bpmArray.length) {
      return this.displaySnackbarError();
    }
    this.listBpmsDialogService.setBpmDetails({
      bpmArray,
      serviceType: this.serviceType,
      sectionId: this.sectionId,
    });
    this.router.navigate(["delete"], { relativeTo: this.route });
  }

  checkDataIntegrity(section) {
    let checkPassed = true;
    for (let i = 0; i < section.length; i++) {
      if (!("sectionBpms" in section[i])) {
        checkPassed = false;
        break;
      }
    }
    return checkPassed;
  }

  displaySnackbarError() {
    this._snackBar.open("No BPMs Selected", "Error", {
        duration: 2000,
    });
  }

  performOperationSong() {
    if (this.songService.returnDidLoadList()) {
      let foundSong = this.songService.findSong(this.serviceId);
      if (foundSong) {
        let checkIntegrity = this.checkDataIntegrity(foundSong.songSections);
        if (checkIntegrity) {
          this.songService.selectedSong.next({...foundSong});
          this.songService.selectedSong.subscribe((data) => {
            this.unfilteredData = { ...data };
            const foundSection = this.checkIfSectionExists(data, this.sectionId);
            if (foundSection) {
              this.buildBpmTable(data, this.serviceType);
              this.loading = false;
            } else {
              this.router.navigate([`./songs`]);
            }
          });
        } else {
          // query and replace
          return this.songService.querySong(this.serviceId).subscribe(({ data, loading }) => {
            if (data.fullSongDetails.status.ok) {
              const foundSection = this.checkIfSectionExists(data.fullSongDetails, this.sectionId);
              if (foundSection) {
                this.unfilteredData = { ...data.fullSongDetails };
                this.songService.findAndReplace({ ...data.fullSongDetails });
                this.songService.selectedSong.next({...this.unfilteredData});
                this.buildBpmTable(data.fullSongDetails, this.serviceType);
                this.loading = false;
              } else {
                this.router.navigate([`./songs`]);
              }
            } else {
              this.router.navigate([`./songs`]);
            }
          });
        }
      } else {
        this.router.navigate([`./songs`]);
      }
    } else {
      return this.songService.querySong(this.serviceId).subscribe(({ data, loading }) => {
        if (data.fullSongDetails.status.ok) {
          const foundSection = this.checkIfSectionExists(data.fullSongDetails, this.sectionId);
          if (foundSection) {
            this.unfilteredData = { ...data.fullSongDetails };
            this.songService.pushServiceArr({ ...data.fullSongDetails });
            this.songService.selectedSong.next({...this.unfilteredData});
            this.buildBpmTable(data.fullSongDetails, this.serviceType);
            this.loading = false;
          } else {
            this.router.navigate([`./songs`]);
          }
        } else {
          this.router.navigate([`./songs`]);
        }
      });
    }
  }

  performOperationExercise() {
    if (this.exerciseService.returnDidLoadList()) {
      let foundExercise = this.exerciseService.findExercise(this.serviceId);
      if (foundExercise) {
        let checkIntegrity = this.checkDataIntegrity(foundExercise.exerciseSections);
        if (checkIntegrity) {
          this.exerciseService.selectedExercise.next({...foundExercise});
          this.exerciseService.selectedExercise.subscribe((data) => {
            const foundSection = this.checkIfSectionExists(data, this.sectionId);
            if (foundSection) {
              this.buildBpmTable(data, this.serviceType);
              this.loading = false;
            } else {
              this.router.navigate([`./exercises`]);
            }
          });
        } else {
          // query and replace
          return this.exerciseService.queryExercise(this.serviceId).subscribe(({ data, loading }) => {
            if (data.fullExerciseDetails.status.ok) {
              const foundSection = this.checkIfSectionExists(data.fullExerciseDetails, this.sectionId);
              if (foundSection) {
                this.unfilteredData = { ...data.fullExerciseDetails };
                this.exerciseService.findAndReplace({ ...data.fullExerciseDetails });
                this.exerciseService.selectedExercise.next({...this.unfilteredData});
                this.buildBpmTable(data.fullExerciseDetails, this.serviceType);
                this.loading = false;
              } else {
                this.router.navigate([`./exercises`]);
              }
            } else {
              this.router.navigate([`./exercises`]);
            }
          });
        }
      } else {
        this.router.navigate([`./exercises`]);
      }
    } else {
      return this.exerciseService.queryExercise(this.serviceId).subscribe(({ data, loading }) => {
        if (data.fullExerciseDetails.status.ok) {
          const foundSection = this.checkIfSectionExists(data.fullExerciseDetails, this.sectionId);
          if (foundSection) {
            this.unfilteredData = { ...data.fullExerciseDetails };
            this.exerciseService.pushServiceArr({ ...data.fullExerciseDetails });
            this.exerciseService.selectedExercise.next({...this.unfilteredData});
            this.buildBpmTable(data.fullExerciseDetails, this.serviceType);
            this.loading = false;
          } else {
            this.router.navigate([`./exercises`]);
          }
        } else {
          this.router.navigate([`./exercises`]);
        }
      });
    }
  }

  checkIfSectionExists(data, id) {
    let findTypeSections = `${this.serviceType}Sections`;
    const foundSection = data[findTypeSections].find(d => d.id === id);
    if (foundSection) {
      return true;
    } else {
      return false;
    }
  }
}