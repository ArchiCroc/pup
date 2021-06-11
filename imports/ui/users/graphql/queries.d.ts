declare module '*.gql' {
  import { DocumentNode } from 'graphql';

  export const USERS_QUERY: DocumentNode;
  export const USER_QUERY: DocumentNode;
  export const USER_SETTINGS_QUERY: DocumentNode;
  export const EXPORT_USER_DATA_QUERY: DocumentNode;
  export const OAUTH_SERVICES_QUERY: DocumentNode;
}