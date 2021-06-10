export interface  UserSettingsGDPR {
    canSendMarketingEmails: boolean
  }
  
  export interface  UserSettings {
    gdpr: UserSettingsGDPR
  }
  
  export interface Profile {
    firstName: String
    lastName: String
  }
  
  export interface  User {
    _id: string
    profile: Profile
    username: string
    emailAddress: string
    oAuthProvider: string
    roles: string[]
    settings: UserSettings 
    fullName: string
  }
  
  export interface Users {
    total: number
    users: [User]
  }