export default `
type Widget {
  _id: String
  isPublic: Boolean
  title: String
  body: String
  createdAtUTC: DateTime
  createdById: String
  createdBy: User
  updatedAtUTC: DateTime
  updatedById: String
  updatedBy: User
  comments: [comments]
}

input WidgetInput {
  _id: String
  isPublic: Boolean
  title: String!
  body: String
}
`;
