import Roles from './Roles';
import RoleSchema from './schemas/role';
// import sanitizeHtml from 'sanitize-html';
import checkUserRole from '../Users/actions/checkUserRole';
import createMongoModifier from '../../modules/server/createMongoModifier';

export default {
  saveRole: (root, args, { user }) => {
    if (!user || !user._id || !checkUserRole(user._id, ['admin'])) {
      throw new Error('Sorry, you must have permission to save a Role.');
    }

    /* #### PLOP_MUTATION_REMOVE_VALIDATION_START #### */
    /* #### PLOP_MUTATION_REMOVE_VALIDATION_END #### */

    const cleanDoc = RoleSchema.clean(args.role);
    RoleSchema.validate(cleanDoc);

    /* #### PLOP_MUTATION_PRE_SAVE_START #### */
    /* #### PLOP_MUTATION_PRE_SAVE_END #### */

    const userId = user._id;
    const timestamp = new Date();

    if (cleanDoc._id) {
      const { _id } = cleanDoc;

      cleanDoc.updatedById = userId;
      cleanDoc.updatedAtUTC = timestamp;

      const currentDoc = Roles.findOne(_id, { fields: { createdById: 0, createdAtUTC: 0 } });
      if (!currentDoc) {
        throw new Error('Cannot find Role to update');
      }

      const modifier = createMongoModifier(currentDoc, cleanDoc);

      delete modifier.$set._id;

      /* #### PLOP_MUTATION_PRE_UPDATE_START #### */
      /* #### PLOP_MUTATION_PRE_UPDATE_END #### */

      Roles.update({ _id }, modifier);
      return Roles.findOne(_id);
    }

    cleanDoc.createdById = userId;
    cleanDoc.createdAtUTC = timestamp;
    cleanDoc.updatedById = userId;
    cleanDoc.updatedAtUTC = timestamp;

    /* #### PLOP_MUTATION_PRE_INSERT_START #### */
    /* #### PLOP_MUTATION_PRE_INSERT_END #### */

    const roleId = Roles.insert(cleanDoc);
    const doc = Roles.findOne(roleId);
    return doc;
  },
  removeRole: (root, args, { user }) => {
    if (!user || !user._id || !checkUserRole(user._id, ['admin'])) {
      throw new Error('Sorry, you must have permission to remove Role.');
    }

    /* #### PLOP_MUTATION_REMOVE_VALIDATION_START #### */
    /* #### PLOP_MUTATION_REMOVE_VALIDATION_END #### */

    /* #### PLOP_MUTATION_PRE_REMOVE_START #### */
    /* #### PLOP_MUTATION_PRE_REMOVE_END #### */

    Roles.remove(args);
    return args;
  },
  /* #### PLOP_MUTATIONS_START #### */
  /* #### PLOP_MUTATIONS_END #### */
};
