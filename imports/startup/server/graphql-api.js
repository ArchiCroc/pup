import { gql } from '@apollo/client';
import { DateResolver, TimeResolver, DateTimeResolver } from 'graphql-scalars';
import { makeExecutableSchema } from 'graphql-tools';
import { mergeTypeDefs, mergeResolvers } from '@graphql-tools/merge';
import { ObjectID } from '/imports/api/libs/graphql/GraphQLObjectIdScalar';

/* #### PLOP_IMPORTS_START #### */
import UsersRolesTypes from '/imports/api/Users/Roles/graphql/types.gql';
import UsersTypes from '/imports/api/Users/graphql/types.gql';
import CommentsTypes from '/imports/api/Comments/graphql/types.gql';
import ErrorReportsTypes from '/imports/api/ErrorReports/graphql/types.gql';
import UsersRolesResolvers from '/imports/api/Users/Roles/graphql/resolvers';
import UsersResolvers from '/imports/api/Users/graphql/resolvers';
import CommentsResolvers from '/imports/api/Comments/graphql/resolvers';
import ErrorReportsResolvers from '/imports/api/ErrorReports/graphql/resolvers';
/* #### PLOP_IMPORTS_END #### */

const commonTypes = gql`
  scalar DateTime
  scalar Time
  scalar Date
  scalar ObjectID
  #### PLOP_COMMON_TYPES_START ####
  #### PLOP_COMMON_TYPES_START ####
`;

const commonResolvers = {
  Date: DateResolver,
  Time: TimeResolver,
  DateTime: DateTimeResolver,
  ObjectID,
  Query: {
    /* #### PLOP_COMMON_QUERY_RESOLVERS_START #### */
    /* #### PLOP_COMMON_QUERY_RESOLVERS_END #### */
  },
  Mutation: {
    /* #### PLOP_COMMON_MUTATION_RESOLVERS_START #### */
    /* #### PLOP_COMMON_MUTATION_RESOLVERS_END #### */
  },
  /* #### PLOP_COMMON_RESOLVERS_START #### */
  /* #### PLOP_COMMON_RESOLVERS_END #### */
};

const typeDefs = mergeTypeDefs([
  /* #### PLOP_TYPES_START #### */
  commonTypes,
  UsersRolesTypes,
  UsersTypes,
  CommentsTypes,
  ErrorReportsTypes,
  /* #### PLOP_TYPES_END #### */
]);
const resolvers = mergeResolvers([
  /* #### PLOP_RESOLVERS_START #### */
  commonResolvers,
  UsersRolesResolvers,
  UsersResolvers,
  CommentsResolvers,
  ErrorReportsResolvers,
  /* #### PLOP_RESOLVERS_END #### */
]);

export default makeExecutableSchema({
  typeDefs,
  resolvers,
});
