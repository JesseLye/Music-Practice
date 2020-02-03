import { Component, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Exercise } from "../exercise-response.model";
import { ExerciseService } from '../exercise.service';

@Component({
  selector: 'app-exercise-list',
  templateUrl: './exercise-list.component.html',
  styleUrls: ['./exercise-list.component.scss']
})
export class ExerciseListComponent {
  constructor(private exerciseService: ExerciseService, private router: Router,
    private route: ActivatedRoute) { }
  @Input() exercisesReceived: Exercise[];
  errMessage: String;
  selectedExercise: String;

  onSelect(exerciseId) {
    this.selectedExercise = exerciseId;
    this.exerciseService.selectExercise(exerciseId);
  }

  onEdit(exerciseId) {
    this.router.navigate([`edit/${exerciseId}`], { relativeTo: this.route });
  }

  onDelete(exerciseId) {
    this.router.navigate([`delete/${exerciseId}`], { relativeTo: this.route });
  }
}