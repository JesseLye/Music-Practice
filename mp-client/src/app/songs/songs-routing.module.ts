import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DialogEntryComponent } from './song-dialog/song-dialog.component';
import { SongsComponent } from './songs.component';
import { AuthGuard } from '../auth/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: SongsComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'add',
        component: DialogEntryComponent,
      },
      {
        path: 'edit/:song_id',
        component: DialogEntryComponent,
      },
      {
        path: 'delete/:song_id',
        component: DialogEntryComponent,
      },
      {
       path: 'add-section/:song_id',
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
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SongsRoutingModule {}
