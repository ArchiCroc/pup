export default `
  type Name {
    first: String
    last: String
  }

  input NameInput {
    first: String
    last: String
  }

  type Role {
    _id: String
    name: String
    inRole: Boolean
  }

  input ProfileInput {
    name: NameInput
  }

  input UserSettingsInput {
    gdprCanSendMarketingEmails: Boolean
  }

  type UserSettings {
    gdprCanSendMarketingEmails: Boolean
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
    name: Name
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
