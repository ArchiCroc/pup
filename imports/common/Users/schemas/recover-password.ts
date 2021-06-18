import Uniforms from 'uniforms';
import SimpleSchema, { SimpleSchemaDefinition, AutoValueContext } from 'simpl-schema';
import i18n from 'meteor/universe:i18n';
import isString from 'lodash/isString';

const RecoverPasswordSchema = new SimpleSchema({
  emailAddress: {
    type: String,
    label: () => i18n.__('Users.email_address'),
    max: 200,
    optional: false,
    regEx: SimpleSchema.RegEx.Email,
    autoValue(this: AutoValueContext) {
      if (this.value && isString(this.value)) {
        return this.value.toLowerCase();
      }
      return this.value;
    },
    uniforms: {
      type: 'email',
      placeholder: () => i18n.__('Users.email_address_placeholder'),
    },
  },
} as SimpleSchemaDefinition);

export default RecoverPasswordSchema;
