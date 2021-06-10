import { Accounts } from 'meteor/accounts-base';
import sendWelcomeEmail from '../../../api/Users/actions/sendWelcomeEmail';
import isOAuthUser from '../../../api/Users/actions/isOAuthUser';
import UserSettingsSchema from '/imports/common/Users/schemas/user-settings';

Accounts.onCreateUser((options, user) => {
  const userToCreate = user;
  if (options.profile) userToCreate.profile = options.profile;
  if (isOAuthUser({ user: userToCreate })) {
    sendWelcomeEmail({ user: userToCreate }); // NOTE: Sent for OAuth accounts only here. Sent for password accounts after email verification (https://cleverbeagle.com/pup/v2/accounts/email-verification).
  }

  userToCreate.roles = ['user'];

  const defaultSettings = UserSettingsSchema.clean({});
  userToCreate.settings = defaultSettings;

  return userToCreate;
});
