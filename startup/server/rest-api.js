import crypto from 'crypto';
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { JsonRoutes as ApiRoutes } from 'meteor/simple:json-routes';
import isNumber from 'lodash/isNumber';
import { Accounts } from 'meteor/accounts-base';
import { Roles } from 'meteor/alanning:roles';
import { getUser } from 'meteor/apollo';

const { productName } = Meteor.settings.public;

/**
 * Customized Middleware for error handling
 */
const handleErrorAsHalJson = (error, request, response, next) => {
  console.log(error);

  let err = error;
  // If we at least put in some effort to throw a user-facing Meteor.Error,
  // the default code should be less severe
  if (isNumber(err.error)) {
    // Matthew added this
    err.statusCode = err.error;
    // from here down was other ways orginally to get the error number, they be able to be pruned
  } else if (err.sanitizedError && err.sanitizedError.errorType === 'Meteor.Error') {
    if (!err.sanitizedError.statusCode) {
      err.sanitizedError.statusCode = err.statusCode || 400;
    }
    err = err.sanitizedError;
  } else if (err.errorType === 'Meteor.Error') {
    if (!err.statusCode) err.statusCode = err.error;
  } else {
    // Hide internal error details
    // XXX could check node_env here and return full
    // error details if development
    const { statusCode } = err;
    err = new Error();
    err.statusCode = statusCode;
  }

  // If an error has a `data` property, we
  // send that. This allows packages to include
  // extra client-safe data with the errors they throw.
  let body = {
    type: 'http://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html',
    status: err.error || 'internal-server-error',
    title: err.reason || 'Internal server error',
    detail: err.details,
    data: err.data,
  };

  body = JSON.stringify(body, null, 2);

  response.statusCode = err.statusCode || 500;
  response.setHeader('Content-Type', 'application/problem+json');
  response.write(body);
  response.end();
};

const validateApikey = async (key, secret) => {
  if (key && secret) {
    // const result = Meteor.users.findOne({ _id: key, 'services.api.keys': secret });
    const result = await Meteor.users
      .rawCollection()
      .findOne({ username: key, 'services.api.apiKeys.key': secret });
    if (result) {
      console.log('api-key is valid');
      return result;
    }
  }
  return false;
};

const parseBasicAuth = async (request, response, next) => {
  // this has to run in a fiber to call a meteor method in validateApikey
  if (request.headers && request.headers.authorization) {
    const basicAuth = request.headers.authorization.match(/^Basic (.+)/);
    if (!basicAuth) {
      response.writeHead(401, { 'WWW-Authenticate': `Basic realm="${productName}"` });
      response.end();
      return false;
    }
    const basicAuthString = Buffer.from(basicAuth[1] || '', 'base64').toString('utf8');
    const basicAuthStringParts = basicAuthString.split(':');

    if (basicAuthStringParts.length === 2) {
      const user = await validateApikey(basicAuthStringParts[0], basicAuthStringParts[1]);
      if (user) {
        request.user = user; // assign user to request object
        next();
        return true;
      }
    }
    // key invalid. send 403 error
    response.writeHead(403, { 'Content-Type': 'application/problem+json' });
    response.end(
      '{"type":"http://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html","title":"Access Denied","status":403,"detail":"Invalid API Key"}',
    );
    return false;
  }
  // no auth key found send 401 header
  response.writeHead(401, { 'WWW-Authenticate': `Basic realm="${productName}"` });
  response.end();
  return false;
};

const parseAuthToken = (request, response, next) => {
  if (request.headers && request.headers['x-token']) {
    request.user = getUser(request.headers['x-token']);
  }
  next();
  return true;
};

// set the middleware
ApiRoutes.ErrorMiddleware.use('/api', handleErrorAsHalJson);
ApiRoutes.Middleware.use('/api', parseBasicAuth); // this has to run in a fiber to call a meteor method in validateApikey
ApiRoutes.ErrorMiddleware.use('/public-api', handleErrorAsHalJson);
ApiRoutes.Middleware.use('/public-api', parseAuthToken);
ApiRoutes.Error = (message, detail, code) => {
  const error = new Error(message);
  error.detail = detail;
  error.code = code || 422;
  return error;
};
// var connect = Npm.require('connect');
// WebApp.connectHandlers.use(connect.json({limit: '500mb'})); //adjust the max upload limit

// fixture - setup api-key for requests
const webhookResult = Meteor.users.findOne({ username: 'webhook-api' });
if (!webhookResult) {
  const userId = Accounts.createUser({
    username: 'webhook-api',
  });

  Roles.addUsersToRoles(userId, ['api']);

  const id = new Mongo.ObjectID();
  const { salt = '' } = Meteor.settings.private;

  const hash = crypto.createHash('sha256', salt);
  hash.update(id._str);
  const key = hash.digest('hex');

  const api = {
    apiKeys: [{ key, createdAt: new Date() }],
  };
  Meteor.users.update({ _id: userId }, { $set: { 'services.api': api } });
}
