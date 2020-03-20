import checkUserRole from '../Users/actions/checkUserRole';
import Roles from './Roles';

export default {
  roles: (parent, args, { user }) => {
    if (!user || !user._id || !checkUserRole(user._id, ['user'])) {
      throw new Error('Sorry, you must have permission to view Roles.');
    }

    /* #### PLOP_QUERY_VALIDATION_START #### */
    /* #### PLOP_QUERY_VALIDATION_END #### */

    const { _ids, pageSize = 10, page = 1, sort = 'name', order = 'ascend', search } = args;

    const cleanPageSize = pageSize > 100 ? 100 : pageSize;

    const options = _ids
      ? {}
      : {
          limit: cleanPageSize,
          skip: page * cleanPageSize - cleanPageSize,
        };

    const orderDirection = order === 'descend' ? -1 : 1;
    options.sort = {};
    options.sort[sort] = orderDirection;

    const query = {};

    if (_ids) {
      query._id = { $in: _ids };
    }

    if (search) {
      const searchRegEx = new RegExp(search, 'i');
      query.$or = [{ name: searchRegEx }];
    }

    /* #### PLOP_QUERY_PRE_FIND_START #### */
    /* #### PLOP_QUERY_PRE_FIND_END #### */

    const result = Roles.find(query, options);

    return {
      total: result.count(false),
      roles: result.fetch(),
    };
  },
  myRoles: (parent, args, { user }) => {
    if (!user || !user._id || !checkUserRole(user._id, ['user'])) {
      throw new Error('Sorry, you must have permission to view my Roles.');
    }

    /* #### PLOP_QUERY_VALIDATION_START #### */
    /* #### PLOP_QUERY_VALIDATION_END #### */

    const query = { createdById: user._id };
    const options = {};

    /* #### PLOP_QUERY_PRE_FIND_START #### */
    /* #### PLOP_QUERY_PRE_FIND_END #### */

    return Roles.find(query).fetch(query, options);
  },
  role: (parent, args, { user }) => {
    if (!user || !user._id || !checkUserRole(user._id, ['user'])) {
      throw new Error('Sorry, you must have permission to view Role.');
    }

    /* #### PLOP_QUERY_VALIDATION_START #### */
    /* #### PLOP_QUERY_VALIDATION_END #### */

    const query = {};
    const options = {};

    /* #### PLOP_QUERY_PRE_FIND_START #### */
    /* #### PLOP_QUERY_PRE_FIND_END #### */

    const _id = (parent && parent.roleId) || args._id;
    if (_id) {
      query._id = _id;
      return Roles.findOne(query, options);
    }
    const name = (parent && parent.roleName) || args.name;
    if (name) {
      query.name = name;
      return Roles.findOne(query);
    }
    return null;
  },
  /* #### PLOP_QUERIES_START #### */
  /* #### PLOP_QUERIES_END #### */
};
