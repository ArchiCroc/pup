export default `
  type Role {
    _id: String
    name: String
    inRole: Boolean
  }

  input ProfileInput {
    firstName: String
    lastName: String
  }



  input UserSettingsInput {
    gdprCanSendMarketingEmails: Boolean
  }

  type UserSettings {
    gdprCanSendMarketingEmails: Boolean
  }

  type Profile {
    firstName: String
    lastName: String
  }

  input UserInput {
    _id: String,
    email: String,
    password: String,
    profile: ProfileInput,
    roles: [String],
    settings:  UserSettingsInput 
  }

  type User {
    _id: String
    profile: Profile
    username: String
    emailAddress: String
    oAuthProvider: String
    roles: [Role]
    settings: UserSettings 
  }

  type Users {
    total: Int
    users: [User]
  }

  type UserDataExport {
    zip: String
  }
`;
