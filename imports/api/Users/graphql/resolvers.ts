import { User } from '/imports/common/Users/interfaces';
import UserQueries from './queries';
import UserMutations from './mutations';

export default {
  Query: UserQueries,
  Mutation: UserMutations,
  User: {
    fullName: (user: User) =>
      (user.profile &&
        (user.profile.firstName || user.profile.lastName) &&
        `${user.profile.firstName} ${user.profile.lastName}`) ||
      user.username,
  },
};
