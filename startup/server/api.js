import gql from 'graphql-tag';

import UserTypes from '../../api/Users/types';
import UserQueries from '../../api/Users/queries';

import DocumentTypes from '../../api/Documents/types';
import DocumentQueries from '../../api/Documents/queries';
import DocumentMutations from '../../api/Documents/mutations';

import CommentTypes from '../../api/Comments/types';
import CommentQueries from '../../api/Comments/queries';
import CommentMutations from '../../api/Comments/mutations';

import '../../api/Documents/server/indexes';
import '../../api/OAuth/server/methods';

const schema = {
  typeDefs: gql`
    ${UserTypes}
    ${DocumentTypes}
    ${CommentTypes}

    type Query {
      documents: [Document]
      document(_id: String): Document
      user: User
    }

    type Mutation {
      addDocument(title: String, body: String): Document
      updateDocument(_id: String!, title: String, body: String, isPublic: Boolean): Document
      removeDocument(_id: String!): Document
      addComment(documentId: String!, comment: String!): Comment
      removeComment(commentId: String!): Comment
    }

    # type Subscription {
    #   commentAdded: Comment
    # }
  `,
  resolvers: {
    Query: {
      ...DocumentQueries,
      ...UserQueries,
    },
    Mutation: {
      ...DocumentMutations,
      ...CommentMutations,
    },
    // Subscription: {
    //   ...DocumentSubscriptions,
    // },
    Document: {
      comments: CommentQueries.comments,
    },
    Comment: {
      user: UserQueries.user,
    },
  },
};

export default schema;
