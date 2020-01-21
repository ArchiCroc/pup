export default `

type Role {
  _id: String
  name: String
  createdAtUTC: DateTime
  createdById: String
  createdBy: User
  updatedAtUTC: DateTime
  updatedById: String
  updatedBy: User
}

type Roles {
  total: Int
  roles: [Role]
}


input RoleInput {
  _id: String
  name: String!
}
`;
