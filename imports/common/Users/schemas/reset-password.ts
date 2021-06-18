import Uniforms from 'uniforms';
import SimpleSchema, { SimpleSchemaDefinition, CustomValidationContext } from 'simpl-schema';
import i18n from 'meteor/universe:i18n';

const UserResetPasswordSchema = new SimpleSchema({
  newPassword: {
    type: String,
    label: () => i18n.__('Users.new_password'),
    min: 8,
    max: 200,
    uniforms: {
      type: 'password',
      placeholder: () => i18n.__('Users.new_password'),
    },
  },
  repeatNewPassword: {
    type: String,
    label: () => i18n.__('Users.confirm_new_password'),
    uniforms: {
      type: 'password',
      placeholder: () => i18n.__('Users.confirm_new_password'),
    },
    custom(this: CustomValidationContext) {
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
} as SimpleSchemaDefinition);

UserResetPasswordSchema.messageBox.messages({
  en: {
    noPasswordMatch: () => i18n.__('Users.password_match_error'),
  },
});

export default UserResetPasswordSchema;
