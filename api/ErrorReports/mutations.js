import ErrorReports from './ErrorReports';
import ErrorReportSchema from './schemas/error-report';
// import sanitizeHtml from 'sanitize-html';
import checkUserRole from '../Users/actions/checkUserRole';
import createMongoModifier from '../../libs/server/createMongoModifier';

export default {
  saveErrorReport: (root, args, { user }) => {
    if (!user || !user._id || !checkUserRole(user._id, ['admin'])) {
      throw new Error('Sorry, you must have permission to save a Error Report.');
    }

    /* #### PLOP_MUTATION_REMOVE_VALIDATION_START #### */
    /* #### PLOP_MUTATION_REMOVE_VALIDATION_END #### */

    const cleanDoc = ErrorReportSchema.clean(args.errorReport);
    ErrorReportSchema.validate(cleanDoc);

    /* #### PLOP_MUTATION_PRE_SAVE_START #### */
    /* #### PLOP_MUTATION_PRE_SAVE_END #### */

    const userId = user._id;
    const timestamp = new Date();

    if (cleanDoc._id) {
      const { _id } = cleanDoc;

      cleanDoc.updatedById = userId;
      cleanDoc.updatedAt = timestamp;

      const currentDoc = ErrorReports.findOne(_id, { fields: { createdById: 0, createdAt: 0 } });
      if (!currentDoc) {
        throw new Error('Cannot find Error Report to update');
      }

      const modifier = createMongoModifier(currentDoc, cleanDoc);

      delete modifier.$set._id;

      /* #### PLOP_MUTATION_PRE_UPDATE_START #### */
      /* #### PLOP_MUTATION_PRE_UPDATE_END #### */

      ErrorReports.update({ _id }, modifier);
      return ErrorReports.findOne(_id);
    }

    cleanDoc.createdById = userId;
    cleanDoc.createdAt = timestamp;
    cleanDoc.updatedById = userId;
    cleanDoc.updatedAt = timestamp;

    /* #### PLOP_MUTATION_PRE_INSERT_START #### */
    /* #### PLOP_MUTATION_PRE_INSERT_END #### */

    const errorReportId = ErrorReports.insert(cleanDoc);
    const doc = ErrorReports.findOne(errorReportId);
    return doc;
  },
  removeErrorReport: (root, args, { user }) => {
    if (!user || !user._id || !checkUserRole(user._id, ['admin'])) {
      throw new Error('Sorry, you must have permission to remove Error Report.');
    }

    /* #### PLOP_MUTATION_REMOVE_VALIDATION_START #### */
    /* #### PLOP_MUTATION_REMOVE_VALIDATION_END #### */

    /* #### PLOP_MUTATION_PRE_REMOVE_START #### */
    /* #### PLOP_MUTATION_PRE_REMOVE_END #### */

    ErrorReports.remove(args);
    return args;
  },
  /* #### PLOP_MUTATIONS_START #### */
  /* #### PLOP_MUTATIONS_END #### */
};
