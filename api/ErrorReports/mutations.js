import ErrorReports from './ErrorReports';
import ErrorReportSchema from './schemas/error-report';
// import sanitizeHtml from 'sanitize-html';
import checkUserRole from '../Users/actions/checkUserRole';

export default {
  saveErrorReport: (root, args, context) => {
    if (!context.user || !context.user._id || !checkUserRole(context.user._id, 'admin')) {
      throw new Error('Sorry, you must have permission to save ErrorReport.');
    }
    if (!context.user) throw new Error('Sorry, you must be logged in to add a new ErrorReport.');

    const cleanDoc = ErrorReportSchema.clean(args.errorReport);
    ErrorReportSchema.validate(cleanDoc);

    const userId = context.user._id;
    const timestamp = new Date();

    cleanDoc.updatedBy = userId;
    cleanDoc.updatedAtUTC = timestamp;

    if (cleanDoc._id) {
      cleanDoc.updatedBy = context.user._id;
      cleanDoc.updatedAt = new Date();

      const { _id } = cleanDoc;
      delete cleanDoc._id;

      ErrorReports.update({ _id }, { $set: cleanDoc });
      return ErrorReports.findOne(_id);
    }

    cleanDoc.createdById = userId;
    cleanDoc.createdAtUTC = timestamp;

    const ErrorReportId = ErrorReports.insert(cleanDoc);
    const doc = ErrorReports.findOne(ErrorReportId);
    return doc;
  },
  removeErrorReport: (root, args, context) => {
    if (!context.user || !context.user._id || !checkUserRole(context.user._id, 'admin')) {
      throw new Error('Sorry, you must have permission to save ErrorReport.');
    }
    if (!ErrorReports.findOne({ _id: args._id, createdById: context.user._id }))
      throw new Error('Sorry, you need to be the owner of this ErrorReport to remove it.');
    ErrorReports.remove(args);
    return args;
  },
  /* #### PLOP_MUTATIONS_START #### */
  /* #### PLOP_MUTATIONS_END #### */
};
