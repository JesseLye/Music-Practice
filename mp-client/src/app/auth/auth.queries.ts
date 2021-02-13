import gql from 'graphql-tag';

export const authUser = gql`
    mutation authUser($email: String!, $password: String!, $setNewToken: Boolean!) {
      authUser(email: $email, password: $password, setNewToken: $setNewToken) {
        id
        email
        token
        status {
          ok
          errMessage
        }
      }
    }
  `;


export const logoutUser = gql`
    mutation {
      logoutUser {
        ok
        errMessage
      }
    }
  `;

export const isAuth = gql`
  {
    isAuthed {
      id
      email
      status {
        ok
        errMessage
      }
    }
  }
  `;

export const initResetPassword = gql`
  mutation initResetPassword($email: String!) {
    initResetPassword(email: $email) {
      ok
      errMessage
    }
  }
`;

export const performResetPassword = gql`
  mutation performResetPassword($newPassword1: String!, $newPassword2: String!, $key: String!) {
    performResetPassword(newPassword1: $newPassword1, newPassword2: $newPassword2, key: $key) {
      ok
      errMessage
    }
  }
`;

export const checkResetPassword = gql`
  query checkResetPassword($key: ID!) {
    checkResetPassword(key: $key) {
      ok
      errMessage
    }
  }
`;

export const addUser = gql`
    mutation addUser($email: String!, $password: String!, $password2: String!) {
      addUser(email: $email, password: $password, password2: $password2) {
        id
        email
        token
        status {
          ok
          errMessage
        }
      }
    }
  `;

export const updateUserLogin = gql`
    mutation updateUser($updateEmail: String!, $confirmUpdateEmail: String!) {
      updateUser(updateEmail: $updateEmail, confirmUpdateEmail: $confirmUpdateEmail, performPasswordUpdate: false) {
        id
        email
        status {
          ok
          errMessage
        }
      }
    }
  `;

export const updateUserPassword = gql`
  mutation updateUser($updatePassword: String!, $confirmUpdatePassword: String!) {
    updateUser(updatePassword: $updatePassword, confirmUpdatePassword: $confirmUpdatePassword, performPasswordUpdate: true) {
      status {
        ok
        errMessage
      }
    }
  }
  `;

export const removeUser = gql`
  mutation {
    removeUser {
      ok
      errMessage
    }
  }
  `;