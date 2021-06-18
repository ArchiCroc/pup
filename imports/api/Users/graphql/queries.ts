import isArray from 'lodash/isArray';
import { User, UsersParams, HasUserId } from '/imports/common/Users/interfaces';
import { Context } from '/imports/common/interfaces';
import queryUsers from '../actions/queryUsers';
import queryUser from '../actions/queryUser';
import exportUserData from '../actions/exportUserData';
import { SortOrder } from 'antd/lib/table/interface';

export default {
  users: (parent: unknown, args: UsersParams, { user }: Context) => {
    // console.log('args', parent: unknown, args, context);
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

    const query: any = {
      _ids,
      currentUser: user,
      search: search || null,
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
    } else {
      // exclude api users by default
      query.roles = { $ne: 'api' };
    }

    if (isArray(status) && status.length > 0) {
      query.status = { $in: status };
    } else if (status) {
      query.status = status;
    }
    return queryUsers(query);
  },
  user: (parent: HasUserId, args: {_id: string }, { user }: Context) => {
    const userIdFromParentQuery = parent && parent.userId;
    return queryUser({
      userIdToQuery: userIdFromParentQuery || args._id || user._id,
    });
  },
  resolveUser: (parent: unknown, args: {_id: string }, { user }: Context) => {
    if (!user) throw new Error('Sorry, you must be logged in to resolve a user');
    if (!args._id) {
      return null;
    }
    return queryUser({
      userIdToQuery: args._id,
    });
  },
  resolveUsers: (parent: unknown, args: {_ids: string[], sort?: string, order?: SortOrder }, { user }: Context) => {
    if (!user) throw new Error('Sorry, you must be logged in to resolve a user');

    const { _ids, sort = 'fullName', order = 'ascend' } = args;

    if (!_ids) {
      return null;
    }

    const query: any = {
      pagination: false,
      _ids,
      currentUser: user,
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
  exportUserData: (parent: unknown, args: { _id: string }, { user }: Context) =>
    exportUserData({
      user,
    }),
  /* #### PLOP_QUERIES_START #### */
  /* #### PLOP_QUERIES_END #### */
};
