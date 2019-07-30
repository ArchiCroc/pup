const getUserName = (profile) =>
  ({
    string: profile,
    object: `${profile.firstName} ${profile.lastName}`,
  }[typeof profile]);

export default getUserName;
