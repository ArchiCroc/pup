import { Accounts } from 'meteor/accounts-base';
import './oauth';
import './emailTemplates';
import './onCreateUser';
// @todo wrap this in a config setting
Accounts.config({
  sendVerificationEmail: true,
});
