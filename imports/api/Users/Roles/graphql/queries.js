import checkUserRole from '/imports/api/libs/checkUserRole';
import UsersRoles from '../UsersRoles';

export default {
  usersRoles: (parent, args, { user }) => {
    if (!user || !user._id || !checkUserRole(user._id, ['admin'])) {
      throw new Error('Sorry, you must have permission to view Users Roles.');
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

    const result = UsersRoles.find(query, options);

    return {
      total: result.count(false),
      usersRoles: result.fetch(),
    };
  },
  myUsersRoles: (parent, args, { user }) => {
    if (!user || !user._id || !checkUserRole(user._id, ['admin'])) {
      throw new Error('Sorry, you must have permission to view my Users Roles.');
    }

    /* #### PLOP_QUERY_VALIDATION_START #### */
    /* #### PLOP_QUERY_VALIDATION_END #### */

    const query = { createdById: user._id };
    const options = {};

    /* #### PLOP_QUERY_PRE_FIND_START #### */
    /* #### PLOP_QUERY_PRE_FIND_END #### */

    return UsersRoles.find(query).fetch(query, options);
  },
  usersRole: (parent, args, { user }) => {
    if (!user || !user._id || !checkUserRole(user._id, ['admin'])) {
      throw new Error('Sorry, you must have permission to view Users Role.');
    }

    /* #### PLOP_QUERY_VALIDATION_START #### */
    /* #### PLOP_QUERY_VALIDATION_END #### */

    const query = {};
    const options = {};

    /* #### PLOP_QUERY_PRE_FIND_START #### */
    /* #### PLOP_QUERY_PRE_FIND_END #### */

    const _id = (parent && parent.usersRoleId) || args._id;
    if (_id) {
      query._id = _id;
      return UsersRoles.findOne(query, options);
    }
    const name = (parent && parent.usersRoleName) || args.name;
    if (name) {
      query.name = name;
      return UsersRoles.findOne(query);
    }
    return null;
  },
  /* #### PLOP_QUERIES_START #### */
  /* #### PLOP_QUERIES_END #### */
};
