export default `
  # @todo I think this can be removed now
  type UserRole {
    _id: String
    name: String
    inRole: Boolean
  }

  input ProfileInput {
    firstName: String
    lastName: String
  }

  input UserSettingsGDPRInput {
    canSendMarketingEmails: Boolean
    #### PLOP_USER_SETTINGS_GDPR_INPUT_START ####
    #### PLOP_USER_SETTINGS_GDPR_INPUT_END ####
  }

  input UserSettingsInput {
    gdpr: UserSettingsGDPRInput
    #### PLOP_USER_SETTINGS_INPUT_START ####
    #### PLOP_USER_SETTINGS_INPUT_END ####
  }

  type UserSettingsGDPR {
    canSendMarketingEmails: Boolean
    #### PLOP_USER_SETTINGS_GDPR_TYPE_START ####
    #### PLOP_USER_SETTINGS_GDPR_TYPE_END ####
  }

  type UserSettings {
    gdpr: UserSettingsGDPR
    #### PLOP_USER_SETTINGS_TYPE_START ####
    #### PLOP_USER_SETTINGS_TYPE_END ####
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
    roles: [String]
    settings: UserSettings 
    fullName: String
  }

  type Users {
    total: Int
    users: [User]
  }

  type UserDataExport {
    zip: String
  }
`;
