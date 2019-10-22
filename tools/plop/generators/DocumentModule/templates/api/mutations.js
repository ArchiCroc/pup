import sanitizeHtml from 'sanitize-html';
import Documents from './Documents';
import DocumentSchema from './schemas/document';

export default {
  addDocument: (root, args, context) => {
    if (!context.user) throw new Error('Sorry, you must be logged in to add a new document.');

    const args2 = args;

    args2.title =
      args2.title ||
      `Untitled Document #${Documents.find({ owner: context.user._id }).count() + 1}`;
    args2.body = sanitizeHtml(args.body);
    const cleanDoc = DocumentSchema.clean(args2);
    DocumentSchema.validate(cleanDoc);

    const userId = context.user._id;
    const timestamp = new Date();

    cleanDoc.owner = userId;
    cleanDoc.updatedBy = userId;
    cleanDoc.updatedAt = timestamp;
    cleanDoc.createdBy = userId;
    cleanDoc.createdAt = timestamp;

    const documentId = Documents.insert(cleanDoc);
    const doc = Documents.findOne(documentId);
    return doc;
  },
  updateDocument: (root, args, context) => {
    if (!context.user) throw new Error('Sorry, you must be logged in to update a document.');
    const cleanDoc = DocumentSchema.clean(args);
    DocumentSchema.validate(cleanDoc);

    cleanDoc.updatedBy = context.user._id;
    cleanDoc.updatedAt = new Date();

    const { _id } = cleanDoc;
    delete cleanDoc._id;

    console.log(cleanDoc);

    // Documents.update({ _id }, { $set: cleanDoc });
    return Documents.findOne(args._id);
  },
  updateDocumentKey: (root, args, context) => {
    if (!context.user) throw new Error('Sorry, you must be logged in to update a document.');

    const doc = { _id: args._id };
    doc[args.key] = args.value;

    const cleanDoc = DocumentSchema.clean(doc);
    DocumentSchema.validate(cleanDoc, { keys: ['_id', args.key] });

    cleanDoc.updatedBy = context.user._id;
    cleanDoc.updatedAt = new Date();

    const { _id } = cleanDoc;
    delete cleanDoc._id;

    console.log(cleanDoc);

    Documents.update({ _id }, { $set: cleanDoc });
    return Documents.findOne(args._id);
  },
  removeDocument: (root, args, context) => {
    if (!context.user) throw new Error('Sorry, you must be logged in to remove a document.');
    if (!Documents.findOne({ _id: args._id, owner: context.user._id }))
      throw new Error('Sorry, you need to be the owner of this document to remove it.');
    Documents.remove(args);
    return args;
  },
  /* #### PLOP_MUTATIONS_START #### */
  /* #### PLOP_MUTATIONS_END #### */
};
