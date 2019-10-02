import isArray from 'lodash/isArray';
import ErrorReports from './ErrorReports';
import checkUserRole from '../Users/actions/checkUserRole';

export default {
  errorReports: (parent, args, context) => {
    if (!context.user || !context.user._id || !checkUserRole(context.user._id, 'admin')) {
      throw new Error('Sorry, you must have permission to view ErrorReports.');
    }

    const {
      search,
      pageSize = 10,
      currentPage = 1,
      sort = 'createdAtUTC',
      order = 'descend',
      level,
    } = args;

    const cleanPageSize = pageSize > 100 ? 100 : pageSize;

    const options = {
      limit: cleanPageSize,
      skip: currentPage * cleanPageSize - cleanPageSize,
    };

    const orderDirection = order === 'descend' ? -1 : 1;

    options.sort = {};
    options.sort[sort] = orderDirection;

    const query = {};
    if (isArray(level)) {
      query.level = { $in: level };
    }

    if (search) {
      const searchRegEx = new RegExp(search, 'i');
      query.$or = [{ level: searchRegEx }];
    }

    const result = ErrorReports.find(query, options);

    return {
      total: result.count(false),
      errorReports: result.fetch(),
    };
  },
  myErrorReports: (parent, args, context) => {
    if (!context.user || !context.user._id || !checkUserRole(context.user._id, 'admin')) {
      throw new Error('Sorry, you must have permission to view my ErrorReports.');
    }
    return ErrorReports.find(
      { createdById: context.user._id },
      { sort: { createdAtUTC: -1 } },
    ).fetch();
  },
  errorReport: (parent, args, context) => {
    if (!context.user || !context.user._id || !checkUserRole(context.user._id, 'admin')) {
      throw new Error('Sorry, you must have permission to view ErrorReport.');
    }
    const errorReportIdFromParentQuery = parent && parent.errorReportId;

    return ErrorReports.findOne({ _id: errorReportIdFromParentQuery || args._id });
  },
  /* #### PLOP_QUERIES_START #### */
  /* #### PLOP_QUERIES_END #### */
};
