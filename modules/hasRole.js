// import { Roles } from 'meteor/alanning:roles';

const hasRole = (rolesTheUserHas, rolesAllowed) => {
  if (typeof rolesAllowed === 'string') {
    return rolesTheUserHas.includes(rolesAllowed);
  }
  return rolesAllowed.some((r) => rolesTheUserHas.includes(r));
};

export default hasRole;
