import Uniforms from 'uniforms';
import SimpleSchema, { SimpleSchemaDefinition, AutoValueContext } from 'simpl-schema';
import i18n from 'meteor/universe:i18n';
import isString from 'lodash/isString';

const AdminProfileSchema = new SimpleSchema({
  _id: {
    type: String,
    max: 50,
    optional: true,
    uniforms: {
      type: 'hidden',
    },
  },
  firstName: {
    type: String,
    label: () => i18n.__('Users.first_name'),
    max: 100,
    uniforms: {
      placeholder: () => i18n.__('Users.first_name'),
    },
  },
  lastName: {
    type: String,
    label: () => i18n.__('Users.last_name'),
    max: 100,
    uniforms: {
      placeholder: () => i18n.__('Users.last_name'),
    },
  },
  emailAddress: {
    type: String,
    label: () => i18n.__('Users.email_address'),
    max: 200,
    regEx: SimpleSchema.RegEx.Email,
    autoValue(this: AutoValueContext): string {
      if (this.value && isString(this.value)) {
        return this.value.toLowerCase();
      }
      return this.value;
    },
    uniforms: {
      placeholder: () => i18n.__('Users.email_address'),
      type: 'email',
    },
  },
  /*
  status: {
    type: Number,
    label: 'Status',
    optional: false,
    allowedValues: [-1, 0, 1],
    autoValue() {
      if (this.value) {
        return parseInt(this.value, 10);
      }
      return this.value;
    },
    uniforms: {
      options: [
        { label: 'Disabled', value: -1 },
        { label: 'Pending', value: 0 },
        { label: 'Enabled', value: 1 },
      ],
    },
  },  */
  roles: {
    type: Array,
    label: () => i18n.__('Users.role_plural'),
    optional: true,
    //allowedValues: ['user', 'staff', 'admin'],
    uniforms: {
      multiple: true,
      query: 'roles',
      edges: 'roles',
      initialLabelKey: 'roles',
      labelKey: 'name',
      valueKey: 'name',
    },
  },
  'roles.$': {
    type: String,
    label: 'permissions',
  },

  password: {
    type: String,
    label: () => i18n.__('Users.password'),
    optional: true,
    min: 8,
    max: 100,
    uniforms: {
      type: 'password',
      placeholder: () => i18n.__('Users.password'),
    },
  },
} as SimpleSchemaDefinition);

export default AdminProfileSchema;
