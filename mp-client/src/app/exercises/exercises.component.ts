import { Component, OnInit, OnDestroy } from '@angular/core';
import { ExerciseService } from "./exercise.service";
import { Exercise } from "./exercise-response.model";
import { Subscription } from "rxjs";

@Component({
  selector: 'app-exercises',
  templateUrl: './exercises.component.html',
  styleUrls: ['./exercises.component.scss']
})
export class ExercisesComponent implements OnInit {
  exercises: Exercise[];
  loading: boolean = true;
  exerciseServiceSubscription: Subscription;

  constructor(private exerciseService: ExerciseService) { }

  ngOnInit() {
    this.exerciseServiceSubscription = this.exerciseService.getAllExercises()
      .valueChanges
      .subscribe(({ data }) => {
        if (data.allUserExercises.status.ok) {
          if (!this.exerciseService.returnDidLoadList()) {
            this.exerciseService.setServiceArray([...data.allUserExercises.exercises]);
            this.exerciseService.setDidLoadListTrue();
          } else {
            this.exercises = this.exerciseService.getServiceArray();
            this.loading = false;
          }
        } else {
          this.exerciseService.setServiceArray([]);
          this.exerciseService.setDidLoadListTrue();
          this.loading = false;
        }
      });
    this.exerciseService.exercisesChanged.subscribe((data) => {
      this.exercises = [...data];
      this.loading = false;
    });
  }

  ngOnDestroy() {
    this.exerciseServiceSubscription.unsubscribe();
  }
}