// import { Meteor } from 'meteor/meteor';
// import { Mongo } from 'meteor/mongo';
import { JsonRoutes as ApiRoutes } from 'meteor/simple:json-routes';
import ErrorReports from '../ErrorReports';
import ErrorReportSchema from '/imports/common/ErrorReports/schemas/error-report';

ApiRoutes.add('post', '/api/v1/error-reports', (request, response) => {});

/*
ApiRoutes.add('post', '/api/v1/error-reports', async (request, response) => {
  if (!request.body) {
    throw ApiRoutes.Error('Api Error', 'Missing Post Data');
  }

  const cleanDoc = ErrorReportSchema.clean(args.errorReport);
  ErrorReportSchema.validate(cleanDoc);

  console.log(cleanDoc);

  // return success
  response.writeHead(204);
  response.end();
});
*/
