import Uniforms from 'uniforms';
import SimpleSchema from 'simpl-schema';
import i18n from 'meteor/universe:i18n';
/* #### PLOP_IMPORTS_START #### */
/* #### PLOP_IMPORTS_END #### */

const cleanLevel = (item) => parseInt(item, 10);;

const ErrorReportSchema = new SimpleSchema({
  _id: {
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
    max: 1,
    autoValue() {
      if (this.value) {
        return cleanLevel(this.value);
      }
      return this.value;
    },
    allowedValues: [0, 1, 2, 3, 3, 5],
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
  path: {
    type: String,
    label: () => i18n.__('ErrorReports.path_label'),
    optional: true,
    max: 1024,
    uniforms: {
      placeholder: () => i18n.__('ErrorReports.path_placeholder'),
    },
  },
  trace: {
    type: Array,
    label: () => i18n.__('ErrorReports.trace_label'),
    optional: true,
    uniforms: {
      placeholder: () => i18n.__('ErrorReports.trace_placeholder'),
    },
  },
  'trace.$': {
    type: String,
  },
  /* #### PLOP_SCHEMA_START #### */
  /* #### PLOP_SCHEMA_END #### */
});

export default ErrorReportSchema;
