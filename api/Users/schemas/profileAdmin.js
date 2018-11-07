import Uniforms from 'uniforms';
import SimpleSchema from 'simpl-schema';
import i18n from 'meteor/universe:i18n';

const UserProfileAdminSchema = new SimpleSchema({
  _id: {
    type: String,
    max: 50,
    optional: false,
    autoform: {
      type: 'hidden',
    },
  },
  displayName: {
    type: String,
    label: 'Display Name',
    max: 200,
    optional: false,
  },
  email: {
    type: String,
    label: 'Email Address',
    max: 200,
    optional: false,
    regEx: SimpleSchema.RegEx.Email,
  },
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
      options: [{ label: 'Disabled', value: -1 }, { label: 'Pending', value: 0 }, { label: 'Enabled', value: 1 }],
    },
  },
  permissions: {
    type: String,
    label: 'permissions',
    optional: false,
    allowedValues: ['user', 'staff', 'admin'],
  },
});

export default UserProfileAdminSchema;
