// import { Meteor } from 'meteor/meteor';
// import { Mongo } from 'meteor/mongo';
import { JsonRoutes as ApiRoutes } from 'meteor/simple:json-routes';

ApiRoutes.add('post', '/public-api/v1/error-reports', async (request, response) => {
  if (!request.body) {
    throw ApiRoutes.Error('Api Error', 'Missing Post Data');
  }

  console.log(request.body);

  // return success
  response.writeHead(204);
  response.end();
});
