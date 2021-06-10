import { Meteor } from 'meteor/meteor';
import checkIfAuthorized from './checkIfAuthorized';
import mapMeteorUserToSchema from './mapMeteorUserToSchema';
import hasRole from '/imports/common/libs/hasRole';

/* eslint-disable consistent-return */

let action;

const getTotalUserCount = (options) => {
  const query = {
    // _id: { $ne: currentUserId }
  };

  if (options.roles) {
    query.roles = options.roles;
  }
  if (options.status) {
    query.status = options.status;
  }

  try {
    return Meteor.users.find(query).count();
  } catch (exception) {
    throw new Error(`[queryUsers.getTotalUserCount] ${exception.message}`);
  }
};

const getProjection = (options) => {
  try {
    return options._ids
      ? { sort: options.sort }
      : { limit: options.limit, skip: options.skip, sort: options.sort };
  } catch (exception) {
    throw new Error(`[queryUsers.getProjection] ${exception.message}`);
  }
};

const getQuery = (options) => {
  try {
    if (options.search) {
      const searchParts = options.search.split(/[, ]/);
      const search = new RegExp(`(${searchParts.join('|')})`, 'i');
      //console.log('[getQuery]', `(${searchParts.join('|')})`);

      return {
        // _id: { $ne: options.currentUser._id }, // I'm not sure the use of this
        $or: [
          { 'profile.firstName': search },
          { 'profile.lastName': search },
          { 'emails.address': search },
          { 'services.facebook.first_name': search },
          { 'services.facebook.last_name': search },
          { 'services.facebook.email': search },
          { 'services.google.name': search },
          { 'services.google.email': search },
          { 'services.github.email': search },
          { 'services.github.username': search },
        ],
      };
    }
    if (options._ids) {
      return {
        _id: { $in: options._ids },
      };
    }
    return {
      /*_id: { $ne: options.currentUser._id }*/
    };
  } catch (exception) {
    throw new Error(`[queryUsers.getQuery] ${exception.message}`);
  }
};

const getUsers = (options) => {
  try {
    const query = getQuery(options);
    if (options.roles) {
      query.roles = options.roles;
    }
    // only list enabled users by default
    if (options.status) {
      query.status = options.status;
    }
    // console.log(query);
    const projection = getProjection(options);
    return Meteor.users
      .find(query, projection)
      .fetch()
      .map((user) => mapMeteorUserToSchema({ user }));
  } catch (exception) {
    throw new Error(`[queryUsers.getUsers] ${exception.message}`);
  }
};

const validateOptions = (options) => {
  try {
    if (!options) throw new Error('options object is required.');
    if (!options.currentUser) throw new Error('options.currentUser is required.');
  } catch (exception) {
    throw new Error(`[queryUsers.validateOptions] ${exception.message}`);
  }
};

const queryUsers = (options) => {
  try {
    validateOptions(options);
    checkIfAuthorized({ as: ['admin'], userId: options.currentUser._id });
    if (options.pagination === false) {
      action.resolve(getUsers(options));
    } else {
      action.resolve({
        total: getTotalUserCount(options),
        users: getUsers(options),
      });
    }
  } catch (exception) {
    action.reject(`[queryUsers] ${exception.message}`);
  }
};

export default (options) =>
  new Promise((resolve, reject) => {
    action = { resolve, reject };
    queryUsers(options);
  });
