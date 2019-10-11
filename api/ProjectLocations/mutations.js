import ProjectLocations from './ProjectLocations';
import ProjectLocationSchema from './schemas/project-location';
// import sanitizeHtml from 'sanitize-html';
import checkUserRole from '../Users/actions/checkUserRole';
import createMongoModifier from '../../modules/server/createMongoModifier';

export default {
  saveProjectLocation: (root, args, { user }) => {
    /* #### PLOP_MUTATION_REMOVE_VALIDATION_START #### */
    /* #### PLOP_MUTATION_REMOVE_VALIDATION_END #### */

    const cleanDoc = ProjectLocationSchema.clean(args.projectLocation);
    ProjectLocationSchema.validate(cleanDoc);

    /* #### PLOP_MUTATION_PRE_SAVE_START #### */
    /* #### PLOP_MUTATION_PRE_SAVE_END #### */

    const userId = user._id;
    const timestamp = new Date();

    if (cleanDoc._id) {
      const { _id } = cleanDoc;

      const modifier = createMongoModifier(ProjectLocationSchema, cleanDoc);

      delete modifier.$set._id;

      /* #### PLOP_MUTATION_PRE_UPDATE_START #### */
      /* #### PLOP_MUTATION_PRE_UPDATE_END #### */

      modifier.$set.updatedById = userId;
      modifier.$set.updatedAtUTC = timestamp;

      ProjectLocations.update({ _id }, modifier);
      return ProjectLocations.findOne(_id);
    }

    cleanDoc.createdById = userId;
    cleanDoc.createdAtUTC = timestamp;
    cleanDoc.updatedById = userId;
    cleanDoc.updatedAtUTC = timestamp;

    /* #### PLOP_MUTATION_PRE_INSERT_START #### */
    /* #### PLOP_MUTATION_PRE_INSERT_END #### */

    const projectLocationId = ProjectLocations.insert(cleanDoc);
    const doc = ProjectLocations.findOne(projectLocationId);
    return doc;
  },
  removeProjectLocation: (root, args, { user }) => {
    if (!user || !user._id || !checkUserRole(user._id, ['admin'])) {
      throw new Error('Sorry, you must have permission to remove Project Location.');
    }

    /* #### PLOP_MUTATION_REMOVE_VALIDATION_START #### */
    /* #### PLOP_MUTATION_REMOVE_VALIDATION_END #### */

    /* #### PLOP_MUTATION_PRE_REMOVE_START #### */
    /* #### PLOP_MUTATION_PRE_REMOVE_END #### */

    ProjectLocations.remove(args);
    return args;
  },
  /* #### PLOP_MUTATIONS_START #### */
  /* #### PLOP_MUTATIONS_END #### */
};
