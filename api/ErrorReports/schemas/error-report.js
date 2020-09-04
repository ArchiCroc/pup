import { Mongo } from 'meteor/mongo';
import Uniforms from 'uniforms';
import SimpleSchema from 'simpl-schema';
import i18n from 'meteor/universe:i18n';
/* #### PLOP_IMPORTS_START #### */
/* #### PLOP_IMPORTS_END #### */
import parseObjectID from '../../../libs/parseObjectID';

const cleanLevel = (item) => parseInt(item, 10);

const ErrorReportSchema = new SimpleSchema({
  _id: {
    type: Mongo.ObjectID,
    optional: true,
    max: 24,
    autoValue() {
      return parseObjectID(this.value);
    },
    blackbox: true,
    uniforms: {
      type: 'hidden',
    },
  },
  userId: {
    type: String,
    label: () => i18n.__('ErrorReports.user_label'),
    uniforms: {
      placeholder: () => i18n.__('ErrorReports.user_placeholder'),
      query: 'users',
      edges: 'users',
      initialLabelKey: 'user',
      labelKey: 'fullName',
      valueKey: '_id',
      idType: 'String',
    },
  },
  level: {
    type: SimpleSchema.Integer,
    label: () => i18n.__('ErrorReports.level_label'),
    autoValue() {
      if (this.value != null) {
        return cleanLevel(this.value);
      }
      return this.value;
    },
    allowedValues: [0, 1, 2, 3, 4, 5],
    uniforms: {
      placeholder: () => i18n.__('ErrorReports.level_placeholder'),
      transform: (value) => i18n.__(`ErrorReports.level_${value}`),
    },
  },
  message: {
    type: String,
    label: () => i18n.__('ErrorReports.message_label'),
    max: 2048,
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
  userAgent: {
    type: String,
    label: () => i18n.__('ErrorReports.user_agent_label'),
    optional: true,
    max: 1024,
    uniforms: {
      placeholder: () => i18n.__('ErrorReports.user_agent_placeholder'),
    },
  },
  stack: {
    type: Array,
    label: () => i18n.__('ErrorReports.stack_label'),
    optional: true,
    uniforms: {
      placeholder: () => i18n.__('ErrorReports.stack_placeholder'),
    },
  },
  'stack.$': {
    type: String,
    label: () => i18n.__('ErrorReports.stack_label'),
    optional: true,
  },
  reactStack: {
    type: Array,
    label: () => i18n.__('ErrorReports.react_stack_label'),
    optional: true,
    uniforms: {
      placeholder: () => i18n.__('ErrorReports.react_stack_placeholder'),
    },
  },
  'reactStack.$': {
    type: String,
    label: () => i18n.__('ErrorReports.react_stack_label'),
    optional: true,
  },
  /* #### PLOP_SCHEMA_START #### */
  /* #### PLOP_SCHEMA_END #### */
});

export default ErrorReportSchema;
