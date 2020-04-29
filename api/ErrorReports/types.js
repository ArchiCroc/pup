export default `

type ErrorReport {
  _id: ObjectID
  userId: String
  user: User
  level: Int
  message: String
  path: String
  userAgent: String
  stack: [String]
  reactStack: [String]
  createdAtUTC: DateTime
  createdById: String
  createdBy: User
}

type ErrorReports {
  total: Int
  errorReports: [ErrorReport]
}


input ErrorReportInput {
  _id: ObjectID
  userId: String!
  level: Int!
  message: String!
  path: String
  userAgent: String
  stack: [String]
  reactStack: [String]
}
`;
