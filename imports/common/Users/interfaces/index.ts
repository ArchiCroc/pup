import { ObjectID, SortOrder } from '/imports/common/interfaces';
export interface UserSettingsGDPR {
  canSendMarketingEmails: boolean;
}

export interface UserSettings {
  gdpr: UserSettingsGDPR;
}

export interface UserProfile {
  firstName: String;
  lastName: String;
}

export type RoleSlug = string;



export interface User {
  _id?: string;
  profile?: UserProfile;
  username?: string;
  emailAddress?: string;
  oAuthProvider?: string;
  roles?: RoleSlug[]
  settings?: UserSettings
  fullName?: string
}

export interface UserLookup {
  __crossReference: string;
  query?: string;
  edges?: string;
  labelKey: string;
  valueKey: string;
  idType?: string;
  variables: any;
  key: string;
  label: string;
}

export interface UserInput {
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

export interface UsersQueryString {
  _ids?: string | string[] | ObjectID | ObjectID[];
  page?: string | number;
  pageSize?: string | number;
  sort?: string;
  order?: SortOrder;
  search?: string;
  role?: string | string[];
  status: number | number[] | string | string[];
}
export interface UsersParams extends UsersQueryString {
  _ids?: ObjectID[];
  page?: number;
  pageSize?: number;
  status: number | number[];
}

export interface HasUserId {
  userId: string;
}
