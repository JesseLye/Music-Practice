import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '../auth/auth.guard';

import { MetronomeComponent } from "./metronome.component";

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        component: MetronomeComponent,
      },
      {
        path: "song/:practice_id/:section_id",
        component: MetronomeComponent,
      },
      {
        path: "exercise/:practice_id/:section_id",
        component: MetronomeComponent,
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MetronomeRoutingModule {}
