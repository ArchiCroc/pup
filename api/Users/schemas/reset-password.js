import Uniforms from 'uniforms';
import SimpleSchema from 'simpl-schema';
import i18n from 'meteor/universe:i18n';

const UserResetPasswordSchema = new SimpleSchema({
  newPassword: {
    type: String,
    label: () => i18n.__('new_password'),
    min: 8,
    max: 200,
    uniforms: {
      type: 'password',
      placeholder: () => i18n.__('new_password'),
    },
  },
  repeatNewPassword: {
    type: String,
    label: () => i18n.__('confirm_new_password'),
    uniforms: {
      type: 'password',
      placeholder: () => i18n.__('confirm_new_password'),
    },
    custom() {
      if (this.value !== this.field('newPassword').value) {
        return 'noPasswordMatch';
      }
      return undefined;
    },
  },
  // token: {
  //   type: String,
  //   uniforms: {
  //     type: 'hidden',
  //   },
  // },
});

UserResetPasswordSchema.messageBox.messages({
  en: {
    noPasswordMatch: () => i18n.__('password_match_error'),
  },
});

export default UserResetPasswordSchema;
