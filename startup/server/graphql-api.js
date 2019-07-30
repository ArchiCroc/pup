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

const schema = {
  typeDefs: gql`
    ${UserTypes}
    ${DocumentTypes}
    ${CommentTypes}

    scalar DateTime
    scalar Date

    type Query {
      documents: [Document]
      document(_id: String): Document
      user(_id: String): User
      users(page: Int, pageSize: Int, search: String, sort: String, order: String): Users
      exportUserData: UserDataExport
      oAuthServices(services: [String]): [String]
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
    },
    Mutation: {
      ...DocumentMutations,
      ...CommentMutations,
      ...UserMutations,
      // ...UserSettingsMutations,
    },
    Document: {
      comments: CommentQueries.comments,
    },
    Comment: {
      user: UserQueries.user,
    },
  },
};

export default schema;
