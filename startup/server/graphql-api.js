import { gql } from '@apollo/client';
import { GraphQLDate, GraphQLDateTime } from 'graphql-iso-date';
import { makeExecutableSchema } from 'graphql-tools';
import { ObjectID } from '../../modules/server/GraphQLObjectIdScalar';

/* #### PLOP_IMPORTS_START #### */
/* #### ROLES_IMPORTS_START #### */
import RoleTypes from '../../api/Roles/types';
import RoleQueries from '../../api/Roles/queries';
import RoleMutations from '../../api/Roles/mutations';
/* #### ROLES_IMPORTS_END #### */

/* #### USERS_IMPORTS_START #### */
import UserTypes from '../../api/Users/types';
import UserQueries from '../../api/Users/queries';
import UserMutations from '../../api/Users/mutations';
import OAuthQueries from '../../api/OAuth/queries';
/* #### USERS_IMPORTS_END #### */

/* #### COMMENTS_IMPORTS_START #### */
import CommentTypes from '../../api/Comments/types';
import CommentQueries from '../../api/Comments/queries';
import CommentMutations from '../../api/Comments/mutations';
/* #### COMMENTS_IMPORTS_END #### */

/* #### ERROR_REPORTS_IMPORTS_START #### */
import ErrorReportTypes from '../../api/ErrorReports/types';
import ErrorReportQueries from '../../api/ErrorReports/queries';
import ErrorReportMutations from '../../api/ErrorReports/mutations';
/* #### ERROR_REPORTS_IMPORTS_END #### */

/* #### PLOP_IMPORTS_END #### */

const schema = {
  typeDefs: gql`
    ${UserTypes}
    ${CommentTypes}

    #### PLOP_TYPES_START ####
    ${RoleTypes}
    ${ErrorReportTypes}
    #### PLOP_TYPES_END ####

    scalar DateTime
    scalar Date
    scalar ObjectID

    #### PLOP_SCALAR_START ####
    #### PLOP_SCALAR_END ####

    type Query {
      #### PLOP_QUERY_TYPES_START ####
      #### ROLES_QUERY_TYPES_START ####
      roles(
        _ids: [String]
        page: Int
        pageSize: Int
        sort: String
        order: String
        search: String
      ): Roles
      myRoles: [Role]
      role(_id: String, name: String): Role
      #### ROLES_QUERY_TYPES_END ####

      #### USERS_QUERY_TYPES_START ####
      user(_id: String): User
      resolveUser(userId: String): User
      users(
        _ids: [String]
        page: Int
        pageSize: Int
        sort: String
        order: String
        search: String
        role: [String]
      ): Users
      resolveUsers(_ids: [String], sort: String, order: String): Users
      exportUserData: UserDataExport
      oAuthServices(services: [String]): [String]
      #### USERS_QUERY_TYPES_END ####

      #### ERROR_REPORTS_QUERY_TYPES_START ####
      errorReports(
        _ids: [ObjectID]
        page: Int
        pageSize: Int
        sort: String
        order: String
        search: String
        level: [Int]
      ): ErrorReports
      myErrorReports: [ErrorReport]
      errorReport(_id: ObjectID): ErrorReport
      #### ERROR_REPORTS_QUERY_TYPES_END ####

      #### PLOP_QUERY_TYPES_END ####
    }

    type Mutation {
      #### PLOP_MUTATION_TYPES_START ####
      #### ROLES_MUTATION_TYPES_START ####
      saveRole(role: RoleInput): Role
      removeRole(_id: String!): Role
      #### ROLES_MUTATION_TYPES_END ####

      #### COMMENTS_REPORTS_MUTATION_TYPES_START ####
      addComment(documentId: String!, comment: String!): Comment
      removeComment(commentId: String!): Comment
      #### COMMENTS_REPORTS_MUTATION_TYPES_END ####

      #### USERS_MUTATION_TYPES_START ####
      updateUser(user: UserInput): User
      updateUserSettings(_id: String, settings: UserSettingsInput): User
      removeUser(_id: String): User
      sendVerificationEmail: User
      sendWelcomeEmail: User
      #### USERS_MUTATION_TYPES_END ####

      #### ERROR_REPORTS_MUTATION_TYPES_START ####
      saveErrorReport(errorReport: ErrorReportInput): ErrorReport
      removeErrorReport(_id: ObjectID!): ErrorReport
      #### ERROR_REPORTS_MUTATION_TYPES_END ####

      #### PLOP_MUTATION_TYPES_END ####
    }
  `,
  resolvers: {
    Date: GraphQLDate,
    DateTime: GraphQLDateTime,
    ObjectID,
    Query: {
      ...UserQueries,
      //  ...UserSettingsQueries,
      ...OAuthQueries,
      /* #### PLOP_QUERY_RESOLVERS_START #### */
      ...RoleQueries,
      ...ErrorReportQueries,
      /* #### PLOP_QUERY_RESOLVERS_END #### */
    },
    Mutation: {
      ...CommentMutations,
      ...UserMutations,
      // ...UserSettingsMutations,
      /* #### PLOP_MUTATION_RESOLVERS_START #### */
      ...RoleMutations,
      ...ErrorReportMutations,
      /* #### PLOP_MUTATION_RESOLVERS_END #### */
    },
    User: {
      fullName: (user) =>
        (user.profile &&
          (user.profile.firstName || user.profile.lastName) &&
          `${user.profile.firstName} ${user.profile.lastName}`) ||
        user.username,
    },
    Comment: {
      user: UserQueries.user,
    },
    ErrorReport: {
      user: UserQueries.user,
      createdBy: (parent, args, context) =>
        UserQueries.user(parent, { _id: parent.createdById }, context),
    },
    /* #### PLOP_RESOLVERS_START #### */
    /* #### ROLES_RESOLVERS_START #### */
    Role: {
      createdBy: (parent, args, context) =>
        UserQueries.resolveUser(parent, { _id: parent.createdById }, context),
      updatedBy: (parent, args, context) =>
        UserQueries.resolveUser(parent, { _id: parent.updatedById }, context),
    },
    /* #### ROLES_RESOLVERS_END #### */
    /* #### PLOP_RESOLVERS_END #### */
  },
};

export default makeExecutableSchema(schema);
