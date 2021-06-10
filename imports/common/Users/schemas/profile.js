import Uniforms from 'uniforms';
import SimpleSchema from 'simpl-schema';
import i18n from 'meteor/universe:i18n';
import isString from 'lodash/isString';

const ProfileSchema = new SimpleSchema({
  _id: {
    type: String,
    max: 50,
    optional: true,
    uniforms: {
      type: 'hidden',
    },
  },
  firstName: {
    type: String,
    label: () => i18n.__('Users.first_name'),
    max: 100,
    uniforms: {
      placeholder: () => i18n.__('Users.first_name'),
    },
  },
  lastName: {
    type: String,
    label: () => i18n.__('Users.last_name'),
    max: 100,
    uniforms: {
      placeholder: () => i18n.__('Users.last_name'),
    },
  },
  emailAddress: {
    type: String,
    label: () => i18n.__('Users.email_address'),
    max: 200,
    regEx: SimpleSchema.RegEx.Email,
    autoValue() {
      if (this.value && isString(this.value)) {
        return this.value.toLowerCase();
      }
      return this.value;
    },
    uniforms: {
      placeholder: () => i18n.__('Users.email_address'),
      type: 'email',
    },
  },
  currentPassword: {
    type: String,
    label: () => i18n.__('Users.current_password'),
    optional: true,
    min: 8,
    max: 100,
    uniforms: {
      type: 'password',
    },
    custom() {
      if (this.value && !this.field('newPassword').value) {
        console.log('Add error to new password');
        this.addValidationErrors([
          // @todo weird bug that type isn't being converted to the correct error message
          {
            name: 'newPassword',
            type: 'missingNewPassword',
            message: 'Need your new password if changing.',
          },
        ]);
        return false;
      }
      return null;
    },
  },
  newPassword: {
    type: String,
    label: () => i18n.__('Users.new_password'),
    optional: true,
    uniforms: {
      type: 'password',
    },
    custom() {
      // console.log('new', this.field('currentPassword').value);
      if (this.value && !this.field('currentPassword').value) {
        console.log('Add error to current password');
        this.addValidationErrors([
          {
            name: 'currentPassword',
            type: 'missingCurrentPassword',
            message: 'Need your current password if changing.',
          },
        ]);
        return false;
      }
      return null;
    },
  },
});

// var password_match_error = TAPi18n.__('password_match_error');
// SignupSchema.messages({
SimpleSchema.setDefaultMessages({
  messages: {
    en: {
      alreadyRegistered: i18n.__('email_address_already_exists'),
      missingNewPassword: i18n.__('missing_new_password'),
      missingCurrentPassword: i18n.__('missing_current_password'),
    },
  },
  //  noMatch: "Password Doesn't Match",
});

export default ProfileSchema;
