import Uniforms from 'uniforms';
import SimpleSchema from 'simpl-schema';
import i18n from 'meteor/universe:i18n';

const UserChangePasswordSchema = new SimpleSchema({
  oldPassword: {
    type: String,
    label: () => i18n.__('old_password'),
    optional: false,
    min: 8,
    max: 200,
    uniforms: {
      type: 'password',
    },
  },
  newPassword: {
    type: String,
    label: () => i18n.__('new_password'),
    optional: false,
    min: 8,
    max: 200,
    uniforms: {
      type: 'password',
    },
  },
  confirmation: {
    type: String,
    label: () => i18n.__('confirm_new_password'),
    optional: false,
    uniforms: {
      type: 'password',
    },
    custom() {
      if (this.value !== this.field('newPassword').value) {
        return 'noMatch';
      }
      return null;
    },
  },
});

export default UserChangePasswordSchema;

// var password_match_error = TAPi18n.__('password_match_error');

// UsersSchemas.UserChangePassword.messages({
//     noMatch: 'password_match_error' //function(){ return TAPi18n.__('password_match_error'); }
// });
