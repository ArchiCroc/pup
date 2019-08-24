import gql from 'graphql-tag';
import { GraphQLDate, GraphQLDateTime } from 'graphql-iso-date';

import UserTypes from '../../api/Users/types';
import UserQueries from '../../api/Users/queries';
import UserMutations from '../../api/Users/mutations';

// import UserSettingsTypes from '../../api/UserSettings/types';
// import UserSettingsQueries from '../../api/UserSettings/queries';
// import UserSettingsMutations from '../../api/UserSettings/mutations';

import DocumentTypes from '../../api/Documents/types';
import DocumentQueries from '../../api/Documents/queries';
import DocumentMutations from '../../api/Documents/mutations';

import CommentTypes from '../../api/Comments/types';
import CommentQueries from '../../api/Comments/queries';
import CommentMutations from '../../api/Comments/mutations';

import OAuthQueries from '../../api/OAuth/queries';

/* #### PLOP_IMPORTS_START #### */
/* #### PLOP_IMPORTS_END #### */

const schema = {
  typeDefs: gql`
    ${UserTypes}
    ${DocumentTypes}
    ${CommentTypes}

    #### PLOP_TYPES_START ####
    #### PLOP_TYPES_END ####

    scalar DateTime
    scalar Date

    #### PLOP_SCALAR_START ####
    #### PLOP_SCALAR_END ####

    type Query {
      widgets: [Widget]
      myWidgets: [Widget]
      widget(_id: String): Widget

      documents: [Document]
      document(_id: String): Document
      user(_id: String): User
      users(page: Int, pageSize: Int, search: String, sort: String, order: String): Users
      exportUserData: UserDataExport
      oAuthServices(services: [String]): [String]
      #### PLOP_QUERIES_SCHEMA_START ####
      #### PLOP_QUERIES_SCHEMA_END ####
    }

    type Mutation {
      addDocument(title: String, body: String): Document
      updateDocument(_id: String!, title: String, body: String, isPublic: Boolean): Document
      updateDocumentKey(_id: String!, key: String!, value: String!): Document
      removeDocument(_id: String!): Document
      addComment(documentId: String!, comment: String!): Comment
      removeComment(commentId: String!): Comment
      updateUser(user: UserInput): User
      updateUserSettings(_id: String, settings: UserSettingsInput): User
      removeUser(_id: String): User
      sendVerificationEmail: User
      sendWelcomeEmail: User
      #### PLOP_MUTATIONS_SCHEMA_START ####
      #### PLOP_MUTATIONS_SCHEMA_END ####
    }
  `,
  resolvers: {
    Date: GraphQLDate,
    DateTime: GraphQLDateTime,
    Query: {
      ...DocumentQueries,
      ...UserQueries,
      //  ...UserSettingsQueries,
      ...OAuthQueries,
      /* #### PLOP_QUERY_RESOLVERS_START #### */
      /* #### PLOP_QUERY_RESOLVERS_END #### */
    },
    Mutation: {
      ...DocumentMutations,
      ...CommentMutations,
      ...UserMutations,
      // ...UserSettingsMutations,
      /* #### PLOP_MUTATION_RESOLVERS_START #### */
      /* #### PLOP_MUTATION_RESOLVERS_END #### */
    },
    Document: {
      comments: CommentQueries.comments,
    },
    Comment: {
      user: UserQueries.user,
    },
    /* #### PLOP_RESOLVERS_START #### */
    /* #### PLOP_RESOLVERS_END #### */
  },
};

export default schema;
