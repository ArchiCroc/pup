import Uniforms from 'uniforms';
import SimpleSchema from 'simpl-schema';
import i18n from 'meteor/universe:i18n';
// import isString from 'lodash/isString';
// import sanitizeHtml from 'sanitize-html';

const UserSettingsSchema = new SimpleSchema({
  gdprCanSendMarketingEmails: {
    type: Boolean,
    label: () => i18n.__('Users.gdpr_can_send_marketing_emails'),
    defaultValue: false,
    uniforms: {
      colon: false,
    },
  },
});

export default UserSettingsSchema;
