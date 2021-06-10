declare module '*.gql' {
    import { DocumentNode } from 'graphql';

    export const saveErrorReport: DocumentNode;
    export const removeErrorReport: DocumentNode;

    export default DocumentNode;
}
