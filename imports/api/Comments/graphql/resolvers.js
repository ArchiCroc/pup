import { makeExecutableSchema } from 'graphql-tools';
import CommentsTypes from './types.gql';
import CommentQueries from './queries';
import CommentMutations from './mutations';
import UserQueries from '/imports/api/Users/graphql/queries';

export default {
  Query: CommentQueries,
  Mutation: CommentMutations,
  Comment: {
    user: UserQueries.user,
  },
};
