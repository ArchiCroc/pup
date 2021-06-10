import Uniforms from 'uniforms';
import SimpleSchema from 'simpl-schema';
import i18n from 'meteor/universe:i18n';
// import isString from 'lodash/isString';
// import sanitizeHtml from 'sanitize-html';
/* #### PLOP_IMPORTS_START #### */
/* #### PLOP_IMPORTS_END #### */

const UserSettingsSchema = new SimpleSchema({
  gdpr: {
    type: Object,
  },
  'gdpr.canSendMarketingEmails': {
    type: Boolean,
    label: () => i18n.__('Users.gdpr_can_send_marketing_emails'),
    defaultValue: false,
    uniforms: {
      colon: false,
    },
  },
  /* #### PLOP_SCHEMA_START #### */
  /* #### PLOP_SCHEMA_END #### */
});

export default UserSettingsSchema;
