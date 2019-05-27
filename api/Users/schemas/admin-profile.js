import Uniforms from 'uniforms';
import SimpleSchema from 'simpl-schema';
import i18n from 'meteor/universe:i18n';
<<<<<<< HEAD
import isString from 'lodash/isString';
=======
import { isString } from 'underscore';
>>>>>>> a936134e9a65750e8afa972cacbc538c8cc31f68

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
    label: () => i18n.__('first_name'),
    max: 100,
    uniforms: {
      placeholder: () => i18n.__('first_name'),
    },
  },
  lastName: {
    type: String,
    label: () => i18n.__('last_name'),
    max: 100,
    uniforms: {
      placeholder: () => i18n.__('last_name'),
    },
  },
  emailAddress: {
    type: String,
    label: () => i18n.__('email_address'),
    max: 200,
    regEx: SimpleSchema.RegEx.Email,
    autoValue() {
      if (this.value && isString(this.value)) {
        return this.value.toLowerCase();
      }
      return this.value;
    },
    uniforms: {
      placeholder: () => i18n.__('email_address'),
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
  },
  roles: {
    type: String,
    label: 'permissions',
    optional: false,
    allowedValues: ['user', 'staff', 'admin'],
  },
  */
  password: {
    type: String,
    label: () => i18n.__('password'),
    optional: true,
    min: 8,
    max: 100,
    uniforms: {
      type: 'password',
      placeholder: () => i18n.__('password'),
    },
  },
});

export default AdminProfileSchema;
