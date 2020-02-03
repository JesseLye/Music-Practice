import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SongsComponent } from './songs.component';
import { SongDialog, SectionDialog, DialogEntryComponent } from './song-dialog/song-dialog.component';
import { SongsRoutingModule } from './songs-routing.module';
import { SharedModule } from '../shared/shared.module';
import { SongListComponent } from './song-list/song-list.component';
import { SongDetailComponent } from "./song-detail/song-detail.component";

@NgModule({
  declarations: [
    SongsComponent,
    SongListComponent,
    SongDetailComponent,
    SongDialog,
    SectionDialog,
    DialogEntryComponent,
  ],
  entryComponents: [
    SongDialog,
    SectionDialog,
    DialogEntryComponent,
  ],
  imports: [
    RouterModule,
    SongsRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class SongsModule {}
