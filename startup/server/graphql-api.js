import gql from 'graphql-tag';
import { GraphQLDate, GraphQLDateTime } from 'graphql-iso-date';

import UserTypes from '../../api/Users/types';
import UserQueries from '../../api/Users/queries';
import UserMutations from '../../api/Users/mutations';

import DocumentTypes from '../../api/Documents/types';
import DocumentQueries from '../../api/Documents/queries';
import DocumentMutations from '../../api/Documents/mutations';

import CommentTypes from '../../api/Comments/types';
import CommentQueries from '../../api/Comments/queries';
import CommentMutations from '../../api/Comments/mutations';

import OAuthQueries from '../../api/OAuth/queries';

/* #### PLOP_IMPORTS_START #### */
/* ####TEST4#### */
import Test4Types from '../../api/Test4/types';
import Test4Queries from '../../api/Test4/queries';
import Test4Mutations from '../../api/Test4/mutations';

/* #### PLOP_IMPORTS_END #### */

const schema = {
  typeDefs: gql`
    ${UserTypes}
    ${DocumentTypes}
    ${CommentTypes}

    #### PLOP_TYPES_START ####
    ${Test4Types}
    #### PLOP_TYPES_END ####

    scalar DateTime
    scalar Date

    #### PLOP_SCALAR_START ####
    #### PLOP_SCALAR_END ####

    type Query {
      documents: [Document]
      document(_id: String): Document
      user(_id: String): User
      users(page: Int, pageSize: Int, search: String, sort: String, order: String): Users
      exportUserData: UserDataExport
      oAuthServices(services: [String]): [String]
      #### PLOP_QUERY_TYPE_START ####
      ####TEST4####
      test4: [Test4]
      myTest4: [Test4]
      test4(_id: String): Test4

      #### PLOP_QUERY_TYPE_END ####
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
      #### PLOP_MUTATION_TYPE_START ####
      ####TEST4####
      saveTest4(test4: Test4Input ): Test4
      removeTest4(_id: String!): Test4

      #### PLOP_MUTATION_TYPE_END ####
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
      ...Test4Queries,
      /* #### PLOP_QUERY_RESOLVERS_END #### */
    },
    Mutation: {
      ...DocumentMutations,
      ...CommentMutations,
      ...UserMutations,
      // ...UserSettingsMutations,
      /* #### PLOP_MUTATION_RESOLVERS_START #### */
      ...Test4Mutations,
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
