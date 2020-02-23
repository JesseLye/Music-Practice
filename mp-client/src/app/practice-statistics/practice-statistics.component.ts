import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SongService } from '../songs/song.service';
import { ExerciseService } from "../exercises/exercise.service";
import { PracticeStatisticDialogService } from "./practice-statistics-dialog/practice-statistics-dialog.service";
import { Bpm } from "../shared/shared-response.model";
import { Sections, DateRange } from "./practice-statistics-response.model";
import { of } from 'rxjs';
import { tap, switchMap, exhaustMap, take } from 'rxjs/operators';

@Component({
  selector: 'app-practice-statistics',
  templateUrl: './practice-statistics.component.html',
  styleUrls: ['./practice-statistics.component.scss']
})
export class PracticeStatisticsComponent implements OnInit {
  selectedData;
  practiceId: string;
  sections: Sections[];
  loading: boolean = true;
  selectedSectionId: string;
  selectedSectionData;
  originalBpms: Bpm[];
  selectedDateRange: DateRange | undefined;
  serviceType: string;
  typeSections: string;
  breakpoint: number;
  gutters: string;
  rowHeight: string;
  disableButtons: boolean;
  disableSelect: boolean;
  setDateInit = true;
  dateLimit = 2;
  insufficientDataMsg: string;

  constructor(private router: Router, private route: ActivatedRoute,
    private songService: SongService, private practiceStatsService: PracticeStatisticDialogService,
    private exerciseService: ExerciseService) {
    this.route.url.pipe(
      switchMap(url => {
        this.serviceType = url[0].path;
        return this.route.params;
      }),
      tap(params => {
        this.practiceId = params['practice_id'];
      }),
    ).subscribe();

    if (this.serviceType === "song") {
      this.songService.selectedSong.pipe(
        exhaustMap((d) => of(d).pipe(take(1)))
      ).subscribe((d) => {
        if (d !== null && d !== undefined) {
          this.selectedData = { ...d };
        }
      });
    } else {
      this.exerciseService.selectedExercise.pipe(
        exhaustMap((d) => of(d).pipe(take(1)))
      ).subscribe((d) => {
        if (d !== null && d !== undefined) {
          this.selectedData = { ...d };
        }
      });
    }
  }

  ngOnInit() {
    if (this.serviceType === "song") {
      this.typeSections = "songSections";
      if (this.selectedData && this.selectedData.id === this.practiceId) {
        let checkIntegrity = this.checkDataIntegrity(this.selectedData.songSections);
        if (checkIntegrity) {
          this.setValues(false);
        } else {
          this.performOperationSong();
        }
      } else {
        this.performOperationSong();
      }
    } else {
      this.typeSections = "exerciseSections";
      if (this.selectedData && this.selectedData.id === this.practiceId) {
        let checkIntegrity = this.checkDataIntegrity(this.selectedData.exerciseSections);
        if (checkIntegrity) {
          this.setValues(false);
        } else {
          this.performOperationExercise();
        }
      } else {
        this.performOperationExercise();
      }
    }

    this.checkWindowWidth();

    this.practiceStatsService.dateRange.subscribe(date => {
      // Don't run if the init date was set
      if (!this.setDateInit) {
        var differenceInDays = this.differenceInDates(date.startDate, date.endDate);
        if (differenceInDays >= this.dateLimit) {
          this.disableButtons = false;
          this.selectedDateRange = date;
          var filterDates = this.filterDates(this.originalBpms);
          if (!filterDates.length) {
            this.disableButtons = true;
            this.insufficientDataMsg = "Visualisation Requires Minimum 3 Days of Practice Data";
          }
          this.selectedSectionData.sectionBpms = [...filterDates];
          // trigger reload
          this.selectedSectionData = { ...this.selectedSectionData };
        } else {
          this.disableButtons = true;
          this.insufficientDataMsg = "Visualisation Requires Minimum 3 Days of Practice Data";
        }
      }
    });
  }

  onResize(event) {
    this.checkWindowWidth();
  }

  checkWindowWidth() {
    if (window.innerWidth >= 1000) {
      this.breakpoint = 2;
      this.gutters = "50px";
    } else {
      this.breakpoint = 1;
      this.gutters = "0px";
    }
  }

  setValues(loading) {
    if (!this.selectedData[this.typeSections].length) {
      this.loading = false;
      this.disableButtons = true;
      this.disableSelect = true;
      this.insufficientDataMsg = "No Data To Be Displayed"
      return;
    }
    this.sections = this.selectedData[this.typeSections].map(d => { return { value: d.id, viewValue: d.sectionName } });
    var firstSection = this.sections[0].value;
    this.selectedSectionData = { ...this.selectedData[this.typeSections].find((d) => d.id === firstSection) };
    this.originalBpms = [...this.selectedSectionData.sectionBpms];

    var startDate = new Date();

    this.selectedDateRange = {
      startDate: startDate.setDate(startDate.getDate() - 30),
      endDate: new Date(),
    };

    this.practiceStatsService.setDates(this.selectedDateRange.startDate, this.selectedDateRange.endDate);

    this.disableButtons = false;
    this.disableSelect = false;
    var initSelectSuccess = this.onSelect(firstSection);
    this.setDateInit = false;
    this.loading = loading;

    // prevents bug where dashboard would use previous dates of last viewed song/exercise
    if (!initSelectSuccess) this.practiceStatsService.clearDates();
  }

  onCustomDate() {
    this.router.navigate([`custom-date`], { relativeTo: this.route });
  }

  onViewBpmData() {
    this.router.navigate([`/list-bpms/${this.serviceType}/${this.practiceId}/${this.selectedSectionId}`]);
  }

  onSelect(val) {
    this.selectedSectionId = val;
    var findData = { ...this.selectedData[this.typeSections].find((d) => d.id === val) };
    if (!findData.sectionBpms.length) {
      this.disableButtons = true;
      this.insufficientDataMsg = "No Data To Be Displayed"
      return false;
    } else {
      var differenceInDays = this.differenceInDates(findData.sectionBpms[0].createdAt, findData.sectionBpms[findData.sectionBpms.length - 1].createdAt);
      if (differenceInDays >= this.dateLimit) {
        this.disableButtons = false;
        this.originalBpms = [...findData.sectionBpms];
        var filterDates = this.filterDates(this.originalBpms);
        if (!filterDates.length) {
          this.disableButtons = true;
          this.insufficientDataMsg = "Visualisation Requires Minimum 3 Days of Practice Data";
          return false;
        }
        findData.sectionBpms = [...filterDates];
        this.selectedSectionData = findData;
        return true;
      } else {
        this.disableButtons = true;
        this.insufficientDataMsg = "Visualisation Requires Minimum 3 Days of Practice Data";
        return false;
      }
    }
  }

  filterDates(data) {
    var startDate = new Date(this.selectedDateRange.startDate).setHours(0, 0, 0, 0);
    var endDate = new Date(this.selectedDateRange.endDate).setHours(0, 0, 0, 0);
    var filteredData = data.filter((d) => {
      var compareDate = new Date(d.createdAt).setHours(0, 0, 0, 0);
      if (compareDate >= startDate && compareDate <= endDate) {
        return true;
      } else {
        return false;
      }
    });
    return filteredData;
  }

  differenceInDates(firstDate, lastDate) {
    var first = new Date(firstDate).getTime();
    var last = new Date(lastDate).getTime();
    var differenceInTime = last - first;
    return differenceInTime / (1000 * 3600 * 24);
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

  performOperationSong() {
    if (this.songService.returnDidLoadList()) {
      let foundSong = this.songService.findSong(this.practiceId);
      if (foundSong) {
        let checkIntegrity = this.checkDataIntegrity(foundSong.songSections);
        if (checkIntegrity) {
          this.songService.selectedSong.next({ ...foundSong });
          this.setValues(false);
        } else {
          // query and replace
          return this.songService.querySong(this.practiceId).subscribe(({ data, loading }) => {
            if (data.fullSongDetails.status.ok) {
              this.selectedData = { ...data.fullSongDetails };
              this.songService.findAndReplace({ ...data.fullSongDetails });
              this.songService.selectedSong.next({ ...this.selectedData });
              this.setValues(loading);
            } else {
              this.router.navigate([`./songs`]);
            }
          });
        }
      } else {
        this.router.navigate([`../`], { relativeTo: this.route });
      }
    } else {
      return this.songService.querySong(this.practiceId).subscribe(({ data, loading }) => {
        if (data.fullSongDetails.status.ok) {
          this.selectedData = { ...data.fullSongDetails };
          this.songService.pushServiceArr({ ...data.fullSongDetails });
          this.songService.selectedSong.next({ ...this.selectedData });
          this.setValues(loading);
        } else {
          this.router.navigate([`./songs`]);
        }
      });
    }
  }

  performOperationExercise() {
    if (this.exerciseService.returnDidLoadList()) {
      let foundExercise = this.exerciseService.findExercise(this.practiceId);
      if (foundExercise) {
        let checkIntegrity = this.checkDataIntegrity(foundExercise.exerciseSections);
        if (checkIntegrity) {
          this.exerciseService.selectedExercise.next({ ...foundExercise });
          this.setValues(false);
        } else {
          // query and replace
          return this.exerciseService.queryExercise(this.practiceId).subscribe(({ data, loading }) => {
            if (data.fullExerciseDetails.status.ok) {
              this.selectedData = { ...data.fullExerciseDetails };
              this.exerciseService.findAndReplace({ ...data.fullExerciseDetails });
              this.exerciseService.selectedExercise.next({ ...this.selectedData });
              this.setValues(loading);
            } else {
              this.router.navigate([`./exercises`]);
            }
          });
        }
      } else {
        this.router.navigate([`./exercises`]);
      }
    } else {
      return this.exerciseService.queryExercise(this.practiceId).subscribe(({ data, loading }) => {
        if (data.fullExerciseDetails.status.ok) {
          this.selectedData = { ...data.fullExerciseDetails };
          this.exerciseService.pushServiceArr({ ...data.fullExerciseDetails });
          this.exerciseService.selectedExercise.next({ ...this.selectedData });
          this.setValues(loading);
        } else {
          this.router.navigate([`./exercises`]);
        }
      });
    }
  }

}
