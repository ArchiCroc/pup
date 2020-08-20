export default `

type UsersRole {
  _id: String
  name: String
  createdAtUTC: DateTime
  createdById: String
  createdBy: User
  updatedAtUTC: DateTime
  updatedById: String
  updatedBy: User
}

type UsersRoles {
  total: Int
  usersRoles: [UsersRole]
}

input UsersRoleInput {
  _id: String
  name: String!
}
`;
