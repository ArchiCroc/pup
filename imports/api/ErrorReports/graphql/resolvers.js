import { makeExecutableSchema } from 'graphql-tools';
import ErrorReportTypes from './types.gql';
import ErrorReportQueries from './queries';
import ErrorReportMutations from './mutations';
import UserQueries from '/imports/api/Users/graphql/queries';

export default {
  Query: ErrorReportQueries,
  Mutation: ErrorReportMutations,
  ErrorReport: {
    user: UserQueries.user,
    createdBy: (parent, args, context) =>
      UserQueries.user(parent, { _id: parent.createdById }, context),
  },
};
