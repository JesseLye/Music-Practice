import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Subject, BehaviorSubject } from 'rxjs';
import { 
  AuthResponse, 
  AddUserResponse, 
  UpdateUserResponse, 
  RemoveUserResponse, 
  IsAuthed, 
  LogOut,
  ResetPasswordResponse,
  PerformPasswordResetResponse,
  CheckResetPasswordResponse,
} from "./auth-response.model";
import {
  authUser,
  logoutUser,
  isAuth,
  initResetPassword,
  performResetPassword,
  checkResetPassword,
  addUser,
  updateUserLogin,
  updateUserPassword,
  removeUser,
} from "./auth.queries";
import { ExerciseService } from "../exercises/exercise.service";
import { SongService } from "../songs/song.service";

interface UserDetails {
  id: String;
  email: String;
}

// @Injectable({ providedIn: 'root' })
@Injectable()
export class AuthService {
  // loggedIn = new BehaviorSubject<boolean>(false);
  userDetails = new BehaviorSubject<any>(false);
  authErr = new Subject<String>();

  constructor(private apollo: Apollo, private exerciseService: ExerciseService,
    private songService: SongService) { }

  logIn(email, password) {
    return this.apollo.mutate<AuthResponse>({
      mutation: authUser,
      variables: {
        email,
        password,
        setNewToken: true,
      },
      refetchQueries: [{
        query: isAuth,
      }],
      awaitRefetchQueries: true,
    });
  }

  logOut() {
    return this.apollo.mutate<LogOut>({
      mutation: logoutUser,
      refetchQueries: [{
        query: isAuth,
      }],
      awaitRefetchQueries: true,
    });
  }
  
  securityCheck(password) {
    const email = this.userDetails.getValue().email;
    return this.apollo.mutate<AuthResponse>({
      mutation: authUser,
      variables: {
        email,
        password,
        setNewToken: false,
      },
    });
  }

  setLoggedOut() {
    this.songService.performCleanUp();
    this.exerciseService.performCleanUp();
    this.apollo.getClient().resetStore();
    this.userDetails.next(false);
    localStorage.removeItem("jwtToken");
  }

  initResetPassword(email) {
    return this.apollo.mutate<ResetPasswordResponse>({
      mutation: initResetPassword,
      variables: {
        email
      }
    });
  }

  performResetPassword(newPassword1, newPassword2, key) {
    return this.apollo.mutate<PerformPasswordResetResponse>({
      mutation: performResetPassword,
      variables: {
        newPassword1,
        newPassword2,
        key
      }
    });
  }

  checkResetPassword(key) {
    return this.apollo.query<CheckResetPasswordResponse>({
        query: checkResetPassword,
        variables: {
          key,
        },
    });
  }

  signUp(email, password, password2) {
    return this.apollo.mutate<AddUserResponse>({
      mutation: addUser,
      variables: {
        email,
        password,
        password2
      },
      refetchQueries: [{
        query: isAuth,
      }],
      awaitRefetchQueries: true,
    });
  }

  updateEmail(updateEmail, confirmUpdateEmail) {
    return this.apollo.mutate<UpdateUserResponse>({
      mutation: updateUserLogin,
      variables: {
        updateEmail,
        confirmUpdateEmail,
      }
    });
  }

  updatePassword(updatePassword, confirmUpdatePassword) {
    return this.apollo.mutate<UpdateUserResponse>({
      mutation: updateUserPassword,
      variables: {
        updatePassword,
        confirmUpdatePassword
      }
    });
  }

  removeUser() {
    return this.apollo.mutate<RemoveUserResponse>({
      mutation: removeUser,
    });
  }

  checkAuthenticated() {
    return this.apollo.watchQuery<IsAuthed>({
      query: isAuth
    });
  }

  resetStore() {
    this.apollo.getClient().resetStore();
  }
}