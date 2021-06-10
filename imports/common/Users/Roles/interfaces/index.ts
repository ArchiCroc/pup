import { User } from '/imports/common/Users/interfaces';

export interface UsersRole {
    _id: String
    name: String
    createdAt: Date
    createdById: String
    createdBy: User
    updatedAt: Date
    updatedById: String
    updatedBy: User
  }
  
  export  interface UsersRoles {
    total: number
    usersRoles: [UsersRole]
  }