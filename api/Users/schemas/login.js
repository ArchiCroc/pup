import Uniforms from 'uniforms';
import SimpleSchema from 'simpl-schema';
import i18n from 'meteor/universe:i18n';
import isString from 'lodash/isString';

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
      if (this.value && isString(this.value)) {
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
