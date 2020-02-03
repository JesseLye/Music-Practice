import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ExercisesComponent } from './exercises.component';
import { AuthGuard } from '../auth/auth.guard';
import { DialogEntryComponent } from './exercise-dialog/exercise-dialog.component';

const routes: Routes = [
  {
    path: '',
    component: ExercisesComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'add',
        component: DialogEntryComponent,
      },
      {
        path: 'edit/:exercise_id',
        component: DialogEntryComponent,
      },
      {
        path: 'delete/:exercise_id',
        component: DialogEntryComponent,
      },
      {
       path: 'add-section/:exercise_id',
       component: DialogEntryComponent, 
      },
      {
        path: 'edit-section/:section_id',
        component: DialogEntryComponent,
      },
      {
          path: 'delete-section/:section_id',
          component: DialogEntryComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExercisesRoutingModule {}
