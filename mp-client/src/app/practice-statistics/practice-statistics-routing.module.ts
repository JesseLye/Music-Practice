import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// import { DialogEntryComponent } from './song-dialog/song-dialog.component';
import { DialogEntryComponent } from "./practice-statistics-dialog/practice-statistics-dialog.component";
import { PracticeStatisticsComponent } from "./practice-statistics.component";
import { AuthGuard } from '../auth/auth.guard';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    children: [
      {
        path: 'song/:practice_id',
        component: PracticeStatisticsComponent,
        children: [
          {
            path: 'custom-date',
            component: DialogEntryComponent,
          },
        ]
      },
      {
        path: 'exercise/:practice_id',
        component: PracticeStatisticsComponent,
        children: [
          {
            path: 'custom-date',
            component: DialogEntryComponent,
          },
        ]
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PracticeStatisticsRoutingModule { }
