import Uniforms from 'uniforms';
import SimpleSchema from 'simpl-schema';
import i18n from 'meteor/universe:i18n';
<<<<<<< HEAD
import isString from 'lodash/isString';
=======
import { isString } from 'underscore';
>>>>>>> a936134e9a65750e8afa972cacbc538c8cc31f68

const SignupSchema = new SimpleSchema({
  firstName: {
    type: String,
    label: () => i18n.__('first_name'),
    max: 100,
    uniforms: {
      placeholder: () => i18n.__('first_name'),
    },
  },
  lastName: {
    type: String,
    label: () => i18n.__('last_name'),
    max: 100,
    uniforms: {
      placeholder: () => i18n.__('last_name'),
    },
  },
  emailAddress: {
    type: String,
    label: () => i18n.__('email_address'),
    max: 200,
    regEx: SimpleSchema.RegEx.Email,
    autoValue() {
      if (this.value && isString(this.value)) {
        return this.value.toLowerCase();
      }
      return this.value;
    },
    uniforms: {
      type: 'email',
      placeholder: () => i18n.__('email_address'),
    },
  },
  password: {
    type: String,
    label: () => i18n.__('password'),
    optional: false,
    min: 8,
    max: 100,
    uniforms: {
      type: 'password',
      placeholder: () => i18n.__('password'),
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
});

// var password_match_error = TAPi18n.__('password_match_error');
// SignupSchema.messages({
SimpleSchema.setDefaultMessages({
  messages: {
    en: {
      alreadyRegistered: 'Email Address Already Exists', // this check could leak who is registered. hmmm
    },
  },
  //  noMatch: "Password Doesn't Match",
});

export default SignupSchema;
