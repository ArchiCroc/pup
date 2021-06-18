import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { User } from '/imports/common/Users/interfaces';
import { Context } from '/imports/common/interfaces';
import updateUser from '../actions/updateUser';
import { isAdmin } from '../actions/checkIfAuthorized';
import queryUser from '../actions/queryUser';
import removeUser from '../actions/removeUser';
import sendWelcomeEmail from '../actions/sendWelcomeEmail';
import UserSettingsSchema from '/imports/common/Users/schemas/user-settings';

export default {
  updateUser: async (parent: unknown, args: { user: User }, { user }: Context) => {
    await updateUser({
      currentUser: user,
      user: args.user,
    });

    return queryUser({ userIdToQuery: args.user._id || user._id });
  },
  updateUserSettings: async (parent: unknown, args: { _id: string, settings: any }, { user }: Context) => {
    if (!user || !user._id) {
      throw new Error('Sorry, You must be logged in to Update User Settings');
    }

    const cleanDoc = UserSettingsSchema.clean(args.settings);
    UserSettingsSchema.validate(cleanDoc);



    let { _id } = user;
    // check to see if the user is an admin and a user id was passed
    if (args._id && isAdmin(user._id)) {
      ({ _id } = args);
    }
    // console.log('updateUserSettings', args);

    try {
      Meteor.users.update(_id, {
        $set: { settings: cleanDoc },
      });
    } catch (exception) {
      throw new Error(`[updateUser.updateUserSettings] ${exception.message}`);
    }

    return queryUser({ userIdToQuery: _id });
  },
  removeUser: (parent: unknown, args: { user: User }, { user }: Context) =>
    removeUser({
      currentUser: user,
      user: args,
    }),
  sendVerificationEmail: (parent: unknown, args: unknown, { user }: Context) => {
    if (!user || !user._id) {
      throw new Error('Sorry, You must be logged in to Send Verification Email');
    }
    Accounts.sendVerificationEmail(user._id);

    return {
      _id: user._id,
    };
  },
  sendWelcomeEmail: async (parent: unknown, args: unknown, { user }: Context) => {
    await sendWelcomeEmail({ user: Meteor.users.findOne(user._id) });

    return {
      _id: user._id,
    };
  },
  /* #### PLOP_MUTATIONS_START #### */
  /* #### PLOP_MUTATIONS_END #### */
};
