export default `
  type Comment {
    _id: String
    userId: String
    user: User
    documentId: String
    comment: String
    createdAt: DateTime
  }
`;
