/* eslint-disable no-template-curly-in-string */
import Uniforms from 'uniforms';
import SimpleSchema from 'simpl-schema';
import i18n from 'meteor/universe:i18n';
import isString from 'lodash/isString';
import moment from 'moment-timezone';

function dateCleanup() {
  const { value } = this;
  if (!value) {
    return;
  }
  const dateRegex = /(\d{1,4})[-/.](\d{1,4})[-/.](\d{1,4})T?/;
  console.log('first vlaue', value);
  const result = dateRegex.exec(new Date(value).toISOString());

  if (result) {
    const a = (result[1].length === 1 ? '0' : '') + result[1];
    const b = (result[2].length === 1 ? '0' : '') + result[2];
    const c = (result[3].length === 1 ? '0' : '') + result[3];

    const date = moment(`${a}-${b}-${c}`, 'YYYY-MM-DD');
    if (date.isValid()) {
      this.value = `${a}-${b}-${c}`;
    }
    console.log('value', date, this.value, date.isValid());
  }
}

const OfficeSchema = new SimpleSchema({
  _id: {
    type: String,
    max: 50,
    optional: true,
    uniforms: {
      type: 'hidden',
    },
  },
  name: {
    type: String,
    label: () => i18n.__('Offices.name'),
    max: 64,
    uniforms: {
      placeholder: () => i18n.__('Offices.name'),
    },
  },
  slug: {
    // @todo do more to normalize invalid characters
    type: String,
    label: () => i18n.__('Offices.slug'),
    max: 48,
    autoValue() {
      // always force slug to lowercase
      if (this.value && isString(this.value)) {
        return this.value.toLowerCase();
      }
      return this.value;
    },
    uniforms: {
      placeholder: () => i18n.__('Offices.slug'),
    },
  },
  folderName: {
    type: String,
    label: () => i18n.__('Offices.folder_name'),
    max: 4,
    autoValue() {
      // always force slug to lowercase
      if (this.value && isString(this.value)) {
        return this.value.toUpperCase();
      }
      return this.value;
    },
    uniforms: {
      placeholder: () => i18n.__('Offices.folder_name_placeholder'),
    },
  },
  visionNames: {
    type: Array,
    label: () => i18n.__('Offices.vision_name'),
    optional: true,
  },
  'visionNames.$': {
    type: String,
    max: 48,
    uniforms: {
      placeholder: () => i18n.__('Offices.vision_name'),
    },
    optional: true,
  },
  ipSubnets: {
    type: Array,
    label: () => i18n.__('Offices.ip_subnets'),
    max: 48,
    uniforms: {
      placeholder: () => i18n.__('Offices.ip_subnet_placeholder'),
    },
    optional: true,
  },
  'ipSubnets.$': {
    type: String,
  },
  projectNumberCode: {
    type: String,
    label: () => i18n.__('Offices.project_number_code'),
    max: 3,
    uniforms: {
      placeholder: () => i18n.__('Offices.project_number_code_placeholder'),
    },
    optional: true,
  },
  timezone: {
    type: String,
    label: () => i18n.__('Offices.timezone'),
    max: 100,
    allowedValues: moment.tz.names(), // @todo is this crazy to pin this big list here?
    uniforms: {
      placeholder: () => i18n.__('Offices.select_timezone'),
    },
  },
  isActive: {
    type: Boolean,
    label: () => i18n.__('Offices.is_active'),
    defaultValue: true,
    uniforms: {
      placeholder: () => i18n.__('Offices.is_active'),
    },
  },
  openDate: {
    type: Date,
    label: () => i18n.__('Offices.open_date'),
    optional: true,
    uniforms: {
      type: 'date',
      placeholder: () => i18n.__('Offices.open_date'),
    },
    // autoValue: dateCleanup,
  },
  closeDate: {
    type: Date,
    label: () => i18n.__('Offices.close_date'),
    optional: true,
    uniforms: {
      type: 'date',
      placeholder: () => i18n.__('Offices.close_date'),
    },
    // autoValue: dateCleanup,
  },
  itEmailAddress: {
    regEx: SimpleSchema.RegEx.Email,
    type: String,
    label: () => i18n.__('Offices.it_email_address'),
    max: 255,
    uniforms: {
      placeholder: () => i18n.__('Offices.it_email_address_placeholder'),
    },
  },
  defaultProjectFolderNameFormat: {
    type: String,
    label: () => i18n.__('Offices.default_project_folder_name_format'),
    max: 64,
    allowedValues: [
      '${projectName}',
      '${projectNumber}',
      '${projectNumber} ${projectName}',
      '${projectNumber}_${projectName}',
    ],
    uniforms: {
      placeholder: () => i18n.__('Offices.default_project_folder_name_format_placeholder'),
    },
  },
});

export default OfficeSchema;
