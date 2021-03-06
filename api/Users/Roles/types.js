export default `

type UsersRole {
  _id: String
  name: String
  createdAt: DateTime
  createdById: String
  createdBy: User
  updatedAt: DateTime
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
