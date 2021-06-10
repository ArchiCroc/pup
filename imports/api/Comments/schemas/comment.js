import Uniforms from 'uniforms';
import SimpleSchema from 'simpl-schema';
import i18n from 'meteor/universe:i18n';
import isString from 'lodash/isString';
import { Meteor } from 'meteor/meteor';
// if (Meteor.isServer) {
//   import sanitizeHtml from 'sanitize-html'; // eslint-disable-line
// }

const CommentSchema = new SimpleSchema({
  _id: {
    type: String,
    max: 50,
    optional: true,
    uniforms: {
      type: 'hidden',
    },
  },
  documentId: {
    type: String,
    max: 50,
    optional: false,
    uniforms: {
      type: 'hidden',
    },
  },
  comment: {
    type: String,
    optional: true,
    label: () => i18n.__('comment'),
    uniforms: {
      placeholder: () => i18n.__('comment_placeholder'),
    },
    autoValue() {
      if (this.value && isString(this.value)) {
        // if (Meteor.isServer) {
        //   return sanitizeHtml(this.value);
        // } else {

        return this.value;
        // }
      } // else
      return null;
    },
  },
});

export default CommentSchema;
