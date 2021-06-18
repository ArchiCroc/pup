import { UserProfile } from '/imports/common/Users/interfaces';

export const getUserName = (profile: UserProfile | string) => {
  if (typeof profile == 'string') {
    return profile;
  }
  if (profile && typeof profile == 'object') {
    return `${profile.firstName} ${profile.lastName}`;
  }
  return null
}

export default getUserName;
