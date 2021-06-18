import { Roles } from 'meteor/alanning:roles';

const checkUserRole = (userId: string, role: string | string[]) => {
  try {
    return Roles.userIsInRole(userId, role);
  } catch (exception) {
    throw new Error(`[checkIfAuthorized.isUser] ${exception.message}`);
  }
};

export default checkUserRole;
