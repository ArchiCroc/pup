declare module '*.gql' {
    import { DocumentNode } from 'graphql';

    export const errorReports: DocumentNode;
    export const editErrorReport: DocumentNode;
    export const errorReport: DocumentNode;
}