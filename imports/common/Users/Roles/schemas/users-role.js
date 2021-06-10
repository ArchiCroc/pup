import Uniforms from 'uniforms';
import SimpleSchema from 'simpl-schema';
import i18n from 'meteor/universe:i18n';
/* #### PLOP_IMPORTS_START #### */
import slugify from 'slugify';
/* #### PLOP_IMPORTS_END #### */

const cleanName = (item) => slugify(item, { lower: true });

const UsersRoleSchema = new SimpleSchema({
  _id: {
    type: String,
    optional: true,
    uniforms: {
      type: 'hidden',
    },
  },
  name: {
    type: String,
    label: () => i18n.__('UsersRoles.name_label'),
    max: 64,
    autoValue() {
      if (this.value != null) {
        return cleanName(this.value);
      }
      return this.value;
    },
    uniforms: {
      placeholder: () => i18n.__('UsersRoles.name_placeholder'),
    },
  },
  /* #### PLOP_SCHEMA_START #### */
  /* #### PLOP_SCHEMA_END #### */
});

export default UsersRoleSchema;
