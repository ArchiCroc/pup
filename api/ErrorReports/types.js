export default `
type ErrorReport {
  _id: String
  level: Int
  message: String
  path: String
  trace: [String]
  createdAtUTC: DateTime
  createdById: String
  createdBy: User
}

input ErrorReportInput {
  _id: String
  level: Int!
  message: String!
  path: String
  trace: [String]
}
`;
