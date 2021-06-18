import SimpleSchema from 'simpl-schema';
SimpleSchema.extendOptions(['uniforms']);
import SimpleSchema2Bridge from '/imports/common/libs/custom-uniforms-bridge-simple-schema-2'; //needed so the uniforms addition loads
import { Accounts } from 'meteor/accounts-base';
import sendWelcomeEmail from '/imports/api/Users/actions/sendWelcomeEmail';
import isOAuthUser from '/imports/api/Users/actions/isOAuthUser';
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
