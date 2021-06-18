import Uniforms from 'uniforms';
import SimpleSchema, { SimpleSchemaDefinition, AutoValueContext } from 'simpl-schema';
import i18n from 'meteor/universe:i18n';
import isString from 'lodash/isString';

const UserLoginSchema = new SimpleSchema({
  emailAddress: {
    type: String,
    label: () => i18n.__('Users.email_address'),
    max: 200,
    regEx: SimpleSchema.RegEx.Email,
    uniforms: {
      type: 'email',
      placeholder: () => i18n.__('Users.email_address'),
    },
    autoValue(this: AutoValueContext) {
      if (this.value && isString(this.value)) {
        return this.value.toLowerCase();
      }
      return this.value;
    },
  },
  password: {
    type: String,
    label: () => i18n.__('Users.password'),
    max: 128,
    uniforms: {
      type: 'password',
      placeholder: () => i18n.__('Users.password'),
    },
  },
} as SimpleSchemaDefinition);

export default UserLoginSchema;
