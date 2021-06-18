import Uniforms from 'uniforms';
import SimpleSchema, { SimpleSchemaDefinition, AutoValueContext } from 'simpl-schema';
import i18n from 'meteor/universe:i18n';
import isString from 'lodash/isString';

const SignupSchema = new SimpleSchema({
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
    autoValue(this: AutoValueContext) {
      if (this.value && isString(this.value)) {
        return this.value.toLowerCase();
      }
      return this.value;
    },
    uniforms: {
      type: 'email',
      placeholder: () => i18n.__('Users.email_address'),
    },
  },
  password: {
    type: String,
    label: () => i18n.__('Users.password'),
    optional: false,
    min: 8,
    max: 100,
    uniforms: {
      type: 'password',
      placeholder: () => i18n.__('Users.password'),
      extra: () => i18n.__('Users.password_help'),
    },
  },
  /*  confirmation: {
    type: String,
    label: 'Confirm Password',
    optional: false,
    uniforms: {
      type: 'password',
    },
    custom() {
      if (this.value !== this.field('password').value) {
        return 'noMatch';
      }
      return null;
    },
  }, */
} as SimpleSchemaDefinition);

// var password_match_error = TAPi18n.__('password_match_error');
// SignupSchema.messages({
SimpleSchema.setDefaultMessages({
  messages: {
    en: {
      alreadyRegistered: i18n.__('Users.email_address_already_exists'), // this check could leak who is registered. hmmm
    },
  },
  //  noMatch: "Password Doesn't Match",
});

export default SignupSchema;
