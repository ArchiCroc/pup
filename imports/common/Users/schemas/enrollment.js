import Uniforms from 'uniforms';
import SimpleSchema from 'simpl-schema';
import i18n from 'meteor/universe:i18n';

const UserEnrollmentSchema = new SimpleSchema({
  displayName: {
    type: String,
    label() {
      return 'Display Name';
    },
    optional: false,
    min: 3,
    max: 200,
    uniforms: {
      type: 'text',
    },
  },
  password: {
    type: String,
    label() {
      return 'New Password';
    },
    optional: false,
    min: 8,
    max: 200,
    uniforms: {
      type: 'password',
    },
  },
  confirmation: {
    type: String,
    label() {
      return 'Confirm New Password';
    },
    optional: false,
    uniforms: {
      type: 'password',
    },
    custom() {
      if (this.value !== this.field('password').value) {
        return 'noMatch';
      }
    },
  },
  token: {
    type: String,
    optional: false,
    uniforms: {
      type: 'hidden',
    },
  },
});

UserEnrollmentSchema.messages({
  noMatch: "Password doesn't match",
});

export default UserEnrollmentSchema;
