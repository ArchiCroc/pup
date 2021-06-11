declare module '*.gql' {
  import { DocumentNode } from 'graphql';
  export const UPDATE_USER_MUTATION: DocumentNode;
  export const REMOVE_USER_MUTATION: DocumentNode;
  export const SEND_VERIFICATION_EMAIL_MUTATION: DocumentNode;
  export const SEND_WELCOME_EMAIL_MUTATION: DocumentNode;
  export const UPDATE_USER_SETTINGS_MUTATION: DocumentNode;
}
