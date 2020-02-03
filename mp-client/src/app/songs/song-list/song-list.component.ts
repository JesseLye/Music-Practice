import { Component, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SongService } from '../song.service';
import { Song } from "../song-response.model";

@Component({
  selector: 'app-song-list',
  templateUrl: './song-list.component.html',
  styleUrls: ['./song-list.component.scss']
})
export class SongListComponent {
  constructor(private songService: SongService,
    private router: Router, private route: ActivatedRoute) { }
  @Input() songsReceived: Song[];
  errMessage: String;
  selectedSong: String;

  onSelect(songId) {
    this.selectedSong = songId;
    this.songService.selectSong(songId);
  }

  onEdit(songId) {
    this.router.navigate([`edit/${songId}`], { relativeTo: this.route });
  }

  onDelete(songId) {
    this.router.navigate([`delete/${songId}`], { relativeTo: this.route });
  }
}