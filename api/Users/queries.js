import queryUsers from './actions/queryUsers';
import queryUser from './actions/queryUser';
import exportUserData from './actions/exportUserData';

export default {
  users: (parent, args, context) => {
    // console.log('args', args);
    const { search, pageSize = 10, page = 1, sort = 'name', order = 'ascend' } = args;

    const query = {
      currentUser: context.user,
      search: search ? new RegExp(search, 'i') : null,
      limit: pageSize,
      skip: page * pageSize - pageSize,
    };

    const orderDirection = order === 'descend' ? -1 : 1;

    if (sort === 'profile') {
      query.sort = {
        'profile.firstName': orderDirection,
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
  user: (parent, args, context) => {
    const userIdFromParentQuery = parent && parent.userId;
    return queryUser({
      userIdToQuery: userIdFromParentQuery || args._id || context.user._id,
    });
  },
  exportUserData: (parent, args, { user }) =>
    exportUserData({
      user,
    }),
};
