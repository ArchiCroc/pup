const getUserName = (profile) =>
  ({
    string: profile,
    object: profile && `${profile.firstName} ${profile.lastName}`,
  }[typeof profile]);

export default getUserName;
