import sanitizeHtml from 'sanitize-html';
import Widgets from './Widgets';
import WidgetSchema from './schemas/widget';

export default {
  saveWidget: (root, args, context) => {
    if (!context.user) throw new Error('Sorry, you must be logged in to add a new Widget.');

    const cleanDoc = WidgetSchema.clean(args);
    WidgetSchema.validate(cleanDoc);

    const userId = context.user._id;
    const timestamp = new Date();

    cleanDoc.updatedBy = userId;
    cleanDoc.updatedAtUTC = timestamp;

    if (cleanDoc._id) {
      cleanDoc.updatedBy = context.user._id;
      cleanDoc.updatedAt = new Date();

      const { _id } = cleanDoc;
      delete cleanDoc._id;

      Widgets.update({ _id }, { $set: cleanDoc });
    }

    cleanDoc.createdById = userId;
    cleanDoc.createdAtUTC = timestamp;

    const WidgetId = Widgets.insert(cleanDoc);
    const doc = Widgets.findOne(WidgetId);
    return doc;
  },
  removeWidget: (root, args, context) => {
    if (!context.user) throw new Error('Sorry, you must be logged in to remove a Widget.');
    if (!Widgets.findOne({ _id: args._id, createdById: context.user._id }))
      throw new Error('Sorry, you need to be the owner of this Widget to remove it.');
    Widgets.remove(args);
    return args;
  },
};
