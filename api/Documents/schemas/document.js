import Uniforms from 'uniforms';
import SimpleSchema from 'simpl-schema';
import i18n from 'meteor/universe:i18n';
import isString from 'lodash/isString';
import sanitizeHtml from 'sanitize-html';

const DocumentSchema = new SimpleSchema({
  _id: {
    type: String,
    max: 50,
    optional: true,
    uniforms: {
      type: 'hidden',
    },
  },
  isPublic: {
    type: Boolean,
    label: () => i18n.__('is_public'),
    defaultValue: false,
  },
  title: {
    type: String,
    label: () => i18n.__('title'),
    max: 100,
    uniforms: {
      placeholder: () => i18n.__('title'),
    },
  },
  body: {
    type: String,
    optional: true,
    label: () => i18n.__('body'),
    uniforms: {
      placeholder: () => i18n.__('body_placeholder'),
    },
    autoValue() {
      if (this.value && isString(this.value)) {
        return sanitizeHtml(this.value);
      } // else
      return 'This is my document. There are many like it, but this one is mine.';
    },
  },
});

export default DocumentSchema;
