import isArray from 'lodash/isArray';
import queryUsers from './actions/queryUsers';
import queryUser from './actions/queryUser';
import exportUserData from './actions/exportUserData';

export default {
  users: (parent, args, context) => {
    // console.log('args', parent, args, context);
    const {
      _ids,
      pageSize = 10,
      page = 1,
      sort = 'fullName',
      order = 'ascend',
      search,
      role,
      status,
    } = args;

    const query = {
      _ids,
      currentUser: context.user,
      search: search ? new RegExp(search, 'i') : null,
      limit: pageSize,
      skip: page * pageSize - pageSize,
    };

    const orderDirection = order === 'descend' ? -1 : 1;

    if (sort === 'fullName') {
      query.sort = {
        'profile.firstName': orderDirection,
        'profile.lastName': orderDirection,
        'services.facebook.first_name': orderDirection,
        'services.google.name': orderDirection,
        'services.github.username': orderDirection,
      };
    } else if (sort === 'emailAddress') {
      query.sort = {
        'emails.0.address': orderDirection,
      };
    } else if (sort === 'roles') {
      query.sort = {
        'roles.0': orderDirection,
      };
    }

    if (isArray(role) && role.length > 0) {
      query.roles = { $in: role };
    }

    if (isArray(status) && status.length > 0) {
      query.status = { $in: status };
    } else if (status) {
      query.status = status;
    }
    return queryUsers(query);
  },
  user: (parent, args, context) => {
    const userIdFromParentQuery = parent && parent.userId;
    return queryUser({
      userIdToQuery: userIdFromParentQuery || args._id || context.user._id,
    });
  },
  resolveUser: (parent, args, context) => {
    if (!context.user) throw new Error('Sorry, you must be logged in to resolve a user');
    if (!args._id) {
      return null;
    }
    return queryUser({
      userIdToQuery: args._id,
    });
  },
  resolveUsers: (parent, args, context) => {
    if (!context.user) throw new Error('Sorry, you must be logged in to resolve a user');

    const { _ids, sort = 'fullName', order = 'ascend' } = args;

    if (!_ids) {
      return null;
    }

    const query = {
      pagination: false,
      _ids,
      currentUser: context.user,
    };

    const orderDirection = order === 'descend' ? -1 : 1;

    if (sort === 'fullName') {
      query.sort = {
        'profile.firstName': orderDirection,
        'profile.lastName': orderDirection,
        'services.facebook.first_name': orderDirection,
        'services.google.name': orderDirection,
        'services.github.username': orderDirection,
      };
    } else if (sort === 'emailAddress') {
      query.sort = {
        'emails.0.address': orderDirection,
      };
    }

    return queryUsers(query);
  },
  exportUserData: (parent, args, { user }) =>
    exportUserData({
      user,
    }),
  /* #### PLOP_QUERIES_START #### */
  /* #### PLOP_QUERIES_END #### */
};
