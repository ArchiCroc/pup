import Uniforms from 'uniforms';
import SimpleSchema from 'simpl-schema';
import i18n from 'meteor/universe:i18n';
<<<<<<< HEAD
import isString from 'lodash/isString';
=======
import { _ } from 'underscore';
>>>>>>> a936134e9a65750e8afa972cacbc538c8cc31f68

const UserLoginSchema = new SimpleSchema({
  emailAddress: {
    type: String,
    label: () => i18n.__('email_address'),
    max: 200,
    regEx: SimpleSchema.RegEx.Email,
    uniforms: {
      type: 'email',
      placeholder: () => i18n.__('email_address'),
    },
    autoValue() {
<<<<<<< HEAD
      if (this.value && isString(this.value)) {
=======
      if (this.value && _.isString(this.value)) {
>>>>>>> a936134e9a65750e8afa972cacbc538c8cc31f68
        return this.value.toLowerCase();
      }
      return this.value;
    },
  },
  password: {
    type: String,
    label: () => i18n.__('password'),
    max: 128,
    uniforms: {
      type: 'password',
      placeholder: () => i18n.__('password'),
    },
  },
});

export default UserLoginSchema;
