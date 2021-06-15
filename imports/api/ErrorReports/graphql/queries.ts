import isArray from 'lodash/isArray';
import { ErrorReport, ErrorReportsParams, HasErrorReportId } from '/imports/common/ErrorReports/interfaces';
import { ObjectID, Context, HasId } from '/imports/common/interfaces';
import checkUserRole from '/imports/api/libs/checkUserRole';
import ErrorReports from '../ErrorReports';

export default {
  errorReports: (parent: unknown, args: ErrorReportsParams, { user }: Context) => {
    if (!user || !user._id || !checkUserRole(user._id, ['admin'])) {
      throw new Error('Sorry, you must have permission to view Error Reports.');
    }

    /* #### PLOP_QUERY_VALIDATION_START #### */
    /* #### PLOP_QUERY_VALIDATION_END #### */

    const {
      _ids,
      pageSize = 10,
      page = 1,
      sort = 'createdAt',
      order = 'descend',
      search,
      level,
    } = args;

    const cleanPageSize = pageSize > 100 ? 100 : pageSize;

    const options: any = _ids
      ? {}
      : {
          limit: cleanPageSize,
          skip: page * cleanPageSize - cleanPageSize,
        };

    const orderDirection = order === 'descend' ? -1 : 1;
    options.sort = {};
    options.sort[sort] = orderDirection;

    const query: any = {};

    if (_ids) {
      query._id = { $in: _ids };
    }

    if (isArray(level) && level.length > 0) {
      query.level = { $in: level };
    } else if (level != null) {
      query.level = level;
    }

    if (search) {
      const searchRegEx = new RegExp(search, 'i');
      query.$or = [
        { message: searchRegEx },
        { path: searchRegEx },
        { userAgent: searchRegEx },
        { stack: searchRegEx },
        { reactStack: searchRegEx },
      ];
    }

    /* #### PLOP_QUERY_PRE_FIND_START #### */
    /* #### PLOP_QUERY_PRE_FIND_END #### */

    const result = ErrorReports.find(query, options);

    return {
      total: result.count(false),
      errorReports: result.fetch(),
    };
  },
  myErrorReports: (parent: unknown, args: ErrorReportsParams, { user }: Context) => {
    if (!user || !user._id || !checkUserRole(user._id, ['admin'])) {
      throw new Error('Sorry, you must have permission to view my Error Reports.');
    }

    const { level } = args;

    /* #### PLOP_QUERY_VALIDATION_START #### */
    /* #### PLOP_QUERY_VALIDATION_END #### */

    const query: any = { createdById: user._id };
    const options = {};

    if (isArray(level) && level.length > 0) {
      query.level = { $in: level };
    } else if (level != null) {
      query.level = level;
    }

    /* #### PLOP_QUERY_PRE_FIND_START #### */
    /* #### PLOP_QUERY_PRE_FIND_END #### */

    return ErrorReports.find(query, options).fetch();
  },
  errorReport: (parent: HasErrorReportId, args: HasId, { user }: Context) => {
    if (!user || !user._id || !checkUserRole(user._id, ['admin'])) {
      throw new Error('Sorry, you must have permission to view Error Report.');
    }

    /* #### PLOP_QUERY_VALIDATION_START #### */
    /* #### PLOP_QUERY_VALIDATION_END #### */

    const query: any = {};
    const options: any = {};

    /* #### PLOP_QUERY_PRE_FIND_START #### */
    /* #### PLOP_QUERY_PRE_FIND_END #### */

    const _id = (parent && parent.errorReportId) || args._id;
    if (_id) {
      query._id = _id;
      return ErrorReports.findOne(query, options);
    }
    return null;
  },
  /* #### PLOP_QUERIES_START #### */
  /* #### PLOP_QUERIES_END #### */
};
