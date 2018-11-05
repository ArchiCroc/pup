import Documents from './Documents';

export default {
  documents: (parent, args, { user }) =>
    user && user._id ? Documents.find({ owner: user._id }).fetch() : [],
  document: (parent, args, { user }) =>
    Documents.findOne({
      $or: [
        { _id: args._id, owner: user && user._id ? user._id : null },
        { _id: args._id, isPublic: true },
      ],
    }),
};