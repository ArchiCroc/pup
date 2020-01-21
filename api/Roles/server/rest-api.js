// import { Meteor } from 'meteor/meteor';
// import { Mongo } from 'meteor/mongo';
import Roles from '../Roles';
import { JsonRoutes as ApiRoutes } from 'meteor/simple:json-routes';
import RoleSchema from '../schemas/role';

/*
ApiRoutes.add('post', '/api/v1/roles', async (request, response) => {
  if (!request.body) {
    throw ApiRoutes.Error('Api Error', 'Missing Post Data');
  }

  const cleanDoc = RoleSchema.clean(args.role);
  RoleSchema.validate(cleanDoc);

  console.log(cleanDoc);

  // return success
  response.writeHead(204);
  response.end();
}
*/
