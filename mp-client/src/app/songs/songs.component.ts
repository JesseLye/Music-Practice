import { Component, OnInit, OnDestroy } from '@angular/core';
import { SongService } from './song.service';
import { Song } from "./song-response.model";
import { Subscription } from "rxjs";

@Component({
  selector: 'app-songs',
  templateUrl: './songs.component.html',
  styleUrls: ['./songs.component.scss']
})
export class SongsComponent implements OnInit, OnDestroy {
  songs: Song[];
  loading: boolean = true;
  songServiceSubscription: Subscription;
  constructor(private songService: SongService) { }

  ngOnInit() {
    this.songServiceSubscription = this.songService.getAllSongs()
      .valueChanges
      .subscribe(({ data }) => {
        if (data.allUserSongs.status.ok) {
          if (!this.songService.returnDidLoadList()) {
            this.songService.setServiceArray([...data.allUserSongs.songs]);
            this.songService.setDidLoadListTrue();
          } else {
            this.songs = this.songService.getServiceArray();
            this.loading = false;
          }
        } else {
          this.songService.setServiceArray([]);
          this.songService.setDidLoadListTrue();
          this.loading = false;
        }
      });
    this.songService.songsChanged.subscribe((data) => {
      this.songs = [...data];
      this.loading = false;
    });
  }

  ngOnDestroy() {
    this.songServiceSubscription.unsubscribe();
  }
}