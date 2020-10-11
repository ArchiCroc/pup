import { Meteor } from 'meteor/meteor';
// import { Mongo } from 'meteor/mongo';
import { JsonRoutes as ApiRoutes } from 'meteor/simple:json-routes';
import ErrorReports from '../ErrorReports';
import ErrorReportSchema from '../schemas/error-report';

ApiRoutes.add('post', '/public-api/v1/error-reports', (request, response) => {
  if (!request.body) {
    throw ApiRoutes.Error('Api Error', 'Missing Post Data');
  }

  const cleanDoc = ErrorReportSchema.clean(request.body);
  // console.log(cleanDoc);
  ErrorReportSchema.validate(cleanDoc);

  if (request.body.userToken) {
    Meteor.users.findOne();
  }

  const userId = (request.user && request.user._id) || null;

  cleanDoc.createdById = userId;
  cleanDoc.createdAt = new Date();

  const errorReportId = ErrorReports.insert(cleanDoc);
  // console.log(errorReportId);
  // return success
  response.writeHead(204);
  response.end();
});
