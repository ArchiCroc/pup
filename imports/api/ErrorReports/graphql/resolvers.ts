import { ErrorReport } from '/imports/common/ErrorReports/interfaces';
import { Context } from '/imports/common/interfaces';
import ErrorReportQueries from './queries';
import ErrorReportMutations from './mutations';
import UserQueries from '/imports/api/Users/graphql/queries';

export default {
  Query: ErrorReportQueries,
  Mutation: ErrorReportMutations,
  ErrorReport: {
    user: UserQueries.user,
    createdBy: (parent: ErrorReport, args: unknown, context: Context) =>
      UserQueries.user(parent, { _id: parent.createdById }, context),
  },
};
