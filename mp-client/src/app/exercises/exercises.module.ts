import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { ExercisesComponent } from "./exercises.component";
import { ExerciseListComponent } from "./exercise-list/exercise-list.component";
import { ExerciseDetailComponent } from "./exercise-detail/exercise-detail.component";
import { ExercisesRoutingModule } from './exercises-routing,module';
import { ExerciseDialog, SectionDialog, DialogEntryComponent } from './exercise-dialog/exercise-dialog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    ExercisesComponent,
    ExerciseListComponent,
    ExerciseDetailComponent,
    ExerciseDialog,
    SectionDialog,
    DialogEntryComponent,
  ],
  entryComponents: [
    ExerciseDialog,
    SectionDialog,
    DialogEntryComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule,
    ExercisesRoutingModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class ExercisesModule { }
