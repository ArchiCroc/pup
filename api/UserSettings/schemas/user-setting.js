import Uniforms from 'uniforms';
import SimpleSchema from 'simpl-schema';
import i18n from 'meteor/universe:i18n';
import isString from 'lodash/isString';
import sanitizeHtml from 'sanitize-html';

const UserSettingsSchema = new SimpleSchema({
  isGDPR: {
    type: Boolean,
    label: () => i18n.__('Users.is_gdpr'),
    defaultValue: false,
  },
  key: {
    type: String,
    label: () => i18n.__('Users.key_name'),
    uniforms: {
      placeholder: () => i18n.__('Users.key_name_placeholder'),
    },
  },
  label: {
    type: String,
    label: () => i18n.__('Users.label'),
    uniforms: {
      placeholder: () => i18n.__('Users.label_placeholder'),
      help: () => i18n.__('Users.label_help'),
    },
  },
  type: {
    type: String,
    allowedValues: ['boolean', 'string', 'number'],
    label: () => i18n.__('Users.type'),
    // uniforms: {
    //     placeholder: () => i18n.__('Users.label_placeholder'),
    //     help: () => i18n.__('Users.label_help'),
    //   },
  },
  value: {
    type: SimpleSchema.oneOf(Boolean, Number, String),
    // label: 'The value for the setting',
    label: () => i18n.__('Users.value'),
    autoValue() {
      // eslint-disable-line
      // NOTE: Pass default value as a string to get around this:
      // https://github.com/aldeed/simple-schema-js/issues/169
      const type = this.field('type');
      if (type.value) {
        return {
          boolean: this.value == 'true', // eslint-disable-line
          string: this.value,
          number: parseInt(this.value, 10),
        }[type.value];
      }
      return undefined;
    },
    optional: true,
  },
});

export default UserSettingsSchema;
