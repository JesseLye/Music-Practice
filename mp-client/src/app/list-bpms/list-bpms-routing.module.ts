import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../auth/auth.guard';

import { ListBpmsComponent } from "./list-bpms.component";
import { DialogEntryComponent } from "./list-bpms-dialog/list-bpms-dialog.component";

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    children: [
      {
        path: 'song/:song_id/:section_id',
        component: ListBpmsComponent,
        children: [
          {
            path: 'delete',
            component: DialogEntryComponent,
          }
        ],
      },
      {
        path: 'exercise/:exercise_id/:section_id',
        component: ListBpmsComponent,
        children: [
          {
            path: 'delete',
            component: DialogEntryComponent,
          }
        ]
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ListBpmsRoutingModule { }
