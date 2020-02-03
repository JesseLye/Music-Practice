import { Status } from "../shared/shared-response.model";

export interface AuthResponse {
    authUser: {
      id: String;
      email: String;
      status: Status,
    }
  };
  
  export interface AddUserResponse {
    addUser: {
      id: String;
      email: String;
      status: Status;
    }
  };

  export interface UpdateUserResponse {
    updateUser: {
      id: String;
      email: String;
      status: Status;
    }
  }

  export interface RemoveUserResponse {
    removeUser: Status;
  }
  
  export interface IsAuthed {
    isAuthed: {
      id: String;
      email: String;
      status: Status;
    }
  };
  
  export interface LogOut {
    logoutUser: Status;
  }

  export interface PerformPasswordResetResponse {
    PerformPasswordReset: Status;
  }

  export interface CheckResetPasswordResponse {
    CheckResetPassword: Status;
  }

  export interface ResetPasswordResponse {
    [key: string]: Status;
  }