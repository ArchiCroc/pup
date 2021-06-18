import Uniforms from 'uniforms';
import SimpleSchema, { SimpleSchemaDefinition } from 'simpl-schema';
import i18n from 'meteor/universe:i18n';
// import isString from 'lodash/isString';
// import sanitizeHtml from 'sanitize-html';
/* #### PLOP_IMPORTS_START #### */
/* #### PLOP_IMPORTS_END #### */

SimpleSchema.extendOptions(['uniforms']);

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
} as SimpleSchemaDefinition);

export default UserSettingsSchema;
