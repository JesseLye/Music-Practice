import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from "../auth/auth.service";

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  performPasswordUpdate: boolean = false;
  userDetailsSubscription: Subscription;
  userDetails: {
    id: String,
    email: String,
  };
  loading: boolean = true;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.userDetailsSubscription = this.authService.userDetails.subscribe((details) => {
      this.userDetails = {
        id: details.id,
        email: details.email,
      };
      this.loading = false;
    });
  }
}