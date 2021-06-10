import { makeExecutableSchema } from 'graphql-tools';
import UserRoleTypes from './types.gql';
import UserRoleQueries from './queries';
import UserRoleMutations from './mutations';
import UserQueries from '/imports/api/Users/graphql/queries';

export default {
  Query: UserRoleQueries,
  Mutation: UserRoleMutations,
  UsersRole: {
    createdBy: (parent, args, context) =>
      UserQueries.resolveUser(parent, { _id: parent.createdById }, context),
    updatedBy: (parent, args, context) =>
      UserQueries.resolveUser(parent, { _id: parent.updatedById }, context),
  },
};
