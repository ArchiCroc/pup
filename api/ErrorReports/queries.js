import ErrorReports from './ErrorReports';
import checkUserRole from '../Users/actions/checkUserRole';

export default {
  errorReports: (parent, args, context) => {
    if (!context.user || context.user._id || checkUserRole(context.user._id, 'admin')) {
      throw new Error('Sorry, you must have permission to view ErrorReports.');
    }
    return ErrorReports.find().fetch();
  },
  myErrorReports: (parent, args, context) => {
    if (!context.user || context.user._id || checkUserRole(context.user._id, 'admin')) {
      throw new Error('Sorry, you must have permission to view my ErrorReports.');
    }
    return ErrorReports.find({ createdById: context.user._id }).fetch();
  },
  errorReport: (parent, args, context) => {
    if (!context.user || context.user._id || checkUserRole(context.user._id, 'admin')) {
      throw new Error('Sorry, you must have permission to view ErrorReport.');
    }
    return ErrorReports.findOne({ _id: args._id });
  },
  /* #### PLOP_QUERIES_START #### */
  /* #### PLOP_QUERIES_END #### */
};
