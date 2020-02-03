import {
    CanActivate,
    ActivatedRouteSnapshot,
    RouterStateSnapshot,
    Router,
    UrlTree
} from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(private authService: AuthService, private router: Router) { }
    canActivate(
        route: ActivatedRouteSnapshot,
        router: RouterStateSnapshot
    ): | boolean
        | UrlTree
        | Promise<boolean | UrlTree>
        | Observable<boolean | UrlTree> {
            return this.authService.checkAuthenticated().valueChanges.pipe(
                take(1),
                map(response => {
                    if (response.data.isAuthed.status.ok) {
                        this.authService.userDetails.next({
                            id: response.data.isAuthed.id,
                            email: response.data.isAuthed.email,
                        });
                        return true;
                    } else {
                        return this.router.createUrlTree(['/signin']);
                    }
                })
            );
    }
}
