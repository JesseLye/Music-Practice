import { Component, Input } from '@angular/core';
import { AuthService } from "../auth/auth.service";
import { Router } from '@angular/router';
import { tap } from "rxjs/operators";

@Component({
  selector: 'app-sidenav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss'],
})
export class SidenavComponent {
  @Input() menuTitle;

  constructor(private authService: AuthService, private router: Router) {}

  onLogOut(): void {
    this.authService.logOut().pipe(
      tap(({ data }) => {
        if (data.logoutUser.ok) {
          this.router.navigate(["/"]);
          this.authService.setLoggedOut();
        } else {
          console.log(data.logoutUser.errMessage);
        }
      }),
    ).subscribe();
  }
}