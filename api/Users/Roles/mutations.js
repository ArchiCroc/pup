import UsersRoles from './UsersRoles';
import UsersRoleSchema from './schemas/users-role';
// import sanitizeHtml from 'sanitize-html';
import checkUserRole from '../actions/checkUserRole';
import createMongoModifier from '../../../libs/server/createMongoModifier';

export default {
  saveUsersRole: (root, args, { user }) => {
    if (!user || !user._id || !checkUserRole(user._id, ['admin'])) {
      throw new Error('Sorry, you must have permission to save a Users Role.');
    }

    /* #### PLOP_MUTATION_REMOVE_VALIDATION_START #### */
    /* #### PLOP_MUTATION_REMOVE_VALIDATION_END #### */

    const cleanDoc = UsersRoleSchema.clean(args.usersRole);
    UsersRoleSchema.validate(cleanDoc);

    /* #### PLOP_MUTATION_PRE_SAVE_START #### */
    /* #### PLOP_MUTATION_PRE_SAVE_END #### */

    const userId = user._id;
    const timestamp = new Date();

    if (cleanDoc._id) {
      const { _id } = cleanDoc;

      cleanDoc.updatedById = userId;
      cleanDoc.updatedAtUTC = timestamp;

      const currentDoc = UsersRoles.findOne(_id, { fields: { createdById: 0, createdAtUTC: 0 } });
      if (!currentDoc) {
        throw new Error('Cannot find Users Role to update');
      }

      const modifier = createMongoModifier(currentDoc, cleanDoc);

      delete modifier.$set._id;

      /* #### PLOP_MUTATION_PRE_UPDATE_START #### */
      /* #### PLOP_MUTATION_PRE_UPDATE_END #### */

      UsersRoles.update({ _id }, modifier);
      return UsersRoles.findOne(_id);
    }

    cleanDoc.createdById = userId;
    cleanDoc.createdAtUTC = timestamp;
    cleanDoc.updatedById = userId;
    cleanDoc.updatedAtUTC = timestamp;

    /* #### PLOP_MUTATION_PRE_INSERT_START #### */
    /* #### PLOP_MUTATION_PRE_INSERT_END #### */

    const usersRoleId = UsersRoles.insert(cleanDoc);
    const doc = UsersRoles.findOne(usersRoleId);
    return doc;
  },
  removeUsersRole: (root, args, { user }) => {
    if (!user || !user._id || !checkUserRole(user._id, ['admin'])) {
      throw new Error('Sorry, you must have permission to remove Users Role.');
    }

    /* #### PLOP_MUTATION_REMOVE_VALIDATION_START #### */
    /* #### PLOP_MUTATION_REMOVE_VALIDATION_END #### */

    /* #### PLOP_MUTATION_PRE_REMOVE_START #### */
    /* #### PLOP_MUTATION_PRE_REMOVE_END #### */

    UsersRoles.remove(args);
    return args;
  },
  /* #### PLOP_MUTATIONS_START #### */
  /* #### PLOP_MUTATIONS_END #### */
};
