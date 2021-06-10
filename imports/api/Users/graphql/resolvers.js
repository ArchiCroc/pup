import { makeExecutableSchema } from 'graphql-tools';
import UserTypes from './types.gql';
import UserQueries from './queries';
import UserMutations from './mutations';

export default {
  Query: UserQueries,
  Mutation: UserMutations,
  User: {
    fullName: (user) =>
      (user.profile &&
        (user.profile.firstName || user.profile.lastName) &&
        `${user.profile.firstName} ${user.profile.lastName}`) ||
      user.username,
  },
};
