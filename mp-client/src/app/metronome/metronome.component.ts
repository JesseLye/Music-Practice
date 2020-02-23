import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SongService } from '../songs/song.service';
import { ExerciseService } from '../exercises/exercise.service';
import { tap, switchMap } from 'rxjs/operators';
import { MatProgressButtonOptions } from 'mat-progress-buttons';

interface resolutions {
    viewValue: string,
    value: number
}

@Component({
    selector: 'app-metronome',
    templateUrl: './metronome.component.html',
    styleUrls: ['./metronome.component.scss']
})
export class MetronomeComponent implements OnInit, OnDestroy {
    audioContext = null;
    unlocked = false;
    isPlaying = false;
    playText = "play_circle_filled";
    startTime;
    current16thNote;
    tempo = 120.0;
    lookahead = 25.0;
    scheduleAheadTime = 0.1;
    nextNoteTime = 0.0;
    noteResolution = 0; // 0 == 16th, 1 == 8th, 2 == quarter note
    noteLength = 0.05;
    last16thNoteDrawn = -1;
    timerWorker = null;
    warmUpMode: boolean = false;
    freePractice: boolean;
    practiceId: string;
    sectionId: string;
    resolutions: resolutions[] = [
        { viewValue: "16th Notes", value: 0 },
        { viewValue: "8th Notes", value: 1 },
        { viewValue: "Quarter Notes", value: 2 },
        { viewValue: "Freestyle", value: 3 },
    ];
    isSong: boolean;

    constructor(public dialog: MatDialog, private route: ActivatedRoute,
        private _snackBar: MatSnackBar, private router: Router,
        private songService: SongService, private exerciseService: ExerciseService) {
        this.route.url.pipe(
            switchMap(url => {
                if (url.length > 0 && url[0].path === "song") {
                    this.isSong = true;
                } else {
                    this.isSong = false;
                }
                return this.route.params;
            }),
            tap(params => {
                if (params["practice_id"]) {
                    this.freePractice = false;
                    this.practiceId = params["practice_id"];
                    this.sectionId = params["section_id"];
                } else {
                    this.freePractice = true;
                }
            })
        ).subscribe();
    }

    ngOnInit() {
        this.audioContext = new (window['AudioContext'] || window['webkitAudioContext'])();
        if (typeof Worker !== 'undefined') {
            // Create a new
            this.timerWorker = new Worker('../metronome.worker', { type: 'module' });
            this.timerWorker.onmessage = ({ data }) => {
                if (data == "tick") {
                    // console.log("tick!");
                    this.scheduler();
                }
                else {
                    console.log("message: " + data);
                }
            };
          } else {
              this.openSnackBar("Web Workers Are Not Supported - No Metronome For You", "Error", 10000);
          }
        if (!this.freePractice) {
            this.checkCorrectSelectedId();
        }
    }

    ngOnDestroy() {
        this.timerWorker.postMessage("stop");
    }

    openDialog() {
        const dialogRef = this.dialog.open(MetronomeEntryDialogComponent, {
            data: {
                bpm: this.tempo,
                sectionId: this.sectionId,
                practiceId: this.practiceId,
                isSong: this.isSong,
            },
            minWidth: "33vw",
        });

        dialogRef.afterClosed().subscribe(result => {
            this.configureSnackBarMessage(result);
        });
    }

    openSnackBar(message: string, action: string, duration=2000) {
        this._snackBar.open(message, action, {
            duration,
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

    nextNote() {
        var secondsPerBeat = 60.0 / this.tempo;
        this.nextNoteTime += 0.25 * secondsPerBeat;

        this.current16thNote++;
        if (this.current16thNote == 16) {
            this.current16thNote = 0;
        }
    }

    scheduleNote(beatNumber, time) {
        if ((this.noteResolution == 1) && (beatNumber % 2))
            return;
        if ((this.noteResolution == 2 || this.noteResolution == 3) && (beatNumber % 4))
            return;

        var osc = this.audioContext.createOscillator();
        osc.connect(this.audioContext.destination);

        if (this.noteResolution == 3)
            // always boops
            osc.frequency.value = 220.0;
        else if (beatNumber % 16 === 0)
            osc.frequency.value = 880.0;
        else if (beatNumber % 4 === 0)
            osc.frequency.value = 440.0;
        else
            osc.frequency.value = 220.0;

        osc.start(time);
        osc.stop(time + this.noteLength);
    }

    scheduler() {
        while (this.nextNoteTime < this.audioContext.currentTime + this.scheduleAheadTime) {
            this.scheduleNote(this.current16thNote, this.nextNoteTime);
            this.nextNote();
        }
    }

    play() {
        if (!this.unlocked) {
            // play silent buffer to unlock the audio
            var buffer = this.audioContext.createBuffer(1, 1, 22050);
            var node = this.audioContext.createBufferSource();
            node.buffer = buffer;
            node.start(0);
            this.unlocked = true;
        }

        this.isPlaying = !this.isPlaying;

        if (this.isPlaying) {
            this.current16thNote = 0;
            this.nextNoteTime = this.audioContext.currentTime;
            this.timerWorker.postMessage("start");
            this.playText = "pause_circle_filled";
            return "stop";
        } else {
            this.timerWorker.postMessage("stop");
            this.playText = "play_circle_filled";
            if (!this.warmUpMode && !this.freePractice) {
                this.openDialog();
            }
            return "play";
        }
    }

    onInputChange(value) {
        this.tempo = value;
    }

    onSelect(value) {
        this.noteResolution = value;
    }

    onToggleWarmUpMode() {
        this.warmUpMode = !this.warmUpMode;
    }

    onClick() {
        this.play();
    }

    performOperationSong() {
        if (this.songService.returnDidLoadList()) {
            let foundSong = this.songService.findSong(this.practiceId);
            if (foundSong) {
                let checkIntegrity = this.checkDataIntegrity(foundSong.songSections);
                if (checkIntegrity) {
                    this.songService.selectedSong.next({ ...foundSong });
                    // this.setValues(false);
                } else {
                    // query and replace
                    return this.songService.querySong(this.practiceId).subscribe(({ data, loading }) => {
                        if (data.fullSongDetails.status.ok) {
                            this.songService.findAndReplace({ ...data.fullSongDetails });
                            this.songService.selectedSong.next({ ...data.fullSongDetails });
                            // this.setValues(loading);
                        } else {
                            this.router.navigate([`./songs`]);
                        }
                    });
                }
            } else {
                this.router.navigate([`./songs`]);
            }
        } else {
            return this.songService.querySong(this.practiceId).subscribe(({ data, loading }) => {
                if (data.fullSongDetails.status.ok) {
                    this.songService.pushServiceArr({ ...data.fullSongDetails });
                    this.songService.selectedSong.next({ ...data.fullSongDetails });
                    // this.setValues(loading);
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
                    // this.setValues(false);
                } else {
                    // query and replace
                    return this.exerciseService.queryExercise(this.practiceId).subscribe(({ data, loading }) => {
                        if (data.fullExerciseDetails.status.ok) {
                            // this.selectedData = { ...data.fullExerciseDetails };
                            this.exerciseService.findAndReplace({ ...data.fullExerciseDetails });
                            this.exerciseService.selectedExercise.next({ ...data.fullExerciseDetails });
                            // this.setValues(loading);
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
                    this.exerciseService.pushServiceArr({ ...data.fullExerciseDetails });
                    this.exerciseService.selectedExercise.next({ ...data.fullExerciseDetails });
                    // this.setValues(loading);
                } else {
                    this.router.navigate([`./exercises`]);
                }
            });
        }
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

    checkCorrectSelectedId() {
        if (this.isSong) {
            return this.songService.selectedSong.subscribe((d) => {
                if (d) {
                    if (this.practiceId !== d.id) {
                        return this.performOperationSong();
                    }
                    const checkIntegrity = this.checkDataIntegrity(d.songSections);
                    if (!checkIntegrity) {
                        return this.performOperationSong();
                    }
                } else {
                    return this.performOperationSong();
                }
            });
        } else {
            return this.exerciseService.selectedExercise.subscribe((d) => {
                if (d) {
                    if (this.practiceId !== d.id) {
                        return this.performOperationExercise();
                    }
                    const checkIntegrity = this.checkDataIntegrity(d.exerciseSections);
                    if (!checkIntegrity) {
                        return this.performOperationExercise();
                    }
                } else {
                    this.performOperationExercise();
                }
            });
        }
    }
}

@Component({
    selector: 'metronome-dialog',
    templateUrl: 'metronome-dialog.html',
})
export class MetronomeEntryDialogComponent {
    buttonOptions: MatProgressButtonOptions = {
        active: false,
        text: 'Submit',
        spinnerSize: 18,
        flat: true,
        stroked: false,
        buttonColor: 'primary',
        spinnerColor: 'primary',
        fullWidth: false,
        disabled: false,
        mode: 'indeterminate',
      };

    constructor(
        public dialogRef: MatDialogRef<MetronomeEntryDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data, private songService: SongService,
        private exerciseService: ExerciseService) { }

    onSubmit() {
        if (this.data.isSong) {
            this.songService.addBpm(this.data.sectionId, this.data.bpm).subscribe(({ data }) => {
                if (data.addBpm.status.ok) {
                    const bpmObject = {
                        id: data.addBpm.id,
                        bpm: data.addBpm.bpm,
                        createdAt: data.addBpm.createdAt,
                    };
                    this.songService.addBpmToArray(bpmObject, this.data.practiceId, this.data.sectionId);
                    this.toggleDialogRef(true, data);
                } else {
                    this.toggleDialogRef(false, data);
                }
            });
        } else {
            this.exerciseService.addBpm(this.data.sectionId, this.data.bpm).subscribe(({ data }) => {
                if (data.addBpm.status.ok) {
                    const bpmObject = {
                        id: data.addBpm.id,
                        bpm: data.addBpm.bpm,
                        createdAt: data.addBpm.createdAt,
                    };
                    this.exerciseService.addBpmToArray(bpmObject, this.data.practiceId, this.data.sectionId);
                    this.toggleDialogRef(true, data);
                } else {
                    this.toggleDialogRef(false, data);
                }
            });
        }
    }

    onCancel() {
        this.dialogRef.close();
    }

    toggleDialogRef(isSuccess, data) {
        this.buttonOptions.active = true;
        if (isSuccess) {
            this.dialogRef.close({
                success: true,
                message: "BPM Added"
            });
        } else {
            this.dialogRef.close({
                success: false,
                message: data.addBpm.status.errMessage,
            });
        }
    }
}
