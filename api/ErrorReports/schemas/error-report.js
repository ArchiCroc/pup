import Uniforms from 'uniforms';
import SimpleSchema from 'simpl-schema';
import i18n from 'meteor/universe:i18n';
/* #### PLOP_IMPORTS_START #### */
/* #### PLOP_IMPORTS_END #### */

const ErrorReportSchema = new SimpleSchema({
  _id: {
    type: String,
    optional: true,
    max: 24,
    uniforms: {
      type: 'hidden',
    },
  },
  userId: {
    type: String,
    optional: true,
    max: 24,
    uniforms: {
      type: 'hidden',
    },
  },
  level: {
    type: SimpleSchema.Integer,
    label: () => i18n.__('ErrorReports.level_label'),
    autoValue() {
      if (this.value) {
        return parseInt(this.value, 10);
      }
      return 0; // defaultValue
    },
    allowedValues: [0, 1, 2, 3, 4, 5],
    uniforms: {
      placeholder: () => i18n.__('ErrorReports.level_placeholder'),
    },
  },
  message: {
    type: String,
    label: () => i18n.__('ErrorReports.message_label'),
    max: 1024,
    uniforms: {
      placeholder: () => i18n.__('ErrorReports.message_placeholder'),
    },
  },
  userAgent: {
    type: String,
    label: () => i18n.__('ErrorReports.user_agent_label'),
    optional: true,
    max: 1024,
    uniforms: {
      placeholder: () => i18n.__('ErrorReports.user_agent_placeholder'),
    },
  },
  path: {
    type: String,
    label: () => i18n.__('ErrorReports.path_label'),
    optional: true,
    max: 1024,
    uniforms: {
      placeholder: () => i18n.__('ErrorReports.path_placeholder'),
    },
  },
  stack: {
    type: Array,
    label: () => i18n.__('ErrorReports.stack_label'),
    optional: true,
    autoValue() {
      if (typeof this.value === 'string') {
        return this.value.split(/\r?\n/);
      }
      return this.value;
    },
    uniforms: {
      placeholder: () => i18n.__('ErrorReports.stack_placeholder'),
    },
  },
  'stack.$': {
    type: String,
  },
  reactStack: {
    type: Array,
    label: () => i18n.__('ErrorReports.react_stack_label'),
    optional: true,
    autoValue() {
      if (typeof this.value === 'string') {
        return this.value.split(/\r?\n/);
      }
      return this.value;
    },
    uniforms: {
      placeholder: () => i18n.__('ErrorReports.react_stack_placeholder'),
    },
  },
  'reactStack.$': {
    type: String,
  },
  /* #### PLOP_SCHEMA_START #### */
  /* #### PLOP_SCHEMA_END #### */
});

export default ErrorReportSchema;
