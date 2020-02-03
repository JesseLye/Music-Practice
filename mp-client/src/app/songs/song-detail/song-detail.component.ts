import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SongService } from '../song.service';
import { Subscription } from 'rxjs';
import { Song } from "../song-response.model";

@Component({
  selector: 'app-song-detail',
  templateUrl: './song-detail.component.html',
  styleUrls: ['./song-detail.component.scss']
})
export class SongDetailComponent implements OnInit {
  // selectedSong: Song | Boolean;
  selectedSong: any;
  selectedSongSubscription: Subscription;
  songListSubscription: Subscription;
  errMessage: String;
  constructor(private songService: SongService, private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.selectedSongSubscription = this.songService.selectedSong.subscribe(song => {
      if (song) {
        this.selectedSong = { ...song };
      } else {
        this.selectedSong = false;
      }
    });
  }

  onAddSection() {
    this.router.navigate([`add-section/${this.selectedSong.id}`], { relativeTo: this.route });
  }

  onEditSection(sectionId) {
    this.router.navigate([`edit-section/${sectionId}`], { relativeTo: this.route });
  }

  onDeleteSection(sectionId) {
    this.router.navigate([`delete-section/${sectionId}`], { relativeTo: this.route });
  }

  onPracticeSection(sectionId) {
    this.router.navigate([`../metronome/song/${this.selectedSong.id}/${sectionId}`], { relativeTo: this.route });
  }

  onViewStatistics() {
    this.router.navigate([`../practice-stats/song/${this.selectedSong.id}`], { relativeTo: this.route });
  }
}
