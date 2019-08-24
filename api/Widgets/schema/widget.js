import Uniforms from 'uniforms';
import SimpleSchema from 'simpl-schema';
import i18n from 'meteor/universe:i18n';

const WidgetSchema = new SimpleSchema({
  _id: {
    type: String,
    optional: true,
    max: 50,
    uniforms: {
      type: 'hidden',
    },
  },
  isPublic: {
    type: Boolean,
    label: () => i18n.__('.is_public_label'),
    uniforms: {
      placeholder: () => i18n.__('.is_public_placeholder'),
    },
  },
  title: {
    type: String,
    label: () => i18n.__('.title_label'),
    max: 100,
    uniforms: {
      placeholder: () => i18n.__('.title_placeholder'),
    },
  },
  body: {
    type: String,
    label: () => i18n.__('.body_label'),
    optional: true,
    uniforms: {
      placeholder: () => i18n.__('.body_placeholder'),
    },
  },
});

export default WidgetSchema;
