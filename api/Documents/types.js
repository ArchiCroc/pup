export default `
  type Document {
    _id: String
    isPublic: Boolean
    title: String
    createdAt: DateTime
    updatedAt: DateTime
    body: String
    owner: String
    comments: [Comment]
  }
`;
