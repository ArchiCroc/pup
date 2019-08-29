import Comments from './Comments';

export default {
  comments: ({ _id }) => Comments.find({ documentId: _id }, { sort: { createdAt: 1 } }).fetch(),
  /* #### PLOP_QUERIES_START #### */
  /* #### PLOP_QUERIES_END #### */
};
