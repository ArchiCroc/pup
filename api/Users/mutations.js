import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import updateUser, { updateUserSettings } from './actions/updateUser';
import { isAdmin } from './actions/checkIfAuthorized';
import queryUser from './actions/queryUser';
import removeUser from './actions/removeUser';
import sendWelcomeEmail from './actions/sendWelcomeEmail';
import UserSettingsSchema from './schemas/user-settings';

export default {
  updateUser: async (parent, args, context) => {
    await updateUser({
      currentUser: context.user,
      user: args.user,
    });

    return queryUser({ userIdToQuery: args.user._id || context.user._id });
  },
  updateUserSettings: async (parent, args, context) => {
    const cleanDoc = UserSettingsSchema.clean(args.settings);
    UserSettingsSchema.validate(cleanDoc);

    let { _id } = context.user;
    // check to see if the user is an admin and a user id was passed
    if (args._id && isAdmin(context.user._id)) {
      ({ _id } = args);
    }
    console.log('updateUserSettings', args);

    try {
      Meteor.users.update(_id, {
        $set: { settings: cleanDoc },
      });
    } catch (exception) {
      throw new Error(`[updateUser.updateUserSettings] ${exception.message}`);
    }

    return queryUser({ userIdToQuery: _id });
  },
  removeUser: (parent, args, { user }) =>
    removeUser({
      currentUser: user,
      user: args,
    }),
  sendVerificationEmail: (parent, args, context) => {
    Accounts.sendVerificationEmail(context.user._id);

    return {
      _id: context.user._id,
    };
  },
  sendWelcomeEmail: async (parent, args, context) => {
    await sendWelcomeEmail({ user: Meteor.users.findOne(context.user._id) });

    return {
      _id: context.user._id,
    };
  },
  /* #### PLOP_MUTATIONS_START #### */
  /* #### PLOP_MUTATIONS_END #### */
};
