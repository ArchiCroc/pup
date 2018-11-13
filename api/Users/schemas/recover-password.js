import Uniforms from 'uniforms';
import SimpleSchema from 'simpl-schema';
import i18n from 'meteor/universe:i18n';
import { isString } from 'underscore';

const RecoverPasswordSchema = new SimpleSchema({
  emailAddress: {
    type: String,
    label: () => i18n.__('email_address'),
    max: 200,
    optional: false,
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
});

export default RecoverPasswordSchema;
