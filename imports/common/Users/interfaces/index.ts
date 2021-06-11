export interface  UserSettingsGDPR {
    canSendMarketingEmails: boolean;
  }
  
  export interface  UserSettings {
    gdpr: UserSettingsGDPR;
  }
  
  export interface UserProfile {
    firstName: String;
    lastName: String;
  }
  
  export type RoleSlug = string;

  export interface  User {
    _id: string;
    profile?: UserProfile;
    username?: string;
    emailAddress?: string;
    oAuthProvider?: string;
    roles?: RoleSlug[]
    settings?: UserSettings 
    fullName?: string
  }

  export interface  UserInput {
    _id?: string;
    profile?: UserProfile;
    username?: string;
    password?: string;
    emailAddress?: string;
    oAuthProvider?: string;
    roles?: RoleSlug[]
    settings?: UserSettings 
  }
  
  export interface Users {
    total: number;
    users: User[];
  }

  export interface UserLogin {
    emailAddress: string;
    password: string;
  }
  