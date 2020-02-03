import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ExerciseService } from '../exercise.service';
import { Subscription } from 'rxjs';
import { Exercise } from "../exercise-response.model";

@Component({
  selector: 'app-exercise-detail',
  templateUrl: './exercise-detail.component.html',
  styleUrls: ['./exercise-detail.component.scss']
})
export class ExerciseDetailComponent implements OnInit {
  // selectedExercise: Exercise | Boolean;
  selectedExercise: any;
  selectedExerciseSubscription: Subscription;
  errMessage: String;
  constructor(private exerciseService: ExerciseService, private router: Router,
    private route: ActivatedRoute) { }
  
  ngOnInit() {
    this.selectedExerciseSubscription = this.exerciseService.selectedExercise.subscribe(exercise => {
      if (exercise) {
        this.selectedExercise = exercise;
      } else {
        this.selectedExercise = false;
      }
    });
  }

  onAddSection() {
    this.router.navigate([`add-section/${this.selectedExercise.id}`], { relativeTo: this.route });
  }

  onEditSection(sectionId) {
    this.router.navigate([`edit-section/${sectionId}`], { relativeTo: this.route });
  }

  onDeleteSection(sectionId) {
    this.router.navigate([`delete-section/${sectionId}`], { relativeTo: this.route });
  }

  onPracticeSection(sectionId) {
    this.router.navigate([`../metronome/exercise/${this.selectedExercise.id}/${sectionId}`], { relativeTo: this.route });
  }

  onViewStatistics() {
    this.router.navigate([`../practice-stats/exercise/${this.selectedExercise.id}`], { relativeTo: this.route });
  }
}
