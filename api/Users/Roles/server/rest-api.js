// import { Meteor } from 'meteor/meteor';
// import { Mongo } from 'meteor/mongo';
import UsersRoles from '../UsersRoles';
import { JsonRoutes as ApiRoutes } from 'meteor/simple:json-routes';
import UsersRoleSchema from '../schemas/users-role';

/*
ApiRoutes.add('post', '/api/v1/users-roles', async (request, response) => {
  if (!request.body) {
    throw ApiRoutes.Error('Api Error', 'Missing Post Data');
  }

  const cleanDoc = UsersRoleSchema.clean(args.usersRole);
  UsersRoleSchema.validate(cleanDoc);

  console.log(cleanDoc);

  // return success
  response.writeHead(204);
  response.end();
}
*/
