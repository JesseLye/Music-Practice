import { Component } from '@angular/core';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Music Practice';
  loading: boolean = true;
  constructor(private authService: AuthService) {
    this.authService.checkAuthenticated().valueChanges.subscribe((response) => {
      this.loading = false;
      if (response.data.isAuthed.status.ok) {
        this.authService.userDetails.next({
          id: response.data.isAuthed.id,
          email: response.data.isAuthed.email,
        });
        return true;
      }
    })
  }
}
